const Booking = require('../models/Booking');

const getBookings = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { receptionistId: req.user.id };
    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createBooking = async (req, res) => {
  const { customerId, patientName, appointmentDate, serviceType, notes, discountId, discountAmount, discountPercentage, discountReason } = req.body;
  if (!patientName || !appointmentDate) {
    return res.status(400).json({ message: 'Patient name and appointment date are required' });
  }

  try {
    const booking = new Booking({
      customerId: customerId || null,
      patientName,
      appointmentDate,
      serviceType,
      notes,
      discountId: discountId || null,
      discountAmount: discountAmount || null,
      discountPercentage: discountPercentage || null,
      discountReason: discountReason || null,
      status: 'pending',
      receptionistId: req.user.role === 'receptionist' ? req.user.id : null
    });

    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateBookingStatus = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can approve or postpone bookings' });
  }

  const { status, postponeDate, adminNote } = req.body;
  if (!['approved', 'postponed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status update' });
  }

  try {
    const updates = {
      status,
      adminNote: adminNote || '',
      decisionAt: new Date(),
      approvedBy: req.user.id,
      postponeDate: status === 'postponed' ? (postponeDate || null) : null
    };

    const updated = await Booking.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getBookings,
  createBooking,
  updateBookingStatus
};
