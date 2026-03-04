const express = require('express');
const router = express.Router();
const { login, signup } = require('../controllers/authController');

// Signup
router.post('/signup', signup);

// Login
router.post('/login', login);

module.exports = router;
