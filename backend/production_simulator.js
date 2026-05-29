const axios = require('axios');

const API_URL = 'http://localhost:5000/api/transactions/ingest';
const API_KEY = 'c4bb965b-80b6-4d67-91e9-1e304a62306a'; // Valid key for admin@gmail.com

const PAYMENT_METHODS = ['mobile_money', 'credit_card', 'bank_transfer', 'cash'];

// Business Profiles
const PROFILES = [
    { name: 'Small Retailer', avgAmount: 15, frequency: 5000, variance: 5 },
    { name: 'Electronics Store', avgAmount: 250, frequency: 15000, variance: 100 },
    { name: 'Wholesaler', avgAmount: 1200, frequency: 30000, variance: 500 }
];

async function sendTransaction(data) {
    try {
        await axios.post(API_URL, data, {
            headers: { 'x-api-key': API_KEY }
        });
        console.log(`✅ [${new Date().toLocaleTimeString()}] Sent: $${data.amount} via ${data.paymentMethod}`);
    } catch (error) {
        console.error('❌ Failed to send:', error.response?.data || error.message);
    }
}

function generateNormalTransaction(profile) {
    const amount = profile.avgAmount + (Math.random() - 0.5) * profile.variance;
    return {
        amount: parseFloat(amount.toFixed(2)),
        paymentMethod: PAYMENT_METHODS[Math.floor(Math.random() * PAYMENT_METHODS.length)],
        timestamp: new Date().toISOString(),
        userId: "841e52ca-a2e9-48cf-bf7a-271130302668" // admin@gmail.com
    };
}

function generateAnomaly(type) {
    let amount = 0;
    let reason = "";

    switch(type) {
        case 'SPIKE':
            amount = 8000 + Math.random() * 5000;
            reason = "High Amount Spike";
            break;
        case 'VELOCITY':
            amount = 10 + Math.random() * 50;
            reason = "Rapid Successive Transactions";
            break;
        case 'NIGHT':
            amount = 100 + Math.random() * 200;
            reason = "Off-hours Activity";
            break;
    }

    return {
        amount: parseFloat(amount.toFixed(2)),
        paymentMethod: PAYMENT_METHODS[Math.floor(Math.random() * PAYMENT_METHODS.length)],
        timestamp: new Date().toISOString(),
        userId: "841e52ca-a2e9-48cf-bf7a-271130302668" // admin@gmail.com
    };
}

async function startSimulation() {
    console.log('🚀 Starting Production-Grade Fiscal Simulation...');
    
    // 1. Regular Traffic Loop
    setInterval(() => {
        const profile = PROFILES[Math.floor(Math.random() * PROFILES.length)];
        sendTransaction(generateNormalTransaction(profile));
    }, 8000);

    // 2. Occasional Anomalies
    setInterval(() => {
        const types = ['SPIKE', 'VELOCITY', 'NIGHT'];
        const type = types[Math.floor(Math.random() * types.length)];
        console.log(`⚠️ Injecting Anomaly: ${type}`);
        
        if (type === 'VELOCITY') {
            // Send 5 rapid transactions
            for(let i=0; i<5; i++) {
                setTimeout(() => sendTransaction(generateAnomaly('VELOCITY')), i * 500);
            }
        } else {
            sendTransaction(generateAnomaly(type));
        }
    }, 45000);
}

startSimulation();
