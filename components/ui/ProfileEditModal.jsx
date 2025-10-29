import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload } from 'lucide-react';
import apiClient from '../../api/apiClient'; // Path is correct
import InputField from './InputField';
import Button from './Button';
// --- FIX: Import getAssetUrl ---
import { getAssetUrl } from '../../utils/helpers'; // Path is correct

const ProfileEditModal = ({ isOpen, onClose, currentUser, onProfileUpdate }) => {
    // FIX: Initialize state correctly when currentUser is loaded
    const [formData, setFormData] = useState({ name: '', bio: '' });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);

    // FIX: Update state when currentUser or isOpen changes
    useEffect(() => {
        if (isOpen && currentUser) {
            setFormData({ name: currentUser.name || '', bio: currentUser.bio || '' });
            setImagePreview(null); // Reset preview
            setProfileImageFile(null); // Reset file
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); // Reset passwords
            setError('');
            setSuccess('');
        }
    }, [isOpen, currentUser]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const data = new FormData();
        data.append('name', formData.name);
        data.append('bio', formData.bio);
        if (profileImageFile) {
            data.append('profileImageFile', profileImageFile);
        }
        try {
            const { data: updatedProfile } = await apiClient.post('/profile/update', data);
            onProfileUpdate(updatedProfile); // Callback to update App state
            setSuccess('Profile updated successfully!');
            // Reset file input state after successful upload
            setProfileImageFile(null);
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to update profile.');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return setError('New passwords do not match.');
        }
        if (passwordData.newPassword.length < 6) {
            return setError('Password must be at least 6 characters.');
        }
        try {
            const { data } = await apiClient.post('/profile/change-password', passwordData);
            setSuccess(data.msg);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to change password.');
        }
    };

    if (!isOpen || !currentUser) return null; // Ensure currentUser exists

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-lg shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={24} /></button>
                        </div>
                        {error && <p className="text-red-500 bg-red-50 p-3 rounded-md text-sm mb-4">{error}</p>}
                        {success && <p className="text-green-600 bg-green-50 p-3 rounded-md text-sm mb-4">{success}</p>}

                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <div className="flex items-center gap-4">
                                <img
                                    // --- FIX: Use getAssetUrl, prioritize local preview ---
                                    src={imagePreview || getAssetUrl(currentUser.profileImage)}
                                    alt="Avatar"
                                    className="w-20 h-20 rounded-full object-cover"
                                />
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center px-4 py-2 text-sm font-semibold text-teal-700 bg-teal-100 rounded-lg hover:bg-teal-200">
                                    <Upload size={16} className="mr-2"/> Change Photo
                                </button>
                                <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                            </div>
                            <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                                <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"></textarea>
                            </div>
                            <div className="text-right">
                                <Button type="submit">Save Profile</Button>
                            </div>
                        </form>

                        <hr className="my-8"/>

                        <h3 className="text-xl font-bold text-gray-700 mb-4">Change Password</h3>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                             <InputField label="Current Password" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
                             <InputField label="New Password" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} required />
                             <InputField label="Confirm New Password" name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} required />
                             <div className="text-right">
                                <Button type="submit">Update Password</Button>
                             </div>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProfileEditModal;