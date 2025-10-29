import React, { useState, useEffect } from 'react';
import { Search, UserX, UserCheck } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { cn } from '../../utils/helpers';

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await apiClient.get('/users/all');
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleToggleBlock = async (userId) => {
        try {
            const { data: updatedUser } = await apiClient.post(`/users/toggle-block/${userId}`);
            setUsers(users.map(user => user._id === userId ? updatedUser : user));
        } catch (error) {
            console.error("Failed to update user status:", error);
            alert("Failed to update user status.");
        }
    };

    const filteredUsers = users.filter(user =>
        (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="text-center">Loading users...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-slate-200">
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">User</th>
                            <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Registered On</th>
                            <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {filteredUsers.map((user) => (
                            <tr key={user._id}>
                                <td className="p-4 whitespace-nowrap">
                                    <div className="font-medium text-slate-900">{user.name}</div>
                                    <div className="text-sm text-slate-500">{user.email}</div>
                                </td>
                                <td className="p-4 whitespace-nowrap text-slate-600">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 whitespace-nowrap">
                                    <span className={cn(
                                        "px-3 py-1 text-xs font-semibold rounded-full",
                                        user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                    )}>
                                        {user.isBlocked ? 'Blocked' : 'Active'}
                                    </span>
                                </td>
                                <td className="p-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleToggleBlock(user._id)}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-1 text-sm rounded-md transition-colors",
                                            user.isBlocked 
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                                        )}
                                        title={user.isBlocked ? 'Unblock User' : 'Block User'}
                                    >
                                        {user.isBlocked ? <UserCheck size={16} /> : <UserX size={16} />}
                                        {user.isBlocked ? 'Unblock' : 'Block'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUserManagement;