/*
* FILE: src/components/auth/UserRegisterPage.jsx
* REBUILT: Now matches your teal theme and implements 2-step OTP.
*/
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import apiClient from '../../api/apiClient';
import Button from '../ui/Button';

const UserRegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
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
            await apiClient.post('/auth/send-register-otp', { name, email, password });
            setIsLoading(false);
            setSuccess('OTP sent to your email! Please check your inbox.');
            setIsOtpSent(true);
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
            await apiClient.post('/auth/verify-register', { name, email, password, otp });
            setIsLoading(false);
            setSuccess('Registration successful! Please log in.');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setIsLoading(false);
            setError(err.response?.data?.msg || 'Registration failed. Invalid or expired OTP.');
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
              <UserPlus size={50} className="text-teal-300 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-white">Create Account</h1>
              <p className="text-slate-300 mt-2">Start your adventure with us today.</p>
            </div>
    
            <motion.form
              variants={formVariants}
              initial="hidden"
              animate="visible"
              onSubmit={isOtpSent ? handleVerifyAndRegister : handleSendOtp}
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

              {/* --- Step 1 Fields (Name, Email, Password) --- */}
              <motion.div 
                animate={{ 
                  height: isOtpSent ? 0 : 'auto', 
                  opacity: isOtpSent ? 0 : 1,
                  display: isOtpSent ? 'none' : 'block'
                }}
                className="space-y-6"
              >
                <motion.div variants={itemVariants} className="relative">
                  <UserPlus
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={20}
                  />
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={name}
                    onChange={onChange}
                    placeholder="Full Name"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/10 text-white placeholder-slate-300 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                  />
                </motion.div>
                <motion.div variants={itemVariants} className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={20}
                  />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    placeholder="Email Address"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/10 text-white placeholder-slate-300 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                  />
                </motion.div>
                <motion.div variants={itemVariants} className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={20}
                  />
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    placeholder="Password"
                    minLength="6"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/10 text-white placeholder-slate-300 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                  />
                </motion.div>
              </motion.div>
    
              {/* --- Step 2 Field (OTP) --- */}
              <motion.div
                initial={{ height: 0, opacity: 0, display: 'none' }}
                animate={{ 
                  height: isOtpSent ? 'auto' : 0, 
                  opacity: isOtpSent ? 1 : 0,
                  display: isOtpSent ? 'block' : 'none'
                }}
                className="relative"
              >
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={20}
                />
                <input
                  id="otp"
                  type="text"
                  name="otp"
                  value={otp}
                  onChange={onOtpChange}
                  placeholder="Enter OTP"
                  maxLength="6"
                  required={isOtpSent}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 text-white placeholder-slate-300 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                />
              </motion.div>

              {/* --- Submit Button (Text changes based on state) --- */}
              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full text-lg bg-teal-600 text-white hover:bg-teal-500 shadow-lg shadow-teal-500/30 py-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : (
                    isOtpSent ? 'Verify & Register' : 'Send OTP'
                  )}
                </Button>
              </motion.div>
            </motion.form>
            <p className="text-center text-sm text-slate-300 mt-8">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-teal-300 hover:text-teal-200 hover:underline"
              >
                Login here
              </Link>
            </p>
          </motion.div>
        </div>
      )
};

export default UserRegisterPage;