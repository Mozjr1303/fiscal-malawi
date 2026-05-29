import { Request, Response } from 'express';
import prisma from '../utils/db';

interface AuthRequest extends Request {
  user?: any;
}

export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, timestamp, paymentMethod, userId } = req.body;
    
    // Fallback to authenticated user ID if userId is not provided in body
    const actualUserId = userId || req.user?.userId;

    if (!actualUserId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        paymentMethod,
        userId: actualUserId,
      },
    });

    // Send to Python ML service for anomaly detection
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
              reason: mlResult.reasons.join(', '), // Save explanation from ML
            }
          });
        }
      } else {
        console.error('ML service returned error:', await mlResponse.text());
      }
    } catch (mlError) {
      console.error('Failed to communicate with ML service:', mlError);
      // We don't fail the transaction if ML service is down, just log it.
    }

    res.status(201).json({ message: 'Transaction recorded', transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        anomalies: true,
      }
    });
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAnomalies = async (req: AuthRequest, res: Response) => {
  try {
    const anomalies = await prisma.anomaly.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        transaction: true,
      }
    });
    
    res.json(anomalies);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
