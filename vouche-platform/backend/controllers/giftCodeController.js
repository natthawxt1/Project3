import pool from '../config/database.js';

// @desc    Get gift codes for a product
// @route   GET /api/gift-codes/product/:productId
// @access  Private/Admin
export const getProductGiftCodes = async (req, res) => {
  try {
    const [giftCodes] = await pool.query(
      `SELECT gc.*, o.order_id, u.email as customer_email
       FROM gift_code gc
       LEFT JOIN \`order\` o ON gc.order_id = o.order_id
       LEFT JOIN user u ON o.user_id = u.user_id
       WHERE gc.product_id = ?
       ORDER BY gc.created_at DESC`,
      [req.params.productId]
    );

    res.json({
      success: true,
      count: giftCodes.length,
      gift_codes: giftCodes
    });
  } catch (error) {
    console.error('Get gift codes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add gift codes to product
// @route   POST /api/gift-codes
// @access  Private/Admin
export const addGiftCodes = async (req, res) => {
  try {
    const { product_id, codes } = req.body;

    if (!product_id || !codes || codes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product_id and codes array'
      });
    }

    // Check if product exists
    const [products] = await pool.query(
      'SELECT product_id FROM product WHERE product_id = ?',
      [product_id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Insert gift codes
    const giftCodeValues = codes.map(code => [product_id, code]);
    const [result] = await pool.query(
      'INSERT INTO gift_code (product_id, code) VALUES ?',
      [giftCodeValues]
    );

    res.status(201).json({
      success: true,
      message: `${result.affectedRows} gift codes added successfully`,
      count: result.affectedRows
    });
  } catch (error) {
    console.error('Add gift codes error:', error);
    
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
  }
};

// @desc    Update gift code status
// @route   PUT /api/gift-codes/:id
// @access  Private/Admin
export const updateGiftCode = async (req, res) => {
  try {
    const { status, expiration_time } = req.body;

    const [result] = await pool.query(
      `UPDATE gift_code 
       SET status = COALESCE(?, status),
           expiration_time = COALESCE(?, expiration_time)
       WHERE gift_code_id = ?`,
      [status, expiration_time, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Gift code not found'
      });
    }

    res.json({
      success: true,
      message: 'Gift code updated successfully'
    });
  } catch (error) {
    console.error('Update gift code error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete gift code
// @route   DELETE /api/gift-codes/:id
// @access  Private/Admin
export const deleteGiftCode = async (req, res) => {
  try {
    // Check if gift code is already sold
    const [giftCodes] = await pool.query(
      'SELECT order_id, status FROM gift_code WHERE gift_code_id = ?',
      [req.params.id]
    );

    if (giftCodes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Gift code not found'
      });
    }

    if (giftCodes[0].order_id !== null) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete gift code that has been sold'
      });
    }

    const [result] = await pool.query(
      'DELETE FROM gift_code WHERE gift_code_id = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Gift code deleted successfully'
    });
  } catch (error) {
    console.error('Delete gift code error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};