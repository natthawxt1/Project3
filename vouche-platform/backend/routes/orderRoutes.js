import express from 'express';
import {
  getMyOrders,
  getOrderById,
  createOrder,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// ================================
// User Routes (Protected)
// ================================
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.post('/', protect, createOrder);

// ================================
// Admin Routes
// ================================
router.get('/', protect, adminOnly, getAllOrders);

// ⭐ แก้จาก PATCH เป็น PUT
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;