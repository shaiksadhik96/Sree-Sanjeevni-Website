import { useRef } from 'react';
import { motion } from 'framer-motion';

const PaymentReceipt = ({ payment, customer, onClose }) => {
    const receiptRef = useRef();

    console.log('[PAYMENT RECEIPT] Payment data:', payment);
    console.log('[PAYMENT RECEIPT] Customer data:', customer);

    const handlePrint = () => {
        window.print();
    };

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('en-IN', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric' 
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            'Paid': { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', light: 'bg-emerald-100' },
            'Pending': { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700', light: 'bg-amber-100' },
            'Partially Paid': { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700', light: 'bg-blue-100' }
        };
        return colors[status] || { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-700', light: 'bg-gray-100' };
    };

    const statusColor = getStatusColor(payment.paymentStatus || 'Pending');
    const receiptNo = (payment._id || payment.id)?.slice(-8).toUpperCase() || 'N/A';
    const balanceDue = Math.max(0, (payment.amount || 0) - (payment.amountPaid || 0));

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 print:bg-white print:backdrop-blur-none"
        >
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto print:shadow-none print:rounded-none print:max-w-full print:max-h-none">
                {/* Receipt Content */}
                <div ref={receiptRef} className="print:p-0 p-0">
                    {/* Premium Header with Gradient */}
                    <div className="bg-gradient-to-b from-herbal-700 via-herbal-800 to-herbal-900 text-white relative overflow-hidden print:from-herbal-700 print:via-herbal-800 print:to-herbal-900">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-herbal-400/10 rounded-full blur-2xl"></div>
                        
                        <div className="relative z-10 p-8 text-center">
                            {/* Clinic Name */}
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="mb-2"
                            >
                                <div className="inline-flex items-center justify-center gap-2 mb-3">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                    </svg>
                                    <span className="text-xs font-bold tracking-widest uppercase">Sree Sanjeevni</span>
                                </div>
                                <h1 className="text-3xl font-bold">Sree Sanjeevni</h1>
                                <h2 className="text-lg font-semibold mt-1 text-white/90">Ayurvedic Clinic & Wellness Center</h2>
                            </motion.div>

                            {/* Tagline */}
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.15 }}
                                className="text-sm text-white/80 mt-2 italic"
                            >
                                "Experience the Healing Power of Traditional Ayurveda"
                            </motion.p>

                            {/* Receipt Type Badge */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-block mt-4 px-4 py-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full"
                            >
                                <span className="text-sm font-bold tracking-widest uppercase">Payment Receipt</span>
                            </motion.div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="p-8 print:p-6">
                        {/* Receipt & Status Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* Receipt Number */}
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border-l-4 border-herbal-600"
                            >
                                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">Receipt Number</p>
                                <p className="text-lg font-bold text-herbal-700 font-mono">{receiptNo}</p>
                            </motion.div>

                            {/* Date */}
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-l-4 border-blue-600"
                            >
                                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">Date</p>
                                <p className="text-lg font-bold text-blue-700">{formatDate(payment.paymentDate || new Date())}</p>
                            </motion.div>

                            {/* Status */}
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                                className={`rounded-lg p-4 border-l-4 ${statusColor.bg} ${statusColor.border}`}
                            >
                                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">Status</p>
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${statusColor.light} ${statusColor.text} font-bold text-sm`}>
                                    {payment.paymentStatus === 'Paid' && (
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    {payment.paymentStatus === 'Pending' && (
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.5a1 1 0 102 0V7z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    {payment.paymentStatus || 'Pending'}
                                </div>
                            </motion.div>
                        </div>

                        {/* Patient & Service Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Patient Information */}
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white border-2 border-gray-200 rounded-lg p-5"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <svg className="w-5 h-5 text-herbal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Patient Details</h3>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Name</p>
                                        <p className="text-base font-semibold text-gray-900">{payment.customerName || 'N/A'}</p>
                                    </div>
                                    {customer?.patientId && (
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Patient ID</p>
                                            <p className="text-sm font-mono font-bold text-herbal-700 bg-herbal-50 px-2 py-1 rounded inline-block border border-herbal-200">
                                                #{customer.patientId}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Service Information */}
                            <motion.div 
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white border-2 border-gray-200 rounded-lg p-5"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4" />
                                    </svg>
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Service Details</h3>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Service Type</p>
                                        <p className="text-base font-semibold text-gray-900">{payment.serviceType || 'Not Specified'}</p>
                                    </div>
                                    {payment.notes && (
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Notes</p>
                                            <p className="text-sm text-gray-700">{payment.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* Payment Amount Section */}
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-gradient-to-br from-herbal-50 via-green-50 to-herbal-50 rounded-xl border-2 border-herbal-200 p-6 mb-8"
                        >
                            <div className="space-y-4">
                                {/* Total Amount */}
                                <div className="flex justify-between items-center pb-4 border-b-2 border-herbal-200">
                                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Total Amount</span>
                                    <span className="text-2xl font-bold text-herbal-800">₹{(payment.amount || 0).toLocaleString('en-IN')}</span>
                                </div>

                                {/* Amount Paid */}
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Amount Paid</span>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold text-emerald-600">₹{(payment.amountPaid || 0).toLocaleString('en-IN')}</span>
                                        <p className="text-xs text-gray-600 mt-1">via {payment.paymentMethod || 'N/A'}</p>
                                    </div>
                                </div>

                                {/* Balance Due (if any) */}
                                {balanceDue > 0 && (
                                    <div className="flex justify-between items-center pt-4 border-t-2 border-red-200 bg-red-50 px-4 py-3 rounded-lg">
                                        <span className="text-sm font-bold text-red-700 uppercase tracking-wider">Balance Due</span>
                                        <span className="text-2xl font-bold text-red-600">₹{balanceDue.toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Footer */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="border-t-2 border-gray-200 pt-6 text-center space-y-3"
                        >
                            <div className="flex justify-center gap-2 mb-3">
                                <svg className="w-5 h-5 text-herbal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm font-semibold text-gray-800">Thank you for your trust in Sree Sanjeevni</p>
                            </div>
                            <p className="text-xs text-gray-600 italic">"Healing through the wisdom of Ayurveda | Traditional Care for Modern Living"</p>
                            <div className="flex justify-center gap-6 text-xs text-gray-600 mt-4">
                                <span>Wellness Center</span>
                                <span>+91-XXXX-XXXXXX</span>
                                <span>info@sreesanjeevni.com</span>
                            </div>
                            <p className="text-xs text-gray-500 pt-3 font-mono">Generated on {new Date().toLocaleString('en-IN')}</p>
                            <p className="text-xs text-gray-400 italic">This is a computer-generated receipt and is valid without signature or seal.</p>
                        </motion.div>
                    </div>
                </div>

                {/* Action Buttons (Not shown during print) */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="sticky bottom-0 bg-white border-t-2 border-gray-200 px-6 py-4 flex gap-4 justify-end print:hidden shadow-lg"
                >
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold text-sm"
                    >
                        Close
                    </button>
                    <button
                        onClick={handlePrint}
                        className="px-6 py-2 bg-gradient-to-r from-herbal-600 to-herbal-700 hover:from-herbal-700 hover:to-herbal-800 text-white rounded-lg transition font-semibold text-sm flex items-center gap-2 shadow-lg"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print / Download PDF
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default PaymentReceipt;
