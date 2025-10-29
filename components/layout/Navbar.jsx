import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn, getAssetUrl } from '../../utils/helpers';
import Button from '../ui/Button';
import { UserCircle, ChevronDown } from 'lucide-react';

const Navbar = ({ isUserAuthenticated, isAdminAuthenticated, currentUser, userProfile, handleLogout }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;

    const isOverHero = currentPath === '/' && !isScrolled;

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [currentPath]);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Packages", path: "/packages" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" }
    ];
    
    if (isAdminAuthenticated) {
        navLinks.push({ name: "Admin Dashboard", path: "/admin" });
    }
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <motion.header
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
                isOverHero
                    ? "bg-transparent"
                    : "bg-white/90 backdrop-blur-md shadow-md border-b border-slate-200/80"
            )}
        >
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className={cn("text-3xl font-bold", isOverHero ? "text-white" : "text-teal-600")}>Voyage</Link>
                
                <nav className="hidden md:flex items-center space-x-8">
                    {navLinks.map(link => (
                        <Link key={link.name} to={link.path} className={cn("pb-1 font-medium text-lg relative", currentPath === link.path ? (isOverHero ? "text-white" : "text-teal-600") : (isOverHero ? "text-slate-200 hover:text-white" : "text-slate-600 hover:text-teal-600"))}>
                            {link.name}
                            {currentPath === link.path && <motion.div className={cn("absolute -bottom-1 left-0 right-0 h-0.5", isOverHero ? "bg-white" : "bg-teal-500")} layoutId="underline" />}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center space-x-2">
                    {isAdminAuthenticated ? (
                        <Button variant="primary" onClick={handleLogout} className="hidden md:flex">Logout Admin</Button>
                    ) : isUserAuthenticated ? (
                        <div className="hidden md:flex items-center gap-4 relative">
                            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)} className={cn("flex items-center gap-2 cursor-pointer font-semibold", isOverHero ? "text-white" : "text-slate-700")}>
                                {userProfile && userProfile.profileImage ? (
                                    <img src={getAssetUrl(userProfile.profileImage)} alt=" " className="w-8 h-8 rounded-full object-cover border-2 border-teal-100" />
                                ) : ( <UserCircle /> )}
                                <span>Hi, {currentUser?.name.split(' ')[0]}!</span>
                                <ChevronDown size={18} className={cn("transition-transform", isDropdownOpen && "rotate-180")} />
                            </button>
                            {isDropdownOpen && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10 py-1">
                                    <Link to="/my-profile" className="block px-4 py-2 text-slate-700 hover:bg-slate-100">My Profile</Link>
                                    <Link to="/my-bookings" className="block px-4 py-2 text-slate-700 hover:bg-slate-100">My Bookings</Link>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">Logout</button>
                                </motion.div>
                            )}
                        </div>
                    ) : (
                        <Button onClick={() => navigate('/landing')} variant={isOverHero ? 'secondary' : 'primary'} className="hidden md:flex">Login</Button>
                    )}
                </div>
            </div>
        </motion.header>
    );
};

export default Navbar;