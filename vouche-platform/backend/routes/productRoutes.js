import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import upload from '../config/multer.js';

const router = express.Router();

// ========================
// Public Routes
// ========================
router.get('/', getProducts);
router.get('/:id', getProduct); // ⭐ Product Detail Route

// ========================
// Admin Routes
// ========================
router.post('/', protect, adminOnly, upload.single('image'), createProduct);
router.put('/:id', protect, adminOnly, upload.single('image'), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
