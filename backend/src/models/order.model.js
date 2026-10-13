const db = require('../config/db');
const crypto = require('crypto');

// Create order transaction with stock validation and inventory deduction
const createOrderTransaction = (orderData, callback) => {
  const {
    customerId,
    items,
    paymentMethod,
    deliveryName,
    deliveryPhone,
    deliveryAddress,
  } = orderData;

  db.getConnection((err, conn) => {
    if (err) return callback(err);

    conn.beginTransaction(async (trxErr) => {
      if (trxErr) {
        conn.release();
        return callback(trxErr);
      }

      try {
        let subtotal = 0;
        const verifiedItems = [];

        // Verify products and inventory with row-locking
        for (const item of items) {
          const productId = Number(item.product_id);
          const qty = Number(item.quantity);

          if (!Number.isInteger(productId) || !Number.isInteger(qty) || qty < 1) {
            throw new Error('Invalid product or quantity specified.');
          }

          const [rows] = await conn.promise().execute(
            'SELECT * FROM products WHERE id = ? AND status = "active" FOR UPDATE',
            [productId]
          );

          const product = rows[0];
          if (!product || product.stock_quantity < qty) {
            throw new Error(
              product
                ? `Insufficient stock for product "${product.name}". Available: ${product.stock_quantity}`
                : `Product ID ${productId} is not available.`
            );
          }

          const lineTotal = Number(product.price) * qty;
          subtotal += lineTotal;
          verifiedItems.push({ product, qty, lineTotal });
        }

        // Generate unique order number
        const orderNumber =
          'AT-' + Date.now() + '-' + crypto.randomBytes(2).toString('hex').toUpperCase();

        // Insert into orders table
        const insertOrderSql = `
          INSERT INTO orders (
            order_number, customer_id, subtotal, delivery_fee, total_amount,
            payment_method, payment_status, order_status,
            delivery_name, delivery_phone, delivery_address
          )
          VALUES (?, ?, ?, 0.00, ?, ?, 'pending', 'placed', ?, ?, ?)
        `;

        const [orderResult] = await conn.promise().execute(insertOrderSql, [
          orderNumber,
          customerId,
          subtotal,
          subtotal,
          paymentMethod,
          deliveryName,
          deliveryPhone,
          deliveryAddress,
        ]);

        const orderId = orderResult.insertId;

        // Insert items and deduct stock
        for (const v of verifiedItems) {
          await conn.promise().execute(
            `INSERT INTO order_items (order_id, product_id, farmer_id, product_name, unit_price, quantity, line_total)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [orderId, v.product.id, v.product.farmer_id, v.product.name, v.product.price, v.qty, v.lineTotal]
          );

          await conn.promise().execute(
            'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
            [v.qty, v.product.id]
          );
        }

        // Insert payment record
        await conn.promise().execute(
          'INSERT INTO payments (order_id, provider, amount, status) VALUES (?, ?, ?, "pending")',
          [orderId, paymentMethod, subtotal]
        );

        // Commit transaction
        await conn.promise().commit();
        conn.release();

        return callback(null, {
          order_id: orderId,
          order_number: orderNumber,
          total_amount: subtotal,
          payment_status: 'pending',
          order_status: 'placed',
        });
      } catch (catchedErr) {
        await conn.promise().rollback();
        conn.release();
        return callback(catchedErr);
      }
    });
  });
};

// Get orders by customer ID
const getOrdersByCustomerId = (customerId, callback) => {
  const sql = `
    SELECT *
    FROM orders
    WHERE customer_id = ?
    ORDER BY created_at DESC
  `;
  db.query(sql, [customerId], (err, rows) => {
    if (err) return callback(err);
    return callback(null, rows);
  });
};

// Cancel an order (only if currently in 'placed' status)
const cancelCustomerOrder = (orderId, customerId, callback) => {
  const sql = `
    UPDATE orders
    SET order_status = 'cancelled'
    WHERE id = ? AND customer_id = ? AND order_status = 'placed'
  `;
  db.query(sql, [orderId, customerId], (err, result) => {
    if (err) return callback(err);
    return callback(null, { affectedRows: result.affectedRows });
  });
};

// Get all orders (for admin)
const getAllOrders = (options = {}, callback) => {
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

module.exports = {
  createOrderTransaction,
  getOrdersByCustomerId,
  cancelCustomerOrder,
  getAllOrders,
};
