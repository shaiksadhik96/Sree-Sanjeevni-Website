const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getDiscounts,
  createDiscount,
  updateDiscountStatus,
  deleteDiscount
} = require('../controllers/discountController');

router.get('/', auth, getDiscounts);
router.post('/', auth, createDiscount);
router.patch('/:id/status', auth, updateDiscountStatus);
router.delete('/:id', auth, deleteDiscount);

module.exports = router;
