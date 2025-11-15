import pool from '../config/database.js';

// ===================================
// Get Payment Info (Order Summary)
// ===================================
export const getPaymentInfo = async (req, res) => {
  try {
    const { order_id } = req.params;
    const userId = req.user.userId;

    // Get order details
    const [orders] = await pool.query(
      `SELECT 
        o.order_id,
        o.user_id,
        o.total_price,
        o.status,
        o.created_at as order_date
      FROM \`orders\` o
      WHERE o.order_id = ? AND o.user_id = ?`,
      [order_id, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const order = orders[0];

    // Check if already paid
    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Order is already processed',
      });
    }

    // Get order items
    const [items] = await pool.query(
      `SELECT 
        oi.product_id,
        p.name as product_name,
        oi.quantity,
        oi.unit_price as price
      FROM order_item oi
      JOIN product p ON oi.product_id = p.product_id
      WHERE oi.order_id = ?`,
      [order_id]
    );

    res.status(200).json({
      success: true,
      payment: {
        order_id: order.order_id,
        total_price: order.total_price,
        status: order.status,
        order_date: order.order_date,
        items: items,
      },
    });
  } catch (error) {
    console.error('Get payment info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment info',
      error: error.message,
    });
  }
};

// ===================================
// Confirm Payment (Simple Demo)
// ===================================
export const confirmPayment = async (req, res) => {
  try {
    const { order_id } = req.body;
    const userId = req.user.userId;

    // Get order
    const [orders] = await pool.query(
      'SELECT order_id, user_id, status FROM `orders` WHERE order_id = ? AND user_id = ?',
      [order_id, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const order = orders[0];

    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Order is already processed',
      });
    }

    // Update order status to "paid"
    await pool.query(
      'UPDATE `orders` SET status = ? WHERE order_id = ?',
      ['paid', order_id]
    );

    res.status(200).json({
      success: true,
      message: 'Payment confirmed successfully',
      order: {
        order_id: order_id,
        status: 'paid',
      },
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment',
      error: error.message,
    });
  }
};
