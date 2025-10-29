import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import { Edit, Camera, Package, Calendar, Users, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';
import ProfileEditModal from '../ui/ProfileEditModal';

const BookingCard = ({ booking }) => {
    const getStatusClasses = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            case 'Cancelled': return 'bg-gray-100 text-gray-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };
    return (
        <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-5 flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-slate-800">{booking.packageName}</h3>
                    <span className={cn("px-3 py-1 text-xs font-semibold rounded-full", getStatusClasses(booking.status))}>
                        {booking.status}
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-sm text-slate-600">
                    <div className="flex items-center gap-2"><Calendar size={14} /> {new Date(booking.date).toLocaleDateString()}</div>
                    <div className="flex items-center gap-2"><Users size={14} /> {booking.guests} Guest(s)</div>
                </div>
            </div>
        </div>
    );
};

const MyProfilePage = ({ onProfileUpdate }) => {
    const [profile, setProfile] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            const [profileRes, bookingsRes] = await Promise.all([
                apiClient.get('/profile'),
                apiClient.get('/requests/mybookings')
            ]);
            setProfile(profileRes.data);
            setBookings(bookingsRes.data);
        } catch (error) {
            console.error("Failed to fetch profile data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleProfileUpdate = (updatedProfile) => {
        setProfile(updatedProfile);
        onProfileUpdate(updatedProfile); // Update the global App state
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
    }

    if (!profile) {
        return <div className="min-h-screen flex items-center justify-center">Could not load profile.</div>;
    }

    return (
        <>
            <ProfileEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                currentUser={profile}
                onProfileUpdate={handleProfileUpdate}
            />
            <div className="bg-slate-50 min-h-screen">
                <div className="pt-32 pb-24 container mx-auto px-6">
                    <div className="md:flex items-center gap-8 bg-white p-8 rounded-2xl shadow-lg mb-12">
                        <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto md:mx-0 mb-6 md:mb-0 flex-shrink-0 group">
                            <img
                                src={`http://localhost:5001/${profile.profileImage}?key=${Date.now()}`}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover border-4 border-teal-500"
                            />
                            <button onClick={() => setIsEditModalOpen(true)} className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera size={32}/>
                            </button>
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-extrabold text-slate-800">{profile.name}</h1>
                            <p className="text-slate-500 mt-1">{profile.email}</p>
                            <p className="text-slate-700 mt-4 max-w-xl">{profile.bio}</p>
                            <button onClick={() => setIsEditModalOpen(true)} className="flex items-center gap-2 mt-4 text-sm font-semibold text-teal-600 hover:underline mx-auto md:mx-0">
                                <Edit size={16} /> Edit Profile & Password
                            </button>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-8">My Travel Journal</h2>
                        {bookings.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {bookings.map(booking => (
                                    <BookingCard key={booking._id} booking={booking} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center bg-white p-12 rounded-lg shadow-md">
                                <Package size={48} className="mx-auto text-slate-400 mb-4" />
                                <h3 className="text-xl font-semibold text-slate-700">No Adventures Yet</h3>
                                <p className="text-slate-500 mt-2">Your booked trips will appear here once you've made a booking.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyProfilePage;