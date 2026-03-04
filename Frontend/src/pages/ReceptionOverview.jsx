import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCustomers } from '../context/CustomerContext';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';

const ReceptionOverview = () => {
    const { customers, fetchCustomers } = useCustomers();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [lastRefresh, setLastRefresh] = useState(new Date());

    // Auto-refresh data every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (fetchCustomers) {
                fetchCustomers();
                setLastRefresh(new Date());
            }
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [fetchCustomers]);

    // Navigation handlers for Quick Actions
    const handleAddPatient = () => navigate('/reception/patients');
    const handleCreateBooking = () => navigate('/reception/bookings');
    const handleOfferDiscount = () => navigate('/reception/discounts');
    const handleViewReports = () => navigate('/reception/reports');

    // Calculate statistics
    const stats = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todaysAppointments = customers.filter(c => {
            if (!c.appointmentDate) return false;
            const appointmentDate = new Date(c.appointmentDate);
            return appointmentDate >= today && appointmentDate < tomorrow;
        }).length;

        const totalPatients = customers.length;

        const activePatients = customers.filter(c => c.status === 'Active' || c.status === 'Scheduled').length;

        const totalRevenue = customers.reduce((sum, customer) => {
            return sum + (parseFloat(customer.serviceCost) || 0);
        }, 0);

        const avgServiceCost = totalPatients > 0 ? Math.round(totalRevenue / totalPatients) : 0;

        const thisWeekStart = new Date(today);
        thisWeekStart.setDate(today.getDate() - today.getDay());
        const weeklyRegistrations = customers.filter(c => {
            const createdDate = new Date(c.createdAt || c.appointmentDate);
            return createdDate >= thisWeekStart;
        }).length;

        return {
            todaysAppointments,
            totalPatients,
            activePatients,
            totalRevenue,
            avgServiceCost,
            weeklyRegistrations
        };
    }, [customers]);

    // Recent activities (all patients, sorted by most recent) with search and filter
    const recentActivities = useMemo(() => {
        let filtered = [...customers]
            .sort((a, b) => {
                const dateA = new Date(a.createdAt || a.appointmentDate || 0);
                const dateB = new Date(b.createdAt || b.appointmentDate || 0);
                return dateB - dateA;
            });
        
        // Apply search filter
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            filtered = filtered.filter(c => 
                c.name?.toLowerCase().includes(search) ||
                c.phone?.toLowerCase().includes(search) ||
                c.therapyType?.toLowerCase().includes(search)
            );
        }
        
        // Apply status filter
        if (filterStatus !== 'all') {
            filtered = filtered.filter(c => c.status === filterStatus);
        }
        
        return filtered;
    }, [customers, searchTerm, filterStatus]);

    // Today's schedule
    const todaysSchedule = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return customers.filter(c => {
            if (!c.appointmentDate) return false;
            const appointmentDate = new Date(c.appointmentDate);
            return appointmentDate >= today && appointmentDate < tomorrow;
        }).sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
    }, [customers]);

    // Therapy breakdown
    const therapyBreakdown = useMemo(() => {
        const breakdown = {};
        customers.forEach(customer => {
            const therapy = customer.therapyType || 'Not Specified';
            breakdown[therapy] = (breakdown[therapy] || 0) + 1;
        });
        return Object.entries(breakdown).sort((a, b) => b[1] - a[1]).slice(0, 10);
    }, [customers]);

    const formatDateLabel = (dateStr) => {
        if (!dateStr) return 'Not Scheduled';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-r from-herbal-600 via-herbal-700 to-herbal-800 rounded-2xl p-8 shadow-glow border border-herbal-500 relative overflow-hidden"
            >
                {/* Decorative floating elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-herbal-400/10 rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex items-center gap-4 mb-4"
                    >
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-glow">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white">Welcome back, {user?.username || 'Receptionist'}!</h1>
                            <p className="text-herbal-100 text-lg mt-1">Ready to provide excellent patient care today</p>
                        </div>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex gap-4 text-white/90 text-sm"
                    >
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Today's Appointments"
                    value={stats.todaysAppointments}
                    icon={
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    }
                    trend="up"
                    trendValue="+12%"
                    gradientFrom="from-blue-500"
                    gradientTo="to-blue-600"
                />
                <StatCard
                    title="Total Patients"
                    value={stats.totalPatients}
                    icon={
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    }
                    trend="up"
                    trendValue={`+${stats.weeklyRegistrations} this week`}
                    gradientFrom="from-herbal-500"
                    gradientTo="to-herbal-600"
                />
                <StatCard
                    title="Active Patients"
                    value={stats.activePatients}
                    icon={
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    trend="up"
                    trendValue="Active"
                    gradientFrom="from-green-500"
                    gradientTo="to-green-600"
                />
                <StatCard
                    title="Avg Service Cost"
                    value={`₹${stats.avgServiceCost}`}
                    icon={
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    trend="neutral"
                    trendValue="Per patient"
                    gradientFrom="from-amber-500"
                    gradientTo="to-amber-600"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's Schedule */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-soft border border-gray-200"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-herbal-500 to-herbal-600 rounded-xl flex items-center justify-center shadow-glow">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Today's Schedule</h3>
                                <p className="text-sm text-gray-500">{todaysSchedule.length} appointments scheduled</p>
                            </div>
                        </div>
                        <motion.span
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="px-3 py-1 bg-herbal-100 text-herbal-700 text-xs font-semibold rounded-full flex items-center gap-1"
                        >
                            <span className="w-2 h-2 bg-herbal-500 rounded-full animate-pulse"></span>
                            LIVE
                        </motion.span>
                    </div>

                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                        {todaysSchedule.length > 0 ? (
                            todaysSchedule.map((appointment, index) => (
                                <motion.div
                                    key={appointment.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-herbal-50 to-white border border-herbal-100 rounded-xl hover:shadow-md transition-all"
                                >
                                    <div className="w-16 text-center">
                                        <div className="text-2xl font-bold text-herbal-700">{formatTime(appointment.appointmentDate)}</div>
                                        <div className="text-xs text-gray-500">Time</div>
                                    </div>
                                    <div className="h-12 w-px bg-herbal-200"></div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-800">{appointment.name}</div>
                                        <div className="text-sm text-gray-600">{appointment.therapyType || 'General Consultation'}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-semibold text-herbal-700">₹{appointment.serviceCost}</div>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            appointment.status === 'Active' 
                                                ? 'bg-green-100 text-green-700' 
                                                : appointment.status === 'Scheduled'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {appointment.status}
                                        </span>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <svg className="w-20 h-20 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </motion.div>
                                <p className="text-gray-500 mt-4 font-medium">No appointments scheduled for today</p>
                                <p className="text-gray-400 text-sm mt-2">Ready to schedule your first appointment!</p>
                                <button
                                    onClick={handleCreateBooking}
                                    className="mt-4 px-4 py-2 bg-herbal-600 hover:bg-herbal-700 text-white text-sm font-semibold rounded-lg transition-all"
                                >
                                    Create Booking
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Quick Stats & Therapy Breakdown */}
                <div className="space-y-6">
                    {/* Therapy Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white rounded-2xl p-6 shadow-soft border border-gray-200"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Top Therapies</h3>
                                <p className="text-xs text-gray-500">Most requested services</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {therapyBreakdown.length > 0 ? (
                                therapyBreakdown.map(([therapy, count], index) => (
                                    <motion.div
                                        key={therapy}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: 0.35 + index * 0.05 }}
                                        className="relative"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700 truncate">{therapy}</span>
                                            <span className="text-sm font-bold text-herbal-700">{count}</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(100, (count / therapyBreakdown[0][1]) * 100)}%` }}
                                                transition={{ duration: 0.8, delay: 0.4 + index * 0.05 }}
                                                className="h-full bg-gradient-to-r from-herbal-500 to-herbal-600 rounded-full"
                                            ></motion.div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 text-center py-8">
                                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    No therapy data available yet
                                </p>
                            )}
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-gradient-to-br from-herbal-50 to-white rounded-2xl p-6 shadow-soft border border-herbal-200"
                    >
                        <h3 className="text-lg font-bold text-herbal-800 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Quick Actions
                        </h3>
                        <div className="space-y-2">
                            <motion.button
                                whileHover={{ scale: 1.03, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAddPatient}
                                className="w-full text-left bg-white hover:bg-herbal-50 border border-herbal-200 rounded-xl p-3 transition-all flex items-center gap-3 group cursor-pointer"
                            >
                                <div className="w-8 h-8 bg-herbal-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <span className="text-sm font-semibold text-gray-700">Add New Patient</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.03, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleCreateBooking}
                                className="w-full text-left bg-white hover:bg-blue-50 border border-blue-200 rounded-xl p-3 transition-all flex items-center gap-3 group cursor-pointer"
                            >
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-semibold text-gray-700">Create Booking</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.03, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleOfferDiscount}
                                className="w-full text-left bg-white hover:bg-amber-50 border border-amber-200 rounded-xl p-3 transition-all flex items-center gap-3 group cursor-pointer"
                            >
                                <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-semibold text-gray-700">Offer Discount</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.03, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleViewReports}
                                className="w-full text-left bg-white hover:bg-purple-50 border border-purple-200 rounded-xl p-3 transition-all flex items-center gap-3 group cursor-pointer"
                            >
                                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-semibold text-gray-700">View Reports</span>
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Recent Activities */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white rounded-2xl p-6 shadow-soft border border-gray-200"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-glow">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Recent Patient Activities</h3>
                            <p className="text-sm text-gray-500">Latest registrations and updates • Last refresh: {lastRefresh.toLocaleTimeString()}</p>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="mb-6 flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by name, phone, or therapy type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:border-herbal-500 focus:ring-2 focus:ring-herbal-300 focus:outline-none text-sm transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                                filterStatus === 'all'
                                    ? 'bg-herbal-600 text-white shadow-soft'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilterStatus('Active')}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                                filterStatus === 'Active'
                                    ? 'bg-green-600 text-white shadow-soft'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setFilterStatus('Scheduled')}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                                filterStatus === 'Scheduled'
                                    ? 'bg-blue-600 text-white shadow-soft'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Scheduled
                        </button>
                        <button
                            onClick={() => setFilterStatus('Completed')}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                                filterStatus === 'Completed'
                                    ? 'bg-gray-600 text-white shadow-soft'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Completed
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 uppercase">Patient Name</th>
                                <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 uppercase">Phone</th>
                                <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 uppercase">Therapy Type</th>
                                <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 uppercase">Appointment</th>
                                <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 uppercase">Status</th>
                                <th className="text-right py-3 px-4 text-sm font-bold text-gray-700 uppercase">Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentActivities.length > 0 ? (
                                recentActivities.map((patient, index) => (
                                    <motion.tr
                                        key={patient.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: 0.55 + index * 0.03 }}
                                        whileHover={{ backgroundColor: "rgba(126, 171, 118, 0.05)", x: 5 }}
                                        className="border-b border-gray-100 hover:shadow-sm transition-all"
                                    >
                                        <td className="py-4 px-4 text-sm font-semibold text-gray-800">{patient.name}</td>
                                        <td className="py-4 px-4 text-sm text-gray-600">{patient.phone}</td>
                                        <td className="py-4 px-4 text-sm text-gray-600">{patient.therapyType || 'Not Specified'}</td>
                                        <td className="py-4 px-4 text-sm text-gray-600">{formatDateLabel(patient.appointmentDate)}</td>
                                        <td className="py-4 px-4">
                                            <motion.span
                                                whileHover={{ scale: 1.1 }}
                                                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                    patient.status === 'Active'
                                                        ? 'bg-green-100 text-green-700'
                                                        : patient.status === 'Scheduled'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : patient.status === 'Completed'
                                                        ? 'bg-gray-100 text-gray-700'
                                                        : 'bg-amber-100 text-amber-700'
                                                }`}
                                            >
                                                {patient.status || 'Active'}
                                            </motion.span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-800 text-right font-bold">₹{patient.serviceCost}</td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-12">
                                        <div className="text-center">
                                            <motion.div
                                                animate={{ y: [0, -10, 0] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            >
                                                <svg className="w-20 h-20 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </motion.div>
                                            <p className="text-gray-500 mt-4 font-medium">
                                                {searchTerm || filterStatus !== 'all' 
                                                    ? 'No patients match your search criteria' 
                                                    : 'No patient activities yet'}
                                            </p>
                                            <p className="text-gray-400 text-sm mt-2">
                                                {searchTerm || filterStatus !== 'all'
                                                    ? 'Try adjusting your filters or search terms'
                                                    : 'Add your first patient to get started!'}
                                            </p>
                                            {!searchTerm && filterStatus === 'all' && (
                                                <button
                                                    onClick={handleAddPatient}
                                                    className="mt-4 px-4 py-2 bg-herbal-600 hover:bg-herbal-700 text-white text-sm font-semibold rounded-lg transition-all inline-flex items-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    Add Patient
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Tips & Performance Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Reception Tips */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 shadow-soft border border-blue-200"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-soft">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-blue-900">Reception Excellence Tips</h3>
                            <p className="text-xs text-blue-600">Best practices for patient care</p>
                        </div>
                    </div>
                    <ul className="space-y-3 text-sm text-gray-700">
                        <motion.li
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.65 }}
                            className="flex items-start gap-2 p-3 bg-white rounded-lg"
                        >
                            <span className="text-blue-600 font-bold text-lg">✓</span>
                            <span>Greet every patient with a warm smile and personalized welcome</span>
                        </motion.li>
                        <motion.li
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                            className="flex items-start gap-2 p-3 bg-white rounded-lg"
                        >
                            <span className="text-blue-600 font-bold text-lg">✓</span>
                            <span>Verify patient information and collect complete details during registration</span>
                        </motion.li>
                        <motion.li
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.75 }}
                            className="flex items-start gap-2 p-3 bg-white rounded-lg"
                        >
                            <span className="text-blue-600 font-bold text-lg">✓</span>
                            <span>Schedule appointments strategically to avoid overcrowding</span>
                        </motion.li>
                        <motion.li
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 }}
                            className="flex items-start gap-2 p-3 bg-white rounded-lg"
                        >
                            <span className="text-blue-600 font-bold text-lg">✓</span>
                            <span>Follow up with patients about their appointment confirmations</span>
                        </motion.li>
                        <motion.li
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.85 }}
                            className="flex items-start gap-2 p-3 bg-white rounded-lg"
                        >
                            <span className="text-blue-600 font-bold text-lg">✓</span>
                            <span>Keep the reception area clean, organized, and welcoming</span>
                        </motion.li>
                    </ul>
                </motion.div>

                {/* Performance Metrics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="bg-gradient-to-br from-herbal-50 to-white rounded-2xl p-6 shadow-soft border border-herbal-200"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-herbal-600 rounded-xl flex items-center justify-center shadow-soft">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-herbal-900">This Week's Performance</h3>
                            <p className="text-xs text-herbal-600">Your productivity metrics</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.75 }}
                            className="bg-white rounded-xl p-4 border border-herbal-100"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-700">Patients Registered</span>
                                <span className="text-2xl font-bold text-herbal-700">{stats.weeklyRegistrations}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (stats.weeklyRegistrations / 20) * 100)}%` }}
                                    transition={{ duration: 1, delay: 0.8 }}
                                    className="h-full bg-gradient-to-r from-herbal-500 to-herbal-600"
                                ></motion.div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Target: 20 per week</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 }}
                            className="bg-white rounded-xl p-4 border border-blue-100"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-700">Appointments Scheduled</span>
                                <span className="text-2xl font-bold text-blue-700">{todaysSchedule.length}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (todaysSchedule.length / 15) * 100)}%` }}
                                    transition={{ duration: 1, delay: 0.85 }}
                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                                ></motion.div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Today's schedule</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.85 }}
                            className="bg-white rounded-xl p-4 border border-green-100"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-700">Patient Satisfaction</span>
                                <span className="text-2xl font-bold text-green-700">98%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "98%" }}
                                    transition={{ duration: 1, delay: 0.9 }}
                                    className="h-full bg-gradient-to-r from-green-500 to-green-600"
                                ></motion.div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Based on feedback</p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* System Status Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="bg-gradient-to-r from-green-50 to-herbal-50 rounded-xl p-4 border-2 border-green-200 flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-3 h-3 bg-green-500 rounded-full shadow-glow"
                    ></motion.div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800">All Systems Operational</p>
                        <p className="text-xs text-gray-600">Last updated: {new Date().toLocaleTimeString()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Connected</span>
                </div>
            </motion.div>
        </div>
    );
};

export default ReceptionOverview;
