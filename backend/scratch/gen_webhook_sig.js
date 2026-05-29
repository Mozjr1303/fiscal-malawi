const crypto = require('crypto');

const secret = 'sec-live-Of8ldvseEKSGKD9n2O7Y8Xl3EO2obkr4';
const payloads = [
  {
    event: 'charge.success',
    data: {
      amount: 50.00,
      channel: 'mobile_money',
      tx_ref: 'TXN-NORM-001',
      created_at: new Date().toISOString()
    }
  },
  {
    event: 'charge.success',
    data: {
      amount: 15000.00,
      channel: 'credit_card',
      tx_ref: 'TXN-ANOM-999',
      created_at: new Date().toISOString()
    }
  }
];

payloads.forEach((payload, i) => {
  const signature = crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');
  console.log(`Payload ${i+1} Signature: ${signature}`);
  console.log(`Payload ${i+1} Body: ${JSON.stringify(payload)}`);
  console.log('---');
});
