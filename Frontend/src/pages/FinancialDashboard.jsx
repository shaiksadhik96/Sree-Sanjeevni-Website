import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useCustomers } from '../context/CustomerContext';
import { useBookings } from '../context/BookingContext';
import { usePayments } from '../context/PaymentContext';

const FinancialDashboard = () => {
    const { customers } = useCustomers();
    const { bookings } = useBookings();
    const { payments } = usePayments();
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');

    // Calculate billing data from approved bookings
    const billingData = useMemo(() => {
        const approvedBookings = bookings.filter(b => b.status === 'approved');
        
        return approvedBookings.map(booking => {
            const customer = customers.find(c => c.id === booking.customerId);
            const serviceCost = parseFloat(customer?.serviceCost) || 0;
            const discount = parseFloat(booking.discountAmount) || parseFloat(customer?.discount) || 0;
            
            const validDiscount = Math.min(discount, serviceCost);
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
                status: 'Unbilled'
            };
        }).sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
    }, [bookings, customers]);

    // Filter payments
    const filteredPayments = useMemo(() => {
        return payments.filter(p => 
            p.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [payments, searchTerm]);

    // Filter bills
    const filteredBills = useMemo(() => {
        return billingData.filter(b => 
            b.patientName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [billingData, searchTerm]);

    // Calculate comprehensive stats
    const stats = useMemo(() => {
        const totalBilled = billingData.reduce((sum, item) => sum + item.finalAmount, 0);
        const totalPaid = payments.reduce((sum, p) => sum + (p.amountPaid || 0), 0);
        const totalDiscounts = billingData.reduce((sum, item) => sum + item.discount, 0);
        const pending = payments.filter(p => p.paymentStatus === 'Pending').length;
        const paid = payments.filter(p => p.paymentStatus === 'Paid').length;

        return {
            totalBilled,
            totalPaid,
            totalDiscounts,
            pending,
            paid,
            pendingAmount: totalBilled - totalPaid,
            collectionRate: totalBilled > 0 ? ((totalPaid / totalBilled) * 100).toFixed(1) : 0
        };
    }, [billingData, payments]);

    // Chart data: Payment Status Distribution
    const paymentStatusData = useMemo(() => {
        return [
            { name: 'Paid', value: stats.paid, color: '#10b981' },
            { name: 'Pending', value: stats.pending, color: '#f59e0b' },
        ].filter(item => item.value > 0);
    }, [stats]);

    // Chart data: Service Revenue
    const serviceRevenueData = useMemo(() => {
        const serviceMap = {};
        billingData.forEach(bill => {
            const service = bill.serviceType || 'General';
            serviceMap[service] = (serviceMap[service] || 0) + bill.finalAmount;
        });
        return Object.entries(serviceMap).map(([name, value]) => ({
            name,
            value
        })).sort((a, b) => b.value - a.value).slice(0, 6);
    }, [billingData]);

    // Chart data: Payment Method Distribution
    const paymentMethodData = useMemo(() => {
        const methodMap = {};
        payments.forEach(p => {
            const method = p.paymentMethod || 'Not Specified';
            methodMap[method] = (methodMap[method] || 0) + (p.amountPaid || 0);
        });
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
        return Object.entries(methodMap).map(([name, value], idx) => ({
            name,
            value,
            color: colors[idx % colors.length]
        }));
    }, [payments]);

    // Chart data: Monthly revenue trend
    const monthlyRevenueData = useMemo(() => {
        const monthMap = {};
        payments.forEach(p => {
            const date = new Date(p.paymentDate || new Date());
            const monthKey = `${date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })}`;
            monthMap[monthKey] = (monthMap[monthKey] || 0) + (p.amountPaid || 0);
        });
        return Object.entries(monthMap).map(([month, revenue]) => ({
            month,
            revenue
        }));
    }, [payments]);

    const formatCurrency = (value) => `₹${(value || 0).toLocaleString('en-IN')}`;
    const formatDate = (date) => new Date(date).toLocaleDateString('en-IN');

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
                    <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Financial Dashboard
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">Track billing, payments, and financial performance</p>
                </div>
            </motion.div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5 shadow-soft hover:shadow-md transition"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-green-600 uppercase tracking-widest font-semibold">Total Billed</p>
                            <p className="text-2xl font-bold text-green-700 mt-2">{formatCurrency(stats.totalBilled)}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-green-200 flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 shadow-soft hover:shadow-md transition"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-blue-600 uppercase tracking-widest font-semibold">Total Collected</p>
                            <p className="text-2xl font-bold text-blue-700 mt-2">{formatCurrency(stats.totalPaid)}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-blue-200 flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-5 shadow-soft hover:shadow-md transition"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-red-600 uppercase tracking-widest font-semibold">Pending Amount</p>
                            <p className="text-2xl font-bold text-red-700 mt-2">{formatCurrency(stats.pendingAmount)}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-red-200 flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2M6.35 7H18M6 11h12v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8z" />
                            </svg>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-5 shadow-soft hover:shadow-md transition"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-amber-600 uppercase tracking-widest font-semibold">Total Discounts</p>
                            <p className="text-2xl font-bold text-amber-700 mt-2">{formatCurrency(stats.totalDiscounts)}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-amber-200 flex items-center justify-center">
                            <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 0 0 9.5 3h-5A2.5 2.5 0 0 0 2 5.5v13A2.5 2.5 0 0 0 4.5 21h5a2.5 2.5 0 0 0 2.5-2.5V13m0 0h4.5A2.5 2.5 0 0 1 22 15.5v5A2.5 2.5 0 0 1 19.5 23h-5A2.5 2.5 0 0 1 12 20.5v-5" />
                            </svg>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5 shadow-soft hover:shadow-md transition"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-purple-600 uppercase tracking-widest font-semibold">Collection Rate</p>
                            <p className="text-2xl font-bold text-purple-700 mt-2">{stats.collectionRate}%</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-purple-200 flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-xl p-4 shadow-soft border border-gray-200">
                <input
                    type="text"
                    placeholder="Search by patient name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-herbal-500 focus:ring-2 focus:ring-herbal-300 focus:outline-none"
                />
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-2 bg-white rounded-xl shadow-soft border border-gray-200">
                {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'billing', label: 'All Bills' },
                    { id: 'payments', label: 'All Payments' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                            activeTab === tab.id
                                ? 'bg-gradient-to-r from-herbal-600 to-brand text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Summary Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Payment Summary */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-2 bg-white rounded-xl p-6 shadow-soft border border-gray-200"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-brand" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                </svg>
                                Quick Summary
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <div>
                                        <p className="text-sm text-gray-600">Paid Payments</p>
                                        <p className="text-2xl font-bold text-blue-700">{stats.paid}</p>
                                    </div>
                                    <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded">PAID</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-amber-50 rounded-lg border border-amber-100">
                                    <div>
                                        <p className="text-sm text-gray-600">Pending Payments</p>
                                        <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
                                    </div>
                                    <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded">PENDING</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-100">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Bills Created</p>
                                        <p className="text-2xl font-bold text-green-700">{billingData.length}</p>
                                    </div>
                                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded">BILLS</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Key Metrics */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-br from-herbal-50 to-green-50 rounded-xl p-6 shadow-soft border border-herbal-200"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Key Metrics
                            </h3>
                            <div className="space-y-4 text-sm">
                                <div className="p-3 bg-white rounded-lg border-l-4 border-green-500">
                                    <p className="text-gray-600 text-xs">Average Bill Value</p>
                                    <p className="text-xl font-bold text-green-700 mt-1">
                                        {billingData.length > 0 
                                            ? formatCurrency(stats.totalBilled / billingData.length)
                                            : '₹0'
                                        }
                                    </p>
                                </div>
                                <div className="p-3 bg-white rounded-lg border-l-4 border-blue-500">
                                    <p className="text-gray-600 text-xs">Outstanding Balance</p>
                                    <p className="text-xl font-bold text-blue-700 mt-1">{formatCurrency(stats.pendingAmount)}</p>
                                </div>
                                <div className="p-3 bg-white rounded-lg border-l-4 border-purple-500">
                                    <p className="text-gray-600 text-xs">Avg Discount Given</p>
                                    <p className="text-xl font-bold text-purple-700 mt-1">
                                        {billingData.length > 0 
                                            ? formatCurrency(stats.totalDiscounts / billingData.length)
                                            : '₹0'
                                        }
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Payment Status Pie Chart */}
                        {paymentStatusData.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl p-6 shadow-soft border border-gray-200"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Payment Status Distribution
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={paymentStatusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={true}
                                        label={({ name, value }) => `${name}: ${value}`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {paymentStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${value} payments`} />
                                </PieChart>
                            </ResponsiveContainer>
                        </motion.div>
                    )}

                    {/* Service Revenue Bar Chart */}
                    {serviceRevenueData.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="bg-white rounded-xl p-6 shadow-soft border border-gray-200"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Revenue by Service
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={serviceRevenueData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                                    <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </motion.div>
                    )}

                    {/* Payment Method Distribution */}
                    {paymentMethodData.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-xl p-6 shadow-soft border border-gray-200"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Payment Methods
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={paymentMethodData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={true}
                                        label={({ name, value }) => `${name}: ₹${value.toLocaleString('en-IN')}`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {paymentMethodData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                                </PieChart>
                            </ResponsiveContainer>
                        </motion.div>
                    )}

                    {/* Monthly Revenue Trend */}
                    {monthlyRevenueData.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            className="bg-white rounded-xl p-6 shadow-soft border border-gray-200"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12a1 1 0 100-2 1 1 0 000 2z" />
                                </svg>
                                Revenue Trend
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={monthlyRevenueData} margin={{ top: 5, right: 30, left: 0, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="revenue" 
                                        stroke="#6366f1" 
                                        dot={{ fill: '#6366f1', r: 5 }}
                                        activeDot={{ r: 7 }}
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </motion.div>
                    )}
                    </div>
                </div>
            )}

            {activeTab === 'billing' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-soft border border-gray-200 overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-herbal-100 to-green-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-700">Patient Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-700">Service Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-700">Appointment Date</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold uppercase text-gray-700">Service Cost</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold uppercase text-gray-700">Discount</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold uppercase text-gray-700">Final Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredBills.length > 0 ? (
                                    filteredBills.map((bill, index) => (
                                        <tr key={bill.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} >
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">{bill.patientName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{bill.serviceType}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{formatDate(bill.appointmentDate)}</td>
                                            <td className="px-6 py-4 text-sm text-right font-semibold text-gray-900">{formatCurrency(bill.serviceCost)}</td>
                                            <td className="px-6 py-4 text-sm text-right">
                                                <span className="text-red-600 font-semibold">{formatCurrency(bill.discount)}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-right font-bold text-green-700">{formatCurrency(bill.finalAmount)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                            No billing records found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {activeTab === 'payments' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-soft border border-gray-200 overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-herbal-100 to-green-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-700">Patient Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-700">Service</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold uppercase text-gray-700">Total Amount</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold uppercase text-gray-700">Amount Paid</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-700">Method</th>
                                    <th className="px-6 py-3 text-center text-xs font-bold uppercase text-gray-700">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-700">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredPayments.length > 0 ? (
                                    filteredPayments.map((payment, index) => (
                                        <tr key={payment._id || payment.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">{payment.customerName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{payment.serviceType || 'N/A'}</td>
                                            <td className="px-6 py-4 text-sm text-right font-semibold text-gray-900">{formatCurrency(payment.amount)}</td>
                                            <td className="px-6 py-4 text-sm text-right font-semibold text-green-700">{formatCurrency(payment.amountPaid)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{payment.paymentMethod}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                                                    payment.paymentStatus === 'Paid'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-amber-100 text-amber-800'
                                                }`}>
                                                    {payment.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{formatDate(payment.paymentDate)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                            No payment records found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default FinancialDashboard;
