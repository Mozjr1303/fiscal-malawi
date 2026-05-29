const http = require('http');

const secret = 'sec-live-Of8ldvseEKSGKD9n2O7Y8Xl3EO2obkr4';

const sendWebhook = (payload, signature) => {
  const data = JSON.stringify(payload);
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/payment/paychangu-callback',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'x-paychangu-signature': signature
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    res.on('data', (d) => process.stdout.write(d));
  });

  req.on('error', (error) => {
    console.error(error);
  });

  req.write(data);
  req.end();
};

// Simulation Data
const normalPayload = {"event":"charge.success","data":{"amount":50,"channel":"mobile_money","tx_ref":"TXN-NORM-001","created_at":new Date().toISOString()}};
const normalSignature = require('crypto').createHmac('sha256', secret).update(JSON.stringify(normalPayload)).digest('hex');

const anomalyPayload = {"event":"charge.success","data":{"amount":15000,"channel":"credit_card","tx_ref":"TXN-ANOM-999","created_at":new Date().toISOString()}};
const anomalySignature = require('crypto').createHmac('sha256', secret).update(JSON.stringify(anomalyPayload)).digest('hex');

console.log('Sending Normal Transaction...');
sendWebhook(normalPayload, normalSignature);

setTimeout(() => {
    console.log('\nSending Anomaly Transaction...');
    sendWebhook(anomalyPayload, anomalySignature);
}, 2000);
