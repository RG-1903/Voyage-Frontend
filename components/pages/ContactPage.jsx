import React, { useState } from 'react';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';
import Button from '../ui/Button';
import InputField from '../ui/InputField';
import apiClient from '../../api/apiClient';

const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '', subject: '' });
    const [formState, setFormState] = useState({ status: 'idle', message: '' });

    const handleChange = e => {
        setFormData({...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormState({ status: 'loading', message: '' });
        try {
            const { data } = await apiClient.post('/contact/add', formData);
            setFormState({ status: 'success', message: data.msg });
            setFormData({ name: '', email: '', message: '', subject: '' });
            setTimeout(() => setFormState({ status: 'idle', message: '' }), 4000);
        } catch (error) {
            setFormState({ status: 'error', message: error.response?.data?.msg || 'Something went wrong.' });
        }
    };

    return (
        <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
            <div className="container mx-auto px-6">
                <h1 className="text-5xl font-extrabold text-center mb-6 text-slate-800">Get In Touch</h1>
                <p className="text-xl text-slate-600 text-center mb-16 max-w-3xl mx-auto">Have questions or ready to book your next adventure? We're here to help!</p>
                
                <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-3xl font-bold mb-2 text-slate-800">Contact Information</h2>
                        <p className="text-slate-600 mb-8">Fill out the form, or use our contact details below.</p>
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="bg-teal-100 p-3 rounded-full mr-4"><MapPin size={20} className="text-teal-600"/></div>
                                <div><h4 className="font-semibold text-lg">Our Office</h4><p className="text-slate-600">123 Voyage Avenue, Wanderlust City, Surat</p></div>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-teal-100 p-3 rounded-full mr-4"><Mail size={20} className="text-teal-600"/></div>
                                <div><h4 className="font-semibold text-lg">Email Us</h4><p className="text-slate-600">hello@voyage.com</p></div>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-teal-100 p-3 rounded-full mr-4"><Phone size={20} className="text-teal-600"/></div>
                                <div><h4 className="font-semibold text-lg">Call Us</h4><p className="text-slate-600">+91 (261) 567-8901</p></div>
                            </div>
                             <div className="flex items-start">
                                <div className="bg-teal-100 p-3 rounded-full mr-4"><Clock size={20} className="text-teal-600"/></div>
                                <div><h4 className="font-semibold text-lg">Business Hours</h4><p className="text-slate-600">Mon - Fri: 9am - 6pm</p></div>
                            </div>
                        </div>
                    </div>
                    <div>
                         <div className="rounded-lg mb-6 h-48 flex items-center justify-center overflow-hidden">
                             <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119064.0410019485!2d72.7398380216669!3d21.15914251433994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e59411d1563%3A0xfe455829093e838!2sSurat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                                width="100%" 
                                height="100%" 
                                style={{ border:0 }} 
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade">
                            </iframe>
                        </div>
                         <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField name="name" placeholder="Your Name" required value={formData.name} onChange={handleChange} />
                                <InputField name="email" type="email" placeholder="Your Email" required value={formData.email} onChange={handleChange} />
                            </div>
                            <InputField name="subject" placeholder="Subject" required value={formData.subject} onChange={handleChange} />
                            <div><textarea name="message" rows="5" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition" required value={formData.message} onChange={handleChange} placeholder="Your Message"></textarea></div>
                            <Button type="submit" className="w-full bg-teal-600 text-white hover:bg-teal-700 shadow-teal-500/30" disabled={formState.status === 'loading'}>
                                {formState.status === 'loading' ? 'Sending...' : 'Send Message'}
                            </Button>
                            {formState.status === 'success' && <p className="text-green-600 mt-2">{formState.message}</p>}
                            {formState.status === 'error' && <p className="text-red-600 mt-2">{formState.message}</p>}
                         </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;