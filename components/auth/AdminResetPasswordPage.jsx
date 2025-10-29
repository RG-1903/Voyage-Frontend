/*
* FILE: src/components/auth/AdminResetPasswordPage.jsx
* REBUILT: New page, now matches the RED admin theme.
*/
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Key, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import apiClient from '../../api/apiClient';
import Button from '../ui/Button';

const AdminResetPasswordPage = () => {
    const [formData, setFormData] = useState({ otp: '', newPassword: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
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

    const formVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
    }
  
    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }

    return (
        <div className="min-h-screen w-full overflow-hidden relative flex items-center justify-center p-6">
          {/* Background */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center animate-ken-burns"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=2070&auto=format&fit=crop')",
              }}
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
    
          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8"
          >
            <div className="text-center mb-10">
              <Key size={50} className="text-red-400 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-white">Set New Password</h1>
              <p className="text-slate-300 mt-2">Enter the OTP sent to your email.</p>
            </div>
    
            <motion.form
              variants={formVariants}
              initial="hidden"
              animate="visible"
              onSubmit={onSubmit}
              className="space-y-6"
            >
              {error && (
                <motion.p 
                  initial={{opacity: 0}} 
                  animate={{opacity: 1}} 
                  className="flex items-center justify-center gap-2 bg-red-500/30 border border-red-500/50 text-white text-center p-3 rounded-lg text-sm"
                >
                  <AlertCircle size={16} /> {error}
                </motion.p>
              )}
              {success && (
                <motion.p 
                  initial={{opacity: 0}} 
                  animate={{opacity: 1}} 
                  className="flex items-center justify-center gap-2 bg-green-500/30 border border-green-500/50 text-white text-center p-3 rounded-lg text-sm"
                >
                  <CheckCircle size={16} /> {success}
                </motion.p>
              )}
              <motion.div variants={itemVariants} className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={20}
                />
                <input
                  id="otp"
                  type="text"
                  name="otp"
                  value={otp}
                  onChange={onChange}
                  placeholder="One-Time Password (OTP)"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/10 text-white placeholder-slate-300 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="relative">
                <Key
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={20}
                />
                <input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={onChange}
                  placeholder="New Password"
                  minLength="6"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/10 text-white placeholder-slate-300 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full text-lg bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-500/30 py-3"
                  disabled={isLoading || !email}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </motion.div>
            </motion.form>
            <p className="text-center text-sm text-slate-300 mt-8">
              <Link
                to="/admin/login"
                className="font-semibold text-red-400 hover:text-red-300 hover:underline"
              >
                Back to Login
              </Link>
            </p>
          </motion.div>
        </div>
    );
};

export default AdminResetPasswordPage;