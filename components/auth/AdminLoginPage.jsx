import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import Button from '../ui/Button';
import { Shield, User, Lock } from 'lucide-react';

const AdminLoginPage = ({ handleLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const { data } = await apiClient.post('/auth/login', { username, password });
            handleLogin(data.token);
        } catch (err) {
            setError(err.response?.data?.msg || 'Invalid username or password.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const formVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

    return (
        <div className="min-h-screen w-full overflow-hidden relative flex items-center justify-center p-6">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-cover bg-center animate-ken-burns" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=2070&auto=format&fit=crop')" }} />
                <div className="absolute inset-0 bg-black/50" />
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="relative w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
                <div className="text-center mb-10">
                    <Shield size={50} className="text-slate-300 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold text-white">Admin Portal</h1>
                    <p className="text-slate-300 mt-2">Please enter your credentials to continue.</p>
                </div>
                <motion.form variants={formVariants} initial="hidden" animate="visible" onSubmit={handleSubmit} className="space-y-6">
                    {error && <motion.p className="bg-red-500/30 border border-red-500/50 text-white text-center p-3 rounded-lg text-sm">{error}</motion.p>}
                    <motion.div variants={itemVariants} className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                        <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required className="w-full pl-12 pr-4 py-3 bg-white/10 text-white placeholder-slate-300 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition" />
                    </motion.div>
                    <motion.div variants={itemVariants} className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full pl-12 pr-4 py-3 bg-white/10 text-white placeholder-slate-300 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition" />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Button type="submit" className="w-full text-lg bg-slate-700 text-white hover:bg-slate-600 shadow-lg shadow-slate-800/30 py-3" disabled={isLoading}>
                            {isLoading ? 'Verifying...' : 'Sign In'}
                        </Button>
                    </motion.div>
                </motion.form>
                 <p className="text-center text-sm text-slate-300 mt-8">
                    Not an admin? <Link to="/landing" className="font-semibold text-teal-300 hover:text-teal-200 hover:underline">Return to portal selection</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLoginPage;