const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const helmet = require('helmet');
// const mongoSanitize = require('express-mongo-sanitize');
// const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customer');
const bookingRoutes = require('./routes/booking');
const discountRoutes = require('./routes/discount');
const paymentRoutes = require('./routes/payment');
const analyticsRoutes = require('./routes/analytics');

const app = express();

// Security Middleware - TEMPORARILY DISABLED (install packages first)
// app.use(helmet());
// app.use(mongoSanitize());

// Rate Limiting - TEMPORARILY DISABLED (install packages first)
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Max 100 requests per 15 min
//   message: 'Too many requests, please try again later.'
// });
// app.use('/api/', limiter);

// CORS & JSON
app.use(cors());
app.use(express.json());

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('--- Database Connection Successful ---');
    console.log(`Connected to: ${process.env.MONGODB_URI}`);
  })
  .catch((err) => {
    console.error('--- Database Connection Failed ---');
    console.error(err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
