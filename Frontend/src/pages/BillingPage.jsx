import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCustomers } from '../context/CustomerContext';
import { useBookings } from '../context/BookingContext';
import { formatDateLabel } from '../utils/date';

const BillingPage = () => {
    const { customers } = useCustomers();
    const { bookings } = useBookings();
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Get approved bookings with customer billing data
    const billingData = useMemo(() => {
        const approvedBookings = bookings.filter(b => b.status === 'approved');
        
        return approvedBookings.map(booking => {
            const customer = customers.find(c => c.id === booking.customerId);
            const serviceCost = parseFloat(customer?.serviceCost) || 0;
            const discount = parseFloat(booking.discountAmount) || parseFloat(customer?.discount) || 0;
            
            // VALIDATION: Ensure discount doesn't exceed service cost
            const validDiscount = Math.min(discount, serviceCost);
            // VALIDATION: Final amount cannot be negative
            const finalAmount = Math.max(0, serviceCost - validDiscount);

            return {
                id: booking.id,
                patientName: booking.patientName || customer?.name || 'Unknown',
                appointmentDate: booking.appointmentDate,
                serviceType: booking.serviceType || customer?.therapyType || 'General Service',
                serviceCost: serviceCost > 0 ? serviceCost : 0,
                discount: validDiscount,
                finalAmount: finalAmount,
                phone: customer?.phone || 'N/A',
                createdAt: booking.createdAt || new Date(),
                // VALIDATION: Track if discount was adjusted
                hasDiscountAdjustment: discount !== validDiscount,
                originalDiscount: discount
            };
        }).sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
    }, [bookings, customers]);

    // Apply filters
    const filteredData = useMemo(() => {
        return billingData.filter(item => {
            const matchesSearch = item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                item.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        });
    }, [billingData, searchTerm]);

    // Calculate stats
    const stats = useMemo(() => {
        const totalRevenue = billingData.reduce((sum, item) => sum + item.finalAmount, 0);
        const totalDiscounts = billingData.reduce((sum, item) => sum + item.discount, 0);
        const totalBillings = billingData.length;

        return { totalRevenue, totalDiscounts, totalBillings };
    }, [billingData]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden bg-gradient-to-r from-herbal-50 via-beige-50 to-green-50 p-6 rounded-xl shadow-lg border border-herbal-100"
            >
                <div className="absolute -top-4 -right-4 h-32 w-32 rounded-full bg-green-200/30 blur-2xl"></div>
                <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-herbal-200/30 blur-2xl"></div>
                <div className="relative">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        Billing & Revenue
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">Track patient billing and revenue from approved bookings</p>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5 shadow-soft"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-green-600 uppercase tracking-widest font-semibold">Total Revenue</p>
                            <p className="text-3xl font-bold text-green-700 mt-2">₹{stats.totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="h-14 w-14 rounded-full bg-green-200 flex items-center justify-center">
                            <span className="text-sm font-bold text-green-700">REV</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 shadow-soft"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-blue-600 uppercase tracking-widest font-semibold">Total Billings</p>
                            <p className="text-3xl font-bold text-blue-700 mt-2">{stats.totalBillings}</p>
                        </div>
                        <div className="h-14 w-14 rounded-full bg-blue-200 flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-700">BIL</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-5 shadow-soft"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-amber-600 uppercase tracking-widest font-semibold">Total Discounts</p>
                            <p className="text-3xl font-bold text-amber-700 mt-2">₹{stats.totalDiscounts.toLocaleString()}</p>
                        </div>
                        <div className="h-14 w-14 rounded-full bg-amber-200 flex items-center justify-center">
                            <span className="text-sm font-bold text-amber-700">DIS</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-xl p-4 shadow-soft border border-gray-200">
                <input
                    type="text"
                    placeholder="Search by patient name or service type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-herbal-500 focus:ring-2 focus:ring-herbal-300 focus:outline-none"
                />
            </div>

            {/* Billing Table */}
            <div className="bg-white rounded-xl shadow-soft border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-herbal-100 to-beige-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Patient</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Phone</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Service</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Appointment</th>
                                <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Service Cost</th>
                                <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Discount</th>
                                <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Final Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredData.length > 0 ? (
                                filteredData.map((item, index) => (
                                    <motion.tr
                                        key={item.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="hover:bg-herbal-50/50 transition"
                                    >
                                        <td className="px-4 py-3 text-sm font-semibold text-gray-800">{item.patientName}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{item.phone}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{item.serviceType}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{formatDateLabel(item.appointmentDate)}</td>
                                        <td className="px-4 py-3 text-sm text-right text-gray-800">₹{item.serviceCost > 0 ? item.serviceCost.toLocaleString() : '-'}</td>
                                        <td className="px-4 py-3 text-sm text-right text-amber-700 font-semibold">
                                            {item.discount > 0 ? `-₹${item.discount.toLocaleString()}` : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right font-bold text-green-700">₹{item.finalAmount.toLocaleString()}</td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-4 py-12 text-center">
                                        <div className="inline-flex flex-col items-center">
                                            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                            <p className="text-gray-500 text-lg font-medium">No billing records found</p>
                                            <p className="text-gray-400 text-sm mt-2">Approved bookings will appear here</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BillingPage;
