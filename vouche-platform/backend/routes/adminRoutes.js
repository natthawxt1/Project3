import express from 'express';
import { getDashboardStats } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Dashboard stats
router.get('/stats', protect, adminOnly, getDashboardStats);

export default router;
