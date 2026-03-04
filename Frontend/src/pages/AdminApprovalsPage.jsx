 import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBookings } from '../context/BookingContext';
import { useDiscounts } from '../context/DiscountContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastProvider';
import { formatDateLabel } from '../utils/date';

const AdminApprovalsPage = () => {
    const { user } = useAuth();
    const { bookings, updateBookingStatus } = useBookings();
    const { discounts, updateDiscountStatus, deleteDiscount } = useDiscounts();
    const { showToast } = useToast();
    
    const [activeTab, setActiveTab] = useState('all');
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemType, setItemType] = useState(null);
    const [adminNote, setAdminNote] = useState('');
    const [postponeDate, setPostponeDate] = useState('');
    const [applyToCustomer, setApplyToCustomer] = useState(false);
    const [acceptDiscount, setAcceptDiscount] = useState(true);

    // Combine bookings and discounts
    const allPendingItems = useMemo(() => {
        const pendingBookings = bookings
            .filter(b => b.status === 'pending')
            .map(b => ({ ...b, type: 'booking', createdAt: b.createdAt || new Date() }));
        
        const pendingDiscounts = discounts
            .filter(d => d.status === 'pending')
            .map(d => ({ ...d, type: 'discount', createdAt: d.createdAt || new Date() }));
        
        return [...pendingBookings, ...pendingDiscounts]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [bookings, discounts]);

    const filteredItems = useMemo(() => {
        if (activeTab === 'all') return allPendingItems;
        if (activeTab === 'bookings') return allPendingItems.filter(item => item.type === 'booking');
        if (activeTab === 'discounts') return allPendingItems.filter(item => item.type === 'discount');
        return allPendingItems;
    }, [allPendingItems, activeTab]);

    const stats = useMemo(() => ({
        total: allPendingItems.length,
        bookings: allPendingItems.filter(i => i.type === 'booking').length,
        discounts: allPendingItems.filter(i => i.type === 'discount').length,
    }), [allPendingItems]);

    const handleApproveBooking = async (bookingId, includeDiscount = true) => {
        const payload = { status: 'approved', adminNote };
        
        // If booking has discount and admin chose not to accept it, remove discount
        if (selectedItem?.discountAmount && !includeDiscount) {
            payload.discountAmount = 0;
            payload.discountPercentage = 0;
            payload.discountReason = null;
        }
        
        const result = await updateBookingStatus(bookingId, payload);
        if (result) {
            showToast(`Booking approved${includeDiscount && selectedItem?.discountAmount ? ' with discount' : ''}`, 'success');
            setSelectedItem(null);
            setAdminNote('');
            setAcceptDiscount(true);
        } else {
            showToast('Failed to approve booking', 'error');
        }
    };

    const handlePostponeBooking = async (bookingId) => {
        const result = await updateBookingStatus(bookingId, { 
            status: 'postponed', 
            postponeDate: postponeDate || null,
            adminNote 
        });
        if (result) {
            showToast('Booking postponed', 'success');
            setSelectedItem(null);
            setAdminNote('');
            setPostponeDate('');
        } else {
            showToast('Failed to postpone booking', 'error');
        }
    };

    const handleApproveDiscount = async (discountId) => {
        const result = await updateDiscountStatus(discountId, 'accepted', adminNote, applyToCustomer);
        if (result) {
            showToast('Discount approved successfully', 'success');
            setSelectedItem(null);
            setAdminNote('');
            setApplyToCustomer(false);
        } else {
            showToast('Failed to approve discount', 'error');
        }
    };

    const handleRejectDiscount = async (discountId) => {
        const result = await updateDiscountStatus(discountId, 'rejected', adminNote, false);
        if (result) {
            showToast('Discount rejected', 'success');
            setSelectedItem(null);
            setAdminNote('');
        } else {
            showToast('Failed to reject discount', 'error');
        }
    };

    const openModal = (item, type) => {
        setSelectedItem(item);
        setItemType(type);
        setAdminNote('');
        setPostponeDate('');
        setApplyToCustomer(false);
        setAcceptDiscount(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden bg-gradient-to-r from-herbal-50 via-beige-50 to-amber-50 p-6 rounded-xl shadow-lg border border-herbal-100"
            >
                <div className="absolute -top-4 -right-4 h-32 w-32 rounded-full bg-herbal-200/30 blur-2xl"></div>
                <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-amber-200/30 blur-2xl"></div>
                <div className="relative">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <svg className="w-8 h-8 text-herbal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Pending Approvals
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">Review and approve booking requests and discount offers</p>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5 shadow-soft hover:shadow-md transition"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-purple-600 uppercase tracking-widest font-semibold">Total Pending</p>
                            <p className="text-4xl font-bold text-purple-700 mt-2">{stats.total}</p>
                        </div>
                        <div className="h-14 w-14 rounded-full bg-purple-200 flex items-center justify-center">
                            <svg className="w-8 h-8 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
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
                            <p className="text-xs text-blue-600 uppercase tracking-widest font-semibold">Bookings</p>
                            <p className="text-4xl font-bold text-blue-700 mt-2">{stats.bookings}</p>
                        </div>
                        <div className="h-14 w-14 rounded-full bg-blue-200 flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-700">BK</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-5 shadow-soft hover:shadow-md transition"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-amber-600 uppercase tracking-widest font-semibold">Discounts</p>
                            <p className="text-4xl font-bold text-amber-700 mt-2">{stats.discounts}</p>
                        </div>
                        <div className="h-14 w-14 rounded-full bg-amber-200 flex items-center justify-center">
                            <span className="text-sm font-bold text-amber-700">DC</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b-2 border-gray-200 pb-2">
                {['all', 'bookings', 'discounts'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-t-lg uppercase text-xs font-bold transition ${
                            activeTab === tab
                                ? 'bg-herbal-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {tab === 'all' ? 'All' : tab === 'bookings' ? 'Bookings' : 'Discounts'}
                    </button>
                ))}
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                        <motion.div
                            key={`${item.type}-${item.id}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => openModal(item, item.type)}
                            className={`cursor-pointer border-2 rounded-xl p-5 shadow-soft hover:shadow-lg transition transform hover:-translate-y-1 ${
                                item.type === 'booking'
                                    ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-white'
                                    : 'border-amber-200 bg-gradient-to-br from-amber-50 to-white'
                            }`}
                        >
                            {/* Badge */}
                            <div className="flex justify-between items-start mb-3">
                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                    item.type === 'booking'
                                        ? 'bg-blue-200 text-blue-800'
                                        : 'bg-amber-200 text-amber-800'
                                }`}>
                                    {item.type === 'booking' ? 'BOOKING' : 'DISCOUNT'}
                                </span>
                                <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                            </div>

                            {/* Content */}
                            {item.type === 'booking' ? (
                                <>
                                    <h3 className="text-lg font-bold text-gray-800">{item.patientName}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{formatDateLabel(item.appointmentDate)}</p>
                                    <p className="text-xs text-gray-500 mt-2">{item.serviceType || 'General Service'}</p>
                                    {item.discountAmount && (
                                        <div className="mt-3 bg-amber-100 rounded-lg p-2 border border-amber-200">
                                            <p className="text-xs font-semibold text-amber-800">Includes Discount: ₹{item.discountAmount}</p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <h3 className="text-lg font-bold text-gray-800">{item.customerName}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{item.applicableTherapy}</p>
                                    <div className="mt-3 flex justify-between items-center">
                                        <span className="text-xl font-bold text-herbal-700">₹{item.discountAmount}</span>
                                        {item.discountPercentage && <span className="text-sm text-gray-600">({item.discountPercentage}%)</span>}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">{item.reason}</p>
                                </>
                            )}
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <div className="inline-flex flex-col items-center">
                            <svg className="w-16 h-16 mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-gray-500 text-lg font-medium">All clear! No pending approvals.</p>
                            <p className="text-gray-400 text-sm mt-2">You're all caught up</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Approval Modal */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
                        style={{ scrollbarWidth: 'thin' }}
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 sticky top-0 bg-white z-10 pb-2 border-b border-gray-200">
                            {itemType === 'booking' ? 'Booking Request' : 'Discount Offer'}
                        </h3>

                        {/* Details */}
                        <div className={`rounded-xl p-4 mb-4 border ${
                            itemType === 'booking' 
                                ? 'bg-blue-50 border-blue-200' 
                                : 'bg-amber-50 border-amber-200'
                        }`}>
                            {itemType === 'booking' ? (
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span className="font-semibold">Patient:</span><span>{selectedItem.patientName}</span></div>
                                    <div className="flex justify-between"><span className="font-semibold">Date:</span><span>{formatDateLabel(selectedItem.appointmentDate)}</span></div>
                                    <div className="flex justify-between"><span className="font-semibold">Service:</span><span>{selectedItem.serviceType || 'General'}</span></div>
                                    {selectedItem.discountAmount && (
                                        <div className="flex justify-between border-t pt-2"><span className="font-semibold">Discount:</span><span className="text-amber-700 font-bold">₹{selectedItem.discountAmount}</span></div>
                                    )}
                                    {selectedItem.notes && (
                                        <div className="border-t pt-2"><span className="font-semibold">Notes:</span><p className="text-gray-600 mt-1">{selectedItem.notes}</p></div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span className="font-semibold">Customer:</span><span>{selectedItem.customerName}</span></div>
                                    <div className="flex justify-between"><span className="font-semibold">Amount:</span><span className="text-herbal-700 font-bold">₹{selectedItem.discountAmount}</span></div>
                                    {selectedItem.discountPercentage && (
                                        <div className="flex justify-between"><span className="font-semibold">Percentage:</span><span>{selectedItem.discountPercentage}%</span></div>
                                    )}
                                    <div className="flex justify-between"><span className="font-semibold">Reason:</span><span>{selectedItem.reason}</span></div>
                                    <div className="flex justify-between"><span className="font-semibold">Therapy:</span><span>{selectedItem.applicableTherapy}</span></div>
                                    {selectedItem.receptionistName && (
                                        <div className="flex justify-between border-t pt-2"><span className="font-semibold">Offered by:</span><span>{selectedItem.receptionistName}</span></div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Admin Note */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Note (Optional)</label>
                            <textarea
                                value={adminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                                placeholder="Add your comments..."
                                rows="2"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-herbal-500 focus:ring-2 focus:ring-herbal-300 focus:outline-none text-sm"
                            />
                        </div>

                        {/* Booking-specific: Discount Decision */}
                        {itemType === 'booking' && selectedItem?.discountAmount && (
                            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <label className="block text-sm font-bold text-amber-800 mb-2">Discount Approval</label>
                                <p className="text-xs text-gray-600 mb-3">This booking includes a discount of ₹{selectedItem.discountAmount}</p>
                                <div className="flex gap-3">
                                    <label className="flex items-center gap-2 cursor-pointer flex-1">
                                        <input
                                            type="radio"
                                            name="discountDecision"
                                            checked={acceptDiscount === true}
                                            onChange={() => setAcceptDiscount(true)}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm text-green-700 font-semibold">Accept Discount</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer flex-1">
                                        <input
                                            type="radio"
                                            name="discountDecision"
                                            checked={acceptDiscount === false}
                                            onChange={() => setAcceptDiscount(false)}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm text-red-700 font-semibold">Decline Discount</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Booking-specific: Postpone Date */}
                        {itemType === 'booking' && (
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Postpone Date (if postponing)</label>
                                <input
                                    type="date"
                                    value={postponeDate}
                                    onChange={(e) => setPostponeDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none text-sm"
                                />
                            </div>
                        )}

                        {/* Discount-specific: Apply to Customer */}
                        {itemType === 'discount' && (
                            <label className="flex items-center gap-2 mb-4 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={applyToCustomer}
                                    onChange={(e) => setApplyToCustomer(e.target.checked)}
                                    className="w-4 h-4 border-herbal-300 rounded"
                                />
                                <span className="text-sm text-gray-700">Apply discount to customer record</span>
                            </label>
                        )}

                        {/* Action Buttons - Sticky at bottom */}
                        <div className="sticky bottom-0 bg-white pt-4 mt-4 border-t border-gray-200 -mx-6 px-6 -mb-6 pb-6 flex gap-3">
                            {itemType === 'booking' ? (
                                <>
                                    <button
                                        onClick={() => handleApproveBooking(selectedItem.id, acceptDiscount)}
                                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                                    >
                                        Approve {selectedItem?.discountAmount && (acceptDiscount ? 'with Discount' : 'without Discount')}
                                    </button>
                                    <button
                                        onClick={() => handlePostponeBooking(selectedItem.id)}
                                        className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition"
                                    >
                                        Postpone
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => handleApproveDiscount(selectedItem.id)}
                                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleRejectDiscount(selectedItem.id)}
                                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                                    >
                                        Reject
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminApprovalsPage;
