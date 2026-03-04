import { formatDateLabel } from "../utils/date.js";

const statusStyles = {
  Active: "bg-herbal-50 text-herbal-700 border-l-4 border-herbal-500",
  Scheduled: "bg-herbal-50 text-herbal-700 border-l-4 border-herbal-500",
  Completed: "bg-beige-100 text-beige-700 border-l-4 border-beige-400",
};

const CustomerList = ({
  customers = [],
  onEdit,
  onDelete,
  allowEdit = true,
  allowDelete = true,
}) => {
  if (!customers.length) {
    return (
      <div className="bg-white shadow-soft border border-herbal-100 rounded-lg p-8 text-center">
        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="text-gray-500 text-sm font-medium">No patients registered yet</p>
        <p className="text-gray-400 text-xs mt-1">Add your first patient to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-herbal-100 rounded-lg shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gradient-to-r from-herbal-600 to-herbal-800 text-white">
              <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Patient Info
                </div>
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Therapy
                </div>
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Appointment
                </div>
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Cost & Discount
                </div>
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Notes
                </div>
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Actions
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customers.map((customer, index) => (
              <tr
                key={customer.id}
                className={`transition-colors hover:bg-herbal-50 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-green-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">
                        {customer.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-gray-900 text-sm">{customer.name}</div>
                        {customer.patientId && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-brand-100 text-brand-700 border border-brand-300">
                            #{customer.patientId}
                          </span>
                        )}
                      </div>
                      <div className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {customer.phone}
                      </div>
                      <div className="text-gray-500 text-xs mt-1 flex items-center gap-3">
                        <span>Age: {customer.age}</span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold">{customer.gender || 'N/A'}</span>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-semibold ml-auto ${statusStyles[customer.status] || statusStyles.Active}`}>
                      {customer.status || "Active"}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-gray-900">{customer.therapyType}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-700">{formatDateLabel(customer.appointmentDate)}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-1">
                    {customer.serviceCost && (
                      <div className="text-sm font-semibold text-herbal-700">₹{customer.serviceCost}</div>
                    )}
                    {customer.discount && (
                      <div className="text-xs text-red-600 font-medium">{customer.discount} off</div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-xs text-gray-600 max-w-xs truncate" title={customer.medicationNotes}>
                    {customer.medicationNotes || "-"}
                  </div>
                </td>
                <td className="px-4 py-4">
                  {(allowEdit || allowDelete) && (
                    <div className="flex items-center justify-center gap-2">
                      {allowEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(customer)}
                          className="p-2 text-brand hover:bg-brand hover:text-white rounded-lg transition-all border border-brand"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                      {allowDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(customer.id)}
                          className="p-2 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all border border-red-300"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-herbal-50 px-4 py-3 border-t border-herbal-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="font-medium">Total Patients: <span className="text-brand font-bold">{customers.length}</span></span>
          <span className="text-xs">Scroll horizontally for more details</span>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
