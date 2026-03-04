const mongoose = require('mongoose');

const DiscountSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  customerName: { type: String, required: true },
  receptionistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Receptionist', required: true },
  receptionistName: { type: String },
  discountAmount: { type: Number, required: true }, // Amount in currency
  discountPercentage: { type: Number }, // Optional percentage
  reason: { type: String }, // Why discount is being offered
  applicableTherapy: { type: String }, // Which therapy this discount applies to
  validUntil: { type: Date }, // Expiry date for the discount offer
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  adminNote: { type: String },
  decisionAt: { type: Date },
  appliedToCustomer: { type: Boolean, default: false } // Whether discount was actually applied to customer record
}, { timestamps: true });

module.exports = mongoose.model('Discount', DiscountSchema, 'discount_data');
