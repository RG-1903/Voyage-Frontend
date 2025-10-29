import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import apiClient from '../../api/apiClient';
import Button from '../ui/Button';
import TeamMemberFormModal from './TeamMemberFormModal';

const AdminTeamMemberCard = ({ member, onEdit, onDelete }) => (
    <motion.div layout className="bg-white rounded-lg shadow-md flex items-center p-4 gap-4">
        <img
            src={`http://localhost:5001/${member.image}`}
            alt={member.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-slate-200"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://i.pravatar.cc/150'; }}
        />
        <div className="flex-grow">
            <h3 className="font-bold text-lg text-slate-800">{member.name}</h3>
            <p className="text-sm text-slate-500">{member.title}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
            <button onClick={() => onEdit(member)} className="flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 rounded-md transition-colors"><Edit size={16} className="mr-1"/> Edit</button>
            <button onClick={() => onDelete(member._id)} className="flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 rounded-md transition-colors"><Trash2 size={16} className="mr-1"/> Delete</button>
        </div>
    </motion.div>
);

const AdminTeam = ({ teamMembers = [], setTeamMembers }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [memberToEdit, setMemberToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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

        try {
            if (formData._id) {
                const { data: updated } = await apiClient.post(`/teams/update/${formData._id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
                setTeamMembers(prev => prev.map(m => m._id === updated._id ? updated : m));
            } else {
                const { data: added } = await apiClient.post('/teams/add', data, { headers: { 'Content-Type': 'multipart/form-data' } });
                setTeamMembers(prev => [...prev, added]);
            }
        } catch (error) {
            console.error("Failed to save team member:", error);
        }
        handleCloseModal();
    };

    const handleDeleteMember = async (id) => {
        if (window.confirm('Are you sure you want to remove this team member?')) {
            try {
                await apiClient.delete(`/teams/${id}`);
                setTeamMembers(prev => prev.filter(m => m._id !== id));
            } catch (error) {
                console.error("Failed to delete team member:", error);
            }
        }
    };

    const filteredMembers = teamMembers.filter(member => {
        // THIS IS THE FIX: Check if name and title exist before calling .toLowerCase()
        const nameMatch = (member.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const titleMatch = (member.title || '').toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || titleMatch;
    });

    return (
        <div>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredMembers.map(member => (
                    <AdminTeamMemberCard key={member._id} member={member} onEdit={handleOpenModalForEdit} onDelete={handleDeleteMember} />
                ))}
            </div>
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