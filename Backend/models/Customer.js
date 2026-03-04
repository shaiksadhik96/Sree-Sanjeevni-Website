const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  patientId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true, enum: ['Male', 'Female'] },
  therapyType: { type: String },
  medicationNotes: { type: String },
  appointmentDate: { type: Date, required: true },
  status: { type: String, default: 'Active' },
  serviceCost: { type: String },
  discount: { type: String },
  receptionistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Receptionist' }
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema, 'customer_data');
