import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import transactionRoutes from './routes/transactionRoutes';
import paychanguRoutes from './routes/paychanguRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({
  verify: (req: any, res, buf) => {
    req.rawBody = buf;
  }
}));

import { handlePayChanguWebhook } from './controllers/paychanguController';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/paychangu', paychanguRoutes);

// Legacy/PayChangu Specific Route (matching user dashboard)
app.post('/payment/paychangu-callback', handlePayChanguWebhook);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Redirect Bridge: Handles PayChangu redirects through the tunnel back to the local frontend
app.get('/dashboard', (req, res) => {
  const queryString = req.url.includes('?') ? '?' + req.url.split('?')[1] : '';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const targetUrl = `${frontendUrl}/dashboard${queryString}`;
  
  console.log(`--- Redirecting via JS Bridge: ${targetUrl} ---`);
  
  // Use JS redirect instead of 302 to bypass iframe/security blocks
  res.send(`
    <html>
      <body style="background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif;">
        <div style="text-align: center;">
          <h2 style="margin-bottom: 1rem;">Finalizing Transaction...</h2>
          <p>Redirecting you back to Sentinel Dashboard</p>
          <script>
            setTimeout(() => {
              window.top.location.href = "${targetUrl}";
            }, 500);
          </script>
        </div>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
