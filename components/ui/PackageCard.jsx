import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, ArrowRight } from 'lucide-react';

const PackageCard = ({ pkg, index, onViewDetails }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 border border-slate-100 flex flex-col"
    >
        <div className="relative overflow-hidden">
            <img
                src={pkg.image.startsWith('http') ? pkg.image : `http://localhost:5001/${pkg.image}`}
                alt={pkg.title}
                className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/cccccc/ffffff?text=Image+Error'; }}
            />
            <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute top-4 right-4 bg-white/90 text-teal-700 px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">{pkg.duration || "N/A"}</div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-slate-800">{pkg.title || "Untitled Package"}</h3>
                <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-semibold">
                    <Star size={14} className="fill-current" />
                    <span>{pkg.rating?.toFixed(1) || "N/A"}</span>
                </div>
            </div>
            <p className="text-sm flex items-center text-slate-500 mb-4"><MapPin size={14} className="mr-1.5 flex-shrink-0" /> {pkg.location || "Unknown Location"}</p>
            <p className="text-slate-600 text-sm mb-6 flex-grow">{pkg.description?.substring(0, 90) || "No description available."}...</p>
            <div className="flex justify-between items-center mt-auto">
                <div className="text-2xl font-bold text-slate-800">₹{pkg.price ? pkg.price.toLocaleString('en-IN') : 0}<span className="text-sm font-normal text-slate-500">/person</span></div>
                <button onClick={() => onViewDetails(pkg)} className="font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 group/link">
                    Details
                    <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
                </button>
            </div>
        </div>
    </motion.div>
);

export default PackageCard;