import React from 'react';
import { Target, Building } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutPage = ({ teamMembers }) => (
    <div className="pt-32 pb-24 bg-white min-h-screen">
        <div className="container mx-auto px-6">
            <h1 className="text-5xl font-extrabold text-center mb-6 text-slate-800">About Voyage</h1>
            <p className="text-xl text-slate-600 text-center mb-16 max-w-3xl mx-auto">We believe travel is more than just seeing new places. It's about creating lasting memories, forging new connections, and discovering yourself along the way.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
                <div>
                    <img src="https://images.unsplash.com/photo-1522199755839-a2bacb67c546?q=80&w=2072&auto=format&fit=crop" alt="Our Story" className="rounded-2xl shadow-2xl"/>
                </div>
                <div>
                    <h2 className="text-3xl font-bold mb-4 text-teal-600 flex items-center"><Target className="mr-3" /> Our Mission</h2>
                    <p className="text-slate-600 mb-6 leading-relaxed">To craft unique and immersive travel experiences that go beyond the ordinary. We are dedicated to providing exceptional service, promoting sustainable tourism, and sharing our passion for exploration with the world.</p>
                    <h2 className="text-3xl font-bold mb-4 text-teal-600 flex items-center"><Building className="mr-3" /> Our Story</h2>
                    <p className="text-slate-600 leading-relaxed">Founded in 2010 by a group of passionate travelers, Voyage started with a simple idea: to make authentic travel accessible to everyone. From a small office to a globally recognized brand, our commitment to quality and adventure has never wavered.</p>
                </div>
            </div>

            <h2 className="text-4xl font-bold text-center mb-12 text-slate-800">Meet Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                {/* Dynamically render team members from the database */}
                {(teamMembers || []).map((member, i) => (
                    <motion.div
                        key={member._id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="group"
                    >
                        <div className="relative overflow-hidden rounded-2xl">
                            <img 
                                src={`http://localhost:5001/${member.image}`} 
                                alt={member.name} 
                                className="w-full h-80 object-cover rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 text-left text-white">
                                <h3 className="text-xl font-semibold">{member.name}</h3>
                                <p className="text-teal-300">{member.title}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </div>
);

export default AboutPage;