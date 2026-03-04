import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { usePayments } from '../context/PaymentContext';
import { useCustomers } from '../context/CustomerContext';
import { useToast } from '../components/ToastProvider';
import { validatePayment, getCorrectPaymentStatus } from '../utils/paymentValidator';
import PaymentReceipt from '../components/PaymentReceipt';

const PaymentsPage = () => {
    const { payments, createPayment, updatePayment, fetchPayments } = usePayments();
    const { customers } = useCustomers();
    const { showToast } = useToast();
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedPaymentForReceipt, setSelectedPaymentForReceipt] = useState(null);
    const [form, setForm] = useState({
        customerId: '',
        customerName: '',
        amount: '',
        amountPaid: '',
        paymentMethod: 'Cash',
        paymentStatus: 'Pending',
        paymentDate: '',
        serviceType: '',
        notes: ''
    });

    // Stats
    const stats = useMemo(() => {
        const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const totalPaid = payments.reduce((sum, p) => sum + (p.amountPaid || 0), 0);
        const pending = payments.filter(p => p.paymentStatus === 'Pending').length;
        const paid = payments.filter(p => p.paymentStatus === 'Paid').length;
        
        return { totalAmount, totalPaid, pending, paid };
    }, [payments]);

    // Filtered payments
    const filteredPayments = useMemo(() => {
        return payments.filter(payment => {
            const matchesSearch = payment.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || payment.paymentStatus === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [payments, searchTerm, statusFilter]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleCustomerChange = (e) => {
        const customerId = e.target.value;
        const customer = customers.find(c => c.id === customerId);
        
        if (customer) {
            // Auto-fill from selected customer
            setForm(prev => ({
                ...prev,
                customerId,
                customerName: customer.name || '',
                amount: customer.serviceCost || prev.amount
            }));
        } else {
            // Manual entry - just update customerId to empty, keep existing values
            setForm(prev => ({
                ...prev,
                customerId: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Prepare payment data for validation
        const paymentData = {
            customerId: form.customerId || null,
            customerName: form.customerName,
            amount: form.amount,
            amountPaid: form.amountPaid || 0,
            paymentMethod: form.paymentMethod,
            paymentStatus: form.paymentStatus,
            paymentDate: form.paymentDate || new Date().toISOString().split('T')[0],
            serviceType: form.serviceType,
            notes: form.notes
        };

        // Validate payment data
        const validation = validatePayment(paymentData, customers);
        if (!validation.valid) {
            // Show all validation errors
            const errorMessage = validation.errors.join('\n');
            showToast(errorMessage, 'error');
            return;
        }

        // Convert to numbers
        const amount = parseFloat(paymentData.amount);
        const amountPaid = parseFloat(paymentData.amountPaid) || 0;

        // Auto-correct payment status based on amounts
        const correctStatus = getCorrectPaymentStatus(amountPaid, amount);

        const payload = {
            customerId: paymentData.customerId,
            customerName: paymentData.customerName,
            amount: amount,
            amountPaid: amountPaid,
            paymentMethod: paymentData.paymentMethod,
            paymentStatus: correctStatus, // Use auto-corrected status
            paymentDate: paymentData.paymentDate,
            serviceType: paymentData.serviceType,
            notes: paymentData.notes
        };

        console.log('[PAYMENTS PAGE] Submitting validated payment:', payload);
        const result = await createPayment(payload);
        console.log('[PAYMENTS PAGE] Result:', result);
        
        if (result) {
            showToast('Payment record created successfully', 'success');
            setShowForm(false);
            setForm({
                customerId: '',
                customerName: '',
                amount: '',
                amountPaid: '',
                paymentMethod: 'Cash',
                paymentStatus: 'Pending',
                paymentDate: '',
                serviceType: '',
                notes: ''
            });
            await fetchPayments();
        } else {
            showToast('Failed to create payment. Please check the details and try again.', 'error');
        }
    };

    const handleMarkPaid = async (payment) => {
        await updatePayment(payment.id, {
            paymentStatus: 'Paid',
            amountPaid: payment.amount,
            paymentDate: new Date().toISOString()
        });
        showToast('Payment marked as paid', 'success');
        await fetchPayments();
    };

    const getStatusBadge = (status) => {
        const styles = {
            Paid: 'bg-green-100 text-green-700 border-green-200',
            Pending: 'bg-amber-100 text-amber-700 border-amber-200',
            'Partially Paid': 'bg-blue-100 text-blue-700 border-blue-200'
        };
        return styles[status] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Payment Records</h1>
                    <p className="text-sm text-gray-500">Track customer payments and dues</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition font-semibold text-sm"
                >
                    {showForm ? '✕ Cancel' : '+ Add Payment'}
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                    <div className="text-sm text-gray-500">Total Amount</div>
                    <div className="text-2xl font-bold text-gray-800">₹{stats.totalAmount.toLocaleString()}</div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white border border-green-200 rounded-lg p-4 shadow-sm"
                >
                    <div className="text-sm text-green-600">Total Collected</div>
                    <div className="text-2xl font-bold text-green-700">₹{stats.totalPaid.toLocaleString()}</div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white border border-amber-200 rounded-lg p-4 shadow-sm"
                >
                    <div className="text-sm text-amber-600">Pending Payments</div>
                    <div className="text-2xl font-bold text-amber-700">{stats.pending}</div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white border border-green-200 rounded-lg p-4 shadow-sm"
                >
                    <div className="text-sm text-green-600">Paid Count</div>
                    <div className="text-2xl font-bold text-green-700">{stats.paid}</div>
                </motion.div>
            </div>

            {/* Add Payment Form */}
            {showForm && (
                <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    onSubmit={handleSubmit}
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Payment Record</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Customer</label>
                            <select
                                name="customerId"
                                value={form.customerId}
                                onChange={handleCustomerChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-300 focus:border-brand"
                            >
                                <option value="">-- Manual Entry --</option>
                                {customers.map(c => (
                                    <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                            <input
                                type="text"
                                name="customerName"
                                value={form.customerName}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-300 focus:border-brand"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount (₹) *</label>
                            <input
                                type="number"
                                name="amount"
                                value={form.amount}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-300 focus:border-brand"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid (₹)</label>
                            <input
                                type="number"
                                name="amountPaid"
                                value={form.amountPaid}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-300 focus:border-brand"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                            <select
                                name="paymentMethod"
                                value={form.paymentMethod}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-300 focus:border-brand"
                            >
                                <option value="Cash">Cash</option>
                                <option value="UPI">UPI</option>
                                <option value="Card">Card</option>
                                <option value="Net Banking">Net Banking</option>
                                <option value="Cheque">Cheque</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                            <select
                                name="paymentStatus"
                                value={form.paymentStatus}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-300 focus:border-brand"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Partially Paid">Partially Paid</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                            <input
                                type="text"
                                name="serviceType"
                                value={form.serviceType}
                                onChange={handleChange}
                                placeholder="e.g., Abhyanga"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-300 focus:border-brand"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                            <input
                                type="date"
                                name="paymentDate"
                                value={form.paymentDate}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-300 focus:border-brand"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <textarea
                                name="notes"
                                value={form.notes}
                                onChange={handleChange}
                                rows={2}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-300 focus:border-brand"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition font-semibold text-sm"
                        >
                            Save Payment
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.form>
            )}

            {/* Search and Filter */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex flex-col md:flex-row gap-3">
                    <input
                        type="text"
                        placeholder="Search by customer name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-300 focus:border-brand"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-300 focus:border-brand"
                    >
                        <option value="all">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Partially Paid">Partially Paid</option>
                    </select>
                </div>
            </div>

            {/* Payment List */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Payment Records ({filteredPayments.length})</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Customer</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Service</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Amount</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Paid</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Method</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredPayments.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-4 py-8 text-center text-sm text-gray-500">
                                        No payment records found
                                    </td>
                                </tr>
                            ) : (
                                filteredPayments.map(payment => (
                                    <tr key={payment.id} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                            {payment.customerName}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {payment.serviceType || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                                            ₹{payment.amount?.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-semibold text-green-600">
                                            ₹{payment.amountPaid?.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {payment.paymentMethod}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(payment.paymentStatus)}`}>
                                                {payment.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {payment.paymentStatus !== 'Paid' && (
                                                    <button
                                                        onClick={() => handleMarkPaid(payment)}
                                                        className="text-xs px-3 py-1 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition font-medium"
                                                    >
                                                        Mark Paid
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setSelectedPaymentForReceipt(payment)}
                                                    className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-medium flex items-center gap-1"
                                                    title="Download Receipt"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                                    </svg>
                                                    Receipt
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Receipt Modal */}
            {selectedPaymentForReceipt && (
                <PaymentReceipt 
                    payment={selectedPaymentForReceipt}
                    customer={customers.find(c => c._id === selectedPaymentForReceipt.customerId)}
                    onClose={() => setSelectedPaymentForReceipt(null)} 
                />
            )}
        </div>
    );
};

export default PaymentsPage;
