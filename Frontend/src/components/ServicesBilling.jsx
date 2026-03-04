import React from 'react';

const RoleItem = ({ title, responsibilities }) => (
  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200 hover:shadow-md transition">
    <h4 className="text-base font-semibold text-indigo-900 mb-3">{title}</h4>
    <ul className="space-y-2">
      {responsibilities.map((resp, idx) => (
        <li key={idx} className="flex items-start gap-2">
          <span className="text-indigo-600 font-bold mt-1">•</span>
          <span className="text-sm text-gray-700">{resp}</span>
        </li>
      ))}
    </ul>
  </div>
);

const ServiceItem = ({ name, duration, price }) => (
  <div className="flex justify-between items-center py-3 border-b border-brand-200 last:border-b-0">
    <div>
      <p className="text-sm font-medium text-brand-800">{name}</p>
      <p className="text-xs text-brand-500">{duration}</p>
    </div>
    <p className="text-sm font-semibold text-brand-800">Rs. {price}</p>
  </div>
);

const DiscountItem = ({ name, offer }) => (
    <div className="bg-brand-50 rounded-lg p-3 flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-brand-700">{name}</p>
        </div>
        <p className="text-sm font-bold text-brand-600 bg-white px-2 py-1 rounded-md">{offer}</p>
    </div>
)

const ServicesBilling = () => {
  const receptionistRoles = [
    {
      title: "Patient Registration & Check-in",
      responsibilities: [
        "Greet and welcome patients warmly",
        "Verify patient identity and update information",
        "Explain clinic policies and procedures",
        "Collect necessary documents and consent forms",
        "Assign patient IDs and manage patient records"
      ]
    },
    {
      title: "Booking & Appointment Management",
      responsibilities: [
        "Schedule appointments based on availability",
        "Confirm appointments via SMS/call 24 hours prior",
        "Manage cancellations and reschedules",
        "Maintain appointment records and calendar",
        "Coordinate therapist availability"
      ]
    },
    {
      title: "Payment & Billing",
      responsibilities: [
        "Process payments via cash, card, UPI, or transfer",
        "Apply discounts and special offers appropriately",
        "Generate billing receipts and invoices",
        "Handle refunds and adjustments",
        "Maintain billing records and reports"
      ]
    },
    {
      title: "Customer Service Excellence",
      responsibilities: [
        "Address patient inquiries and concerns",
        "Recommend appropriate services and packages",
        "Maintain confidentiality of patient information",
        "Provide feedback to management",
        "Ensure clinic cleanliness and comfort"
      ]
    }
  ];

  const services = [
    { name: 'Abhyanga Massage', duration: '60 min', price: 1200 },
    { name: 'Shirodhara Therapy', duration: '45 min', price: 1800 },
    { name: 'Panchakarma Detox', duration: '90 min', price: 2500 },
    { name: 'Herbal Steam', duration: '30 min', price: 800 },
    { name: 'Nasya Therapy', duration: '30 min', price: 900 },
    { name: 'Kati Basti (Back Care)', duration: '50 min', price: 1400 },
    { name: 'Swedana (Sweating Therapy)', duration: '40 min', price: 1100 },
    { name: 'Netra Tarpana (Eye Care)', duration: '35 min', price: 1000 },
  ];

  const discounts = [
      { name: "Senior Citizen (60+)", offer: "15% Off" },
      { name: "First Visit", offer: "10% Off" },
      { name: "Package (3+ Sessions)", offer: "20% Off" },
      { name: "Weekend Special", offer: "12% Off" },
  ]

  return (
    <div className="space-y-8">
      {/* Receptionist Roles Section */}
      <div className="glass-card p-8 bg-gradient-to-br from-indigo-50 via-white to-blue-50 border border-indigo-200">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-900 to-blue-900 bg-clip-text text-transparent">Receptionist Roles & Responsibilities</h3>
          <p className="text-sm text-gray-600 mt-2">Master your role to provide exceptional service to our valued patients</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {receptionistRoles.map((role, idx) => (
            <RoleItem key={idx} title={role.title} responsibilities={role.responsibilities} />
          ))}
        </div>

        <div className="mt-8 p-6 bg-indigo-100 border-l-4 border-indigo-600 rounded-lg">
          <p className="text-indigo-900 font-semibold text-sm">Key Principle:</p>
          <p className="text-indigo-800 text-sm mt-2">As a receptionist, you are the first point of contact for patients. Your professionalism, courtesy, and efficiency directly impact their experience at Sree Sanjeevni. Always prioritize patient satisfaction and clinic operations.</p>
        </div>
      </div>

      {/* Services & Billing Section */}
      <div className="glass-card p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-brand-800">Services & Billing</h3>
          <p className="text-sm text-brand-500">Standard offerings with transparent pricing.</p>
        </div>
        
        <div className="space-y-6">
          {/* Services List */}
          <div>
              <div className="divide-y divide-brand-100">
                  {services.map((service) => <ServiceItem key={service.name} {...service} />)}
              </div>
          </div>

          {/* Payment Modes */}
          <div>
            <h4 className="text-lg font-semibold text-brand-800 mb-3 text-center">Payment Modes</h4>
            <div className="flex flex-wrap justify-center gap-3 text-xs text-brand-700">
              <span className="pill bg-white">UPI (Google Pay / PhonePe)</span>
              <span className="pill bg-white">Debit or Credit Card</span>
              <span className="pill bg-white">Cash</span>
              <span className="pill bg-white">Bank Transfer</span>
            </div>
          </div>

          {/* Special Discounts */}
          <div>
              <h4 className="text-lg font-semibold text-brand-800 mb-4 text-center">Special Discounts</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {discounts.map(d => <DiscountItem key={d.name} {...d} />)}
              </div>
              <p className="text-center text-xs text-brand-500 mt-4">Limited time offers for our valued guests.</p>
          </div>
        </div>

        <p className="text-center text-sm text-brand-600 mt-8 font-medium">
          Calm spaces, mindful care.
        </p>
      </div>
    </div>
  );
};

export default ServicesBilling;