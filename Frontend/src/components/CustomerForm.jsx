import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AYURVEDIC_SERVICES, getServicePrice } from "../utils/services";

const emptyValues = {
  name: "",
  phone: "",
  age: "",
  gender: "",
  appointmentDate: "",
  therapyType: "",
  medicationNotes: "",
  status: "Active",
  serviceCost: "",
  discount: "",
  discountReason: "",
};

const CustomerForm = ({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Save",
  showStatus = false,
  title = "Customer Details",
}) => {
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setValues({ ...emptyValues, ...initialValues });
      return;
    }

    setValues(emptyValues);
  }, [initialValues]);

  const requiredFields = useMemo(
    () => ["name", "phone", "age", "gender", "appointmentDate"],
    [],
  );

  const validate = () => {
    const nextErrors = {};
    requiredFields.forEach((field) => {
      if (!values[field]) {
        nextErrors[field] = "Required";
      }
    });

    if (values.age && Number(values.age) <= 0) {
      nextErrors.age = "Enter a valid age";
    }

    if (values.phone && values.phone.length < 8) {
      nextErrors.phone = "Enter a valid phone";
    }

    if (values.gender && !["Male", "Female"].includes(values.gender)) {
      nextErrors.gender = "Select Male or Female";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-fill service cost when therapy type is selected
      if (name === 'therapyType' && value) {
        const servicePrice = getServicePrice(value);
        if (servicePrice > 0) {
          updated.serviceCost = servicePrice;
        }
      }
      return updated;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    const payload = {
      ...values,
      age: Number(values.age),
    };

    onSubmit(payload);
    if (!initialValues) {
      setValues(emptyValues);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="glass-card relative overflow-hidden space-y-4 p-6"
    >
      <div className="absolute -right-4 -bottom-4 opacity-5">
        <svg
          viewBox="0 0 150 150"
          className="h-28 w-28 text-brand-600"
          fill="currentColor"
        >
          <circle cx="75" cy="75" r="60" />
          <path d="M75 35 L75 115 M35 75 L115 75" stroke="white" strokeWidth="6" />
        </svg>
      </div>
      <div className="relative flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-brand-800">{title}</h3>
          <p className="text-xs text-brand-500">
            Keep the service notes concise and clear.
          </p>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-brand-100 bg-white px-3 py-1 text-xs font-semibold text-brand-600 transition hover:bg-brand-50"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-brand-700">
          Name <span className="text-red-500">*</span>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            placeholder="Patient full name"
            className="mt-2 w-full rounded-xl border border-brand-100 bg-white px-4 py-2 text-sm focus:border-brand-400 focus:outline-none"
          />
          {errors.name && (
            <span className="text-xs text-red-500">{errors.name}</span>
          )}
        </label>
        <label className="text-sm font-semibold text-brand-700">
          Phone <span className="text-red-500">*</span>
          <input
            type="text"
            name="phone"
            value={values.phone}
            onChange={handleChange}
            placeholder="10-digit phone number"
            className="mt-2 w-full rounded-xl border border-brand-100 bg-white px-4 py-2 text-sm focus:border-brand-400 focus:outline-none"
          />
          {errors.phone && (
            <span className="text-xs text-red-500">{errors.phone}</span>
          )}
        </label>
        <label className="text-sm font-semibold text-brand-700">
          Age <span className="text-red-500">*</span>
          <input
            type="number"
            name="age"
            value={values.age}
            onChange={handleChange}
            placeholder="Patient age"
            className="mt-2 w-full rounded-xl border border-brand-100 bg-white px-4 py-2 text-sm focus:border-brand-400 focus:outline-none"
          />
          {errors.age && (
            <span className="text-xs text-red-500">{errors.age}</span>
          )}
        </label>
        <label className="text-sm font-semibold text-brand-700">
          Gender <span className="text-red-500">*</span>
          <select
            name="gender"
            value={values.gender}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-brand-100 bg-white px-4 py-2 text-sm focus:border-brand-400 focus:outline-none"
          >
            <option value="">-- Select Gender --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {errors.gender && (
            <span className="text-xs text-red-500">{errors.gender}</span>
          )}
        </label>
        <label className="text-sm font-semibold text-brand-700">
          Appointment Date <span className="text-red-500">*</span>
          <input
            type="date"
            name="appointmentDate"
            value={values.appointmentDate}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-brand-100 bg-white px-4 py-2 text-sm focus:border-brand-400 focus:outline-none"
          />
          {errors.appointmentDate && (
            <span className="text-xs text-red-500">{errors.appointmentDate}</span>
          )}
        </label>
      </div>

      {/* Therapy & Cost Section */}
      <div className="border-t-2 border-herbal-100 pt-4">
        <h4 className="text-sm font-bold text-herbal-700 mb-3 uppercase tracking-wider">Therapy Details</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-brand-700">
            Therapy Type
            <select
              name="therapyType"
              value={values.therapyType}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-brand-100 bg-white px-4 py-2 text-sm focus:border-brand-400 focus:outline-none"
            >
              <option value="">-- Select Service --</option>
              {AYURVEDIC_SERVICES.map(service => (
                <option key={service.id} value={service.name}>
                  {service.name} - ₹{service.price} ({service.duration})
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold text-brand-700">
            Service Cost (₹)
            <input
              type="number"
              name="serviceCost"
              value={values.serviceCost}
              onChange={handleChange}
              placeholder="e.g., 1500"
              className="mt-2 w-full rounded-xl border border-brand-100 bg-white px-4 py-2 text-sm focus:border-brand-400 focus:outline-none"
            />
          </label>
        </div>
      </div>

      {/* Discount Section */}
      <div className="border-t-2 border-amber-100 pt-4">
        <h4 className="text-sm font-bold text-amber-700 mb-3 uppercase tracking-wider flex items-center gap-2">
          Discount (Optional - Requires Admin Approval)
        </h4>
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-gray-700">
            Discount Amount (₹)
            <input
              type="number"
              name="discount"
              value={values.discount}
              onChange={handleChange}
              placeholder="e.g., 500"
              min="0"
              className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-300 focus:outline-none"
            />
          </label>
          <label className="text-sm font-semibold text-gray-700">
            Discount Reason
            <select
              name="discountReason"
              value={values.discountReason}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-300 focus:outline-none"
            >
              <option value="">-- Select Reason --</option>
              <option value="Senior Citizen">Senior Citizen (60+ years)</option>
              <option value="First Visit">First Visit Discount</option>
              <option value="Loyalty">Loyalty Customer</option>
              <option value="Referral">Referral Bonus</option>
              <option value="Package Deal">Package Deal</option>
              <option value="Special Offer">Special Offer</option>
              <option value="Medical Condition">Medical Condition</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <div className="md:col-span-2">
            <p className="text-xs text-amber-600">Note: Discount will be sent to admin for approval before applying to customer account</p>
          </div>
        </div>
      </div>

      {showStatus && (
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-brand-700">
            Service Status
            <select
              name="status"
              value={values.status}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-brand-100 bg-white px-4 py-2 text-sm focus:border-brand-400 focus:outline-none"
            >
              <option value="Active">Active</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
            </select>
          </label>
        </div>
      )}

      <label className="text-sm font-semibold text-brand-700">
        Medication Notes
        <textarea
          name="medicationNotes"
          value={values.medicationNotes}
          onChange={handleChange}
          rows={3}
          className="mt-2 w-full rounded-xl border border-brand-100 bg-white px-4 py-2 text-sm focus:border-brand-400 focus:outline-none"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3 pt-4">
        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-lg bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-dark hover:shadow-lg"
        >
          {submitLabel}
        </motion.button>
        <span className="text-xs text-brand-500">
          Required fields are marked in the form.
        </span>
      </div>
    </motion.form>
  );
};

export default CustomerForm;
