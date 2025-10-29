import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import apiClient from '../../api/apiClient';

const AdminForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        try {
            await apiClient.post('/auth/admin-send-reset-otp', { email });
            setIsLoading(false);
            setSuccess('OTP sent to admin email. You will be redirected to reset it.');
            // Navigate to reset page, passing email in state
            setTimeout(() => {
                navigate('/admin/reset-password', { state: { email } });
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to send OTP. Please check the email.');
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
                    <h1 className="text-3xl font-bold text-white">Reset Password</h1>
                    <p className="text-slate-400">Enter your admin email to receive an OTP.</p>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="mb-4 relative">
                        <label className="block text-slate-300 text-sm font-medium mb-2" htmlFor="email">Admin Username (Email)</label>
                        <Mail className="absolute left-3 top-10 w-5 h-5 text-slate-400" />
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                            placeholder="admin@voyage.com"
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
                        disabled={isLoading}
                        className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-red-500/30 hover:bg-red-700 transition duration-300 ease-in-out flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Send OTP'}
                        {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
                    </button>
                </form>

                <p className="text-center text-slate-400 mt-6">
                    Remembered it?{' '}
                    <Link to="/admin/login" className="font-medium text-red-400 hover:text-red-300 transition">
                        Back to Login
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default AdminForgotPasswordPage;