import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ userProfile, handleLogout, isUserAuthenticated, isAdminAuthenticated, currentUser }) => {
    return (
        <div className="bg-slate-50 text-slate-800 font-sans">
            <Navbar
                isUserAuthenticated={isUserAuthenticated}
                isAdminAuthenticated={isAdminAuthenticated}
                currentUser={currentUser}
                userProfile={userProfile} 
                handleLogout={handleLogout}
            />
            <main>
                {/* The Outlet component from react-router-dom renders the matched child route */}
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;