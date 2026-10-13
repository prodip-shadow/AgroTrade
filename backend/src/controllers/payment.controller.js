const paymentModel = require('../models/payment.model');

// Get payments for a specific order
const getOrderPayments = (req, res) => {
  const { id } = req.params;
  const orderId = Number(id);

  if (!orderId || isNaN(orderId)) {
    return res.status(400).json({
      success: false,
      message: 'Valid order ID required',
    });
  }

  paymentModel.getPaymentsByOrderId(orderId, req.user.id, req.user.role, (err, payments) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve payment records: ' + err.message,
      });
    }

    return res.status(200).json({
      success: true,
      payments: payments || [],
    });
  });
};

// Get personal payments history
const getMyPayments = (req, res) => {
  paymentModel.getCustomerPayments(req.user.id, (err, payments) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch payment history: ' + err.message,
      });
    }

    return res.status(200).json({
      success: true,
      payments: payments || [],
    });
  });
};

module.exports = {
  getOrderPayments,
  getMyPayments,
};
