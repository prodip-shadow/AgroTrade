const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const db = require('./config/db');

// Import Route Handlers
const authRoutes = require('./routes/auth.route');
const productRoutes = require('./routes/product.route');
const orderRoutes = require('./routes/order.route');
const paymentRoutes = require('./routes/payment.route');
const adminRoutes = require('./routes/admin.route');
const cartRoutes = require('./routes/cart.route');

const app = express();

// Trust reverse proxy for accurate IP identification
app.set('trust proxy', 1);

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

// Dynamic CORS configuration
const allowedOrigins = process.env.FRONTEND_ORIGIN
  ? process.env.FRONTEND_ORIGIN.split(',').map((url) => url.trim().replace(/\/$/, ''))
  : ['http://localhost:3000', 'http://127.0.0.1:5500', 'http://localhost:5500'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, '');
      const isAllowed = allowedOrigins.includes(cleanOrigin);
      const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(cleanOrigin);

      if (isAllowed || isLocalhost || process.env.NODE_ENV !== 'production') {
        return callback(null, cleanOrigin);
      }
      return callback(null, cleanOrigin);
    },
    credentials: true,
  })
);

// Body Parsers & Cookie Parser
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Root & Health Checks
app.get('/', (req, res) => {
  res.json({
    name: 'AgroTrade API',
    status: 'running',
    version: '1.0.0',
  });
});

app.get('/api/health', (req, res) => {
  db.query('SELECT 1', (err) => {
    if (err) {
      return res.status(503).json({
        success: false,
        status: 'error',
        database: 'disconnected',
        error: err.message,
      });
    }
    return res.status(200).json({
      success: true,
      status: 'ok',
      database: 'connected',
    });
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);

// 404 Route Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route '${req.originalUrl}' not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
