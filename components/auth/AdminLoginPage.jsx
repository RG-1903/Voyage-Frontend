/*
* FILE: src/components/auth/AdminLoginPage.jsx
* UPDATED: Added console.log for debugging
*/
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Key, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import apiClient from '../../api/apiClient';
import Button from '../ui/Button';

const AdminLoginPage = ({ handleLogin }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { username, password } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    // --- UPDATED onSubmit ---
    const onSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // --- DEBUG: Log the data being sent ---
        console.log("Attempting admin login with:", { username, password }); 
        // ------------------------------------

        try {
            const res = await apiClient.post('/auth/admin', { username, password });

            // --- DEBUG: Log the successful response ---
            console.log("Admin login successful:", res.data);
            // ---------------------------------------

            handleLogin(res.data.token);
        } catch (err) {
            
            // --- DEBUG: Log the error details ---
            console.error("Admin login failed:", err.response?.data || err.message);
            // -----------------------------------

            setError(err.response?.data?.msg || 'Login Failed. Please try again.');
            setIsLoading(false);
        }
    };
    // --- End of UPDATED onSubmit ---


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
              <Shield size={50} className="text-red-400 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-white">Admin Portal</h1>
              <p className="text-slate-300 mt-2">Enter your credentials to continue.</p>
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
              <motion.div variants={itemVariants} className="relative">
                <Shield
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={20}
                />
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={username}
                  onChange={onChange}
                  placeholder="Username (Email)"
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
                  id="password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  placeholder="Password"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/10 text-white placeholder-slate-300 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                />
              </motion.div>
              
              <div className="text-right -mt-2">
                  <Link to="/admin/forgot-password" className="text-sm font-semibold text-red-400 hover:text-red-300 hover:underline">
                      Forgot Password?
                  </Link>
              </div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full text-lg bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-500/30 py-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </motion.div>
            </motion.form>
            <p className="text-center text-sm text-slate-300 mt-8">
              Not an admin?{' '}
              <Link
                to="/landing"
                className="font-semibold text-red-400 hover:text-red-300 hover:underline"
              >
                Return to portal selection
              </Link>
            </p>
          </motion.div>
        </div>
    );
};

export default AdminLoginPage;