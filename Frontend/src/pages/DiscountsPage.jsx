import { useState, useMemo, useEffect } from 'react';
import { useDiscounts } from '../context/DiscountContext';
import { useAuth } from '../context/AuthContext';

const DiscountsPage = () => {
    const { user } = useAuth();
    const { discounts, loading, fetchDiscounts, updateDiscountStatus, deleteDiscount } = useDiscounts();
    const [filter, setFilter] = useState('pending');
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [adminNote, setAdminNote] = useState('');
    const [applyToCustomer, setApplyToCustomer] = useState(false);

    useEffect(() => {
        fetchDiscounts();
    }, []);

    const filteredDiscounts = useMemo(() => {
        if (user?.role === 'admin') {
            return filter === 'all' ? discounts : discounts.filter(d => d.status === filter);
        } else {
            return filter === 'all' ? discounts : discounts.filter(d => d.status === filter);
        }
    }, [discounts, filter, user]);

    const handleApprove = async (discountId) => {
        const updated = await updateDiscountStatus(discountId, 'accepted', adminNote, applyToCustomer);
        if (updated) {
            setSelectedDiscount(null);
            setAdminNote('');
            setApplyToCustomer(false);
        }
    };

    const handleReject = async (discountId) => {
        const updated = await updateDiscountStatus(discountId, 'rejected', adminNote, false);
        if (updated) {
            setSelectedDiscount(null);
            setAdminNote('');
        }
    };

    const handleDelete = async (discountId) => {
        if (confirm('Are you sure you want to delete this discount offer?')) {
            await deleteDiscount(discountId);
        }
    };

    const pendingCount = discounts.filter(d => d.status === 'pending').length;
    const acceptedCount = discounts.filter(d => d.status === 'accepted').length;
    const rejectedCount = discounts.filter(d => d.status === 'rejected').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-herbal-50 to-beige-50 p-6 rounded-lg shadow-md">
                <span className="pointer-events-none absolute -top-2 right-10 h-2 w-2 rounded-full bg-herbal-300/70"></span>
                <span className="pointer-events-none absolute top-10 right-24 h-1.5 w-1.5 rounded-full bg-amber-300/70"></span>
                <span className="pointer-events-none absolute bottom-6 left-12 h-2 w-2 rounded-full bg-herbal-200/70"></span>
                <h2 className="text-2xl font-semibold text-gray-800">Discount Offers</h2>
                <p className="text-sm text-gray-500">{user?.role === 'admin' ? 'Review and approve patient discount offers from receptionists' : 'Create discount offers for your patients'}</p>
            </div>

            {/* Stats Cards */}
            {user?.role === 'admin' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white border border-herbal-100 rounded-lg p-5 shadow-soft hover:shadow-md transition">
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Pending Offers</p>
                        <p className="text-3xl font-bold text-amber-600 mt-2">{pendingCount}</p>
                        <p className="text-xs text-gray-400 mt-1">awaiting approval</p>
                    </div>
                    <div className="bg-white border border-herbal-100 rounded-lg p-5 shadow-soft hover:shadow-md transition">
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Accepted</p>
                        <p className="text-3xl font-bold text-green-600 mt-2">{acceptedCount}</p>
                        <p className="text-xs text-gray-400 mt-1">approved offers</p>
                    </div>
                    <div className="bg-white border border-herbal-100 rounded-lg p-5 shadow-soft hover:shadow-md transition">
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Rejected</p>
                        <p className="text-3xl font-bold text-red-600 mt-2">{rejectedCount}</p>
                        <p className="text-xs text-gray-400 mt-1">declined offers</p>
                    </div>
                </div>
            )}

            {/* Filter Tabs */}
            {user?.role === 'admin' && (
                <div className="flex gap-2 border-b border-herbal-200">
                    {['pending', 'accepted', 'rejected', 'all'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 uppercase text-xs font-semibold transition ${
                                filter === status
                                    ? 'text-herbal-700 border-b-2 border-herbal-700'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            )}

            {/* Discount Offers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    <div className="col-span-full text-center py-12">
                        <div className="inline-flex flex-col items-center">
                            <div className="h-8 w-8 border-4 border-herbal-200 border-t-herbal-600 rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-500 text-sm">Loading discount offers...</p>
                        </div>
                    </div>
                ) : filteredDiscounts.length > 0 ? (
                    filteredDiscounts.map(discount => (
                        <div
                            key={discount.id}
                            className={`border rounded-lg p-4 shadow-soft transition hover:shadow-md cursor-pointer ${
                                discount.status === 'pending'
                                    ? 'border-amber-200 bg-amber-50'
                                    : discount.status === 'accepted'
                                    ? 'border-green-200 bg-green-50'
                                    : 'border-red-200 bg-red-50'
                            }`}
                            onClick={() => user?.role === 'admin' && setSelectedDiscount(discount)}
                        >
                            {/* Status Badge */}
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800">{discount.customerName}</h3>
                                    <p className="text-xs text-gray-500">{discount.applicableTherapy}</p>
                                </div>
                                <span
                                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        discount.status === 'pending'
                                            ? 'bg-amber-200 text-amber-800'
                                            : discount.status === 'accepted'
                                            ? 'bg-green-200 text-green-800'
                                            : 'bg-red-200 text-red-800'
                                    }`}
                                >
                                    {discount.status.toUpperCase()}
                                </span>
                            </div>

                            {/* Discount Details */}
                            <div className="space-y-2 mb-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Discount Amount:</span>
                                    <span className="font-semibold text-herbal-700">₹{discount.discountAmount}</span>
                                </div>
                                {discount.discountPercentage && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Percentage:</span>
                                        <span className="font-semibold">{discount.discountPercentage}%</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Reason:</span>
                                    <span className="text-gray-700">{discount.reason}</span>
                                </div>
                                {discount.validUntil && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Valid Until:</span>
                                        <span className="text-gray-700">{new Date(discount.validUntil).toLocaleDateString()}</span>
                                    </div>
                                )}
                                {user?.role === 'receptionist' && discount.receptionistId === user.id && (
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-600">Created:</span>
                                        <span className="text-gray-700">{new Date(discount.createdAt).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>

                            {/* Offered by */}
                            {discount.receptionistName && (
                                <p className="text-xs text-gray-500 border-t border-gray-200 pt-2">
                                    Offered by: <span className="font-semibold">{discount.receptionistName}</span>
                                </p>
                            )}

                            {/* Action Buttons (Receptionist) */}
                            {user?.role === 'receptionist' && discount.status === 'pending' && discount.receptionistId === user.id && (
                                <button
                                    onClick={() => handleDelete(discount.id)}
                                    className="w-full mt-3 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold rounded transition"
                                >
                                    Withdraw Offer
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <div className="inline-flex flex-col items-center">
                            <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-gray-500 text-sm font-medium">No discount offers {filter !== 'all' ? `with status "${filter}"` : 'yet'}</p>
                            {filter === 'pending' && user?.role === 'receptionist' && (
                                <p className="text-gray-400 text-xs mt-2">👉 Go to <span className="font-semibold">Patients</span> page to create discount offers for your customers</p>
                            )}
                            {filter === 'pending' && user?.role === 'admin' && (
                                <p className="text-gray-400 text-xs mt-2">Receptionists will send discount offers here for your approval</p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Admin Decision Modal */}
            {user?.role === 'admin' && selectedDiscount && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Review Discount Offer</h3>

                        {/* Offer Details */}
                        <div className="bg-herbal-50 border border-herbal-100 rounded-lg p-4 mb-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Patient:</span>
                                <span className="font-semibold">{selectedDiscount.customerName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Amount:</span>
                                <span className="font-semibold text-herbal-700">₹{selectedDiscount.discountAmount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Therapy:</span>
                                <span>{selectedDiscount.applicableTherapy}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Reason:</span>
                                <span>{selectedDiscount.reason}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Offered by:</span>
                                <span>{selectedDiscount.receptionistName}</span>
                            </div>
                        </div>

                        {/* Admin Note */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Note (Optional)</label>
                            <textarea
                                value={adminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                                placeholder="Add your notes or reason..."
                                className="w-full px-3 py-2 border border-herbal-200 rounded-lg focus:outline-none focus:border-herbal-500 text-sm"
                                rows="3"
                            />
                        </div>

                        {/* Apply to Customer Checkbox (for Accept) */}
                        {selectedDiscount.status === 'pending' && (
                            <label className="flex items-center gap-2 mb-4">
                                <input
                                    type="checkbox"
                                    checked={applyToCustomer}
                                    onChange={(e) => setApplyToCustomer(e.target.checked)}
                                    className="w-4 h-4 border-herbal-300 rounded"
                                />
                                <span className="text-sm text-gray-700">Apply discount to customer record</span>
                            </label>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-3">
                            {selectedDiscount.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => handleApprove(selectedDiscount.id)}
                                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition"
                                    >
                                        ✓ Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(selectedDiscount.id)}
                                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition"
                                    >
                                        ✕ Reject
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => setSelectedDiscount(null)}
                                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiscountsPage;
