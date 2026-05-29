import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function verify() {
  console.log('🧪 Starting 1000 MK Anomaly Rule Verification...');

  // 1. Authenticate
  let token: string;
  try {
    const logRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'simulator@fiscaltech.com',
      password: 'password123'
    });
    token = logRes.data.token;
    console.log('✅ Authenticated successfully.');
  } catch (error) {
    console.error('❌ Authentication failed:', error);
    return;
  }

  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Test Case 1: Transaction <= 1000 at night time (2 AM) - Should NOT be flagged as anomaly
  console.log('\n--- Test Case 1: Amount 500 (<= 1000) at Night ---');
  try {
    const res1 = await axios.post(`${API_URL}/transactions`, {
      amount: 500.0,
      timestamp: '2026-05-28T02:00:00.000Z', // 2 AM (Night Outlier)
      paymentMethod: 'mobile_money'
    }, config);
    
    // Check if anomaly was created for this transaction
    const anomalyCheck = await axios.get(`${API_URL}/transactions/anomalies`, config);
    const hasAnomaly1 = anomalyCheck.data.some((a: any) => a.transactionId === res1.data.transaction.id);
    
    if (hasAnomaly1) {
      console.error('❌ FAIL: Transaction of 500 MK was flagged as an anomaly!');
    } else {
      console.log('✅ PASS: Transaction of 500 MK was NOT flagged as an anomaly.');
    }
  } catch (err: any) {
    console.error('Error during Test 1:', err.response?.data || err.message);
  }

  // Test Case 2: Transaction > 1000 at night time (2 AM) - Should IS flagged as anomaly
  console.log('\n--- Test Case 2: Amount 6000 (> 1000) at Night ---');
  try {
    const res2 = await axios.post(`${API_URL}/transactions`, {
      amount: 6000.0,
      timestamp: '2026-05-28T02:00:00.000Z', // 2 AM (Night Outlier)
      paymentMethod: 'mobile_money'
    }, config);
    
    // Check if anomaly was created for this transaction
    const anomalyCheck = await axios.get(`${API_URL}/transactions/anomalies`, config);
    const foundAnomaly = anomalyCheck.data.find((a: any) => a.transactionId === res2.data.transaction.id);
    
    if (foundAnomaly) {
      console.log('✅ PASS: Transaction of 6000 MK WAS flagged as an anomaly.');
      console.log(`💡 Flagged Reason: "${foundAnomaly.reason}"`);
      console.log(`📊 Anomaly Score: ${foundAnomaly.anomalyScore}`);
    } else {
      console.error('❌ FAIL: Transaction of 6000 MK was NOT flagged as an anomaly!');
    }
  } catch (err: any) {
    console.error('Error during Test 2:', err.response?.data || err.message);
  }
}

verify();
