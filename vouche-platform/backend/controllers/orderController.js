import pool from '../config/database.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { items, payment_method } = req.body;
    const userId = req.user.user_id;

    // Validation
    if (!items || items.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Calculate total and check stock
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      // Get product details and available stock
      const [products] = await connection.query(
        `SELECT p.*, 
         COUNT(CASE WHEN gc.status = 'new' AND gc.order_id IS NULL THEN 1 END) as available_stock
         FROM product p
         LEFT JOIN gift_code gc ON p.product_id = gc.product_id
         WHERE p.product_id = ? AND p.is_active = TRUE
         GROUP BY p.product_id`,
        [item.product_id]
      );

      if (products.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: `Product ${item.product_id} not found or inactive`
        });
      }

      const product = products[0];

      if (product.available_stock < item.quantity) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.available_stock}`
        });
      }

      orderItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: product.price
      });

      totalPrice += product.price * item.quantity;
    }

    // Create order
    const [orderResult] = await connection.query(
      'INSERT INTO `order` (user_id, total_price, status) VALUES (?, ?, ?)',
      [userId, totalPrice, 'pending']
    );

    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of orderItems) {
      await connection.query(
        'INSERT INTO order_item (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.unit_price]
      );

      // Assign gift codes to this order
      await connection.query(
        `UPDATE gift_code 
         SET order_id = ?, status = 'active'
         WHERE product_id = ? 
         AND status = 'new' 
         AND order_id IS NULL
         LIMIT ?`,
        [orderId, item.product_id, item.quantity]
      );
    }

    // Create payment record
    await connection.query(
      'INSERT INTO payment (order_id, payment_method, amount, payment_status) VALUES (?, ?, ?, ?)',
      [orderId, payment_method || 'card', totalPrice, 'successful']
    );

    // Update order status to paid
    await connection.query(
      'UPDATE `order` SET status = ? WHERE order_id = ?',
      ['paid', orderId]
    );

    await connection.commit();

    // Get order details with gift codes
    const [orderDetails] = await connection.query(
      `SELECT 
        o.*,
        u.name as customer_name,
        u.email as customer_email
       FROM \`order\` o
       JOIN user u ON o.user_id = u.user_id
       WHERE o.order_id = ?`,
      [orderId]
    );

    // Get order items with gift codes
    const [items_with_codes] = await connection.query(
      `SELECT 
        oi.*,
        p.name as product_name,
        GROUP_CONCAT(gc.code) as gift_codes
       FROM order_item oi
       JOIN product p ON oi.product_id = p.product_id
       LEFT JOIN gift_code gc ON gc.order_id = oi.order_id AND gc.product_id = oi.product_id
       WHERE oi.order_id = ?
       GROUP BY oi.order_item_id`,
      [orderId]
    );

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        ...orderDetails[0],
        items: items_with_codes.map(item => ({
          ...item,
          gift_codes: item.gift_codes ? item.gift_codes.split(',') : []
        }))
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  } finally {
    connection.release();
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT 
        o.*,
        u.name as customer_name,
        u.email as customer_email,
        COUNT(DISTINCT oi.order_item_id) as items_count
       FROM \`order\` o
       JOIN user u ON o.user_id = u.user_id
       LEFT JOIN order_item oi ON o.order_id = oi.order_id
       GROUP BY o.order_id
       ORDER BY o.created_at DESC`
    );

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/user
// @access  Private
export const getUserOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT 
        o.*,
        COUNT(DISTINCT oi.order_item_id) as items_count
       FROM \`order\` o
       LEFT JOIN order_item oi ON o.order_id = oi.order_id
       WHERE o.user_id = ?
       GROUP BY o.order_id
       ORDER BY o.created_at DESC`,
      [req.user.user_id]
    );

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get order details with gift codes
// @route   GET /api/orders/:id
// @access  Private
export const getOrderDetails = async (req, res) => {
  try {
    // Get order
    const [orders] = await pool.query(
      `SELECT 
        o.*,
        u.name as customer_name,
        u.email as customer_email
       FROM \`order\` o
       JOIN user u ON o.user_id = u.user_id
       WHERE o.order_id = ?`,
      [req.params.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orders[0];

    // Check authorization
    if (req.user.role !== 'admin' && order.user_id !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    // Get order items with gift codes
    const [items] = await pool.query(
      `SELECT 
        oi.*,
        p.name as product_name,
        p.image_url,
        GROUP_CONCAT(gc.code) as gift_codes
       FROM order_item oi
       JOIN product p ON oi.product_id = p.product_id
       LEFT JOIN gift_code gc ON gc.order_id = oi.order_id AND gc.product_id = oi.product_id
       WHERE oi.order_id = ?
       GROUP BY oi.order_item_id`,
      [req.params.id]
    );

    res.json({
      success: true,
      order: {
        ...order,
        items: items.map(item => ({
          ...item,
          gift_codes: item.gift_codes ? item.gift_codes.split(',') : []
        }))
      }
    });
  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status'
      });
    }

    const [result] = await pool.query(
      'UPDATE `order` SET status = ? WHERE order_id = ?',
      [status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};