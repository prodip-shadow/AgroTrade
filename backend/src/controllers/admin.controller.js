const adminModel = require('../models/admin.model');

// Get overall platform summary statistics
const getSummary = (req, res) => {
  adminModel.getDashboardSummary((err, summary) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve admin summary: ' + err.message,
      });
    }

    return res.status(200).json({
      success: true,
      ...summary,
    });
  });
};

// Get list of users (Admin only)
const getUsers = (req, res) => {
  const { limit = 200 } = req.query;

  adminModel.getUsersList({ limit }, (err, users) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve users: ' + err.message,
      });
    }

    return res.status(200).json({
      success: true,
      users: users || [],
    });
  });
};

// Toggle user active status (activate/deactivate)
const toggleUserStatus = (req, res) => {
  const { id } = req.params;
  const targetId = Number(id);

  if (targetId === req.user.id) {
    return res.status(400).json({
      success: false,
      message: 'You cannot deactivate your own admin account.',
    });
  }

  adminModel.toggleUserStatus(targetId, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to toggle user status: ' + err.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User status updated successfully.',
      updated: result.affectedRows,
    });
  });
};

// Delete user account
const deleteUser = (req, res) => {
  const { id } = req.params;
  const targetId = Number(id);

  if (targetId === req.user.id) {
    return res.status(400).json({
      success: false,
      message: 'You cannot delete your own admin account.',
    });
  }

  adminModel.deleteUser(targetId, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete user: ' + err.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully.',
      deleted: result.affectedRows,
    });
  });
};

// Admin create new category
const createCategory = (req, res) => {
  const { name, slug } = req.body || {};

  if (!name || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Category name is required.',
    });
  }

  adminModel.createCategory(name.trim(), slug ? slug.trim() : null, (err, category) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create category: ' + err.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      category,
    });
  });
};

// Get list of orders (Admin only)
const getOrders = (req, res) => {
  const { limit = 200 } = req.query;

  adminModel.getOrdersList({ limit }, (err, orders) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve orders: ' + err.message,
      });
    }

    return res.status(200).json({
      success: true,
      orders: orders || [],
    });
  });
};

// Approve, reject, or deactivate a product
const updateProductStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};

  const allowedStatuses = ['active', 'rejected', 'inactive'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Allowed values: active, rejected, inactive.',
    });
  }

  adminModel.updateProductStatus(id, status, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update product status: ' + err.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Product status updated to ${status}`,
      updated: result.affectedRows,
    });
  });
};

module.exports = {
  getSummary,
  getUsers,
  toggleUserStatus,
  deleteUser,
  createCategory,
  getOrders,
  updateProductStatus,
};
