import React, { useState, useEffect } from 'react';
import { Shield, ShieldOff, User, Mail, Calendar } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { cn } from '../../utils/helpers';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await apiClient.get('/users/all');
                setUsers(data);
            } catch (err) {
                setError('Failed to fetch users.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleToggleBlock = async (userId) => {
        try {
            await apiClient.put(`/users/toggle-block/${userId}`);
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user._id === userId ? { ...user, isBlocked: !user.isBlocked } : user
                )
            );
        } catch (err) {
            alert('Failed to update user status.');
        }
    };

    if (isLoading) return <div>Loading users...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">User</th>
                            <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Email</th>
                            <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Registered On</th>
                            <th className="p-4 text-center text-sm font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {users.map(user => (
                            <tr key={user._id}>
                                <td className="p-4 whitespace-nowrap font-medium text-slate-900 flex items-center gap-2"><User size={16} />{user.name}</td>
                                <td className="p-4 whitespace-nowrap text-slate-600 flex items-center gap-2"><Mail size={16} />{user.email}</td>
                                <td className="p-4 whitespace-nowrap text-slate-500 flex items-center gap-2"><Calendar size={16} />{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td className="p-4 whitespace-nowrap text-center">
                                    <span className={cn("px-3 py-1 text-xs font-semibold rounded-full",
                                        user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                    )}>
                                        {user.isBlocked ? 'Blocked' : 'Active'}
                                    </span>
                                </td>
                                <td className="p-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleToggleBlock(user._id)}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-1.5 text-sm rounded-md font-semibold",
                                            user.isBlocked ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
                                        )}
                                    >
                                        {user.isBlocked ? <Shield size={16} /> : <ShieldOff size={16} />}
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

export default AdminUsers;