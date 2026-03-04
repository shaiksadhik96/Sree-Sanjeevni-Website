const Discount = require('../models/Discount');
const Customer = require('../models/Customer');

const getDiscounts = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { receptionistId: req.user.id };
    const discounts = await Discount.find(query)
      .populate('customerId', 'name phone therapyType')
      .populate('receptionistId', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(discounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createDiscount = async (req, res) => {
  const { customerId, customerName, discountAmount, discountPercentage, reason, applicableTherapy, validUntil } = req.body;

  if (!customerId || !customerName || !discountAmount) {
    return res.status(400).json({ message: 'Customer ID, name, and discount amount are required' });
  }

  try {
    const discount = new Discount({
      customerId,
      customerName,
      receptionistId: req.user.id,
      receptionistName: req.user.name || 'Receptionist',
      discountAmount,
      discountPercentage: discountPercentage || null,
      reason: reason || 'Special offer',
      applicableTherapy: applicableTherapy || 'All',
      validUntil: validUntil || null,
      status: 'pending'
    });

    const savedDiscount = await discount.save();
    const populated = await Discount.findById(savedDiscount._id)
      .populate('customerId', 'name phone therapyType')
      .populate('receptionistId', 'name email');
    
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateDiscountStatus = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can approve or reject discounts' });
  }

  const { status, adminNote, appliedToCustomer } = req.body;
  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status update' });
  }

  try {
    const discount = await Discount.findById(req.params.id);
    if (!discount) {
      return res.status(404).json({ message: 'Discount not found' });
    }

    const updates = {
      status,
      adminNote: adminNote || '',
      decisionAt: new Date(),
      approvedBy: req.user.id,
      appliedToCustomer: appliedToCustomer || false
    };

    // If accepted and appliedToCustomer is true, update customer record
    if (status === 'accepted' && appliedToCustomer) {
      await Customer.findByIdAndUpdate(
        discount.customerId,
        { discount: `₹${discount.discountAmount}` },
        { new: true }
      );
      updates.appliedToCustomer = true;
    }

    const updated = await Discount.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate('customerId', 'name phone therapyType')
      .populate('receptionistId', 'name email')
      .populate('approvedBy', 'name email');
    
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteDiscount = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);
    
    if (!discount) {
      return res.status(404).json({ message: 'Discount not found' });
    }

    // Allow deletion only by receptionist who created it or admin
    if (req.user.role !== 'admin' && discount.receptionistId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own discount offers' });
    }

    // Can only delete pending discounts
    if (discount.status !== 'pending') {
      return res.status(400).json({ message: 'Can only delete pending discount offers' });
    }

    await Discount.findByIdAndDelete(req.params.id);
    res.json({ message: 'Discount offer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getDiscounts,
  createDiscount,
  updateDiscountStatus,
  deleteDiscount
};
