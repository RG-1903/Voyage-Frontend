import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Globe, Users2, Leaf, CheckCircle, ArrowRight, Mail } from 'lucide-react';
import Button from '../ui/Button';
import PackageCard from '../ui/PackageCard';
import apiClient from '../../api/apiClient'; // Import apiClient

// Removed testimonials from props
const HomePage = ({ packages, handleAddTestimonial, onViewDetails, currentUser, isUserAuthenticated }) => {
    const [feedbackData, setFeedbackData] = useState({ name: '', email: '', feedback: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);
    // --- ADDED: State for testimonials and loading ---
    const [testimonials, setTestimonials] = useState([]);
    const [testimonialsLoading, setTestimonialsLoading] = useState(true);
    const navigate = useNavigate();

    // --- ADDED: Fetch testimonials when component mounts ---
    useEffect(() => {
        const fetchTestimonials = async () => {
            setTestimonialsLoading(true);
            try {
                const res = await apiClient.get('/testimonials');
                setTestimonials(res.data);
            } catch (error) {
                console.error("Failed to fetch testimonials:", error);
                setTestimonials([]);
            } finally {
                setTestimonialsLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    // --- User details pre-fill logic (remains the same) ---
    useEffect(() => {
        if (isUserAuthenticated && currentUser) {
            setFeedbackData(prev => ({ ...prev, name: currentUser.name, email: currentUser.email || '' }));
        } else {
            setFeedbackData({ name: '', email: '', feedback: '' });
        }
    }, [currentUser, isUserAuthenticated]);

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        if (feedbackData.name && feedbackData.feedback) {
            handleAddTestimonial(feedbackData); // Use passed-in handler
            setFeedbackData(prev => ({ ...prev, feedback: '' }));
            setIsSubmitted(true);
            setTimeout(() => setIsSubmitted(false), 3000);
            // Optionally refetch testimonials here by calling fetchTestimonials() again
        }
    };

    const buttonContainerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.4 } } };
    const buttonItemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } } };

    return (
        <>
            {/* Hero Section */}
            <section className="relative h-screen text-white flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center animate-ken-burns"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop')" }}
                    ></div>
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>
                <div className="relative container mx-auto px-6 text-center z-20">
                    <motion.h1 initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, type: 'spring' }} className="text-6xl md:text-8xl font-extrabold leading-tight mb-4 text-shadow-lg">
                        Your Journey Begins Here
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-slate-200 text-shadow">
                        Discover breathtaking destinations and create unforgettable memories.
                    </motion.p>
                    <motion.div variants={buttonContainerVariants} initial="hidden" animate="visible" className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.div variants={buttonItemVariants}>
                            <Button variant="primary" className="text-lg px-8 py-4 w-full sm:w-auto" onClick={() => navigate('/packages')} icon={ArrowRight}>
                                Explore Packages
                            </Button>
                        </motion.div>
                         <motion.div variants={buttonItemVariants}>
                            <Button variant="secondary" className="text-lg px-8 py-4 w-full sm:w-auto" onClick={() => navigate('/contact')} icon={Mail}>
                                Contact Us
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Top Destinations Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <h2 className="text-4xl font-bold text-center mb-4 text-slate-800">Top Destinations</h2>
                        <p className="text-lg text-slate-600 text-center mb-16 max-w-2xl mx-auto">Handpicked by our travel experts for an experience of a lifetime.</p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {(packages || []).slice(0, 3).map((pkg, index) => <PackageCard key={pkg._id || index} pkg={pkg} index={index} onViewDetails={onViewDetails} />)}
                    </div>
                </div>
            </section>

             {/* Why Choose Us Section */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                         <h2 className="text-4xl font-bold text-center mb-4 text-slate-800">Why Choose Voyage?</h2>
                        <p className="text-lg text-slate-600 text-center mb-16 max-w-2xl mx-auto">We don't just sell trips; we craft experiences that last a lifetime, with a personal touch.</p>
                    </motion.div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                         <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="p-6">
                            <div className="mx-auto bg-teal-100 text-teal-600 rounded-full h-20 w-20 flex items-center justify-center mb-6"><Globe size={40} /></div>
                            <h3 className="text-xl font-bold mb-2">Expert-Curated Itineraries</h3>
                            <p className="text-slate-600">Every destination is handpicked and every itinerary is thoughtfully designed by our travel experts.</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="p-6">
                            <div className="mx-auto bg-teal-100 text-teal-600 rounded-full h-20 w-20 flex items-center justify-center mb-6"><Users2 size={40} /></div>
                            <h3 className="text-xl font-bold mb-2">Personalized Service</h3>
                            <p className="text-slate-600">From the first call to your flight home, we provide 24/7 support and personalized attention.</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="p-6">
                            <div className="mx-auto bg-teal-100 text-teal-600 rounded-full h-20 w-20 flex items-center justify-center mb-6"><Leaf size={40} /></div>
                            <h3 className="text-xl font-bold mb-2">Sustainable Travel</h3>
                            <p className="text-slate-600">We are committed to responsible tourism that respects local cultures and protects the environment.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-white">
                 <div className="container mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <h2 className="text-4xl font-bold text-center mb-4 text-slate-800">What Our Travelers Say</h2>
                        <p className="text-lg text-slate-600 text-center mb-16 max-w-2xl mx-auto">Real stories from our adventurers who have explored the world with us.</p>
                    </motion.div>
                    {/* --- Use local testimonials state and loading --- */}
                    {testimonialsLoading ? (
                        <p className="text-center">Loading testimonials...</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {(testimonials || []).map((testimonial, index) => (
                                <motion.div key={testimonial._id || index} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="bg-slate-50 p-8 rounded-2xl border border-slate-200 flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-teal-300 mb-6" fill="currentColor" viewBox="0 0 16 16"><path d="M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388c0-.351.021-.703.062-1.054.062-.527.21-1.036.465-1.498.254-.462.616-.878 1.08-1.218.463-.34.984-.578 1.572-.698.588-.12 1.236-.144 1.915-.043a1 1 0 0 0 .814-.986V3.364a1 1 0 0 0-.943-.999C13.878 2.267 12.98 2.5 12.28 3.01c-.7.51-1.233 1.21-1.6 2.06-.368.85-.56 1.805-.59 2.834H8.5a1 1 0 0 0-1 1v2.442a1 1 0 0 0 1 1H12zm-8 0a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H2.612c0-.351.021-.703.062-1.054.062-.527.21-1.036.465-1.498.254-.462.616-.878 1.08-1.218.463-.34.984-.578 1.572-.698.588-.12 1.236-.144 1.915-.043a1 1 0 0 0 .814-.986V3.364a1 1 0 0 0-.943-.999C5.878 2.267 4.98 2.5 4.28 3.01c-.7.51-1.233 1.21-1.6 2.06-.368.85-.56 1.805-.59 2.834H.5a1 1 0 0 0-1 1v2.442a1 1 0 0 0 1 1H4z" /></svg>
                                    <p className="text-slate-600 italic mb-6 text-base">"{testimonial.feedback}"</p>
                                    <div className="w-12 h-0.5 bg-teal-200 mx-auto"></div>
                                    <h4 className="font-semibold text-slate-800 mt-5 text-md tracking-wider uppercase">{testimonial.name}</h4>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Share Your Story Section */}
            <section className="py-24 bg-slate-50">
                 <div className="container mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="bg-teal-600 rounded-3xl p-12 text-white text-center shadow-2xl shadow-teal-500/30 overflow-hidden relative">
                        {/* Decorative divs */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
                        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/10 rounded-full"></div>
                        <div className="relative z-10">
                            <h2 className="text-4xl font-bold mb-4">Share Your Story</h2>
                            <p className="text-lg text-teal-100 mb-8 max-w-2xl mx-auto">Your feedback inspires us and helps other travelers choose their next great adventure.</p>
                            <AnimatePresence>
                                {isSubmitted ? (
                                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex flex-col items-center justify-center h-48">
                                        <CheckCircle size={64} className="text-white mb-4" />
                                        <p className="text-2xl font-semibold">Thank you for your feedback!</p>
                                    </motion.div>
                                ) : (
                                    <motion.form onSubmit={handleFeedbackSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-xl mx-auto">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <input
                                                type="text"
                                                placeholder="Your Name"
                                                value={feedbackData.name}
                                                onChange={(e) => setFeedbackData({ ...feedbackData, name: e.target.value })}
                                                className="w-full bg-white/20 border border-white/30 rounded-lg px-5 py-3 text-white placeholder-teal-100 focus:outline-none focus:ring-2 focus:ring-white transition disabled:opacity-75 disabled:cursor-not-allowed"
                                                required
                                                disabled={isUserAuthenticated} // Disable if logged in
                                            />
                                            <input
                                                type="email"
                                                placeholder="Your Email (Optional)"
                                                value={feedbackData.email}
                                                onChange={(e) => setFeedbackData({ ...feedbackData, email: e.target.value })}
                                                className="w-full bg-white/20 border border-white/30 rounded-lg px-5 py-3 text-white placeholder-teal-100 focus:outline-none focus:ring-2 focus:ring-white transition disabled:opacity-75 disabled:cursor-not-allowed"
                                                disabled={isUserAuthenticated} // Disable if logged in
                                            />
                                        </div>

                                        <textarea
                                            placeholder="Your Feedback"
                                            value={feedbackData.feedback}
                                            onChange={(e) => setFeedbackData({ ...feedbackData, feedback: e.target.value })}
                                            rows="4"
                                            className="w-full bg-white/20 border border-white/30 rounded-2xl px-5 py-3 mb-6 text-white placeholder-teal-100 focus:outline-none focus:ring-2 focus:ring-white transition"
                                            required
                                        ></textarea>
                                        <Button variant="secondary" type="submit" className="w-full md:w-auto">Submit Feedback</Button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default HomePage;