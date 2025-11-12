import express from 'express';
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderDetails,
  updateOrderStatus
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, adminOnly, getAllOrders);
router.get('/user', protect, getUserOrders);
router.get('/:id', protect, getOrderDetails);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;