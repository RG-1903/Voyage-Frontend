import React, { useState } from 'react';
import { LayoutDashboard, Package, UserCheck, LogOut, Users, MessageSquare } from 'lucide-react';
import { cn } from '../../utils/helpers';
import AdminDashboard from './AdminDashboard';
import AdminPackages from './AdminPackages';
import AdminRequests from './AdminRequests';
import AdminTeam from './AdminTeam'; // This component will fetch its own data now
import AdminUserManagement from './AdminUserManagement';
import AdminResponses from './AdminResponses';

const AdminPage = ({
    packages, setPackages,
    clientRequests, setClientRequests,
    // --- REMOVED: teamMembers, setTeamMembers ---
    handleLogout
}) => {
    const [adminView, setAdminView] = useState('Dashboard');

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard },
        { name: 'Packages', icon: Package },
        { name: 'Requests', icon: UserCheck },
        { name: 'Team', icon: Users },
        { name: 'Users', icon: Users },
        { name: 'Responses', icon: MessageSquare }
    ];

    const renderView = () => {
        switch (adminView) {
            case 'Packages':
                return <AdminPackages packages={packages} setPackages={setPackages} />;
            case 'Requests':
                return <AdminRequests clientRequests={clientRequests} setClientRequests={setClientRequests} />;
            case 'Team':
                // --- REMOVED: Props passed to AdminTeam ---
                return <AdminTeam />;
            case 'Users':
                return <AdminUserManagement />;
            case 'Responses':
                return <AdminResponses />;
            case 'Dashboard':
            default:
                return <AdminDashboard packages={packages} clientRequests={clientRequests} setAdminView={setAdminView} />;
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="flex">
                {/* Sidebar (Remains the same) */}
                <aside className="w-64 bg-white shadow-lg h-screen sticky top-0 flex flex-col border-r border-slate-200">
                    <div className="p-6 border-b border-slate-200">
                        <h1 className="text-2xl font-bold text-teal-600">Voyage Admin</h1>
                    </div>
                    <nav className="flex-grow pt-6">
                        {navItems.map(item => (
                            <button
                                key={item.name}
                                onClick={() => setAdminView(item.name)}
                                className={cn(
                                    "w-full flex items-center px-6 py-3 text-left transition-colors",
                                    adminView === item.name ? "bg-teal-50 text-teal-600 border-r-4 border-teal-500 font-semibold" : "text-slate-600 hover:bg-slate-100"
                                )}
                            >
                                <item.icon size={20} className="mr-3" />
                                <span>{item.name}</span>
                            </button>
                        ))}
                    </nav>
                    <div className="p-6 border-t border-slate-200">
                        <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2 font-semibold text-red-500 bg-red-100 rounded-lg hover:bg-red-200 transition-colors">
                            <LogOut size={20} className="mr-2" />
                            Logout
                        </button>
                    </div>
                </aside>
                {/* Main Content Area (Remains the same) */}
                <main className="flex-1 p-10">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-800">{adminView}</h1>
                    </header>
                    {renderView()}
                </main>
            </div>
        </div>
    );
};

export default AdminPage;