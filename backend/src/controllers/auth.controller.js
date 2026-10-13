const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

// Register a new customer or farmer
const register = async (req, res) => {
  const { full_name, email, password, phone, role } = req.body || {};

  if (!full_name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'full_name, email and password are required',
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long',
    });
  }

  try {
    const password_hash = await bcrypt.hash(password, 12);
    const safeRole = role === 'farmer' ? 'farmer' : 'customer';

    userModel.createUser(
      { full_name, email, phone, password_hash, role: safeRole },
      (err, user) => {
        if (err) {
          const isDuplicate = err.code === 'ER_DUP_ENTRY' || err.errno === 1062;
          return res.status(isDuplicate ? 409 : 500).json({
            success: false,
            message: isDuplicate ? 'Email already registered' : 'Registration failed: ' + err.message,
          });
        }

        const token = jwt.sign(
          { id: user.id, full_name: user.full_name, email: user.email, role: user.role },
          process.env.JWT_SECRET || 'agrotrade_jwt_secret',
          { expiresIn: '8h' }
        );

        res.cookie('accessToken', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 8 * 60 * 60 * 1000,
        });

        return res.status(201).json({
          success: true,
          message: 'Registration successful',
          user,
          token,
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during registration: ' + error.message,
    });
  }
};

// User Login
const login = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  userModel.getUserByEmail(email, async (err, dbUser) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Server error during login',
      });
    }

    if (!dbUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    try {
      const isMatch = await bcrypt.compare(password, dbUser.password_hash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      const user = {
        id: dbUser.id,
        full_name: dbUser.full_name,
        email: dbUser.email,
        role: dbUser.role,
      };

      const token = jwt.sign(
        user,
        process.env.JWT_SECRET || 'agrotrade_jwt_secret',
        { expiresIn: '8h' }
      );

      res.cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 8 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user,
        token,
      });
    } catch (compareErr) {
      return res.status(500).json({
        success: false,
        message: 'Server error comparing password',
      });
    }
  });
};

// Get authenticated user's current profile
const getMe = (req, res) => {
  userModel.getUserById(req.user.id, (err, user) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Server error fetching user profile',
      });
    }

    return res.status(200).json({
      success: true,
      user: user || null,
    });
  });
};

// Get registered farmers directory (farmer & admin only)
const getFarmers = (req, res) => {
  userModel.getFarmersList((err, farmers) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch farmers: ' + err.message,
      });
    }

    return res.status(200).json({
      success: true,
      farmers: farmers || [],
    });
  });
};

module.exports = {
  register,
  login,
  getMe,
  getFarmers,
};
