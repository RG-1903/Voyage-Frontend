import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload } from 'lucide-react';
import InputField from '../ui/InputField';

const PackageFormModal = ({ isOpen, onClose, onSave, packageToEdit }) => {
    const [formData, setFormData] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => { 
        if (isOpen) {
            if (packageToEdit) { 
                setFormData(packageToEdit);
                if (packageToEdit.image) {
                    setImagePreview(packageToEdit.image.startsWith('http') ? packageToEdit.image : `http://localhost:5001/${packageToEdit.image}`);
                }
            } else { 
                // Default state for a new package
                setFormData({ title: '', location: '', price: '', duration: '', rating: '', imageFile: null, type: 'Adventure', description: '', highlights: [] });
                setImagePreview(null);
            }
        }
    }, [packageToEdit, isOpen]);

    const handleChange = (e) => { 
        const { name, value } = e.target; 
        setFormData(prev => ({ ...prev, [name]: value })); 
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, imageFile: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleHighlightsChange = (e) => {
        setFormData(prev => ({ ...prev, highlights: e.target.value.split(',').map(h => h.trim()) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    const isEditing = !!packageToEdit;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.3 }} className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">{isEditing ? 'Edit Package' : 'Add New Package'}</h2>
                                <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={24} /></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField name="title" value={formData.title || ''} onChange={handleChange} label="Package Title" required />
                                    <InputField name="location" value={formData.location || ''} onChange={handleChange} label="Location" required />
                                    <InputField name="price" type="number" value={formData.price || ''} onChange={handleChange} label="Price ($)" required />
                                    <InputField name="duration" value={formData.duration || ''} onChange={handleChange} label="Duration" required />
                                    <InputField name="rating" type="number" step="0.1" min="0" max="5" value={formData.rating || ''} onChange={handleChange} label="Rating (0-5)" required />
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Package Image</label>
                                        <div className="mt-1 flex items-center gap-4">
                                            <div className="w-24 h-24 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center">
                                                {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /> : <span className="text-xs text-slate-500">No Image</span>}
                                            </div>
                                            <button type="button" onClick={() => fileInputRef.current.click()} className="px-4 py-2 text-sm font-semibold text-teal-700 bg-teal-100 rounded-lg hover:bg-teal-200">
                                                <Upload size={16} className="inline mr-2"/> Upload Image
                                            </button>
                                            <input ref={fileInputRef} type="file" name="imageFile" onChange={handleFileChange} className="hidden" accept="image/*" />
                                        </div>
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea name="description" value={formData.description || ''} onChange={handleChange} rows="3" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" required></textarea>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Highlights (comma-separated)</label>
                                        <input name="highlights" type="text" value={(formData.highlights || []).join(', ')} onChange={handleHighlightsChange} className="w-full p-3 border rounded-lg" required/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Travel Type</label>
                                        <select name="type" value={formData.type || 'Adventure'} onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                                            <option>Adventure</option>
                                            <option>Relaxation</option>
                                            <option>Cultural</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-end space-x-4">
                                    <button type="button" onClick={onClose} className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
                                    <button type="submit" className="px-6 py-2 font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600">{isEditing ? 'Save Changes' : 'Add Package'}</button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PackageFormModal;