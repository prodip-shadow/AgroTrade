const productModel = require('../models/product.model');

// Get all categories
const getCategories = (req, res) => {
  productModel.getCategories((err, categories) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch categories: ' + err.message,
      });
    }

    return res.status(200).json({
      success: true,
      categories: categories || [],
    });
  });
};

// Get active products (supports ?search= query)
const getProducts = (req, res) => {
  const { search } = req.query;

  productModel.getActiveProducts({ search }, (err, products) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch products: ' + err.message,
      });
    }

    return res.status(200).json({
      success: true,
      products: products || [],
    });
  });
};

// Farmer creates a new product (submitted for admin approval)
const createProduct = (req, res) => {
  const {
    category_id,
    name,
    description,
    price,
    stock_quantity,
    unit,
    image_url,
  } = req.body || {};

  const numPrice = Number(price);
  const numStock = Number(stock_quantity);

  if (
    !name ||
    !name.trim() ||
    !Number.isFinite(numPrice) ||
    numPrice < 0 ||
    !Number.isInteger(numStock) ||
    numStock < 0
  ) {
    return res.status(400).json({
      success: false,
      message: 'Valid product name, non-negative price, and valid stock quantity are required.',
    });
  }

  const productData = {
    farmer_id: req.user.id,
    category_id: category_id ? Number(category_id) : null,
    name: name.trim(),
    description: description ? description.trim() : null,
    price: numPrice,
    stock_quantity: numStock,
    unit: unit ? unit.trim() : 'kg',
    image_url: image_url ? image_url.trim() : null,
  };

  productModel.createProduct(productData, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create product: ' + err.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Product submitted for admin approval',
      id: result.id,
      status: result.status,
    });
  });
};

// Get products listed by the currently authenticated farmer
const getMyProducts = (req, res) => {
  productModel.getProductsByFarmerId(req.user.id, (err, products) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch your products: ' + err.message,
      });
    }

    return res.status(200).json({
      success: true,
      products: products || [],
    });
  });
};

module.exports = {
  getCategories,
  getProducts,
  createProduct,
  getMyProducts,
};
