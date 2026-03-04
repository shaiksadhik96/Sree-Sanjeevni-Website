const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ReceptionistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'receptionist' }
}, { timestamps: true });

ReceptionistSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('Receptionist', ReceptionistSchema, 'receptionist_data');
