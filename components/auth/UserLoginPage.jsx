/*
* FILE: src/components/auth/UserLoginPage.jsx
* UPDATED: Corrected API endpoint and loading/error logic.
*/
import React, { useState} from 'react';
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom' 
import apiClient from '../../api/apiClient'
import Button from '../ui/Button'
import { User, Mail, Lock, Loader2, AlertCircle } from 'lucide-react' // Added Loader2 and AlertCircle

const UserLoginPage = ({ handleUserLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      // --- FIX: Corrected API endpoint ---
      const { data } = await apiClient.post('/auth/login', { email, password }) 
      handleUserLogin(data.token)
      // Navigation is now handled in App.jsx after successful login
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid email or password.')
      setIsLoading(false) // Keep loading false on error
    }
  }

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
          <User size={50} className="text-teal-300 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white">Welcome Back!</h1>
          <p className="text-slate-300 mt-2">Sign in to continue your journey.</p>
        </div>

        <motion.form
          variants={formVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit}
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
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
              size={20}
            />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full pl-12 pr-4 py-3 bg-white/10 text-white placeholder-slate-300 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              className="w-full text-lg bg-teal-600 text-white hover:bg-teal-500 shadow-lg shadow-teal-500/30 py-3"
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
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-teal-300 hover:text-teal-200 hover:underline"
          >
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default UserLoginPage