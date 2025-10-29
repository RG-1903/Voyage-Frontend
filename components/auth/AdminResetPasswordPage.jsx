import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Key, ArrowRight, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import apiClient from '../../api/apiClient';

const AdminResetPasswordPage = () => {
    const [formData, setFormData] = useState({ otp: '', newPassword: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get email from previous page's state
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            // If no email, redirect back
            setError('No email address provided. Please start over.');
            setTimeout(() => navigate('/admin/forgot-password'), 2000);
        }
    }, [email, navigate]);

    const { otp, newPassword } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        try {
            await apiClient.post('/auth/admin-reset-password', { email, otp, newPassword });
            setIsLoading(false);
            setSuccess('Password reset successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/admin/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to reset password. Invalid or expired OTP.');
            setIsLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-6">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Set New Password</h1>
                    <p className="text-slate-400">Enter the OTP sent to {email || 'your email'}.</p>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="mb-4 relative">
                        <label className="block text-slate-300 text-sm font-medium mb-2" htmlFor="otp">One-Time Password (OTP)</label>
                        <Lock className="absolute left-3 top-10 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            name="otp"
                            value={otp}
                            onChange={onChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                            placeholder="123456"
                            required
                        />
                    </div>
                    <div className="mb-6 relative">
                        <label className="block text-slate-300 text-sm font-medium mb-2" htmlFor="newPassword">New Password</label>
                        <Key className="absolute left-3 top-10 w-5 h-5 text-slate-400" />
                        <input
                            type="password"
                            name="newPassword"
                            value={newPassword}
                            onChange={onChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                            placeholder="••••••••"
                            minLength="6"
                            required
                        />
                    </div>

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

                    <button
                        type="submit"
                        disabled={isLoading || !email}
                        className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-red-500/30 hover:bg-red-700 transition duration-300 ease-in-out flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Reset Password'}
                        {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
                    </button>
                </form>
                
                <p className="text-center text-slate-400 mt-6">
                    <Link to="/admin/login" className="font-medium text-red-400 hover:text-red-300 transition">
                        Back to Login
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default AdminResetPasswordPage;