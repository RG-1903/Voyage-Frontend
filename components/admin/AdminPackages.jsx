import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import apiClient from '../../api/apiClient';
import Button from '../ui/Button';
import PackageFormModal from './PackageFormModal';
import AdminPackageCard from './AdminPackageCard';

const AdminPackages = ({ packages, setPackages }) => {
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
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (formData.highlights && Array.isArray(formData.highlights)) {
            formData.highlights.forEach(h => data.append('highlights', h));
        }

        // --- !! THIS IS THE FIX !! ---
        // We must manually get the token and set the headers for multipart requests
        const token = sessionStorage.getItem('adminAuthToken');
        const config = {
            headers: { 
                'Content-Type': 'multipart/form-data',
                'x-auth-token': token // Manually add the token
            }
        };
        // --- End of Fix ---

        try {
            let updatedPackage;
            if (formData._id) {
                // Pass the config object to the post request
                const res = await apiClient.post(`/packages/update/${formData._id}`, data, config);
                updatedPackage = res.data;
                setPackages(prev => prev.map(p => p._id === updatedPackage._id ? updatedPackage : p));
            } else {
                // Pass the config object to the post request
                const res = await apiClient.post('/packages/add', data, config);
                updatedPackage = res.data;
                setPackages(prev => [...prev, updatedPackage]);
            }
        } catch (error) {
            console.error("Failed to save package:", error.response?.data?.msg || error.message);
            alert("Failed to save package.");
        }
        handleCloseModal();
    };

    const handleDeletePackage = async (id) => {
        if (window.confirm('Are you sure you want to delete this package?')) {
            try {
                await apiClient.delete(`/packages/${id}`);
                setPackages(prev => prev.filter(p => p._id !== id));
            } catch (error) {
                console.error("Failed to delete package:", error.response?.data?.msg || error.message);
                alert("Failed to delete package.");
            }
        }
    };

    const filteredPackages = packages.filter(pkg => {
        const titleMatch = (pkg.title || '').toLowerCase().includes(searchTerm.toLowerCase());
        const locationMatch = (pkg.location || '').toLowerCase().includes(searchTerm.toLowerCase());
        return titleMatch || locationMatch;
    });

    return (
        <div>
            {/* Search and Add Button */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by title or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>
                <Button onClick={handleOpenModalForNew} className="mt-4 md:mt-0 w-full md:w-auto bg-teal-600 text-white hover:bg-teal-700 shadow-teal-500/30">
                    <Plus size={20} className="mr-2" />Add New Package
                </Button>
            </div>
            {/* Grid for packages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredPackages.map(pkg => (
                    <AdminPackageCard key={pkg._id} pkg={pkg} onEdit={handleOpenModalForEdit} onDelete={handleDeletePackage} />
                ))}
            </div>
            {/* Modal */}
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