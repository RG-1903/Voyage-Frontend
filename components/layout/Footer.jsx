import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    
    const handleSubscribe = (e) => {
        e.preventDefault();
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 3000);
    };

    const footerLinks = [
        { name: "Home", path: "/" },
        { name: "Packages", path: "/packages" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" }
    ];

    return (
        <footer className="bg-slate-900 text-slate-300">
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    <div>
                        <h3 className="text-3xl font-bold mb-4 text-teal-400">Voyage</h3>
                        <p className="text-slate-400">Crafting unforgettable journeys to the world's most wondrous destinations.</p>
                        <div className="flex space-x-4 mt-6">
                            <a href="#" className="text-slate-400 hover:text-teal-400 transition"><Facebook size={24} /></a>
                            <a href="#" className="text-slate-400 hover:text-teal-400 transition"><Twitter size={24} /></a>
                            <a href="#" className="text-slate-400 hover:text-teal-400 transition"><Instagram size={24} /></a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg mb-4 text-white">Quick Links</h4>
                        <ul className="space-y-3">
                            {footerLinks.map(link => (
                                <li key={link.name}>
                                    <Link to={link.path} className="text-slate-400 hover:text-teal-400 transition">{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg mb-4 text-white">Support</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-slate-400 hover:text-teal-400 transition">FAQ</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-teal-400 transition">Privacy Policy</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-teal-400 transition">Terms of Service</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg mb-4 text-white">Stay Connected</h4>
                        <p className="text-slate-400 mb-4">Join our newsletter for exclusive deals and travel inspiration.</p>
                        <form onSubmit={handleSubscribe}>
                            <div className="flex">
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" className="w-full rounded-l-full px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                                <button type="submit" className="bg-teal-500 px-4 rounded-r-full hover:bg-teal-600 text-white">→</button>
                            </div>
                            {subscribed && <p className="text-green-400 text-sm mt-2">Thank you for subscribing!</p>}
                        </form>
                    </div>
                </div>
                <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500">
                    <p>© {new Date().getFullYear()} Voyage. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;