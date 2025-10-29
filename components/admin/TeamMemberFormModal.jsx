import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload } from 'lucide-react';
import InputField from '../ui/InputField'; // Adjusted path
// --- FIX: Import getAssetUrl ---
import { getAssetUrl } from '../../utils/helpers'; // Adjusted path

const TeamMemberFormModal = ({ isOpen, onClose, onSave, memberToEdit }) => {
    const [formData, setFormData] = useState({ name: '', title: '', imageFile: null });
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            if (memberToEdit) {
                setFormData(memberToEdit);
                // --- FIX: Use getAssetUrl ---
                setImagePreview(memberToEdit.image ? getAssetUrl(memberToEdit.image) : null);
            } else {
                setFormData({ name: '', title: '', imageFile: null });
                setImagePreview(null);
            }
        }
    }, [memberToEdit, isOpen]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, imageFile: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;
    const isEditing = !!memberToEdit;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">{isEditing ? 'Edit Team Member' : 'Add New Team Member'}</h2>
                                <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={24} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <InputField name="name" value={formData.name || ''} onChange={handleChange} label="Full Name" required />
                                <InputField name="title" value={formData.title || ''} onChange={handleChange} label="Job Title (e.g., Founder & CEO)" required />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                                    <div className="mt-1 flex items-center gap-4">
                                        <div className="w-24 h-24 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center">
                                            {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /> : <span className="text-xs text-slate-500">No Image</span>}
                                        </div>
                                        <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 text-sm font-semibold text-teal-700 bg-teal-100 rounded-lg hover:bg-teal-200">
                                            <Upload size={16} className="inline mr-2"/> Upload Image
                                        </button>
                                        <input ref={fileInputRef} type="file" name="imageFile" onChange={handleFileChange} className="hidden" accept="image/*" />
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-end space-x-4">
                                    <button type="button" onClick={onClose} className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
                                    <button type="submit" className="px-6 py-2 font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600">{isEditing ? 'Save Changes' : 'Add Member'}</button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TeamMemberFormModal;