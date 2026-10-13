const db = require('../config/db');

// Get all items in a user's cart
const getCart = (userId, callback) => {
  const query = `
    SELECT 
      ci.id AS cart_item_id,
      ci.user_id,
      ci.product_id,
      ci.quantity,
      ci.created_at AS added_at,
      p.id,
      p.name,
      p.price,
      p.unit,
      p.image_url,
      p.stock_quantity,
      p.status,
      c.name AS category_name,
      f.full_name AS farmer_name
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN users f ON p.farmer_id = f.id
    WHERE ci.user_id = ? AND p.status = 'active'
    ORDER BY ci.updated_at DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return callback(err, null);
    return callback(null, results);
  });
};

// Add item to cart or increment quantity if already exists
const addItem = (userId, productId, quantity, callback) => {
  const qty = Number(quantity) > 0 ? Number(quantity) : 1;
  const query = `
    INSERT INTO cart_items (user_id, product_id, quantity)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
  `;

  db.query(query, [userId, productId, qty], (err, result) => {
    if (err) return callback(err, null);
    getCart(userId, callback);
  });
};

// Update item quantity directly
const updateQuantity = (userId, productId, quantity, callback) => {
  const qty = Number(quantity);

  if (qty <= 0) {
    return removeItem(userId, productId, callback);
  }

  const query = `
    UPDATE cart_items
    SET quantity = ?
    WHERE user_id = ? AND product_id = ?
  `;

  db.query(query, [qty, userId, productId], (err, result) => {
    if (err) return callback(err, null);
    getCart(userId, callback);
  });
};

// Remove single item from user cart
const removeItem = (userId, productId, callback) => {
  const query = `
    DELETE FROM cart_items
    WHERE user_id = ? AND product_id = ?
  `;

  db.query(query, [userId, productId], (err, result) => {
    if (err) return callback(err, null);
    getCart(userId, callback);
  });
};

// Clear entire cart for user (e.g. after successful order checkout)
const clearCart = (userId, callback) => {
  const query = `
    DELETE FROM cart_items
    WHERE user_id = ?
  `;

  db.query(query, [userId], (err, result) => {
    if (err) return callback(err, null);
    return callback(null, { success: true, cleared: true });
  });
};

// Batch merge guest cart items into user's database cart upon login
const syncGuestCart = async (userId, items) => {
  if (!Array.isArray(items) || items.length === 0) return;
  const promisePool = db.promise();

  for (const item of items) {
    const pId = item.id || item.product_id;
    const qty = Number(item.quantity) > 0 ? Number(item.quantity) : 1;
    if (!pId) continue;

    await promisePool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = GREATEST(quantity, VALUES(quantity))`,
      [userId, pId, qty]
    );
  }
};

module.exports = {
  getCart,
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
  syncGuestCart,
};
