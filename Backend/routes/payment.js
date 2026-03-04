const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  getAllPayments, 
  createPayment, 
  updatePayment, 
  deletePayment 
} = require('../controllers/paymentController');

router.get('/', auth, getAllPayments);
router.post('/', auth, createPayment);
router.patch('/:id', auth, updatePayment);
router.delete('/:id', auth, deletePayment);

module.exports = router;
