export const createOrder = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const userId = req.user.userId;
    const { cart_items } = req.body;

    // ⭐ เพิ่ม log
    console.log('🆔 User ID:', userId);
    console.log('🛒 Cart Items:', cart_items);

    if (!cart_items || cart_items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    let totalPrice = 0;
    const orderItems = [];

    // Validate products and calculate total
    for (const item of cart_items) {
      console.log('🔍 Checking product:', item.product_id);
      
      const [products] = await connection.query(
        'SELECT product_id, name, price FROM product WHERE product_id = ? AND is_active = 1',
        [item.product_id]
      );

      console.log('📦 Product found:', products);

      if (products.length === 0) {
        throw new Error(`Product ${item.product_id} not found or inactive`);
      }

      const product = products[0];

      // Check stock
      const [stockCheck] = await connection.query(
        `SELECT COUNT(*) as available_stock 
         FROM gift_code 
         WHERE product_id = ? AND status = 'new' AND order_id IS NULL`,
        [item.product_id]
      );

      console.log('📊 Stock available:', stockCheck[0].available_stock);

      if (stockCheck[0].available_stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      const subtotal = product.price * item.quantity;
      totalPrice += subtotal;

      orderItems.push({
        product_id: product.product_id,
        quantity: item.quantity,
        price: product.price,
        subtotal: subtotal,
      });
    }

    console.log('💰 Total Price:', totalPrice);

    // Create order
    const [orderResult] = await connection.query(
      'INSERT INTO `orders` (user_id, total_price, status) VALUES (?, ?, ?)',
      [userId, totalPrice, 'pending']
    );

    const orderId = orderResult.insertId;
    console.log('✅ Order Created! ID:', orderId);

    // Create order items and assign gift codes
    for (const item of orderItems) {
      // Insert order item
      await connection.query(
        'INSERT INTO order_item (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );

      // Assign gift codes to this order
      await connection.query(
        `UPDATE gift_code 
         SET order_id = ?, status = 'active'
         WHERE product_id = ? AND status = 'new' AND order_id IS NULL
         LIMIT ?`,
        [orderId, item.product_id, item.quantity]
      );
    }

    await connection.commit();

    console.log('🎉 Order Complete!');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        order_id: orderId,
        total_price: totalPrice,
        status: 'pending',
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error('❌ Create order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order',
    });
  } finally {
    connection.release();
  }
};

import pool from '../config/database.js';

// ===================================
// Get My Orders (User)
// ===================================
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [orders] = await pool.query(
      `SELECT 
        o.order_id,
        o.total_price,
        o.status,
        o.created_at as order_date,
        COUNT(DISTINCT oi.order_item_id) as items_count
      FROM \`orders\` o
      LEFT JOIN order_item oi ON o.order_id = oi.order_id
      WHERE o.user_id = ?
      GROUP BY o.order_id
      ORDER BY o.created_at DESC`,
      [userId]
    );

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};

// ===================================
// Get Order Details (User)
// ===================================
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Get order basic info
    const [orders] = await pool.query(
      `SELECT 
        o.order_id,
        o.user_id,
        o.total_price,
        o.status,
        o.created_at as order_date
      FROM \`orders\` o
      WHERE o.order_id = ? AND o.user_id = ?`,
      [id, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const order = orders[0];

    // Get order items
    const [items] = await pool.query(
      `SELECT 
        oi.order_item_id,
        oi.product_id,
        oi.quantity,
        oi.unit_price as price,
        oi.subtotal,
        p.name as product_name,
        p.image_url
      FROM order_item oi
      JOIN product p ON oi.product_id = p.product_id
      WHERE oi.order_id = ?`,
      [id]
    );

    // Get gift codes for each item
    for (let item of items) {
      const [codes] = await pool.query(
        `SELECT 
          gift_code_id,
          code,
          status,
          redeemed_at
        FROM gift_code
        WHERE product_id = ? AND order_id = ?`,
        [item.product_id, id]
      );
      item.gift_codes = codes;
    }

    order.items = items;

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details',
      error: error.message,
    });
  }
};

// ===================================
// Get All Orders (Admin)
// ===================================
export const getAllOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT 
        o.order_id,
        o.user_id,
        u.name as user_name,
        u.email as user_email,
        o.total_price,
        o.status,
        o.created_at as order_date,
        COUNT(DISTINCT oi.order_item_id) as items_count
      FROM \`orders\` o
      LEFT JOIN user u ON o.user_id = u.user_id
      LEFT JOIN order_item oi ON o.order_id = oi.order_id
      GROUP BY o.order_id
      ORDER BY o.created_at DESC`
    );

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('❌ Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};

// ===================================
// Update Order Status (Admin) 
// ===================================
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'paid', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    await pool.query(
      'UPDATE `orders` SET status = ? WHERE order_id = ?',
      [status, id]
    );

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
    });
  } catch (error) {
    console.error('❌ Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message,
    });
  }
};
