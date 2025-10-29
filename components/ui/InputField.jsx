import React from 'react';

const InputField = ({ label, ...props }) => (
    <div>
        {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
        <input
            {...props}
            className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
        />
    </div>
);

export default InputField;