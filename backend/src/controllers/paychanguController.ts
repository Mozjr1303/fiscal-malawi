import { Request, Response } from 'express';
import prisma from '../utils/db';
import crypto from 'crypto';
import axios from 'axios';

// PayChangu Webhook Controller
// This receives real-time transaction updates from PayChangu when customers pay via Airtel Money, TNM Mpamba, or Visa/Mastercard.

export const handlePayChanguWebhook = async (req: Request, res: Response) => {
  console.log('--- Incoming PayChangu Webhook ---');
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  
  try {
    const payload = req.body;
    const signature = req.headers['x-paychangu-signature'] || req.headers['paychangu-signature'] || req.headers['signature'];

    // Webhook Signature Verification
    const webhookSecret = process.env.PAYCHANGU_WEBHOOK_SECRET || process.env.PAYCHANGU_SECRET_KEY;
    
    if (webhookSecret && webhookSecret !== 'YOUR_SECRET_KEY_HERE') {
      const rawBody = (req as any).rawBody;
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody || JSON.stringify(payload))
        .digest('hex');

      if (signature !== expectedSignature) {
          console.warn(`❌ PayChangu Webhook: Invalid signature. Expected: ${expectedSignature.substring(0, 8)}... Received: ${String(signature).substring(0, 8)}...`);
          // For debugging during initial setup, we will log but not block if secret matches
          // return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    // PayChangu payload typically contains event type and transaction data
    const event = payload.event;
    const data = payload.data;
    
    console.log('--- PAYCHANGU WEBHOOK DATA ---');
    console.log(JSON.stringify(payload, null, 2));
    console.log('--- ---');
    
    console.log(`PayChangu Event: ${event} | Status: ${payload.status}`);

    // Handle both event-based and status-based success notifications
    if (event === 'charge.success' || payload.status === 'success') {
      // Some PayChangu versions nest data in 'data', others send it at the root
      const txData = data || payload;
      
      const amount = parseFloat(txData.amount);
      const paymentMethod = txData.channel || txData.payment_method || 'mobile_money';
      const timestamp = new Date(txData.created_at || txData.timestamp || Date.now());
      const txRef = txData.tx_ref || txData.tx_reference;

      // We need to associate this with an admin user.
      // For this prototype, we'll fetch the first admin user in the DB.
      const adminUser = await prisma.user.findFirst({
        where: { role: 'admin' }
      });

      if (!adminUser) {
        return res.status(500).json({ error: 'No admin configured to receive PayChangu data' });
      }

      // 1. Save Transaction to our Database
      const transaction = await prisma.transaction.create({
        data: {
          id: txRef, // Use PayChangu's reference as our ID for tracking
          amount,
          paymentMethod,
          timestamp,
          userId: adminUser.id,
        }
      });

      // 2. Automatically send to our Machine Learning Service for Anomaly Detection!
      try {
        const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8001';
        const mlResponse = await fetch(`${mlServiceUrl}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: transaction.id,
            amount: transaction.amount,
            timestamp: transaction.timestamp.toISOString(),
            paymentMethod: transaction.paymentMethod,
            userId: transaction.userId
          })
        });

        if (mlResponse.ok) {
          const mlResult = await mlResponse.json();
          
          if (mlResult.is_anomaly && amount > 1000) {
            await prisma.anomaly.create({
              data: {
                transactionId: transaction.id,
                anomalyScore: mlResult.anomaly_score,
                reason: mlResult.reasons.join(', '),
              }
            });
            console.log(`⚠️ ML Alert: PayChangu Transaction ${txRef} flagged as anomaly!`);
          }
        }
      } catch (mlError) {
        console.error('Failed to communicate with ML service during PayChangu webhook processing:', mlError);
      }

      console.log(`✅ PayChangu Webhook Processed: ${amount} via ${paymentMethod}`);
    }

    // Acknowledge receipt to PayChangu
    res.status(200).send('Webhook Received');
  } catch (error) {
    console.error('PayChangu Webhook Error:', error);
    res.status(500).send('Webhook processing failed');
  }
};

export const initializePayment = async (req: Request, res: Response) => {
  console.log('--- PayChangu Initialize Request ---');
  console.log('Body:', JSON.stringify(req.body, null, 2));
  
  const { amount, email, callback_url, return_url } = req.body;

  if (!amount || !email) {
    return res.status(400).json({ error: 'Amount and email are required' });
  }

  try {
    const secretKey = process.env.PAYCHANGU_SECRET_KEY;
    
    if (!secretKey || secretKey === 'YOUR_SECRET_KEY_HERE') {
      return res.status(500).json({ error: 'PayChangu Secret Key not configured in Sentinel backend' });
    }

    const tx_ref = `SENTINEL-${Date.now()}`;
    
    const response = await axios.post('https://api.paychangu.com/payment', {
      amount,
      currency: 'MWK',
      email,
      first_name: 'Sentinel',
      last_name: 'User',
      callback_url: return_url || 'http://localhost:5173/dashboard', // Success Redirect
      return_url: return_url || 'http://localhost:5173/dashboard',   // Cancel/Failure Redirect
      webhook_url: callback_url || `${process.env.PUBLIC_TUNNEL_URL || 'https://sentinel-fiscal-mw.loca.lt'}/api/paychangu/webhook`, // Server-to-Server
      tx_ref,
      customization: {
        title: 'Sentinel Fiscal Test',
        description: 'Testing the Malawian Fiscal Integration System'
      }
    }, {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({ 
      checkout_url: response.data.data.checkout_url,
      tx_ref: tx_ref
    });
  } catch (error: any) {
    console.error('PayChangu Initialization Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to initialize PayChangu payment',
      details: error.response?.data || error.message
    });
  }
};
