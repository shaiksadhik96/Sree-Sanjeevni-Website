import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useCustomers } from "../context/CustomerContext.jsx";
import { useBookings } from "../context/BookingContext.jsx";
import { useToast } from "../components/ToastProvider.jsx";
import { formatDateLabel } from "../utils/date.js";

const ReceptionBookingsPage = () => {
  const { customers } = useCustomers();
  const { bookings, createBooking } = useBookings();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    customerId: "",
    patientName: "",
    appointmentDate: "",
    serviceType: "",
    notes: "",
    discountAmount: "",
    discountPercentage: "",
    discountReason: "",
  });
  const [showDiscountSection, setShowDiscountSection] = useState(false);

  const selectedCustomer = useMemo(
    () => customers.find((c) => c.id === form.customerId),
    [customers, form.customerId],
  );

  const hasCustomers = customers && customers.length > 0;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomerChange = (event) => {
    const value = event.target.value;
    const customer = customers.find((c) => c.id === value);
    setForm((prev) => ({
      ...prev,
      customerId: value,
      patientName: customer?.name || prev.patientName,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.patientName || !form.appointmentDate) {
      showToast("Patient name and appointment date are required.", "error");
      return;
    }

    const payload = {
      customerId: form.customerId,
      patientName: selectedCustomer?.name || form.patientName,
      appointmentDate: form.appointmentDate,
      serviceType: form.serviceType,
      notes: form.notes,
    };

    // Add discount fields if provided
    if (form.discountAmount || form.discountPercentage) {
      payload.discountAmount = parseFloat(form.discountAmount) || 0;
      payload.discountPercentage = parseFloat(form.discountPercentage) || 0;
      payload.discountReason = form.discountReason || '';
    }

    const result = await createBooking(payload);
    if (!result) {
      showToast("Failed to create booking.", "error");
      return;
    }

    showToast("Booking request sent for approval.", "success");
    setForm({
      customerId: "",
      patientName: "",
      appointmentDate: "",
      serviceType: "",
      notes: "",
      discountAmount: "",
      discountPercentage: "",
      discountReason: "",
    });
    setShowDiscountSection(false);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white border border-gray-200 rounded-lg p-6 shadow-soft"
      >
        <h2 className="text-lg font-semibold text-gray-800">Book Appointment</h2>
        <p className="text-xs text-gray-500 mb-4">Create a booking request for admin approval.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Selection Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-gray-200">
            <div className="relative z-20">
              <label className="text-xs font-semibold text-gray-600 mb-2 block">Customer *</label>
              {!hasCustomers ? (
                <div className="w-full py-2 px-3 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm">
                  No patients available. Add a patient first.
                </div>
              ) : (
                <select
                  value={form.customerId}
                  onChange={handleCustomerChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white hover:border-herbal-400 focus:border-herbal-600 focus:ring-2 focus:ring-herbal-300 focus:outline-none transition-all"
                >
                  <option value="">-- Select a customer --</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} ({customer.phone || 'N/A'})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-2 block">Patient Name *</label>
              <input
                type="text"
                name="patientName"
                value={selectedCustomer?.name || form.patientName}
                onChange={handleChange}
                placeholder="Auto-filled or enter manually"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-herbal-600 focus:ring-2 focus:ring-herbal-300 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Appointment Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-gray-200">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-2 block">Appointment Date *</label>
              <input
                type="date"
                name="appointmentDate"
                value={form.appointmentDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-herbal-600 focus:ring-2 focus:ring-herbal-300 focus:outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-2 block">Service Type</label>
              <select
                name="serviceType"
                value={form.serviceType}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white hover:border-herbal-400 focus:border-herbal-600 focus:ring-2 focus:ring-herbal-300 focus:outline-none transition-all"
              >
                <option value="">-- Select service --</option>
                <option value="Abhyanga">Abhyanga (Full Body Massage)</option>
                <option value="Shirodhara">Shirodhara (Third Eye Therapy)</option>
                <option value="Pizhichil">Pizhichil (Oil Bath Therapy)</option>
                <option value="Navarakizhi">Navarakizhi (Rice Bolus Massage)</option>
                <option value="Udwarthanam">Udwarthanam (Powder Massage)</option>
                <option value="Kati Basti">Kati Basti (Lower Back Treatment)</option>
                <option value="Netra Tarpana">Netra Tarpana (Eye Rejuvenation)</option>
                <option value="Nasya">Nasya (Nasal Therapy)</option>
              </select>
            </div>
          </div>

          {/* Notes Section */}
          <div className="pb-4 border-b border-gray-200">
            <label className="text-xs font-semibold text-gray-600 mb-2 block">Notes (Optional)</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="2"
              placeholder="Any special notes for the admin..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-herbal-600 focus:ring-2 focus:ring-herbal-300 focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Optional Discount Section */}
          <div className="pb-4">
            <button
              type="button"
              onClick={() => setShowDiscountSection(!showDiscountSection)}
              className="flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800 mb-3"
            >
              <svg className={`w-4 h-4 transition-transform ${showDiscountSection ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              Add Discount (Optional)
            </button>
            
            {showDiscountSection && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Discount Amount (₹)</label>
                    <input
                      type="number"
                      name="discountAmount"
                      value={form.discountAmount}
                      onChange={handleChange}
                      placeholder="e.g., 500"
                      min="0"
                      className="w-full rounded-lg border border-amber-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-300 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Discount Percentage (%)</label>
                    <input
                      type="number"
                      name="discountPercentage"
                      value={form.discountPercentage}
                      onChange={handleChange}
                      placeholder="e.g., 10"
                      min="0"
                      max="100"
                      className="w-full rounded-lg border border-amber-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-300 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Reason for Discount</label>
                  <input
                    type="text"
                    name="discountReason"
                    value={form.discountReason}
                    onChange={handleChange}
                    placeholder="e.g., Senior citizen, Regular customer"
                    className="w-full rounded-lg border border-amber-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-300 focus:outline-none"
                  />
                </div>
                <p className="text-xs text-amber-700">Admin will review and approve/decline this discount</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!hasCustomers}
              className="px-6 py-2 rounded-lg bg-herbal-600 hover:bg-herbal-700 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-soft"
            >
              Send for Approval
            </button>
            <button
              type="reset"
              onClick={() => {
                setForm({customerId: "", patientName: "", appointmentDate: "", serviceType: "", notes: "", discountAmount: "", discountPercentage: "", discountReason: ""});
                setShowDiscountSection(false);
              }}
              className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold transition-all"
            >
              Clear
            </button>
          </div>
        </form>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bookings.length === 0 ? (
          <div className="text-sm text-gray-500">No bookings yet.</div>
        ) : (
          bookings.map((booking) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-gray-200 rounded-lg p-5 shadow-soft relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-brand/60"></div>
              <div className="absolute bottom-6 right-10 h-1.5 w-1.5 rounded-full bg-amber-400/70"></div>
              <h3 className="text-base font-semibold text-gray-800">{booking.patientName}</h3>
              <p className="text-xs text-gray-500">{formatDateLabel(booking.appointmentDate)}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-600">{booking.serviceType || "General"}</span>
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
              {booking.discountAmount && (
                <div className="mt-3 rounded-lg bg-amber-50 border border-amber-100 p-2">
                  <p className="text-xs font-semibold text-amber-700">Discount Offered</p>
                  <p className="text-xs text-amber-600">₹{booking.discountAmount}{booking.discountPercentage ? ` (${booking.discountPercentage}%)` : ''}</p>
                  {booking.discountReason && <p className="text-xs text-amber-600">{booking.discountReason}</p>}
                </div>
              )}
              {booking.notes && (
                <p className="mt-3 text-xs text-gray-500">{booking.notes}</p>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Additional Information Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-gradient-to-br from-herbal-50 to-white border border-herbal-200 rounded-xl p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-herbal-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-herbal-800">Booking Guidelines</h3>
          </div>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-herbal-600 font-bold">•</span>
              <span>Ensure patient is registered before creating booking</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-herbal-600 font-bold">•</span>
              <span>Verify service availability for requested date/time</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-herbal-600 font-bold">•</span>
              <span>Add any special notes or patient preferences</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-herbal-600 font-bold">•</span>
              <span>Discounts must be added during patient registration</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-herbal-600 font-bold">•</span>
              <span>Wait for admin approval before confirming with patient</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-blue-900">Typical Session Duration</h3>
          </div>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Abhyanga / Pizhichil</span>
                <span className="text-sm text-blue-600 font-bold">60-90 mins</span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Shirodhara</span>
                <span className="text-sm text-blue-600 font-bold">45-60 mins</span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Navarakizhi / Udwarthanam</span>
                <span className="text-sm text-blue-600 font-bold">45-60 mins</span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Kati Basti / Netra Tarpana</span>
                <span className="text-sm text-blue-600 font-bold">30-45 mins</span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Nasya</span>
                <span className="text-sm text-blue-600 font-bold">20-30 mins</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Booking Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-6 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 shadow-xl text-white"
      >
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Pro Tip: Booking Workflow
        </h3>
        <p className="text-white/90 text-sm leading-relaxed">
          <strong>Step 1:</strong> Add the patient in the "Patients" page with their details and optional therapy/discount information.<br />
          <strong>Step 2:</strong> Come to "Bookings" page to schedule their appointment with specific date and service.<br />
          <strong>Step 3:</strong> Wait for admin approval before confirming the appointment with the patient.<br />
          <strong>Note:</strong> Discount offers are sent to admin for approval automatically when added during patient registration.
        </p>
      </motion.div>
    </div>
  );
};

export default ReceptionBookingsPage;
