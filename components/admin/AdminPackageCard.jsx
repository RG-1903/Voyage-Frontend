import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, MapPin, Star } from 'lucide-react';
// --- FIX: Import getAssetUrl ---
import { getAssetUrl } from '../../utils/helpers'; // Path is correct based on structure

const AdminPackageCard = ({ pkg, onEdit, onDelete }) => (
    <motion.div layout className="bg-white rounded-lg shadow-md flex flex-col md:flex-row items-center overflow-hidden">
        <img
            // --- FIX: Use getAssetUrl ---
            src={getAssetUrl(pkg.image)}
            alt={pkg.title}
            className="w-full md:w-48 h-48 md:h-full object-cover"
            // Optional: Add an error handler for broken images
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/192x192/cccccc/ffffff?text=No+Image'; }}
        />
        <div className="p-4 flex-grow w-full">
            <h3 className="font-bold text-lg text-slate-800">{pkg.title}</h3>
            <p className="text-sm text-slate-500 flex items-center mb-2"><MapPin size={14} className="mr-1"/>{pkg.location}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-700">
                <span>₹{pkg.price.toLocaleString('en-IN')}</span>
                <span>{pkg.duration}</span>
                <span className="flex items-center"><Star size={14} className="mr-1 text-yellow-500"/>{pkg.rating}</span>
            </div>
        </div>
        <div className="p-4 flex-shrink-0 flex md:flex-col items-center justify-around md:justify-center gap-2 w-full md:w-auto border-t md:border-t-0 md:border-l">
            <button onClick={() => onEdit(pkg)} className="flex items-center justify-center w-full md:w-auto px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 rounded-md transition-colors">
                <Edit size={16} className="mr-1"/> Edit
            </button>
            <button onClick={() => onDelete(pkg._id)} className="flex items-center justify-center w-full md:w-auto px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 rounded-md transition-colors">
                <Trash2 size={16} className="mr-1"/> Delete
            </button>
        </div>
    </motion.div>
);

export default AdminPackageCard;