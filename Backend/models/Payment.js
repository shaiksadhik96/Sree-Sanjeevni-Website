const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  customerId: { 
    type: String, // Changed to String to accept null more easily
    default: null
  },
  customerName: { type: String, required: true },
  bookingId: { 
    type: String,
    default: null
  },
  amount: { type: Number, required: true },
  amountPaid: { type: Number, default: 0 },
  paymentMethod: { 
    type: String, 
    enum: ['Cash', 'UPI', 'Card', 'Net Banking', 'Cheque', 'Other'],
    default: 'Cash'
  },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Paid', 'Partially Paid'],
    default: 'Pending'
  },
  paymentDate: { type: Date },
  serviceType: { type: String },
  notes: { type: String },
  receptionistId: { 
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema, 'customers_payment');
