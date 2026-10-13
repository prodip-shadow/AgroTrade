const db = require('../config/db');

// Get all product categories
const getCategories = (callback) => {
  const sql = `SELECT * FROM categories ORDER BY name ASC`;
  db.query(sql, (err, rows) => {
    if (err) return callback(err);
    return callback(null, rows);
  });
};

// Get active products (with optional search)
const getActiveProducts = (options = {}, callback) => {
  const { search } = options;
  let sql = `
    SELECT
      p.*,
      c.name AS category_name,
      u.full_name AS farmer_name
    FROM products p
    JOIN users u ON u.id = p.farmer_id
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.status = 'active'
  `;
  const params = [];

  if (search && search.trim()) {
    sql += ` AND (p.name LIKE ? OR c.name LIKE ?)`;
    const term = `%${search.trim()}%`;
    params.push(term, term);
  }

  sql += ` ORDER BY p.created_at DESC`;

  db.query(sql, params, (err, rows) => {
    if (err) return callback(err);
    return callback(null, rows);
  });
};

// Create product (status starts as 'pending' for admin review)
const createProduct = (productData, callback) => {
  const {
    farmer_id,
    category_id,
    name,
    description,
    price,
    stock_quantity,
    unit = 'kg',
    image_url,
  } = productData;

  const sql = `
    INSERT INTO products (farmer_id, category_id, name, description, price, stock_quantity, unit, image_url, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `;
  const params = [
    farmer_id,
    category_id || null,
    name,
    description || null,
    price,
    stock_quantity,
    unit || 'kg',
    image_url || null,
  ];

  db.query(sql, params, (err, result) => {
    if (err) return callback(err);
    return callback(null, {
      id: result.insertId,
      status: 'pending',
    });
  });
};

// Get products owned by a specific farmer
const getProductsByFarmerId = (farmerId, callback) => {
  const sql = `
    SELECT p.*, c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.farmer_id = ?
    ORDER BY p.id DESC
  `;
  db.query(sql, [farmerId], (err, rows) => {
    if (err) return callback(err);
    return callback(null, rows);
  });
};

// Find single product by ID
const getProductById = (id, callback) => {
  const sql = `
    SELECT p.*, c.name AS category_name, u.full_name AS farmer_name
    FROM products p
    JOIN users u ON u.id = p.farmer_id
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.id = ?
    LIMIT 1
  `;
  db.query(sql, [id], (err, rows) => {
    if (err) return callback(err);
    return callback(null, rows[0] || null);
  });
};

// Update product status (admin approval/rejection)
const updateProductStatus = (id, status, callback) => {
  const sql = `UPDATE products SET status = ? WHERE id = ?`;
  db.query(sql, [status, id], (err, result) => {
    if (err) return callback(err);
    return callback(null, { affectedRows: result.affectedRows, id, status });
  });
};

module.exports = {
  getCategories,
  getActiveProducts,
  createProduct,
  getProductsByFarmerId,
  getProductById,
  updateProductStatus,
};
