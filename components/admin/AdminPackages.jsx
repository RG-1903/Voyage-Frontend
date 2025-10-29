import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, MapPin, Star } from 'lucide-react';
import apiClient from '../../api/apiClient';
import Button from '../ui/Button';
import PackageFormModal from './PackageFormModal';

const AdminPackageCard = ({ pkg, onEdit, onDelete }) => (
    <motion.div layout className="bg-white rounded-lg shadow-md flex flex-col md:flex-row items-center overflow-hidden">
        <img
            src={pkg.image.startsWith('http') ? pkg.image : `http://localhost:5001/${pkg.image}`}
            alt={pkg.title}
            className="w-full md:w-48 h-48 md:h-full object-cover"
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

const AdminPackages = ({ packages = [], setPackages }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [packageToEdit, setPackageToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleOpenModalForNew = () => {
        setIsModalOpen(true);
        setPackageToEdit(null);
    };

    const handleOpenModalForEdit = (pkg) => {
        setIsModalOpen(true);
        setPackageToEdit(pkg);
    };

    const handleCloseModal = () => setIsModalOpen(false);
    
    const handleSavePackage = async (formData) => {
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'highlights' && Array.isArray(formData[key])) {
                formData[key].forEach(h => data.append('highlights', h));
            } else if (formData[key] !== null) {
                data.append(key, formData[key]);
            }
        });

        try {
            if (formData._id) {
                const { data: updated } = await apiClient.post(`/packages/update/${formData._id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
                setPackages(prev => prev.map(p => p._id === updated._id ? updated : p));
            } else {
                const { data: added } = await apiClient.post('/packages/add', data, { headers: { 'Content-Type': 'multipart/form-data' } });
                setPackages(prev => [...prev, added]);
            }
        } catch (error) {
            console.error("Failed to save package:", error);
        }
        handleCloseModal();
    };

    const handleDeletePackage = async (id) => {
        if (window.confirm('Are you sure you want to delete this package?')) {
            try {
                await apiClient.delete(`/packages/${id}`);
                setPackages(prev => prev.filter(p => p._id !== id));
            } catch (error) {
                console.error("Failed to delete package:", error);
            }
        }
    };

    const filteredPackages = packages.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search packages by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>
                <Button onClick={handleOpenModalForNew} className="mt-4 md:mt-0 w-full md:w-auto bg-teal-600 text-white hover:bg-teal-700 shadow-teal-500/30">
                    <Plus size={20} className="mr-2" />Add New Package
                </Button>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredPackages.map(pkg => (
                    <AdminPackageCard key={pkg._id} pkg={pkg} onEdit={handleOpenModalForEdit} onDelete={handleDeletePackage} />
                ))}
            </div>
            <PackageFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSavePackage}
                packageToEdit={packageToEdit}
            />
        </div>
    );
};

export default AdminPackages;