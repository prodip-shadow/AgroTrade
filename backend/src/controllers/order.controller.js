const orderModel = require('../models/order.model');

// Customer places a new order
const placeOrder = (req, res) => {
  const {
    items,
    payment_method,
    delivery_name,
    delivery_phone,
    delivery_address,
  } = req.body || {};

  const allowedPaymentMethods = ['bkash', 'nagad', 'rocket', 'card', 'cod'];

  if (
    !Array.isArray(items) ||
    items.length === 0 ||
    !allowedPaymentMethods.includes(String(payment_method).toLowerCase()) ||
    !delivery_name ||
    !delivery_phone ||
    !delivery_address
  ) {
    return res.status(400).json({
      success: false,
      message: 'Cart items, valid payment method, and complete delivery details are required.',
    });
  }

  const orderData = {
    customerId: req.user.id,
    items,
    paymentMethod: String(payment_method).toLowerCase(),
    deliveryName: String(delivery_name).trim(),
    deliveryPhone: String(delivery_phone).trim(),
    deliveryAddress: String(delivery_address).trim(),
  };

  orderModel.createOrderTransaction(orderData, (err, result) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Order processing failed.',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Order placed; payment pending',
      order_id: result.order_id,
      order_number: result.order_number,
      total_amount: result.total_amount,
      payment_status: result.payment_status,
      order_status: result.order_status,
    });
  });
};

// Customer retrieves their own order history
const getMyOrders = (req, res) => {
  orderModel.getOrdersByCustomerId(req.user.id, (err, orders) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch order history: ' + err.message,
      });
    }

    return res.status(200).json({
      success: true,
      orders: orders || [],
    });
  });
};

// Customer cancels their placed order
const cancelOrder = (req, res) => {
  const { id } = req.params;
  const orderId = Number(id);

  if (!orderId || isNaN(orderId)) {
    return res.status(400).json({
      success: false,
      message: 'Valid order ID required',
    });
  }

  orderModel.cancelCustomerOrder(orderId, req.user.id, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to cancel order: ' + err.message,
      });
    }

    if (!result || result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order not found or cannot be cancelled (must be in "placed" status).',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order cancelled. Paid orders need manual support/refund handling.',
    });
  });
};

module.exports = {
  placeOrder,
  getMyOrders,
  cancelOrder,
};
