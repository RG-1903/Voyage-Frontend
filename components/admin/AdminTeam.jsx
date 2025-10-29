import React, { useState, useEffect } from 'react'; 
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import apiClient from '../../api/apiClient';
import Button from '../ui/Button';
import TeamMemberFormModal from './TeamMemberFormModal';
import AdminTeamMemberCard from './AdminTeamMemberCard'; 

const AdminTeam = () => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [memberToEdit, setMemberToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTeamMembers = async () => {
            setIsLoading(true);
            try {
                const { data } = await apiClient.get('/teams');
                setTeamMembers(data);
            } catch (error) {
                console.error("Failed to fetch team members:", error);
                setTeamMembers([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTeamMembers();
    }, []);

    const handleOpenModalForNew = () => {
        setIsModalOpen(true);
        setMemberToEdit(null);
    };

    const handleOpenModalForEdit = (member) => {
        setIsModalOpen(true);
        setMemberToEdit(member);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleSaveMember = async (formData) => {
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));

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
            let updatedMember;
            if (formData._id) {
                // Pass the config object to the post request
                const res = await apiClient.post(`/teams/update/${formData._id}`, data, config);
                updatedMember = res.data;
                setTeamMembers(prev => prev.map(m => m._id === updatedMember._id ? updatedMember : m));
            } else {
                // Pass the config object to the post request
                const res = await apiClient.post('/teams/add', data, config);
                updatedMember = res.data;
                setTeamMembers(prev => [...prev, updatedMember]);
            }
        } catch (error) {
            console.error("Failed to save team member:", error.response?.data?.msg || error.message);
            alert("Failed to save team member.");
        }
        handleCloseModal();
    };

    const handleDeleteMember = async (id) => {
        if (window.confirm('Are you sure you want to remove this team member?')) {
            try {
                await apiClient.delete(`/teams/${id}`);
                setTeamMembers(prev => prev.filter(m => m._id !== id));
            } catch (error) {
                console.error("Failed to delete team member:", error.response?.data?.msg || error.message);
                 alert("Failed to delete team member.");
            }
        }
    };

    const filteredMembers = teamMembers.filter(member => {
        const nameMatch = (member.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const titleMatch = (member.title || '').toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || titleMatch;
    });

    if (isLoading) {
        return <p>Loading team members...</p>;
    }

    return (
        <div>
            {/* Search and Add Button */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                 <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>
                <Button onClick={handleOpenModalForNew} className="mt-4 md:mt-0 w-full md:w-auto bg-teal-600 text-white hover:bg-teal-700 shadow-teal-500/30">
                    <Plus size={20} className="mr-2" />Add Team Member
                </Button>
            </div>
            {/* Grid for members */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredMembers.map(member => (
                    <AdminTeamMemberCard key={member._id} member={member} onEdit={handleOpenModalForEdit} onDelete={handleDeleteMember} />
                ))}
            </div>
            {/* Modal */}
            <TeamMemberFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveMember}
                memberToEdit={memberToEdit}
            />
        </div>
    );
};
export default AdminTeam;