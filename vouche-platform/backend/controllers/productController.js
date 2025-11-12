import pool from '../config/database.js';

// @desc    Get all products with stock
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, search, sort, minPrice, maxPrice } = req.query;
    
    let query = `
      SELECT 
        p.*,
        c.name as category_name,
        COUNT(CASE WHEN gc.status = 'new' AND gc.order_id IS NULL THEN 1 END) as stock
      FROM product p
      LEFT JOIN category c ON p.category_id = c.category_id
      LEFT JOIN gift_code gc ON p.product_id = gc.product_id
      WHERE p.is_active = TRUE
    `;
    
    const params = [];

    // Category filter
    if (category) {
      query += ' AND p.category_id = ?';
      params.push(category);
    }

    // Search filter
    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Price filter
    if (minPrice) {
      query += ' AND p.price >= ?';
      params.push(minPrice);
    }
    if (maxPrice) {
      query += ' AND p.price <= ?';
      params.push(maxPrice);
    }

    query += ' GROUP BY p.product_id';

    // Sort
    if (sort === 'price_asc') {
      query += ' ORDER BY p.price ASC';
    } else if (sort === 'price_desc') {
      query += ' ORDER BY p.price DESC';
    } else if (sort === 'name') {
      query += ' ORDER BY p.name ASC';
    } else {
      query += ' ORDER BY p.created_at DESC';
    }

    const [products] = await pool.query(query, params);

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res) => {
  try {
    const [products] = await pool.query(
      `SELECT 
        p.*,
        c.name as category_name,
        COUNT(CASE WHEN gc.status = 'new' AND gc.order_id IS NULL THEN 1 END) as stock
      FROM product p
      LEFT JOIN category c ON p.category_id = c.category_id
      LEFT JOIN gift_code gc ON p.product_id = gc.product_id
      WHERE p.product_id = ?
      GROUP BY p.product_id`,
      [req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product: products[0]
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create product with gift codes
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { name, category_id, price, description, image_url, gift_codes } = req.body;

    // Validation
    if (!name || !category_id || !price) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (!gift_codes || gift_codes.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one gift code'
      });
    }

    // Create product
    const [productResult] = await connection.query(
      'INSERT INTO product (name, category_id, price, description, image_url) VALUES (?, ?, ?, ?, ?)',
      [name, category_id, price, description, image_url]
    );

    const productId = productResult.insertId;

    // Insert gift codes
    const giftCodeValues = gift_codes.map(code => [productId, code]);
    await connection.query(
      'INSERT INTO gift_code (product_id, code) VALUES ?',
      [giftCodeValues]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: {
        product_id: productId,
        name,
        category_id,
        price,
        description,
        image_url,
        gift_codes_count: gift_codes.length
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create product error:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'One or more gift codes already exist'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  } finally {
    connection.release();
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { name, category_id, price, description, image_url, is_active } = req.body;

    const [result] = await pool.query(
      `UPDATE product 
       SET name = COALESCE(?, name),
           category_id = COALESCE(?, category_id),
           price = COALESCE(?, price),
           description = COALESCE(?, description),
           image_url = COALESCE(?, image_url),
           is_active = COALESCE(?, is_active)
       WHERE product_id = ?`,
      [name, category_id, price, description, image_url, is_active, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    // Check if product has orders
    const [orders] = await connection.query(
      'SELECT order_id FROM order_item WHERE product_id = ?',
      [req.params.id]
    );

    if (orders.length > 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cannot delete product with existing orders'
      });
    }

    // Delete gift codes (CASCADE will handle this, but explicit is better)
    await connection.query(
      'DELETE FROM gift_code WHERE product_id = ?',
      [req.params.id]
    );

    // Delete product
    const [result] = await connection.query(
      'DELETE FROM product WHERE product_id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await connection.commit();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  } finally {
    connection.release();
  }
};