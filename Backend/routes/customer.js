const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  migratePatientIds
} = require('../controllers/customerController');

// Get all customers
router.get('/', auth, getAllCustomers);

// Add a customer
router.post('/', auth, addCustomer);

// Update customer
router.patch('/:id', auth, updateCustomer);

// Delete customer
router.delete('/:id', auth, deleteCustomer);

// Migrate patient IDs for existing customers
router.post('/migrate-ids', auth, migratePatientIds);

module.exports = router;
