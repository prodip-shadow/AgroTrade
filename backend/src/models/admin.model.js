const db = require('../config/db');

// Get overview stats for admin dashboard
const getDashboardSummary = (callback) => {
  const usersSql = 'SELECT COUNT(*) AS total FROM users';
  const productsSql = 'SELECT COUNT(*) AS total FROM products';
  const ordersSql = 'SELECT COUNT(*) AS total, COALESCE(SUM(total_amount), 0) AS sales FROM orders';
  const paymentsSql = "SELECT COUNT(*) AS total FROM payments WHERE status = 'pending'";

  db.query(usersSql, (err, usersResult) => {
    if (err) return callback(err);

    db.query(productsSql, (err, productsResult) => {
      if (err) return callback(err);

      db.query(ordersSql, (err, ordersResult) => {
        if (err) return callback(err);

        db.query(paymentsSql, (err, paymentsResult) => {
          if (err) return callback(err);

          return callback(null, {
            users: usersResult[0]?.total || 0,
            products: productsResult[0]?.total || 0,
            orders: ordersResult[0]?.total || 0,
            order_value: ordersResult[0]?.sales || 0,
            pending_payments: paymentsResult[0]?.total || 0,
          });
        });
      });
    });
  });
};

// Get list of registered users
const getUsersList = (options = {}, callback) => {
  const { limit = 200 } = options;
  const sql = `
    SELECT id, full_name, email, phone, role, is_verified, is_active, created_at
    FROM users
    ORDER BY id DESC
    LIMIT ?
  `;
  db.query(sql, [Number(limit)], (err, rows) => {
    if (err) return callback(err);
    return callback(null, rows);
  });
};

// Toggle user active status
const toggleUserStatus = (userId, callback) => {
  const sql = `UPDATE users SET is_active = NOT is_active WHERE id = ?`;
  db.query(sql, [userId], (err, result) => {
    if (err) return callback(err);
    return callback(null, { affectedRows: result.affectedRows, userId });
  });
};

// Delete user
const deleteUser = (userId, callback) => {
  const sql = `DELETE FROM users WHERE id = ?`;
  db.query(sql, [userId], (err, result) => {
    if (err) return callback(err);
    return callback(null, { affectedRows: result.affectedRows, userId });
  });
};

// Create a new category
const createCategory = (name, slug, callback) => {
  const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const sql = `INSERT INTO categories (name, slug) VALUES (?, ?)`;
  db.query(sql, [name, finalSlug], (err, result) => {
    if (err) return callback(err);
    return callback(null, { id: result.insertId, name, slug: finalSlug });
  });
};

// Get list of orders
const getOrdersList = (options = {}, callback) => {
  const { limit = 200 } = options;
  const sql = `
    SELECT *
    FROM orders
    ORDER BY created_at DESC
    LIMIT ?
  `;
  db.query(sql, [Number(limit)], (err, rows) => {
    if (err) return callback(err);
    return callback(null, rows);
  });
};

// Update product status (active, rejected, inactive)
const updateProductStatus = (productId, status, callback) => {
  const sql = `UPDATE products SET status = ? WHERE id = ?`;
  db.query(sql, [status, productId], (err, result) => {
    if (err) return callback(err);
    return callback(null, { affectedRows: result.affectedRows, productId, status });
  });
};

module.exports = {
  getDashboardSummary,
  getUsersList,
  toggleUserStatus,
  deleteUser,
  createCategory,
  getOrdersList,
  updateProductStatus,
};
