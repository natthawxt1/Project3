import express from 'express';
import {
  getGiftCodes,
  bulkAddGiftCodes,
  deleteGiftCode,
} from '../controllers/giftCodeController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// ========================
// Admin Routes
// ========================
router.get('/', protect, adminOnly, getGiftCodes);
router.post('/bulk', protect, adminOnly, bulkAddGiftCodes);
router.delete('/:id', protect, adminOnly, deleteGiftCode);

export default router;
