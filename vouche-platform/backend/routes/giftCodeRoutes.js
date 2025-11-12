import express from 'express';
import {
  getProductGiftCodes,
  addGiftCodes,
  updateGiftCode,
  deleteGiftCode
} from '../controllers/giftCodeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/product/:productId', protect, adminOnly, getProductGiftCodes);
router.post('/', protect, adminOnly, addGiftCodes);
router.put('/:id', protect, adminOnly, updateGiftCode);
router.delete('/:id', protect, adminOnly, deleteGiftCode);

export default router;