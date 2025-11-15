import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import giftCodeRoutes from './routes/giftCodeRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ========================
// Middleware
// ========================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Log image requests (for debugging)
app.use('/uploads', (req, res, next) => {
  console.log('📸 Image requested:', req.url);
  next();
});

// ========================
// Routes
// ========================
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/gift-codes', giftCodeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes); 

// ========================
// Health Check
// ========================
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
  });
});

// ========================
// 404 Handler (ต้องอยู่ล่างสุด!)
// ========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ========================
// Error Handler
// ========================
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ========================
// Start Server
// ========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📸 Images: http://localhost:${PORT}/uploads`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
});

export default app;
