import { useState } from 'react';

const DiscountForm = ({ onSubmit, onCancel, initialValues }) => {
    const [name, setName] = useState(initialValues?.name || '');
    const [description, setDescription] = useState(initialValues?.description || '');
    const [value, setValue] = useState(initialValues?.value || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, description, value });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full p-2 border rounded-md"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full p-2 border rounded-md"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Value</label>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="mt-1 block w-full p-2 border rounded-md"
                    required
                />
            </div>
            <div className="flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand text-white rounded-md">Save</button>
            </div>
        </form>
    );
};

export default DiscountForm;
