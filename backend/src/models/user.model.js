const db = require('../config/db');

// Create a new user (customer / farmer)
const createUser = (userData, callback) => {
  const { full_name, email, phone, password_hash, role } = userData;
  const sql = `
    INSERT INTO users (full_name, email, phone, password_hash, role)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sql, [full_name, email.toLowerCase(), phone || null, password_hash, role], (err, result) => {
    if (err) return callback(err);
    return callback(null, {
      id: result.insertId,
      full_name,
      email: email.toLowerCase(),
      role,
    });
  });
};

// Find user by email (for login)
const getUserByEmail = (email, callback) => {
  const sql = `SELECT * FROM users WHERE email = ? AND is_active = 1 LIMIT 1`;
  db.query(sql, [String(email || '').toLowerCase()], (err, rows) => {
    if (err) return callback(err);
    return callback(null, rows[0] || null);
  });
};

// Find user by ID (safe details for auth verification)
const getUserById = (id, callback) => {
  const sql = `
    SELECT id, full_name, email, phone, role, is_verified, is_active, created_at
    FROM users
    WHERE id = ?
    LIMIT 1
  `;
  db.query(sql, [id], (err, rows) => {
    if (err) return callback(err);
    return callback(null, rows[0] || null);
  });
};

// Get users list (for admin)
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

// Get list of farmers
const getFarmersList = (callback) => {
  const sql = `
    SELECT u.id, u.full_name, u.email, u.phone, u.created_at, COUNT(p.id) AS products_count
    FROM users u
    LEFT JOIN products p ON p.farmer_id = u.id AND p.status = 'active'
    WHERE u.role = 'farmer' AND u.is_active = 1
    GROUP BY u.id
    ORDER BY products_count DESC, u.id DESC
  `;
  db.query(sql, (err, rows) => {
    if (err) return callback(err);
    return callback(null, rows);
  });
};

// Update user active status
const updateUserStatus = (id, isActive, callback) => {
  const sql = `UPDATE users SET is_active = ? WHERE id = ?`;
  db.query(sql, [Boolean(isActive), id], (err, result) => {
    if (err) return callback(err);
    return callback(null, { affectedRows: result.affectedRows, isActive });
  });
};

// Update user role
const updateUserRole = (id, role, callback) => {
  const sql = `UPDATE users SET role = ? WHERE id = ?`;
  db.query(sql, [role, id], (err, result) => {
    if (err) return callback(err);
    return callback(null, { affectedRows: result.affectedRows, role });
  });
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  getUsersList,
  getFarmersList,
  updateUserStatus,
  updateUserRole,
};
