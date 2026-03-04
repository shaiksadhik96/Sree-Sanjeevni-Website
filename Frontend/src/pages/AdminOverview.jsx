import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCustomers } from '../context/CustomerContext';
import { isToday, formatDateLabel } from '../utils/date';

const AdminOverview = () => {
    const { customers } = useCustomers();

    const stats = useMemo(() => {
        const totalPatients = customers.length;
        const activePatients = customers.filter(c => c.status === 'Active').length;
        const todaysAppointments = customers.filter(c => isToday(c.appointmentDate)).length;
        const completedServices = customers.filter(c => c.status === 'Completed').length;

        const totalRevenue = customers.reduce((sum, c) => {
            const cost = Number(c.serviceCost) || 0;
            return sum + cost;
        }, 0);

        const averageServiceCost = totalPatients > 0 
            ? (totalRevenue / totalPatients).toFixed(2) 
            : 0;

        return {
            totalPatients,
            activePatients,
            todaysAppointments,
            completedServices,
            totalRevenue,
            averageServiceCost,
        };
    }, [customers]);

    const recentActivities = useMemo(() => {
        return customers
            .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
            .slice(0, 15);
    }, [customers]);

    const therapyBreakdown = useMemo(() => {
        const breakdown = {};
        customers.forEach(c => {
            const therapy = c.therapyType || 'Unknown';
            breakdown[therapy] = (breakdown[therapy] || 0) + 1;
        });
        return Object.entries(breakdown)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
    }, [customers]);

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Patients Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-gradient-to-br from-herbal-600 to-herbal-800 border border-herbal-500 rounded-lg p-6 shadow-soft hover:shadow-lift transition-all duration-300"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white/90 font-medium uppercase tracking-wide">Total Patients</p>
                            <p className="text-3xl font-bold text-white mt-2">{stats.totalPatients}</p>
                        </div>
                        <motion.div 
                            className="bg-green-400 rounded-full p-3"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                            <svg className="w-8 h-8 text-herbal-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Active Services Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-gradient-to-br from-herbal-500 to-herbal-700 border border-herbal-400 rounded-lg p-6 shadow-soft hover:shadow-lift transition-all duration-300"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white/90 font-medium uppercase tracking-wide">Active Services</p>
                            <p className="text-3xl font-bold text-white mt-2">{stats.activePatients}</p>
                        </div>
                        <motion.div 
                            className="bg-green-300 rounded-full p-3"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <svg className="w-8 h-8 text-herbal-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Today's Appointments Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-gradient-to-br from-herbal-600 to-herbal-800 border border-herbal-500 rounded-lg p-6 shadow-soft hover:shadow-lift transition-all duration-300"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white/90 font-medium uppercase tracking-wide">Today's Appointments</p>
                            <p className="text-3xl font-bold text-white mt-2">{stats.todaysAppointments}</p>
                        </div>
                        <motion.div 
                            className="bg-green-400 rounded-full p-3"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <svg className="w-8 h-8 text-herbal-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Total Revenue Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-gradient-to-br from-beige-400 to-beige-500 border border-beige-300 rounded-lg p-6 shadow-soft hover:shadow-lift transition-all duration-300"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white/90 font-medium uppercase tracking-wide">Total Revenue</p>
                            <p className="text-3xl font-bold text-white mt-2">₹{stats.totalRevenue.toLocaleString()}</p>
                        </div>
                        <motion.div 
                            className="bg-amber-200 rounded-full p-3"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                            <svg className="w-8 h-8 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Clinic Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-soft"
                >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-herbal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Today's Overview
                    </h3>
                    <div className="space-y-3">
                        <motion.div 
                            whileHover={{ x: 5 }}
                            className="flex justify-between items-center p-3 bg-herbal-50 rounded-lg border border-herbal-200"
                        >
                            <span className="text-sm text-gray-700 font-medium">Appointments</span>
                            <span className="text-2xl font-bold text-herbal-700">{stats.todaysAppointments}</span>
                        </motion.div>
                        <motion.div 
                            whileHover={{ x: 5 }}
                            className="flex justify-between items-center p-3 bg-herbal-50 rounded-lg border border-herbal-200"
                        >
                            <span className="text-sm text-gray-700 font-medium">Active Services</span>
                            <span className="text-2xl font-bold text-herbal-700">{stats.activePatients}</span>
                        </motion.div>
                        <motion.div 
                            whileHover={{ x: 5 }}
                            className="flex justify-between items-center p-3 bg-beige-100 rounded-lg border border-beige-300"
                        >
                            <span className="text-sm text-gray-700 font-medium">Today's Revenue</span>
                            <span className="text-lg font-bold text-beige-400">₹{stats.totalRevenue.toLocaleString()}</span>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-soft"
                >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-herbal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Clinic Status
                    </h3>
                    <div className="space-y-3">
                        <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center justify-between p-3 bg-herbal-50 rounded-lg border border-herbal-200"
                        >
                            <span className="text-sm text-gray-700 font-medium">Clinic Status</span>
                            <motion.span 
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="px-3 py-1 bg-herbal-600 text-white text-xs font-bold rounded-full flex items-center gap-1"
                            >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" />
                                </svg>
                                Open
                            </motion.span>
                        </motion.div>
                        <motion.div 
                            whileHover={{ x: 5 }}
                            className="flex items-center justify-between p-3 bg-herbal-50 rounded-lg border border-herbal-200"
                        >
                            <span className="text-sm text-gray-700 font-medium">Total Patients</span>
                            <span className="text-2xl font-bold text-herbal-700">{stats.totalPatients}</span>
                        </motion.div>
                        <motion.div 
                            whileHover={{ x: 5 }}
                            className="flex items-center justify-between p-3 bg-herbal-50 rounded-lg border border-herbal-200"
                        >
                            <span className="text-sm text-gray-700 font-medium">Avg Revenue/Patient</span>
                            <span className="text-lg font-bold text-herbal-700">₹{stats.averageServiceCost}</span>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-soft"
                >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-herbal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Quick Notes
                    </h3>
                    <div className="space-y-2 text-sm text-gray-700">
                        <motion.div 
                            whileHover={{ x: 5 }}
                            className="p-3 bg-herbal-50 rounded-lg border-l-4 border-herbal-600"
                        >
                            <p className="font-semibold text-herbal-900 flex items-center gap-2">
                                <motion.svg 
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-4 h-4" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </motion.svg>
                                System Running
                            </p>
                            <p className="text-xs text-herbal-700 mt-1">All systems operational</p>
                        </motion.div>
                        <motion.div 
                            whileHover={{ x: 5 }}
                            className="p-3 bg-herbal-50 rounded-lg border-l-4 border-herbal-600"
                        >
                            <p className="font-semibold text-herbal-900 flex items-center gap-2">
                                <svg
                                    className="w-4 h-4" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Data Synced
                            </p>
                            <p className="text-xs text-herbal-700 mt-1">Last sync: Just now</p>
                        </motion.div>
                        <motion.div 
                            whileHover={{ x: 5 }}
                            className="p-3 bg-beige-100 rounded-lg border-l-4 border-beige-400"
                        >
                            <p className="font-semibold text-beige-400 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                </svg>
                                Reminder
                            </p>
                            <p className="text-xs text-beige-400 mt-1">Check patient feedback</p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-soft"
            >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Patient Activities</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Patient Name</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Therapy</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Appointment</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentActivities.length > 0 ? (
                                recentActivities.map((customer, index) => (
                                    <motion.tr 
                                        key={customer.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                        whileHover={{ backgroundColor: "rgba(126, 171, 118, 0.05)" }}
                                        className="border-b border-gray-100 hover:shadow-sm transition-all"
                                    >
                                        <td className="py-3 px-4 text-sm text-gray-800">{customer.name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{customer.therapyType}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{formatDateLabel(customer.appointmentDate)}</td>
                                        <td className="py-3 px-4">
                                            <motion.span 
                                                whileHover={{ scale: 1.05 }}
                                                className={`px-2 py-1 text-xs font-semibold rounded ${
                                                    customer.status === 'Active' 
                                                        ? 'bg-herbal-100 text-herbal-700' 
                                                        : customer.status === 'Completed'
                                                        ? 'bg-gray-100 text-gray-700'
                                                        : 'bg-beige-100 text-beige-400'
                                                }`}
                                            >
                                                {customer.status}
                                            </motion.span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-800 text-right font-semibold">₹{customer.serviceCost}</td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-4 text-center text-sm text-gray-500">No recent activities</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white border border-herbal-100 rounded-lg p-6 shadow-soft"
                >
                    <h3 className="text-sm font-bold text-herbal-800 uppercase tracking-widest">Therapy Demand</h3>
                    <p className="text-xs text-gray-500 mt-1">Top therapies requested this week.</p>
                    <div className="mt-6 space-y-3">
                        {therapyBreakdown.length > 0 ? (
                            therapyBreakdown.map(([therapy, count]) => (
                                <div key={therapy} className="flex items-center gap-3">
                                    <span className="w-24 text-xs text-gray-500 truncate">{therapy}</span>
                                    <div className="flex-1 h-2 rounded-full bg-herbal-50 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-herbal-500 to-herbal-700"
                                            style={{ width: `${Math.min(100, count * 20)}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs font-semibold text-gray-600">{count}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-gray-400">No therapy data yet.</p>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.05 }}
                    className="bg-white border border-herbal-100 rounded-lg p-6 shadow-soft"
                >
                    <h3 className="text-sm font-bold text-herbal-800 uppercase tracking-widest">Operations Flow</h3>
                    <p className="text-xs text-gray-500 mt-1">Daily flow from intake to follow-up.</p>
                    <div className="mt-6 space-y-4">
                        {[
                            { label: 'Intake', detail: 'New patients checked in' },
                            { label: 'Therapy', detail: 'Services and sessions' },
                            { label: 'Billing', detail: 'Payments and discounts' },
                            { label: 'Feedback', detail: 'Notes and reviews' },
                        ].map((step, index) => (
                            <div key={step.label} className="flex items-center gap-3">
                                <div className="relative flex items-center">
                                    <div className="h-2.5 w-2.5 rounded-full bg-herbal-600"></div>
                                    {index < 3 && (
                                        <div className="absolute left-1 top-3 h-6 w-[2px] bg-herbal-200"></div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{step.label}</p>
                                    <p className="text-xs text-gray-500">{step.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white border border-herbal-100 rounded-lg p-6 shadow-soft"
                >
                    <h3 className="text-sm font-bold text-herbal-800 uppercase tracking-widest">Service Balance</h3>
                    <p className="text-xs text-gray-500 mt-1">Active vs completed sessions.</p>
                    <div className="mt-6 space-y-3">
                        <div className="flex items-center justify-between rounded-lg border border-herbal-100 bg-herbal-50 px-4 py-3">
                            <span className="text-xs text-gray-600">Active</span>
                            <span className="text-lg font-semibold text-herbal-700">{stats.activePatients}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-4 py-3">
                            <span className="text-xs text-gray-600">Completed</span>
                            <span className="text-lg font-semibold text-gray-700">{stats.completedServices}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-beige-200 bg-beige-50 px-4 py-3">
                            <span className="text-xs text-gray-600">Average Revenue</span>
                            <span className="text-lg font-semibold text-beige-400">₹{stats.averageServiceCost}</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Quick Actions for Admin */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.button 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white border-2 border-herbal-600 hover:bg-herbal-600 hover:text-white transition-colors rounded-lg p-4 text-left group"
                >
                    <div className="flex items-center space-x-3">
                        <div className="bg-herbal-600 group-hover:bg-white rounded-full p-2 transition-colors">
                            <svg className="w-6 h-6 text-white group-hover:text-herbal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <span className="font-semibold text-gray-800 group-hover:text-white">View Reports</span>
                    </div>
                </motion.button>

                <motion.button 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.55 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white border-2 border-purple-500 hover:bg-purple-500 hover:text-white transition-colors rounded-lg p-4 text-left group"
                >
                    <div className="flex items-center space-x-3">
                        <div className="bg-purple-500 group-hover:bg-white rounded-full p-2 transition-colors">
                            <svg className="w-6 h-6 text-white group-hover:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <span className="font-semibold text-gray-800 group-hover:text-white">Manage Staff</span>
                    </div>
                </motion.button>

                <motion.button 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white border-2 border-herbal-600 hover:bg-herbal-600 hover:text-white transition-colors rounded-lg p-4 text-left group"
                >
                    <div className="flex items-center space-x-3">
                        <div className="bg-herbal-600 group-hover:bg-white rounded-full p-2 transition-colors">
                            <svg className="w-6 h-6 text-white group-hover:text-herbal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <span className="font-semibold text-gray-800 group-hover:text-white">Export Data</span>
                    </div>
                </motion.button>

                <motion.button 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.65 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white border-2 border-beige-400 hover:bg-beige-400 hover:text-white transition-colors rounded-lg p-4 text-left group"
                >
                    <div className="flex items-center space-x-3">
                        <div className="bg-beige-400 group-hover:bg-white rounded-full p-2 transition-colors">
                            <svg className="w-6 h-6 text-white group-hover:text-beige-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <span className="font-semibold text-gray-800 group-hover:text-white">Settings</span>
                    </div>
                </motion.button>
            </div>

            {/* Additional Insights Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.7 }}
                className="mt-8 bg-gradient-to-br from-herbal-50 via-white to-beige-50 border-2 border-herbal-200 rounded-2xl p-8 shadow-xl"
            >
                <h2 className="text-2xl font-bold text-herbal-800 mb-6 text-center">Clinic Performance Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-3 shadow-glow">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{stats.completedServices}</p>
                        <p className="text-sm text-gray-600 mt-1">Completed Services</p>
                    </div>
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-3 shadow-glow">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">₹{stats.averageServiceCost}</p>
                        <p className="text-sm text-gray-600 mt-1">Avg Service Cost</p>
                    </div>
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-3 shadow-glow">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{Math.round((stats.activePatients / stats.totalPatients) * 100) || 0}%</p>
                        <p className="text-sm text-gray-600 mt-1">Active Rate</p>
                    </div>
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mb-3 shadow-glow">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{therapyBreakdown.length}</p>
                        <p className="text-sm text-gray-600 mt-1">Therapy Types</p>
                    </div>
                </div>
            </motion.div>

            {/* Admin Tips Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.8 }}
                className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-2xl p-6 shadow-soft">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-soft">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-blue-900">Daily Admin Checklist</h3>
                    </div>
                    <ul className="space-y-3 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold text-lg">□</span>
                            <span>Review and approve pending booking requests</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold text-lg">□</span>
                            <span>Process discount approvals from receptionists</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold text-lg">□</span>
                            <span>Check today's appointment schedule and staffing</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold text-lg">□</span>
                            <span>Review revenue reports and outstanding payments</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold text-lg">□</span>
                            <span>Update patient records and follow-up actions</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-2xl p-6 shadow-soft">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-herbal-600 rounded-xl flex items-center justify-center shadow-soft">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-green-900">Quick Actions</h3>
                    </div>
                    <div className="space-y-3">
                        <button className="w-full text-left bg-white hover:bg-green-50 border border-green-200 rounded-xl p-3 transition-all flex items-center justify-between group">
                            <span className="text-sm font-semibold text-gray-700">View Pending Approvals</span>
                            <span className="text-herbal-600 font-bold">→</span>
                        </button>
                        <button className="w-full text-left bg-white hover:bg-green-50 border border-green-200 rounded-xl p-3 transition-all flex items-center justify-between group">
                            <span className="text-sm font-semibold text-gray-700">Generate Monthly Report</span>
                            <span className="text-herbal-600 font-bold">→</span>
                        </button>
                        <button className="w-full text-left bg-white hover:bg-green-50 border border-green-200 rounded-xl p-3 transition-all flex items-center justify-between group">
                            <span className="text-sm font-semibold text-gray-700">Send Payment Reminders</span>
                            <span className="text-herbal-600 font-bold">→</span>
                        </button>
                        <button className="w-full text-left bg-white hover:bg-green-50 border border-green-200 rounded-xl p-3 transition-all flex items-center justify-between group">
                            <span className="text-sm font-semibold text-gray-700">Backup Data</span>
                            <span className="text-herbal-600 font-bold">→</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminOverview;
