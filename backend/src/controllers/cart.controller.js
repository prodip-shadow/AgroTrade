const cartModel = require('../models/cart.model');

// Get cart for logged in user
const getCart = (req, res) => {
  const userId = req.user.id;

  cartModel.getCart(userId, (err, items) => {
    if (err) {
      console.error('Error fetching cart:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve cart items',
      });
    }

    return res.status(200).json({
      success: true,
      items: items || [],
      totalCount: (items || []).reduce((sum, item) => sum + Number(item.quantity), 0),
    });
  });
};

// Add item to cart
const addToCart = (req, res) => {
  const userId = req.user.id;
  const { product_id, quantity = 1 } = req.body || {};

  if (!product_id) {
    return res.status(400).json({
      success: false,
      message: 'product_id is required',
    });
  }

  cartModel.addItem(userId, product_id, quantity, (err, items) => {
    if (err) {
      console.error('Error adding to cart:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to add item to cart',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product added to persistent cart',
      items: items || [],
      totalCount: (items || []).reduce((sum, item) => sum + Number(item.quantity), 0),
    });
  });
};

// Update item quantity in cart
const updateQuantity = (req, res) => {
  const userId = req.user.id;
  const productId = req.params.productId || req.body.product_id;
  const { quantity } = req.body || {};

  if (!productId || quantity === undefined) {
    return res.status(400).json({
      success: false,
      message: 'product_id and quantity are required',
    });
  }

  cartModel.updateQuantity(userId, productId, quantity, (err, items) => {
    if (err) {
      console.error('Error updating cart quantity:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to update item quantity',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Cart quantity updated',
      items: items || [],
      totalCount: (items || []).reduce((sum, item) => sum + Number(item.quantity), 0),
    });
  });
};

// Remove item from cart
const removeFromCart = (req, res) => {
  const userId = req.user.id;
  const productId = req.params.productId || req.body.product_id;

  if (!productId) {
    return res.status(400).json({
      success: false,
      message: 'productId is required',
    });
  }

  cartModel.removeItem(userId, productId, (err, items) => {
    if (err) {
      console.error('Error removing from cart:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to remove item from cart',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product removed from cart',
      items: items || [],
      totalCount: (items || []).reduce((sum, item) => sum + Number(item.quantity), 0),
    });
  });
};

// Clear entire cart
const clearCart = (req, res) => {
  const userId = req.user.id;

  cartModel.clearCart(userId, (err) => {
    if (err) {
      console.error('Error clearing cart:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to clear cart',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      items: [],
      totalCount: 0,
    });
  });
};

// Sync guest cart with database on login
const syncGuestCart = async (req, res) => {
  const userId = req.user.id;
  const { items } = req.body || {};

  try {
    if (Array.isArray(items) && items.length > 0) {
      await cartModel.syncGuestCart(userId, items);
    }

    cartModel.getCart(userId, (err, currentItems) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Cart sync query failed' });
      }

      return res.status(200).json({
        success: true,
        message: 'Cart synchronized with database',
        items: currentItems || [],
        totalCount: (currentItems || []).reduce((sum, item) => sum + Number(item.quantity), 0),
      });
    });
  } catch (err) {
    console.error('Error syncing cart:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to sync cart',
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  syncGuestCart,
};
