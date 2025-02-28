import express from 'express';
import { getPaymentDetails, sendContactMessage } from '../controllers/paymentController.js';

const router = express.Router();

// ... existing routes ...
router.post('/contact', sendContactMessage);

export default router; 