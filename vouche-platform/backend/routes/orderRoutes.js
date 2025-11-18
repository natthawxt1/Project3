import express from 'express';
import {
  getMyOrders,
  getOrderById,
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderDetailsAdmin
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// ================================
// Admin Routes
// ================================
router.get('/', protect, adminOnly, getAllOrders);

router.get('/admin/:id', protect, adminOnly, getOrderDetailsAdmin);

// ⭐ แก้จาก PATCH เป็น PUT
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

// ================================
// User Routes (Protected)
// ================================
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.post('/', protect, createOrder);

export default router;