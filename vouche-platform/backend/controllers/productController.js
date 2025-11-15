import pool from '../config/database.js';

// @desc    Get all products with stock
// @route   GET /api/products
export const getProducts = async (req, res) => {
  try {
    const { category, sort = 'name' } = req.query;

    let query = `
      SELECT 
        p.product_id, p.name, p.category_id, c.name AS category_name,
        p.price, p.description, p.image_url, p.is_active,
        COUNT(gc.gift_code_id) AS stock
      FROM product p
      LEFT JOIN category c ON p.category_id = c.category_id
      LEFT JOIN gift_code gc ON p.product_id = gc.product_id 
        AND gc.status = 'new' AND gc.order_id IS NULL
      WHERE 1=1
    `;

    const params = [];

    if (category) {
      query += ' AND p.category_id = ?';
      params.push(category);
    }

    query += ' GROUP BY p.product_id';

    // Sorting
    switch (sort) {
      case 'price_asc':
        query += ' ORDER BY p.price ASC';
        break;
      case 'price_desc':
        query += ' ORDER BY p.price DESC';
        break;
      case 'newest':
        query += ' ORDER BY p.product_id DESC';
        break;
      default:
        query += ' ORDER BY p.name ASC';
    }

    const [products] = await pool.query(query, params);

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await pool.query(
      `SELECT 
        p.product_id, p.name, p.category_id, c.name AS category_name,
        p.price, p.description, p.image_url, p.is_active,
        COUNT(gc.gift_code_id) AS stock
      FROM product p
      LEFT JOIN category c ON p.category_id = c.category_id
      LEFT JOIN gift_code gc ON p.product_id = gc.product_id 
        AND gc.status = 'new' AND gc.order_id IS NULL
      WHERE p.product_id = ?
      GROUP BY p.product_id`,
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      product: products[0],
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
    });
  }
};

// @desc    Create product with gift codes
// @route   POST /api/products
export const createProduct = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { name, category_id, price, description, gift_codes } = req.body;
    
    // รับ image path จาก multer
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    // เพิ่มสินค้า
    const [result] = await connection.query(
      'INSERT INTO product (name, category_id, price, description, image_url) VALUES (?, ?, ?, ?, ?)',
      [name, category_id, price, description, image_url]
    );

    const product_id = result.insertId;

    // เพิ่ม gift codes
    if (gift_codes) {
      const codes = typeof gift_codes === 'string' ? JSON.parse(gift_codes) : gift_codes;
      
      if (codes.length > 0) {
        const values = codes.map((code) => [product_id, code, 'new']);
        await connection.query(
          'INSERT INTO gift_code (product_id, code, status) VALUES ?',
          [values]
        );
      }
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product_id,
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
    });
  } finally {
    connection.release();
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const { name, category_id, price, description, gift_codes } = req.body;
    
    // รับ image path จาก multer (ถ้ามีการ upload ใหม่)
    const image_url = req.file ? `/uploads/${req.file.filename}` : undefined;

    // Update product
    let updateQuery = 'UPDATE product SET name = ?, category_id = ?, price = ?, description = ?';
    const params = [name, category_id, price, description];

    if (image_url) {
      updateQuery += ', image_url = ?';
      params.push(image_url);
    }

    updateQuery += ' WHERE product_id = ?';
    params.push(id);

    await connection.query(updateQuery, params);

    // เพิ่ม gift codes ใหม่ (ถ้ามี)
    if (gift_codes) {
      const codes = typeof gift_codes === 'string' ? JSON.parse(gift_codes) : gift_codes;
      
      if (codes.length > 0) {
        const values = codes.map((code) => [id, code, 'new']);
        await connection.query(
          'INSERT INTO gift_code (product_id, code, status) VALUES ?',
          [values]
        );
      }
    }

    await connection.commit();

    res.json({
      success: true,
      message: 'Product updated successfully',
    });
  } catch (error) {
    await connection.rollback();
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
    });
  } finally {
    connection.release();
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // ตรวจสอบว่ามี orders ที่ใช้สินค้านี้หรือไม่
    const [orders] = await pool.query(
      'SELECT COUNT(*) as count FROM order_item WHERE product_id = ?',
      [id]
    );

    if (orders[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete product with existing orders',
      });
    }

    // ลบ gift codes ก่อน
    await pool.query('DELETE FROM gift_code WHERE product_id = ?', [id]);

    // ลบสินค้า
    await pool.query('DELETE FROM product WHERE product_id = ?', [id]);

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
    });
  }
};
