const API_URL = 'http://localhost:5000/api';

const generateTransaction = () => {
  const paymentMethods = ['credit_card', 'mobile_money', 'bank_transfer', 'cash'];
  const isAnomaly = Math.random() > 0.95; // 5% chance of being highly anomalous

  let amount;
  if (isAnomaly) {
    // Generate weirdly huge amounts at weird hours
    amount = parseFloat((Math.random() * 5000 + 1000).toFixed(2));
  } else {
    // Normal transaction
    amount = parseFloat((Math.random() * 200 + 5).toFixed(2));
  }

  return {
    amount,
    timestamp: new Date().toISOString(),
    paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
  };
};

const runSimulator = async () => {
  console.log('🚀 Starting Live Traffic Simulator...');
  
  // Login first to get admin token
  let token;
  let userId;
  try {
    // Register if doesn't exist, or just login
    try {
      await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'simulator@fiscaltech.com',
          password: 'password123',
          role: 'admin'
        })
      });
    } catch(e) {
      // Ignore if already exists
    }

    const logRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'simulator@fiscaltech.com',
          password: 'password123'
        })
    });
    const logData = await logRes.json();
    token = logData.token;
    userId = logData.user.id;
    
    console.log('✅ Authenticated successfully!');
  } catch (error) {
    console.error('❌ Authentication failed. Make sure backend is running.');
    process.exit(1);
  }

  // Loop
  setInterval(async () => {
    const tx = generateTransaction();
    tx.userId = userId;
    
    try {
      await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(tx)
      });
      console.log(`💸 Simulated Transaction: $${tx.amount} via ${tx.paymentMethod}`);
    } catch (error) {
      console.error(`❌ Failed to send transaction: ${error.message}`);
    }
  }, 3000); // Send every 3 seconds
};

runSimulator();
