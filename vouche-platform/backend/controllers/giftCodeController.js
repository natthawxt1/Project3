import db from '../config/database.js';

// ================================
// GET ALL GIFT CODES (Admin Only)
// ================================
export const getGiftCodes = async (req, res) => {
  try {
    const { status, product_id } = req.query;

    let query = `
      SELECT 
        gc.gift_code_id,
        gc.product_id,
        gc.code,
        gc.status,
        gc.order_id,
        gc.created_at,
        gc.redeemed_at,
        p.name as product_name
      FROM gift_code gc
      LEFT JOIN product p ON gc.product_id = p.product_id
    `;

    const conditions = [];
    const params = [];

    if (status) {
      conditions.push('gc.status = ?');
      params.push(status);
    }

    if (product_id) {
      conditions.push('gc.product_id = ?');
      params.push(product_id);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY gc.created_at DESC';

    const [giftCodes] = await db.query(query, params);

    res.json({
      success: true,
      gift_codes: giftCodes,
    });
  } catch (error) {
    console.error('Get gift codes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gift codes',
      error: error.message,
    });
  }
};

// ================================
// BULK ADD GIFT CODES (Admin Only)
// ================================
export const bulkAddGiftCodes = async (req, res) => {
  try {
    const { product_id, codes } = req.body;

    if (!product_id || !codes || !Array.isArray(codes) || codes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and codes array are required',
      });
    }

    // Check if product exists
    const [products] = await db.query('SELECT * FROM product WHERE product_id = ?', [product_id]);

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Insert gift codes
    const values = codes.map((code) => [product_id, code, 'new']);
    
    await db.query(
      'INSERT INTO gift_code (product_id, code, status) VALUES ?',
      [values]
    );

    res.json({
      success: true,
      message: `Successfully added ${codes.length} gift codes`,
      count: codes.length,
    });
  } catch (error) {
    console.error('Bulk add gift codes error:', error);
    
    // Handle duplicate code error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'One or more codes already exist',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to add gift codes',
      error: error.message,
    });
  }
};

// ================================
// DELETE GIFT CODE (Admin Only)
// ================================
export const deleteGiftCode = async (req, res) => {
  try {
    const { id } = req.params;

    const [giftCodes] = await db.query(
      'SELECT * FROM gift_code WHERE gift_code_id = ?',
      [id]
    );

    if (giftCodes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Gift code not found',
      });
    }

    // Don't allow deletion of redeemed codes
    if (giftCodes[0].status === 'redeemed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete redeemed gift codes',
      });
    }

    await db.query('DELETE FROM gift_code WHERE gift_code_id = ?', [id]);

    res.json({
      success: true,
      message: 'Gift code deleted successfully',
    });
  } catch (error) {
    console.error('Delete gift code error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete gift code',
      error: error.message,
    });
  }
};
