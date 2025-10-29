import React from 'react';
// FIX 1: Import IndianRupee instead of DollarSign
import { Package, UserCheck, CheckCircle, IndianRupee, Plus } from 'lucide-react';
import { cn } from '../../utils/helpers';

const AdminDashboard = ({ packages = [], clientRequests = [], setAdminView }) => {
    const pendingRequests = clientRequests.filter(r => r.status === 'Pending').length;
    const approvedRequests = clientRequests.filter(r => r.status === 'Approved').length;
    
    const estimatedRevenue = clientRequests
        .filter(r => r.status === 'Approved')
        .reduce((acc, req) => {
            const pkg = packages.find(p => p.title === req.packageName);
            return acc + (pkg ? (pkg.price * (req.guests || 1)) : 0);
        }, 0);

    return (
        <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                    <div className="p-3 bg-blue-100 rounded-full mr-4"><Package size={32} className="text-blue-600"/></div>
                    <div><p className="text-sm text-slate-500">Total Packages</p><p className="text-2xl lg:text-3xl font-bold text-slate-800">{packages.length}</p></div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-full mr-4"><UserCheck size={32} className="text-yellow-600"/></div>
                    <div><p className="text-sm text-slate-500">Pending Requests</p><p className="text-2xl lg:text-3xl font-bold text-slate-800">{pendingRequests}</p></div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                    <div className="p-3 bg-green-100 rounded-full mr-4"><CheckCircle size={32} className="text-green-600"/></div>
                    <div><p className="text-sm text-slate-500">Approved Requests</p><p className="text-2xl lg:text-3xl font-bold text-slate-800">{approvedRequests}</p></div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                    {/* FIX 2: Replace the DollarSign component with IndianRupee */}
                    <div className="p-3 bg-indigo-100 rounded-full mr-4"><IndianRupee size={32} className="text-indigo-600"/></div>
                    <div><p className="text-sm text-slate-500">Est. Revenue</p><p className="text-2xl xl:text-3xl font-bold text-slate-800">₹{estimatedRevenue.toLocaleString('en-IN')}</p></div>
                </div>
            </div>

            {/* Recent Activity and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-xl mb-4 text-slate-700">Recent Booking Requests</h3>
                    <div className="space-y-4">
                        {clientRequests.slice(0, 5).map(req => (
                            <div key={req._id} className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-slate-50">
                                <div><span className="font-semibold">{req.clientName}</span> requested <span className="text-slate-600">{req.packageName}</span></div>
                                <span className={cn("px-3 py-1 text-xs font-semibold rounded-full", req.status === 'Approved' ? 'bg-green-100 text-green-800' : req.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800')}>{req.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-xl mb-4 text-slate-700">Quick Actions</h3>
                    <div className="space-y-3">
                        <button onClick={() => setAdminView('Packages')} className="w-full flex items-center px-4 py-2 font-semibold text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors">
                            <Plus size={18} className="mr-2"/> Add New Package
                        </button>
                        <button onClick={() => setAdminView('Requests')} className="w-full flex items-center px-4 py-2 font-semibold text-yellow-700 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                            <UserCheck size={18} className="mr-2"/> Manage Requests
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;