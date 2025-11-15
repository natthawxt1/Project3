import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

// Protect routes - ต้อง login
export const protect = async (req, res, next) => {
  try {
    let token;

    // ตรวจสอบ token จาก Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log('🔐 Decoded token:', decoded);

    // ดึงข้อมูล user จาก database
    const [users] = await pool.query(
      'SELECT user_id, name, email, role FROM `user` WHERE user_id = ?',
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    // ⭐⭐⭐ แก้ตรงนี้! เปลี่ยนเป็น camelCase
    req.user = {
      userId: users[0].user_id,  // ⭐ เปลี่ยนจาก user_id เป็น userId
      name: users[0].name,
      email: users[0].email,
      role: users[0].role,
    };

    console.log('✅ req.user:', req.user);

    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Not authorized, token failed',
    });
  }
};

// Admin only middleware
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.',
    });
  }
};
