const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getBookings,
  createBooking,
  updateBookingStatus
} = require('../controllers/bookingController');

router.get('/', auth, getBookings);
router.post('/', auth, createBooking);
router.patch('/:id/status', auth, updateBookingStatus);

module.exports = router;
