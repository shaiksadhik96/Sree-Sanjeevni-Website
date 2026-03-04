const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const Customer = require('../models/Customer');
const Discount = require('../models/Discount');
const authenticateToken = require('../middleware/auth');

// Apply authentication to all analytics routes
router.use(authenticateToken);

// Get Revenue Statistics
router.get('/revenue', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const matchCondition = {
      paymentStatus: 'Paid'
    };

    // Add date filter if provided
    if (startDate && endDate) {
      matchCondition.paymentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const revenueData = await Payment.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          totalPaid: { $sum: '$amountPaid' },
          totalPayments: { $sum: 1 }
        }
      }
    ]);

    const pendingPayments = await Payment.countDocuments({ paymentStatus: 'Pending' });
    const partialPayments = await Payment.countDocuments({ paymentStatus: 'Partially Paid' });

    res.json({
      totalRevenue: revenueData[0]?.totalRevenue || 0,
      totalPaid: revenueData[0]?.totalPaid || 0,
      totalPayments: revenueData[0]?.totalPayments || 0,
      pendingPayments,
      partialPayments
    });
  } catch (error) {
    console.error('[ANALYTICS] Revenue error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Booking Statistics
router.get('/bookings-stats', async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalBookings = await Booking.countDocuments();
    const todayBookings = await Booking.countDocuments({
      appointmentDate: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999))
      }
    });

    // Format stats
    const formattedStats = {
      total: totalBookings,
      today: todayBookings,
      byStatus: {}
    };

    stats.forEach(stat => {
      formattedStats.byStatus[stat._id] = stat.count;
    });

    res.json(formattedStats);
  } catch (error) {
    console.error('[ANALYTICS] Bookings stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Patient Growth (Monthly)
router.get('/patient-growth', async (req, res) => {
  try {
    const growth = await Customer.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          newPatients: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 } // Last 12 months
    ]);

    // Format data for frontend charts
    const formattedGrowth = growth.map(item => ({
      period: `${item._id.month}/${item._id.year}`,
      year: item._id.year,
      month: item._id.month,
      count: item.count,
      newPatients: item.newPatients
    }));

    const totalPatients = await Customer.countDocuments();

    res.json({
      totalPatients,
      monthlyGrowth: formattedGrowth
    });
  } catch (error) {
    console.error('[ANALYTICS] Patient growth error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Top Services
router.get('/top-services', async (req, res) => {
  try {
    const services = await Booking.aggregate([
      {
        $group: {
          _id: '$serviceType',
          bookingCount: { $sum: 1 },
          totalRevenue: { $sum: '$serviceCost' }
        }
      },
      { $sort: { bookingCount: -1 } },
      { $limit: 10 }
    ]);

    // Also get from customers
    const customerServices = await Customer.aggregate([
      {
        $group: {
          _id: '$therapyType',
          patientCount: { $sum: 1 }
        }
      },
      { $sort: { patientCount: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      topServicesByBookings: services,
      topServicesByPatients: customerServices
    });
  } catch (error) {
    console.error('[ANALYTICS] Top services error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Daily Statistics (for dashboard overview)
router.get('/daily-stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      todayBookings,
      todayPayments,
      todayRevenue,
      pendingApprovals,
      activePatients
    ] = await Promise.all([
      Booking.countDocuments({
        appointmentDate: { $gte: today, $lt: tomorrow }
      }),
      Payment.countDocuments({
        paymentDate: { $gte: today, $lt: tomorrow }
      }),
      Payment.aggregate([
        {
          $match: {
            paymentDate: { $gte: today, $lt: tomorrow },
            paymentStatus: 'Paid'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amountPaid' }
          }
        }
      ]),
      Discount.countDocuments({ status: 'pending' }),
      Customer.countDocuments({ status: 'Active' })
    ]);

    res.json({
      todayBookings,
      todayPayments,
      todayRevenue: todayRevenue[0]?.total || 0,
      pendingApprovals,
      activePatients
    });
  } catch (error) {
    console.error('[ANALYTICS] Daily stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Payment Methods Distribution
router.get('/payment-methods', async (req, res) => {
  try {
    const methods = await Payment.aggregate([
      {
        $match: { paymentStatus: 'Paid' }
      },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amountPaid' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json(methods);
  } catch (error) {
    console.error('[ANALYTICS] Payment methods error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Discount Analytics
router.get('/discounts', async (req, res) => {
  try {
    const discountStats = await Discount.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalDiscount: { $sum: '$discountAmount' }
        }
      }
    ]);

    const topDiscountReasons = await Discount.aggregate([
      {
        $group: {
          _id: '$reason',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      stats: discountStats,
      topReasons: topDiscountReasons
    });
  } catch (error) {
    console.error('[ANALYTICS] Discount stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Age Distribution of Patients
router.get('/patient-demographics', async (req, res) => {
  try {
    const ageGroups = await Customer.aggregate([
      {
        $bucket: {
          groupBy: '$age',
          boundaries: [0, 18, 30, 45, 60, 100],
          default: 'Other',
          output: {
            count: { $sum: 1 },
            avgAge: { $avg: '$age' }
          }
        }
      }
    ]);

    // Gender distribution (if field exists)
    const genderDistribution = await Customer.aggregate([
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      ageGroups,
      genderDistribution
    });
  } catch (error) {
    console.error('[ANALYTICS] Demographics error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Comprehensive Dashboard Data
router.get('/dashboard', async (req, res) => {
  try {
    const [
      revenueStats,
      bookingStats,
      patientStats,
      dailyStats
    ] = await Promise.all([
      Payment.aggregate([
        { $match: { paymentStatus: 'Paid' } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$amountPaid' },
            avgPayment: { $avg: '$amountPaid' }
          }
        }
      ]),
      Booking.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      Customer.countDocuments(),
      Booking.countDocuments({
        appointmentDate: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
      })
    ]);

    res.json({
      revenue: {
        total: revenueStats[0]?.totalRevenue || 0,
        average: revenueStats[0]?.avgPayment || 0
      },
      bookings: {
        total: bookingStats.reduce((sum, item) => sum + item.count, 0),
        byStatus: bookingStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      },
      patients: {
        total: patientStats
      },
      today: {
        bookings: dailyStats
      }
    });
  } catch (error) {
    console.error('[ANALYTICS] Dashboard error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
