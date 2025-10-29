import React, { useState } from 'react';
import { CheckCircle, XCircle, Search, Trash2, FileText } from 'lucide-react';
import { cn } from '../../utils/helpers';
import apiClient from '../../api/apiClient';
import Button from '../ui/Button';

// A simple modal to show invoice details
const InvoiceModal = ({ request, onClose }) => (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Invoice</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><XCircle size={24} /></button>
            </div>
            <div className="border-t pt-4">
                <p><strong>Transaction ID:</strong> {request.transactionId}</p>
                <p><strong>Client:</strong> {request.clientName} ({request.clientEmail})</p>
                <p><strong>Package:</strong> {request.packageName}</p>
                <p><strong>Guests:</strong> {request.guests}</p>
                <p><strong>Date:</strong> {new Date(request.date).toLocaleDateString()}</p>
                <hr className="my-4"/>
                <p className="text-xl font-bold text-right">Total Amount: ₹{request.totalAmount.toLocaleString('en-IN')}</p>
                <p className="text-right text-sm text-green-600">Status: {request.paymentStatus}</p>
            </div>
        </div>
    </div>
);


const AdminRequests = ({ clientRequests = [], setClientRequests }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [invoiceRequest, setInvoiceRequest] = useState(null);

    const handleRequestStatusChange = async (id, newStatus) => {
        try {
            const { data: updated } = await apiClient.post(`/requests/update/${id}`, { status: newStatus });
            setClientRequests(prev => prev.map(req => (req._id === updated._id ? updated : req)));
        } catch (error) {
            console.error("Failed to update request status:", error);
        }
    };

    const handleDeleteRequest = async (id) => {
        if (window.confirm('Are you sure you want to permanently delete this request? This action cannot be undone.')) {
            try {
                await apiClient.delete(`/requests/${id}`);
                setClientRequests(prev => prev.filter(req => req._id !== id));
            } catch (error) {
                console.error("Failed to delete request:", error.response?.data?.msg || error.message);
                alert("Failed to delete request.");
            }
        }
    };

    const filteredRequests = clientRequests.filter(req => 
        (req.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (req.clientEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (req.packageName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {invoiceRequest && <InvoiceModal request={invoiceRequest} onClose={() => setInvoiceRequest(null)} />}
            
            <div className="p-4 border-b border-slate-200">
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or package..."
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
                            <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Client Info</th>
                            <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Package & Guests</th>
                            <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {filteredRequests.map((req, index) => (
                            <tr key={req._id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50 hover:bg-slate-100'}>
                                <td className="p-4 whitespace-nowrap">
                                    <div className="font-medium text-slate-900">{req.clientName}</div>
                                    <div className="text-sm text-slate-500">{req.clientEmail}</div>
                                </td>
                                <td className="p-4 whitespace-nowrap text-slate-600">
                                    <div>{req.packageName}</div>
                                    <div className="text-sm text-slate-500">{req.guests} Guest(s)</div>
                                </td>
                                <td className="p-4 whitespace-nowrap">
                                    <span className={cn(
                                        "px-3 py-1 text-xs font-semibold rounded-full",
                                        req.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                        req.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                        req.status === 'Cancelled' ? 'bg-gray-100 text-gray-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    )}>
                                        {req.status}
                                    </span>
                                </td>
                                <td className="p-4 whitespace-nowrap">
                                    <div className="flex space-x-2">
                                        {req.status === 'Pending' && (
                                            <>
                                                <button onClick={() => handleRequestStatusChange(req._id, 'Approved')} className="p-2 text-green-600 hover:bg-green-100 rounded-full" title="Approve">
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button onClick={() => handleRequestStatusChange(req._id, 'Rejected')} className="p-2 text-red-600 hover:bg-red-100 rounded-full" title="Reject">
                                                    <XCircle size={18} />
                                                </button>
                                            </>
                                        )}
                                        <button onClick={() => setInvoiceRequest(req)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full" title="View Invoice">
                                            <FileText size={18} />
                                        </button>
                                        <button onClick={() => handleDeleteRequest(req._id)} className="p-2 text-gray-500 hover:bg-gray-200 rounded-full" title="Delete">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminRequests;