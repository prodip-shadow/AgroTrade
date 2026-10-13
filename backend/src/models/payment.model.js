const db = require('../config/db');

// Get payments for a specific order (customer can see own, admin can see all)
const getPaymentsByOrderId = (orderId, userId, userRole, callback) => {
  const sql = `
    SELECT p.*
    FROM payments p
    JOIN orders o ON o.id = p.order_id
    WHERE o.id = ? AND (o.customer_id = ? OR ? = 'admin')
  `;
  db.query(sql, [orderId, userId, userRole], (err, rows) => {
    if (err) return callback(err);
    return callback(null, rows);
  });
};

// Get payments history for a customer
const getCustomerPayments = (customerId, callback) => {
  const sql = `
    SELECT p.*, o.order_number, o.order_status, o.delivery_address
    FROM payments p
    JOIN orders o ON o.id = p.order_id
    WHERE o.customer_id = ?
    ORDER BY p.created_at DESC
  `;
  db.query(sql, [customerId], (err, rows) => {
    if (err) return callback(err);
    return callback(null, rows);
  });
};

// Count pending payments (for admin dashboard)
const countPendingPayments = (callback) => {
  const sql = `SELECT COUNT(*) AS total FROM payments WHERE status = 'pending'`;
  db.query(sql, (err, rows) => {
    if (err) return callback(err);
    return callback(null, rows[0]?.total || 0);
  });
};

module.exports = {
  getPaymentsByOrderId,
  getCustomerPayments,
  countPendingPayments,
};
