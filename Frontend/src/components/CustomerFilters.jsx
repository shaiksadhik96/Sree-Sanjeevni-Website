import React from 'react';

const CustomerFilters = () => {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-brand-800">Filters</h3>
      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="cost" className="text-sm font-medium text-brand-700">Max Cost</label>
          <input type="range" id="cost" min="0" max="1000" className="w-full h-2 bg-brand-100 rounded-lg appearance-none cursor-pointer" />
        </div>
        <div>
          <label htmlFor="availability" className="text-sm font-medium text-brand-700">Availability</label>
          <input type="date" id="availability" className="w-full mt-1 rounded-md border-brand-200 shadow-sm sm:text-sm" />
        </div>
        <div className="space-y-2">
            <h4 className="text-sm font-medium text-brand-700">Treatment Status</h4>
            <div className="flex items-center">
                <input id="check1" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                <label htmlFor="check1" className="ml-3 text-sm text-brand-600">Initial Consultation</label>
            </div>
            <div className="flex items-center">
                <input id="check2" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                <label htmlFor="check2" className="ml-3 text-sm text-brand-600">Therapy Ongoing</label>
            </div>
            <div className="flex items-center">
                <input id="check3" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                <label htmlFor="check3" className="ml-3 text-sm text-brand-600">Post-Treatment</label>
            </div>
            <div className="flex items-center">
                <input id="check4" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                <label htmlFor="check4" className="ml-3 text-sm text-brand-600">Completed</label>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerFilters;
