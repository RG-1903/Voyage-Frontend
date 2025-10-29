import React, { useState, useEffect } from 'react';
import { Send, Check, Eye, X } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { cn } from '../../utils/helpers';
import Button from '../ui/Button';

const ResponseModal = ({ message, onClose, onRespond, isViewing = false }) => {
    // FIX: Added a fallback '|| ""' to ensure the textarea always has a valid value.
    const [responseText, setResponseText] = useState(
        isViewing 
        ? (message.responseText || '') 
        : `Hi ${message.name},\n\nThank you for reaching out to Voyage! \n\n[Your response here]\n\nBest regards,\nThe Voyage Team`
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        onRespond(message._id, message.email, responseText);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 overflow-y-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{isViewing ? 'View Response' : 'Respond to Message'}</h2>
                    <p className="text-sm text-slate-500 mb-4">To: {message.name} ({message.email})</p>
                    
                    <h4 className="font-semibold text-slate-800 mt-4 mb-1">Original Message:</h4>
                    <p className="text-sm text-slate-700 font-semibold mb-1">Subject: {message.subject}</p>
                    <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md mb-4 border max-h-32 overflow-y-auto">
                        {message.message}
                    </div>
                    
                    <h4 className="font-semibold text-slate-800 mt-6 mb-1">{isViewing ? 'Your Response:' : 'Your Response:'}</h4>
                    <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        rows="8"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                        readOnly={isViewing}
                    />
                     {isViewing && message.respondedAt && (
                        <p className="text-xs text-slate-400 mt-2">Responded on: {new Date(message.respondedAt).toLocaleString()}</p>
                    )}
                </div>
                <div className="bg-slate-50 px-6 py-4 flex justify-end gap-4 rounded-b-lg border-t">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        {isViewing ? 'Close' : 'Cancel'}
                    </Button>
                    {!isViewing && (
                        <Button type="submit">
                            <Send size={16} className="mr-2"/> Send Response
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
};

const AdminResponses = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isViewing, setIsViewing] = useState(false);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const { data } = await apiClient.get('/contact');
                setMessages(data);
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, []);
    
    const handleRespond = async (messageId, userEmail, responseText) => {
        try {
            const { data } = await apiClient.post(`/contact/respond/${messageId}`, { responseText, userEmail });
            setMessages(messages.map(msg => msg._id === messageId ? data.message : msg));
            closeModal();
        } catch (error) {
            console.error("Failed to send response:", error);
            alert("Failed to send response.");
        }
    };
    
    const openModal = (message, viewMode = false) => {
        setSelectedMessage(message);
        setIsViewing(viewMode);
    };
    
    const closeModal = () => {
        setSelectedMessage(null);
        setIsViewing(false);
    };

    if (loading) return <div className="text-center">Loading messages...</div>;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {selectedMessage && <ResponseModal message={selectedMessage} onClose={closeModal} onRespond={handleRespond} isViewing={isViewing} />}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">From</th>
                            <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Subject & Message</th>
                            <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {messages.map((msg) => (
                            <tr key={msg._id}>
                                <td className="p-4 whitespace-nowrap"><div className="font-medium text-slate-900">{msg.name}</div><div className="text-sm text-slate-500">{msg.email}</div></td>
                                <td className="p-4"><p className="font-semibold">{msg.subject}</p><p className="text-sm text-slate-600 truncate max-w-sm">{msg.message}</p></td>
                                <td className="p-4 whitespace-nowrap"><span className={cn("px-3 py-1 text-xs font-semibold rounded-full", msg.status === 'Responded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800')}>{msg.status}</span></td>
                                <td className="p-4 whitespace-nowrap">
                                    {msg.status === 'Pending' ? (
                                        <Button onClick={() => openModal(msg, false)} size="sm"><Send size={16} className="mr-2"/> Respond</Button>
                                    ) : (
                                        <Button onClick={() => openModal(msg, true)} size="sm" variant="secondary"><Eye size={16} className="mr-2"/> View</Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminResponses;