const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  appointmentDate: { type: Date, required: true },
  serviceType: { type: String },
  notes: { type: String },
  discountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Discount' },
  discountAmount: { type: Number },
  discountPercentage: { type: Number },
  discountReason: { type: String },
  status: {
    type: String,
    enum: ['pending', 'approved', 'postponed'],
    default: 'pending'
  },
  receptionistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Receptionist' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  adminNote: { type: String },
  postponeDate: { type: Date },
  decisionAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema, 'booking_data');
