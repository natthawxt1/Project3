import db from '../config/database.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [revenue] = await db.query(
      `SELECT COALESCE(SUM(total_price), 0) as total_revenue 
       FROM orders 
       WHERE status = 'paid'`
    );

    const [orders] = await db.query('SELECT COUNT(*) as total_orders FROM orders');

    const [products] = await db.query(
      'SELECT COUNT(*) as total_products FROM product'
    );

    const [customers] = await db.query(
      `SELECT COUNT(*) as total_customers 
       FROM user 
       WHERE role = 'customer'`
    );

    const [recentOrders] = await db.query(
      `SELECT 
        o.order_id,
        o.total_price as total_amount,
        o.order_date,
        o.status,
        o.created_at,
        u.name as full_name,
        u.email
       FROM orders o
       JOIN user u ON o.user_id = u.user_id
       ORDER BY o.created_at DESC
       LIMIT 5`
    );

    res.json({
      success: true,
      stats: {
        total_revenue: revenue[0].total_revenue,
        total_orders: orders[0].total_orders,
        total_products: products[0].total_products,
        total_customers: customers[0].total_customers,
        recent_orders: recentOrders,
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message,
    });
  }
};
