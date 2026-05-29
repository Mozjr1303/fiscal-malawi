import { Router } from 'express';
import { createTransaction, getTransactions, getAnomalies } from '../controllers/transactionController';
import { authenticateToken, requireAdmin, authenticateApiKey } from '../middleware/authMiddleware';

const router = Router();

// Existing JWT routes for dashboard
router.post('/', authenticateToken, createTransaction);
router.get('/', authenticateToken, getTransactions);
router.get('/anomalies', authenticateToken, requireAdmin, getAnomalies);

// New POS Integration Webhook/Ingestion endpoint using API Key
router.post('/ingest', authenticateApiKey, createTransaction);

export default router;
