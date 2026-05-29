import { Router } from 'express';
import { handlePayChanguWebhook, initializePayment } from '../controllers/paychanguController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Endpoint for PayChangu Webhook
router.post('/webhook', handlePayChanguWebhook);

// Endpoint to initialize a payment
router.post('/initialize', authenticateToken, initializePayment);

export default router;
