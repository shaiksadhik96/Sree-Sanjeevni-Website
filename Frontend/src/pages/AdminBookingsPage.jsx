import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useBookings } from "../context/BookingContext.jsx";
import { useToast } from "../components/ToastProvider.jsx";
import { formatDateLabel } from "../utils/date.js";

const AdminBookingsPage = () => {
  const { bookings, updateBookingStatus } = useBookings();
  const { showToast } = useToast();
  const [postponeDates, setPostponeDates] = useState({});

  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => {
      if (a.status === b.status) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (a.status === "pending") return -1;
      if (b.status === "pending") return 1;
      return a.status.localeCompare(b.status);
    });
  }, [bookings]);

  const handleApprove = async (bookingId) => {
    const result = await updateBookingStatus(bookingId, { status: "approved" });
    if (!result) {
      showToast("Failed to approve booking.", "error");
      return;
    }
    showToast("Booking approved.", "success");
  };

  const handlePostpone = async (bookingId) => {
    const postponeDate = postponeDates[bookingId] || "";
    const result = await updateBookingStatus(bookingId, {
      status: "postponed",
      postponeDate: postponeDate || null,
    });
    if (!result) {
      showToast("Failed to postpone booking.", "error");
      return;
    }
    showToast("Booking postponed.", "success");
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white border border-gray-200 rounded-lg p-6 shadow-soft"
      >
        <h2 className="text-lg font-semibold text-gray-800">Bookings Approval</h2>
        <p className="text-xs text-gray-500">Approve or postpone receptionist requests.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedBookings.length === 0 ? (
          <div className="text-sm text-gray-500">No bookings available.</div>
        ) : (
          sortedBookings.map((booking) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-gray-200 rounded-lg p-5 shadow-soft relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-brand/60"></div>
              <div className="absolute bottom-6 right-10 h-1.5 w-1.5 rounded-full bg-amber-400/70"></div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-800">{booking.patientName}</h3>
                  <p className="text-xs text-gray-500">{formatDateLabel(booking.appointmentDate)}</p>
                </div>
                <span
                  className={`px-2 py-1 text-[10px] font-semibold rounded-full uppercase tracking-wide ${
                    booking.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : booking.status === "postponed"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
              <p className="mt-3 text-xs text-gray-600">{booking.serviceType || "General Service"}</p>
              {booking.discountAmount && (
                <div className="mt-3 rounded-lg bg-amber-50 border border-amber-100 p-2">
                  <p className="text-xs font-semibold text-amber-700">Discount Offered</p>
                  <p className="text-xs text-amber-600 font-medium">₹{booking.discountAmount}{booking.discountPercentage ? ` (${booking.discountPercentage}%)` : ''}</p>
                  {booking.discountReason && <p className="text-xs text-amber-600">{booking.discountReason}</p>}
                </div>
              )}
              {booking.notes && (
                <p className="mt-2 text-xs text-gray-500">{booking.notes}</p>
              )}

              <div className="mt-4 space-y-2">
                <label className="text-[11px] font-semibold text-gray-500">Postpone Date</label>
                <input
                  type="date"
                  value={postponeDates[booking.id] || ""}
                  onChange={(event) =>
                    setPostponeDates((prev) => ({
                      ...prev,
                      [booking.id]: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleApprove(booking.id)}
                    className="flex-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePostpone(booking.id)}
                    className="flex-1 rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-white"
                  >
                    Postpone
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminBookingsPage;
