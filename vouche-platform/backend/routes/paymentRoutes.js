import express from 'express';
import {
  getPaymentInfo,
  confirmPayment,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get Payment Info
router.get('/:order_id', protect, getPaymentInfo);

// Confirm Payment (Simple)
router.post('/confirm', protect, confirmPayment);

export default router;
