import pool from '../config/database.js';

// @desc    Get all categories
// @route   GET /api/categories
export const getCategories = async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT * FROM category ORDER BY name ASC');

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
    });
  }
};

// @desc    Create category
// @route   POST /api/categories
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const [result] = await pool.query(
      'INSERT INTO category (name) VALUES (?)',
      [name]
    );

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category_id: result.insertId,
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    await pool.query(
      'UPDATE category SET name = ? WHERE category_id = ?',
      [name, id]
    );

    res.json({
      success: true,
      message: 'Category updated successfully',
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // ตรวจสอบว่ามี products ใช้ category นี้หรือไม่
    const [products] = await pool.query(
      'SELECT COUNT(*) as count FROM product WHERE category_id = ?',
      [id]
    );

    if (products[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing products',
      });
    }

    await pool.query('DELETE FROM category WHERE category_id = ?', [id]);

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
    });
  }
};
