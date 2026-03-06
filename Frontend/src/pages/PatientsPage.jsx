import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CustomerList from '../components/CustomerList';
import CustomerForm from '../components/CustomerForm';
import { useCustomers } from '../context/CustomerContext';
import { useDiscounts } from '../context/DiscountContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastProvider';

const PatientsPage = ({ viewOnly = false }) => {
    const { customers, fetchCustomers, addCustomer, updateCustomer, deleteCustomer } = useCustomers();
    const { createDiscount, fetchDiscounts } = useDiscounts();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [showForm, setShowForm] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [therapyFilter, setTherapyFilter] = useState('all');
    const [showDiscountModal, setShowDiscountModal] = useState(false);
    const [discountCustomer, setDiscountCustomer] = useState(null);
    const [discountForm, setDiscountForm] = useState({
        discountAmount: '',
        discountPercentage: '',
        reason: '',
        applicableTherapy: '',
        validUntil: ''
    });

    // Debug: Log customer count whenever it changes
    useEffect(() => {
        console.log(`[PATIENTS PAGE] Total customers in state: ${customers.length}`);
    }, [customers]);

    const statusSummary = useMemo(() => {
        const summary = { active: 0, scheduled: 0, completed: 0 };
        customers.forEach((customer) => {
            const status = customer.status || 'Active';
            if (status === 'Active') summary.active += 1;
            if (status === 'Scheduled') summary.scheduled += 1;
            if (status === 'Completed') summary.completed += 1;
        });
        return summary;
    }, [customers]);

    const monthlyTrend = useMemo(() => {
        const now = new Date();
        const months = [];
        for (let i = 5; i >= 0; i -= 1) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const label = date.toLocaleString('en-US', { month: 'short' });
            const count = customers.filter((customer) => {
                const appointment = new Date(customer.appointmentDate);
                return (
                    appointment.getFullYear() === date.getFullYear() &&
                    appointment.getMonth() === date.getMonth()
                );
            }).length;
            months.push({ label, count });
        }

        const max = Math.max(1, ...months.map((month) => month.count));
        return months.map((month) => ({
            ...month,
            percent: Math.round((month.count / max) * 100),
        }));
    }, [customers]);

    const handleAddPatient = () => {
        setEditingCustomer(null);
        setShowForm(true);
    };

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        setShowForm(true);
    };

    const handleSubmit = async (payload) => {
        if (editingCustomer) {
            await updateCustomer(editingCustomer.id, payload);
            showToast("Patient updated.", "success");
            await fetchCustomers(); // Refresh to get accurate count
        } else {
            const newCustomer = await addCustomer(payload);
            
            if (newCustomer) {
                // If discount is provided, create discount offer for admin approval
                if (payload.discount && parseFloat(payload.discount) > 0) {
                    const discountPayload = {
                        customerId: newCustomer.id,
                        customerName: newCustomer.name,
                        discountAmount: parseFloat(payload.discount),
                        discountPercentage: null,
                        reason: payload.discountReason || 'Special offer',
                        applicableTherapy: payload.therapyType || 'All',
                        validUntil: null
                    };
                    
                    const discountResult = await createDiscount(discountPayload);
                    if (discountResult) {
                        showToast("Patient added. Discount sent to admin for approval.", "success");
                        await fetchDiscounts();
                    } else {
                        showToast("Patient added, but discount request failed.", "warning");
                    }
                } else {
                    showToast("Patient added successfully.", "success");
                }
                
                // Refresh customer list to ensure accurate count from database
                await fetchCustomers();
            } else {
                showToast("Failed to add patient.", "error");
            }
        }
        setShowForm(false);
        setEditingCustomer(null);
    };

    const handleOfferDiscount = (customer) => {
        if (user?.role !== 'receptionist') {
            showToast('Only receptionists can offer discounts', 'error');
            return;
        }
        setDiscountCustomer(customer);
        setShowDiscountModal(true);
    };

    const handleSubmitDiscount = async () => {
        if (!discountForm.discountAmount) {
            showToast('Please enter discount amount', 'error');
            return;
        }

        const payload = {
            customerId: discountCustomer.id,
            customerName: discountCustomer.name,
            discountAmount: parseFloat(discountForm.discountAmount),
            discountPercentage: discountForm.discountPercentage ? parseFloat(discountForm.discountPercentage) : null,
            reason: discountForm.reason || 'Special offer',
            applicableTherapy: discountForm.applicableTherapy || 'All',
            validUntil: discountForm.validUntil || null
        };

        const result = await createDiscount(payload);
        if (result) {
            showToast('Discount offer sent to admin for approval', 'success');
            await fetchDiscounts();
            setShowDiscountModal(false);
            setDiscountCustomer(null);
            setDiscountForm({
                discountAmount: '',
                discountPercentage: '',
                reason: '',
                applicableTherapy: '',
                validUntil: ''
            });
        } else {
            showToast('Failed to create discount offer', 'error');
        }
    };

    const handleDeleteCustomer = async (id) => {
        await deleteCustomer(id);
        await fetchCustomers(); // Refresh to get accurate count from database
        showToast("Patient deleted successfully.", "success");
    };

    // Calculate patient status based on appointment date
    const getPatientStatus = (appointmentDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const appointment = new Date(appointmentDate);
        appointment.setHours(0, 0, 0, 0);
        
        // If appointment date is in the past → Completed
        if (appointment < today) {
            return 'Completed';
        }
        // If appointment is today or in future → Pending
        return 'Pending';
    };

    // Filter customers with auto-calculated status
    const filteredCustomers = customers.filter(c => {
        const autoStatus = getPatientStatus(c.appointmentDate);
        const statusMatch = statusFilter === 'all' || autoStatus === statusFilter || (statusFilter === 'pending' && autoStatus === 'Pending');
        const therapyMatch = therapyFilter === 'all' || c.therapyType?.includes(therapyFilter);
        return statusMatch && therapyMatch;
    });

    return (
        <div className="space-y-6">

            {/* Patient Records Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">Patient Records</h2>
                        <p className="text-sm text-gray-500">{viewOnly ? 'View all patient records' : 'Manage patient records and information'}</p>
                    </div>
                    {!showForm && !viewOnly && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddPatient}
                            className="bg-herbal-600 text-white px-4 py-2 rounded-md hover:bg-herbal-700 transition-all font-semibold shadow-soft"
                        >
                            + Add Patient
                        </motion.button>
                    )}
                </div>

                {/* Filter Dropdowns */}
                {!showForm && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="grid grid-cols-2 gap-4 mb-5"
                    >
                        <motion.div whileHover={{ scale: 1.02 }}>
                            <label className="text-xs font-semibold text-gray-700 mb-2 block">Filter by Status</label>
                            <select 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:border-herbal-600 focus:ring-2 focus:ring-herbal-600/20 transition-all hover:border-herbal-400"
                            >
                                <option value="all">All Patients</option>
                                <option value="pending">Still Pending</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }}>
                            <label className="text-xs font-semibold text-gray-700 mb-2 block">Filter by Therapy</label>
                            <select 
                                value={therapyFilter}
                                onChange={(e) => setTherapyFilter(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:border-herbal-600 focus:ring-2 focus:ring-herbal-600/20 transition-all hover:border-herbal-400"
                            >
                                <option value="all">All Therapies</option>
                                <option value="Abhyanga">Abhyanga</option>
                                <option value="Shirodhara">Shirodhara</option>
                                <option value="Pizhichil">Pizhichil</option>
                                <option value="Navarakizhi">Navarakizhi</option>
                            </select>
                        </motion.div>
                    </motion.div>
                )}

                {/* Content Area */}
                {showForm && !viewOnly ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white p-6 rounded-lg shadow-soft border border-gray-200"
                    >
                        <CustomerForm
                            initialValues={editingCustomer}
                            onSubmit={handleSubmit}
                            onCancel={() => setShowForm(false)}
                        />
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="bg-white p-6 rounded-lg shadow-soft border border-gray-200"
                    >
                        <CustomerList 
                            customers={filteredCustomers} 
                            onEdit={viewOnly ? null : handleEdit} 
                            onDelete={viewOnly ? null : handleDeleteCustomer}
                            onOfferDiscount={viewOnly ? null : handleOfferDiscount}
                            allowEdit={!viewOnly}
                            allowDelete={!viewOnly}
                            allowDiscount={!viewOnly} 
                        />
                    </motion.div>
                )}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white border border-herbal-100 rounded-lg p-6 shadow-soft"
                >
                    <h3 className="text-sm font-bold text-herbal-800 uppercase tracking-widest">Patient Journey</h3>
                    <p className="text-xs text-gray-500 mt-1">A quick flow of how a visit progresses.</p>
                    <div className="mt-5 space-y-4">
                        {[
                            { label: 'Registration', detail: 'Profile check-in and notes' },
                            { label: 'Assessment', detail: 'Vitals and therapy selection' },
                            { label: 'Appointment', detail: 'Scheduled or ongoing' },
                            { label: 'Follow-up', detail: 'Plan and reminders' },
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
                    transition={{ duration: 0.5, delay: 0.05 }}
                    className="bg-white border border-herbal-100 rounded-lg p-6 shadow-soft"
                >
                    <h3 className="text-sm font-bold text-herbal-800 uppercase tracking-widest">Monthly Booking Pulse</h3>
                    <p className="text-xs text-gray-500 mt-1">Appointment volume in the last 6 months.</p>
                    <div className="mt-6 space-y-3">
                        {monthlyTrend.map((month) => (
                            <div key={month.label} className="flex items-center gap-3">
                                <span className="w-8 text-xs text-gray-500">{month.label}</span>
                                <div className="flex-1 h-2 rounded-full bg-herbal-50 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-herbal-500 to-herbal-700"
                                        style={{ width: `${month.percent}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs font-semibold text-gray-600">{month.count}</span>
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
                    <h3 className="text-sm font-bold text-herbal-800 uppercase tracking-widest">Care Signals</h3>
                    <p className="text-xs text-gray-500 mt-1">Status distribution at a glance.</p>
                    <div className="mt-6 grid grid-cols-1 gap-3">
                        <div className="flex items-center justify-between rounded-lg border border-herbal-100 bg-herbal-50 px-4 py-3">
                            <span className="text-xs text-gray-600">Active</span>
                            <span className="text-lg font-semibold text-herbal-700">{statusSummary.active}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-herbal-100 bg-white px-4 py-3">
                            <span className="text-xs text-gray-600">Scheduled</span>
                            <span className="text-lg font-semibold text-herbal-700">{statusSummary.scheduled}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-beige-200 bg-beige-50 px-4 py-3">
                            <span className="text-xs text-gray-600">Completed</span>
                            <span className="text-lg font-semibold text-beige-400">{statusSummary.completed}</span>
                        </div>
                    </div>
                    <div className="mt-5 rounded-lg bg-gray-50 px-4 py-3 text-xs text-gray-500">
                        Tip: Keep appointment notes updated to improve follow-ups.
                    </div>
                </motion.div>
            </div>

            {/* Discount Offer Modal */}
            {showDiscountModal && discountCustomer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Offer Discount to Patient</h3>

                        {/* Patient Info */}
                        <div className="bg-herbal-50 border border-herbal-100 rounded-lg p-4 mb-4">
                            <p className="text-sm font-semibold text-gray-700">{discountCustomer.name}</p>
                            <p className="text-xs text-gray-500">{discountCustomer.phone}</p>
                            {discountCustomer.therapyType && (
                                <p className="text-xs text-herbal-700 font-medium mt-1">{discountCustomer.therapyType}</p>
                            )}
                        </div>

                        {/* Discount Form */}
                        <div className="space-y-4 mb-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-2">Discount Amount (₹)</label>
                                <input
                                    type="number"
                                    value={discountForm.discountAmount}
                                    onChange={(e) => setDiscountForm({...discountForm, discountAmount: e.target.value})}
                                    placeholder="Enter amount"
                                    className="w-full px-3 py-2 border border-herbal-200 rounded-lg focus:outline-none focus:border-herbal-500 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-2">Discount Percentage (%) - Optional</label>
                                <input
                                    type="number"
                                    value={discountForm.discountPercentage}
                                    onChange={(e) => setDiscountForm({...discountForm, discountPercentage: e.target.value})}
                                    placeholder="e.g., 10"
                                    className="w-full px-3 py-2 border border-herbal-200 rounded-lg focus:outline-none focus:border-herbal-500 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-2">Reason for Discount</label>
                                <input
                                    type="text"
                                    value={discountForm.reason}
                                    onChange={(e) => setDiscountForm({...discountForm, reason: e.target.value})}
                                    placeholder="e.g., Loyalty, First visit, Senior citizen"
                                    className="w-full px-3 py-2 border border-herbal-200 rounded-lg focus:outline-none focus:border-herbal-500 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-2">Applicable Therapy</label>
                                <input
                                    type="text"
                                    value={discountForm.applicableTherapy}
                                    onChange={(e) => setDiscountForm({...discountForm, applicableTherapy: e.target.value})}
                                    placeholder="All or specific therapy type"
                                    className="w-full px-3 py-2 border border-herbal-200 rounded-lg focus:outline-none focus:border-herbal-500 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-2">Valid Until - Optional</label>
                                <input
                                    type="date"
                                    value={discountForm.validUntil}
                                    onChange={(e) => setDiscountForm({...discountForm, validUntil: e.target.value})}
                                    className="w-full px-3 py-2 border border-herbal-200 rounded-lg focus:outline-none focus:border-herbal-500 text-sm"
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleSubmitDiscount}
                                className="flex-1 px-4 py-2 bg-herbal-600 hover:bg-herbal-700 text-white font-semibold rounded transition"
                            >
                                Send for Approval
                            </button>
                            <button
                                onClick={() => {
                                    setShowDiscountModal(false);
                                    setDiscountCustomer(null);
                                    setDiscountForm({
                                        discountAmount: '',
                                        discountPercentage: '',
                                        reason: '',
                                        applicableTherapy: '',
                                        validUntil: ''
                                    });
                                }}
                                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Additional Information Sections */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-gradient-to-br from-herbal-50 to-white border border-herbal-200 rounded-2xl p-6 shadow-soft"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-herbal-600 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-herbal-800">Patient Care Guidelines</h3>
                    </div>
                    <ul className="space-y-3 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="mt-1 h-2 w-2 rounded-full bg-herbal-600"></span>
                            <span>Always verify patient contact information during registration</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="mt-1 h-2 w-2 rounded-full bg-herbal-600"></span>
                            <span>Record therapy preferences and any allergies in notes</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="mt-1 h-2 w-2 rounded-full bg-herbal-600"></span>
                            <span>Update patient status after each visit completion</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="mt-1 h-2 w-2 rounded-full bg-herbal-600"></span>
                            <span>Ensure discount approvals before applying to bills</span>
                        </li>
                    </ul>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-gradient-to-br from-amber-50 to-white border border-amber-200 rounded-2xl p-6 shadow-soft"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-amber-800">Therapy Scheduling Tips</h3>
                    </div>
                    <div className="space-y-3 text-sm text-gray-700">
                        <div className="bg-white rounded-lg p-3 border border-amber-100">
                            <p className="font-semibold text-amber-700">Morning (9-12)</p>
                            <p className="text-xs text-gray-600">Best for Abhyanga, Pizhichil, Navarakizhi</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-amber-100">
                            <p className="font-semibold text-amber-700">Afternoon (2-5)</p>
                            <p className="text-xs text-gray-600">Ideal for Shirodhara, Netra Tarpana</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-amber-100">
                            <p className="font-semibold text-amber-700">Evening (5-7)</p>
                            <p className="text-xs text-gray-600">Perfect for Nasya, consultations</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Quick Reference Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-6 bg-gradient-to-r from-herbal-600 to-herbal-700 rounded-2xl p-8 shadow-xl text-white"
            >
                <h3 className="text-2xl font-bold mb-6 text-center">Quick Reference: Therapy Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <p className="font-bold mb-2">Abhyanga</p>
                        <p className="text-sm text-white/90">Full body oil massage for detoxification and relaxation</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <p className="font-bold mb-2">Shirodhara</p>
                        <p className="text-sm text-white/90">Warm oil stream on forehead for stress relief and mental clarity</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <p className="font-bold mb-2">Pizhichil</p>
                        <p className="text-sm text-white/90">Oil bath therapy for joint pain, muscle stiffness, and rejuvenation</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <p className="font-bold mb-2">Navarakizhi</p>
                        <p className="text-sm text-white/90">Rice bolus massage for nourishment and strengthening</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <p className="font-bold mb-2">Udwarthanam</p>
                        <p className="text-sm text-white/90">Herbal powder massage for weight management and skin health</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <p className="font-bold mb-2">Netra Tarpana</p>
                        <p className="text-sm text-white/90">Eye rejuvenation therapy for vision improvement and eye strain</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PatientsPage;
