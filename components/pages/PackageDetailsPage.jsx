import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
import InputField from '../ui/InputField';

const PackageDetailsPage = ({ pkg, handleProceedToPayment, isUserAuthenticated, currentUser }) => {
    const [bookingDetails, setBookingDetails] = useState({ phone: '', date: '', guests: 2, requests: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0];

    const handleChange = (e) => setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });

    const handleSubmitToPayment = (e) => {
        e.preventDefault();
        setError('');
        if (!isUserAuthenticated) {
            alert("Please log in to book a package.");
            navigate('/login');
            return;
        }
        if (!bookingDetails.date || !bookingDetails.phone) {
            setError('Please fill in all required fields (date and phone).');
            return;
        }
        const fullBookingData = { ...pkg, ...bookingDetails, clientName: currentUser.name, clientEmail: currentUser.email };
        handleProceedToPayment(fullBookingData);
    };

    return (
        <div className="bg-white pt-32 pb-20">
            <div className="container mx-auto px-6">
                <button onClick={() => navigate('/packages')} className="flex items-center text-teal-600 font-semibold mb-8 hover:underline">
                    <ArrowLeft className="mr-2" size={18}/> Back to Packages
                </button>
                <div className="grid lg:grid-cols-5 gap-12">
                    <div className="lg:col-span-3">
                        <motion.img 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            src={pkg.image && pkg.image.startsWith('http') ? pkg.image : `http://localhost:5001/${pkg.image}`} 
                            alt={pkg.title} 
                            className="w-full h-auto object-cover rounded-2xl shadow-2xl mb-8" 
                        />
                        <h1 className="text-4xl font-bold mb-4 text-slate-800">{pkg.title}</h1>
                        <p className="text-lg text-slate-600 mb-6">{pkg.description}</p>
                        <h3 className="text-2xl font-bold mb-4 text-slate-800">Highlights</h3>
                        <ul className="list-disc list-inside space-y-2 text-slate-700">
                            {(pkg.highlights || []).map((h, i) => <li key={i}>{h}</li>)}
                        </ul>
                    </div>
                    <div className="lg:col-span-2">
                        <div className="bg-slate-50 p-8 rounded-xl shadow-lg sticky top-28">
                            <h2 className="text-3xl font-bold mb-2 text-slate-800">Book Your Trip</h2>
                             <div className="text-3xl font-bold text-teal-600 mb-6">
                                ₹{pkg.price.toLocaleString('en-IN')}
                                <span className="text-lg font-normal text-slate-500">/person</span>
                            </div>
                            <form onSubmit={handleSubmitToPayment} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* FIX: Added the 'min' attribute to the date input */}
                                    <InputField label="Travel Date" name="date" type="date" value={bookingDetails.date} onChange={handleChange} required min={today} />
                                    <InputField label="Guests" name="guests" type="number" min="1" value={bookingDetails.guests} onChange={handleChange} required />
                                </div>
                                <InputField label="Contact Phone" name="phone" type="tel" placeholder="10-digit number" value={bookingDetails.phone} onChange={handleChange} required />
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Special Requests</label>
                                    <textarea name="requests" rows="3" value={bookingDetails.requests} onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"></textarea>
                                </div>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <Button type="submit" className="w-full text-lg mt-4">
                                    <CheckCircle className="mr-2"/> Proceed to Payment
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackageDetailsPage;