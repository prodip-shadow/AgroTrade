const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

// Middleware to verify JWT token from Authorization header or Cookie
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  let token = null;

  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Login required. Access denied.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'agrotrade_jwt_secret');

    userModel.getUserById(decoded.id, (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Server error verifying authentication.',
        });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists.',
        });
      }

      if (!user.is_active) {
        return res.status(403).json({
          success: false,
          message: 'Your account has been deactivated.',
        });
      }

      req.user = {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      };

      next();
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};

// Optional token verification (does not fail if token is absent)
const optionalVerifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  let token = null;

  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'agrotrade_jwt_secret');
    userModel.getUserById(decoded.id, (err, user) => {
      if (err || !user || !user.is_active) {
        req.user = null;
        return next();
      }

      req.user = {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      };
      next();
    });
  } catch {
    req.user = null;
    next();
  }
};

module.exports = {
  verifyToken,
  optionalVerifyToken,
};
