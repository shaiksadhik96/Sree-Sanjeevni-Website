import { useRef } from 'react';

const PaymentReceipt = ({ payment, customer, onClose }) => {
    const receiptRef = useRef();

    // Debug: log payment data
    console.log('[PAYMENT RECEIPT] Payment data:', payment);
    console.log('[PAYMENT RECEIPT] Customer data:', customer);

    const handlePrint = () => {
        window.print();
    };

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('en-IN', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
        });
    };

    const getStatusBadge = (status) => {
        const styles = {
            Paid: 'bg-green-100 text-green-700 border-green-300',
            Pending: 'bg-amber-100 text-amber-700 border-amber-300',
            'Partially Paid': 'bg-blue-100 text-blue-700 border-blue-300'
        };
        return styles[status] || 'bg-gray-100 text-gray-700 border-gray-300';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 print:bg-white">
            <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto print:shadow-none print:max-w-full print:max-h-none">
                {/* Receipt Content */}
                <div ref={receiptRef} className="p-8 print:p-0">
                    {/* Header with gradient */}
                    <div className="text-center mb-8 pb-6 bg-gradient-to-r from-brand-50 via-green-50 to-brand-50 rounded-lg p-6 border-2 border-brand print:border print:rounded-none">
                        <div className="text-center mb-3 flex justify-center"><span className="inline-block px-3 py-1 bg-white rounded-full border border-brand text-xs font-bold text-brand uppercase">Sree Sanjeevni</span></div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-700 to-green-600 bg-clip-text text-transparent">Sree Sanjeevni Ayurvedic Clinic</h1>
                        <p className="text-xs text-gray-500 mt-2 uppercase tracking-wider font-semibold">Traditional Healing | Modern Care</p>
                        <div className="mt-3 text-xs text-gray-600 space-y-1">
                            <p>Address: Ayurvedic Wellness Center</p>
                            <p>Contact: +91-XXXX-XXXXXX | Email: info@sreesanjeevni.com</p>
                        </div>
                        <div className="mt-4 inline-block px-4 py-2 bg-white rounded-full shadow-sm border border-brand-200">
                            <p className="text-sm font-bold text-brand-700">PAYMENT RECEIPT</p>
                        </div>
                    </div>

                    {/* Receipt Details */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                            <h3 className="text-xs font-bold text-brand-700 uppercase mb-3 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Receipt Information
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Receipt No:</span>
                                    <span className="font-semibold">#{(payment._id || payment.id)?.slice(-8).toUpperCase() || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Date:</span>
                                    <span className="font-semibold">{formatDate(payment.paymentDate || new Date())}</span>
                                </div>
                                <div className="flex justify-between text-sm items-center">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusBadge(payment.paymentStatus || 'Pending')}`}>
                                        {payment.paymentStatus || 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-brand-700 uppercase mb-3 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Patient Information
                            </h3>
                            <div className="space-y-2">
                                {customer?.patientId && (
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Patient ID:</span>
                                        <span className="font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">#{customer.patientId}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Name:</span>
                                    <span className="font-semibold">{payment.customerName || 'N/A'}</span>
                                </div>
                                {payment.serviceType && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Service:</span>
                                        <span className="font-semibold">{payment.serviceType}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-brand-700 uppercase mb-3 pb-2 border-b-2 border-brand-200 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Payment Details
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm py-2">
                                <span className="text-gray-600">Total Amount:</span>
                                <span className="font-bold text-lg">₹{(payment.amount || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm py-2">
                                <span className="text-gray-600">Amount Paid:</span>
                                <span className="font-bold text-lg text-green-600">₹{(payment.amountPaid || 0).toLocaleString()}</span>
                            </div>
                            {(payment.amount || 0) - (payment.amountPaid || 0) > 0 && (
                                <div className="flex justify-between text-sm py-2 bg-red-50 px-3 rounded">
                                    <span className="text-red-600 font-semibold">Balance Due:</span>
                                    <span className="font-bold text-lg text-red-600">₹{((payment.amount || 0) - (payment.amountPaid || 0)).toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm py-2">
                                <span className="text-gray-600">Payment Method:</span>
                                <span className="font-semibold">{payment.paymentMethod || 'N/A'}</span>
                            </div>
                            {payment.notes && (
                                <div className="mt-4 p-3 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-500 block mb-1">Notes:</span>
                                    <span className="text-sm">{payment.notes}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="bg-gradient-to-r from-brand-50 to-green-50 border-2 border-brand rounded-lg p-5 mb-8 shadow-md">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="text-xs text-gray-600 uppercase tracking-wide block mb-1">Amount Received</span>
                                <span className="text-lg font-bold text-brand-800">Total Paid</span>
                            </div>
                            <span className="text-3xl font-bold bg-gradient-to-r from-brand-700 to-green-600 bg-clip-text text-transparent">₹{(payment.amountPaid || 0).toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-sm text-gray-600 pt-6 border-t-2 border-brand-200 bg-gradient-to-b from-white to-brand-50 p-4 rounded-lg">
                        <p className="font-bold text-brand-700 mb-3 text-base\">Thank you for choosing Sree Sanjeevni Ayurvedic Clinic!</p>
                        <p className="text-xs mb-2 text-gray-600\">"Experience the healing power of Ayurveda"</p>
                        <div className="flex justify-center gap-8 text-xs text-gray-500 mt-3">
                            <span>Natural Remedies</span>
                            <span>Holistic Care</span>
                            <span>Traditional Wisdom</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-4 italic\">This is a computer-generated receipt and does not require a signature.</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 px-6 py-4 flex gap-3 justify-end print:hidden">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium text-sm"
                    >
                        Close
                    </button>
                    <button
                        onClick={handlePrint}
                        className="px-5 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg transition font-semibold text-sm flex items-center gap-2 shadow-lg"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print / Download
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentReceipt;
