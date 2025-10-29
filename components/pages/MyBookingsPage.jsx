import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import { cn } from '../../utils/helpers';
import { Package, Calendar, Users, Hash, Info, XCircle } from 'lucide-react';
import Button from '../ui/Button';

const BookingCard = ({ booking, onCancel }) => {
    const getStatusClasses = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
            case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
            case 'Cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };
    
    return (
        <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800">{booking.packageName}</h3>
                        <p className="text-sm text-slate-500">Booked on: {new Date(booking.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={cn("px-4 py-1.5 text-sm font-semibold rounded-full border", getStatusClasses(booking.status))}>
                        {booking.status}
                    </span>
                </div>
                <hr className="my-4"/>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-700">
                    <div className="flex items-center gap-3"><Calendar size={18} className="text-teal-600" /> <strong>Travel Date:</strong> {new Date(booking.date).toLocaleDateString()}</div>
                    <div className="flex items-center gap-3"><Users size={18} className="text-teal-600" /> <strong>Guests:</strong> {booking.guests}</div>
                    <div className="flex items-center gap-3"><Hash size={18} className="text-teal-600" /> <strong>Transaction ID:</strong> {booking.transactionId}</div>
                    <div className="flex items-center gap-3"><Info size={18} className="text-teal-600" /> <strong>Payment:</strong> <span className="font-bold">₹{booking.totalAmount.toLocaleString('en-IN')}</span></div>
                </div>
            </div>
            {(booking.status === 'Pending' || booking.status === 'Approved') && (
                <div className="bg-slate-50 px-6 py-3 text-right">
                    <button onClick={() => onCancel(booking._id)} className="text-sm font-semibold text-red-600 hover:text-red-800 flex items-center gap-2 ml-auto">
                        <XCircle size={16} /> Cancel Booking
                    </button>
                </div>
            )}
        </div>
    );
};

const MyBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const { data } = await apiClient.get('/requests/mybookings');
            setBookings(data);
        } catch (error) {
            console.error("Failed to fetch bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);
    
    const handleCancelBooking = async (bookingId) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await apiClient.post(`/requests/update/${bookingId}`, { status: 'Cancelled' });
                // Refresh the list to show the updated status
                fetchBookings();
            } catch (error) {
                console.error("Failed to cancel booking:", error);
                alert("Could not cancel the booking. Please try again.");
            }
        }
    };

    return (
        <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
            <div className="container mx-auto px-6">
                <h1 className="text-5xl font-extrabold text-center mb-6 text-slate-800">My Bookings</h1>
                <p className="text-xl text-slate-600 text-center mb-16 max-w-3xl mx-auto">Here's a history of all your adventures with Voyage.</p>

                {loading ? (
                    <p className="text-center">Loading your bookings...</p>
                ) : bookings.length > 0 ? (
                    <div className="space-y-8 max-w-4xl mx-auto">
                        {bookings.map(booking => (
                            <BookingCard key={booking._id} booking={booking} onCancel={handleCancelBooking}/>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-slate-500">You haven't booked any packages yet.</p>
                )}
            </div>
        </div>
    );
};

export default MyBookingsPage;