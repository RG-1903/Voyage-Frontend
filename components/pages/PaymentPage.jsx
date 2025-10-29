import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, CreditCard, Calendar, User, AlertTriangle, CheckCircle } from 'lucide-react';
import InputField from '../ui/InputField';
import Button from '../ui/Button';

const PaymentPage = ({ bookingData, handleAddRequest }) => {
    const [cardDetails, setCardDetails] = useState({
        cardName: bookingData.clientName || '',
        cardNumber: '',
        expiry: '',
        cvc: '',
    });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        if (!cardDetails.cardName.trim()) newErrors.cardName = 'Name on card is required.';
        if (!/^\d{16}$/.test(cardDetails.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Enter a valid 16-digit card number.';
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiry)) newErrors.expiry = 'Use MM/YY format.';
        if (!/^\d{3,4}$/.test(cardDetails.cvc)) newErrors.cvc = 'Enter a valid CVC.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'cardNumber') {
            const formattedValue = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
            setCardDetails({ ...cardDetails, [name]: formattedValue.slice(0, 19) });
        } else if (name === 'expiry') {
            const formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2');
             setCardDetails({ ...cardDetails, [name]: formattedValue.slice(0, 5) });
        } else {
            setCardDetails({ ...cardDetails, [name]: value });
        }
    };

    const totalAmount = bookingData.price * bookingData.guests;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setStatus('loading');
        
        const finalBookingData = {
            clientName: bookingData.clientName,
            clientEmail: bookingData.clientEmail,
            clientPhone: bookingData.phone,
            packageName: bookingData.title,
            date: bookingData.date,
            guests: Number(bookingData.guests),
            requests: bookingData.requests,
            totalAmount: totalAmount,
            paymentStatus: 'Completed',
            transactionId: `VOYAGE-${Date.now()}`
        };
        
        // Simulate payment processing delay
        setTimeout(async () => {
            try {
                await handleAddRequest(finalBookingData);
                setStatus('success');
            } catch (error) {
                console.error("Booking failed:", error);
                setStatus('error');
            }
        }, 2000);
    };

    return (
        <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
            <div className="container mx-auto px-6">
                <AnimatePresence mode="wait">
                {status === 'success' ? (
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-2xl mx-auto bg-white p-12 rounded-lg shadow-xl">
                        <CheckCircle className="mx-auto text-green-500 mb-4" size={64}/>
                        <h1 className="text-4xl font-bold text-slate-800">Booking Successful!</h1>
                        <p className="text-lg text-slate-600 mt-4">Thank you for choosing Voyage! An email confirmation and your invoice have been sent to <strong>{bookingData.clientEmail}</strong>.</p>
                        <p className="mt-2 text-slate-500">Your adventure to <strong>{bookingData.title}</strong> awaits!</p>
                        <div className="mt-8 flex justify-center gap-4">
                            <Button variant="secondary" onClick={() => navigate('/')}>Go to Homepage</Button>
                            <Button onClick={() => navigate('/my-bookings')}>View My Bookings</Button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h1 className="text-5xl font-extrabold text-center mb-12 text-slate-800">Secure Checkout</h1>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                            <div className="bg-white p-8 rounded-xl shadow-lg">
                                <h2 className="text-2xl font-bold mb-4">Booking Summary</h2>
                                <div className="space-y-3 text-slate-700">
                                    <p><strong>Package:</strong> {bookingData.title}</p>
                                    <p><strong>Date:</strong> {new Date(bookingData.date).toLocaleDateString()}</p>
                                    <p><strong>Guests:</strong> {bookingData.guests}</p>
                                    <p><strong>Contact:</strong> {bookingData.phone}</p>
                                    <hr className="my-3"/>
                                    <p className="text-2xl font-bold">Total: <span className="text-teal-600">₹{totalAmount.toLocaleString('en-IN')}</span></p>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-lg">
                                <h2 className="text-2xl font-bold mb-6">Payment Information</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <InputField label="Name on Card" name="cardName" value={cardDetails.cardName} onChange={handleChange} required icon={User} error={errors.cardName}/>
                                    <InputField label="Card Number" name="cardNumber" value={cardDetails.cardNumber} onChange={handleChange} required icon={CreditCard} placeholder="0000 0000 0000 0000" error={errors.cardNumber}/>
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputField label="Expiry (MM/YY)" name="expiry" value={cardDetails.expiry} onChange={handleChange} required icon={Calendar} placeholder="MM/YY" error={errors.expiry}/>
                                        <InputField label="CVC" name="cvc" value={cardDetails.cvc} onChange={handleChange} required icon={Lock} placeholder="123" error={errors.cvc}/>
                                    </div>
                                     {status === 'error' && (
                                        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg"><AlertTriangle size={20} /><span>Payment failed. Please check details and try again.</span></div>
                                    )}
                                    <Button type="submit" className="w-full text-lg mt-4" disabled={status === 'loading'}>
                                        {status === 'loading' ? 'Processing...' : `Pay ₹${totalAmount.toLocaleString('en-IN')}`}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PaymentPage;