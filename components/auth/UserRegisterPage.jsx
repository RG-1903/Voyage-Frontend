import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import apiClient from '../../api/apiClient';

const UserRegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false); // New state to control UI flow
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const { name, email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onOtpChange = e => setOtp(e.target.value);

    // Step 1: Handle sending the OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        try {
            // This new route just sends the OTP
            await apiClient.post('/auth/send-register-otp', { name, email, password });
            setIsLoading(false);
            setSuccess('OTP sent to your email! Please check your inbox.');
            setIsOtpSent(true); // Show the OTP field
        } catch (err) {
            setIsLoading(false);
            setError(err.response?.data?.msg || 'Failed to send OTP. Please try again.');
        }
    };

    // Step 2: Handle verifying the OTP and completing registration
    const handleVerifyAndRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        try {
            // This new route verifies OTP and creates the user
            await apiClient.post('/auth/verify-register', { name, email, password, otp });
            setIsLoading(false);
            setSuccess('Registration successful! Please log in.');
            // Navigate to login after a short delay
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setIsLoading(false);
            setError(err.response?.data?.msg || 'Registration failed. Invalid or expired OTP.');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow"></div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full max-w-md bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500/20 rounded-full mb-4 border border-teal-500/30">
                        <UserPlus className="w-8 h-8 text-teal-300" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Create Account</h1>
                    <p className="text-slate-400">Start your adventure with us today.</p>
                </div>

                {/* This form handles both steps */}
                <form onSubmit={isOtpSent ? handleVerifyAndRegister : handleSendOtp}>
                    
                    {/* --- Step 1 Fields (Name, Email, Password) --- */}
                    <motion.div animate={{ display: isOtpSent ? 'none' : 'block' }}>
                        <div className="mb-4 relative">
                            <label className="block text-slate-300 text-sm font-medium mb-2" htmlFor="name">Full Name</label>
                            <UserPlus className="absolute left-3 top-10 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                name="name"
                                value={name}
                                onChange={onChange}
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div className="mb-4 relative">
                            <label className="block text-slate-300 text-sm font-medium mb-2" htmlFor="email">Email Address</label>
                            <Mail className="absolute left-3 top-10 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div className="mb-6 relative">
                            <label className="block text-slate-300 text-sm font-medium mb-2" htmlFor="password">Password</label>
                            <Lock className="absolute left-3 top-10 w-5 h-5 text-slate-400" />
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                                placeholder="••••••••"
                                minLength="6"
                                required
                            />
                        </div>
                    </motion.div>

                    {/* --- Step 2 Field (OTP) --- */}
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: isOtpSent ? 'auto' : 0, opacity: isOtpSent ? 1 : 0 }}
                    >
                        <div className="mb-6 relative">
                            <label className="block text-slate-300 text-sm font-medium mb-2" htmlFor="otp">Enter OTP</label>
                            <Lock className="absolute left-3 top-10 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                name="otp"
                                value={otp}
                                onChange={onOtpChange}
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                                placeholder="123456"
                                maxLength="6"
                                required={isOtpSent}
                            />
                        </div>
                    </motion.div>


                    {/* --- Error/Success Messages --- */}
                    {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg mb-4 text-sm">
                            <AlertCircle size={16} /> {error}
                        </motion.div>
                    )}
                    {success && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-green-400 bg-green-500/10 p-3 rounded-lg mb-4 text-sm">
                            <CheckCircle size={16} /> {success}
                        </motion.div>
                    )}

                    {/* --- Submit Button (Text changes based on state) --- */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-teal-500/30 hover:bg-teal-600 transition duration-300 ease-in-out flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin mr-2" />
                        ) : (
                            isOtpSent ? 'Verify & Register' : 'Send OTP'
                        )}
                        {!isLoading && !isOtpSent && <ArrowRight className="ml-2 w-5 h-5" />}
                    </button>
                </form>

                <p className="text-center text-slate-400 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-teal-400 hover:text-teal-300 transition">
                        Login here
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default UserRegisterPage;