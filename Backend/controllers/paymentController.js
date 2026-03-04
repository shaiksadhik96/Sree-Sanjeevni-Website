const Payment = require('../models/Payment');

// Get all payments
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('customerId', 'name phone')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new payment
const createPayment = async (req, res) => {
  try {
    console.log('[CREATE PAYMENT] Request received:', req.body);
    
    // Validate required fields
    if (!req.body.customerName || !req.body.amount) {
      console.log('[CREATE PAYMENT] ✗ Missing required fields');
      return res.status(400).json({ message: 'Customer name and amount are required' });
    }
    
    // Convert empty string to null for customerId
    const customerId = req.body.customerId || null;
    
    const paymentData = {
      ...req.body,
      customerId: customerId === '' ? null : customerId,
      receptionistId: req.user.role === 'receptionist' ? req.user.id : null
    };
    
    console.log('[CREATE PAYMENT] Saving payment data:', paymentData);
    const newPayment = new Payment(paymentData);
    const savedPayment = await newPayment.save();
    console.log('[CREATE PAYMENT] ✓ Payment saved successfully with ID:', savedPayment._id);
    res.status(201).json(savedPayment);
  } catch (err) {
    console.error('[CREATE PAYMENT] ✗ Error:', err.message);
    console.error('[CREATE PAYMENT] ✗ Error stack:', err);
    res.status(400).json({ message: err.message });
  }
};

// Update payment
const updatePayment = async (req, res) => {
  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedPayment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete payment
const deletePayment = async (req, res) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllPayments,
  createPayment,
  updatePayment,
  deletePayment
};
