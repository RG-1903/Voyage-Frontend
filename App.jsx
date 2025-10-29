import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import apiClient from './api/apiClient';
import { decodeJwt } from './utils/helpers';
import Layout from './components/layout/Layout';
import HomePage from './components/pages/HomePage';
import PackagesPage from './components/pages/PackagesPage';
import AboutPage from './components/pages/AboutPage';
import ContactPage from './components/pages/ContactPage';
import PackageDetailsPage from './components/pages/PackageDetailsPage';
import LandingPage from './components/auth/LandingPage';
import AdminLoginPage from './components/auth/AdminLoginPage';
import UserLoginPage from './components/auth/UserLoginPage';
import UserRegisterPage from './components/auth/UserRegisterPage';
import AdminPage from './components/admin/AdminPage';
import MyBookingsPage from './components/pages/MyBookingsPage';
import PaymentPage from './components/pages/PaymentPage';
import MyProfilePage from './components/pages/MyProfilePage';

// --- Protected Route Components (Remain the same) ---
const UserProtectedRoute = ({ isUserAuthenticated, children }) => {
  if (!isUserAuthenticated) { return <Navigate to="/login" replace />; }
  return children;
};
const AdminProtectedRoute = ({ isAdminAuthenticated, children }) => {
  if (!isAdminAuthenticated) { return <Navigate to="/admin/login" replace />; }
  return children;
};

export default function App() {
  const [packages, setPackages] = useState([]);
  const [clientRequests, setClientRequests] = useState([]); // Keep for Admin
  // --- REMOVED: Testimonials and Team state here ---
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(!!sessionStorage.getItem('adminAuthToken'));
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(!sessionStorage.getItem('adminAuthToken') && !!sessionStorage.getItem('userAuthToken'));
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Still used for initial package load
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingDataForPayment, setBookingDataForPayment] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // --- User Authentication Logic (Remains the same) ---
  useEffect(() => {
    const userToken = sessionStorage.getItem('userAuthToken');
    if (isUserAuthenticated && userToken) {
      const userData = decodeJwt(userToken);
      if (userData) setCurrentUser(userData.user);
    } else {
      setCurrentUser(null);
    }
  }, [isUserAuthenticated]);

  // --- Initial Data Load (Only Packages now) ---
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // --- Only fetch packages initially ---
        const pkgsRes = await apiClient.get('/packages');
        setPackages(pkgsRes.data);
      } catch (error) {
        console.error("Failed to load initial package data", error);
        setPackages([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []); // Run only once on mount

  // --- Admin Data Load (Only requests now) ---
  useEffect(() => {
    if (isAdminAuthenticated) {
      apiClient.get('/requests').then(res => setClientRequests(res.data)).catch(err => console.error("Failed to load admin requests data", err));
      // Packages are already loaded initially, others loaded in specific admin components
    }
  }, [isAdminAuthenticated]);

  // --- User Profile Fetch (Remains the same) ---
  useEffect(() => {
    if (isUserAuthenticated) {
      apiClient.get('/profile').then(res => setUserProfile(res.data)).catch(err => console.error("Failed to fetch user profile", err));
    } else {
      setUserProfile(null);
    }
  }, [isUserAuthenticated]);

  // --- Navigation Logic (Remains the same) ---
   useEffect(() => {
    if (isAdminAuthenticated && !location.pathname.startsWith('/admin')) {
        navigate('/admin', { replace: true });
    }
    if (isUserAuthenticated && ['/landing', '/login', '/register'].includes(location.pathname)) {
        navigate('/', { replace: true });
    }
  }, [location.pathname, isAdminAuthenticated, isUserAuthenticated, navigate]);

  // --- Handler Functions ---
  const handleAdminLogin = (token) => { sessionStorage.removeItem('userAuthToken'); sessionStorage.setItem('adminAuthToken', token); setIsAdminAuthenticated(true); setIsUserAuthenticated(false); navigate('/admin'); };
  const handleUserLogin = (token) => { sessionStorage.removeItem('adminAuthToken'); sessionStorage.setItem('userAuthToken', token); setIsUserAuthenticated(true); setIsAdminAuthenticated(false); navigate('/'); };
  const handleLogout = () => { sessionStorage.removeItem('adminAuthToken'); sessionStorage.removeItem('userAuthToken'); setIsAdminAuthenticated(false); setIsUserAuthenticated(false); setCurrentUser(null); navigate('/landing'); };
  const handleViewDetails = (pkg) => { setSelectedPackage(pkg); navigate('/package-details'); };
  const handleProceedToPayment = (bd) => { setBookingDataForPayment(bd); navigate('/payment'); };
  const handleProfileUpdate = (up) => { setUserProfile(up); };
  const handleAddRequest = async (d) => { await apiClient.post('/requests/add', d); };
  // Keep handleAddTestimonial logic, it will be passed down to HomePage
  const handleAddTestimonial = async (d) => { await apiClient.post('/testimonials/add', d); /* Optionally refetch testimonials on HomePage after adding */ };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div></div>
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* --- Layout Routes --- */}
        <Route element={<Layout userProfile={userProfile} handleLogout={handleLogout} isUserAuthenticated={isUserAuthenticated} isAdminAuthenticated={isAdminAuthenticated} currentUser={currentUser} />}>
          {/* HomePage now fetches its own testimonials */}
          <Route path="/" element={<HomePage onViewDetails={handleViewDetails} packages={packages} handleAddTestimonial={handleAddTestimonial} currentUser={currentUser} isUserAuthenticated={isUserAuthenticated} />} />
          <Route path="/packages" element={<PackagesPage packages={packages} onViewDetails={handleViewDetails} />} />
          {/* AboutPage now fetches its own data */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/package-details" element={selectedPackage ? <PackageDetailsPage pkg={selectedPackage} handleProceedToPayment={handleProceedToPayment} isUserAuthenticated={isUserAuthenticated} currentUser={currentUser} /> : <Navigate to="/packages" />} />
          <Route path="/my-bookings" element={<UserProtectedRoute isUserAuthenticated={isUserAuthenticated}><MyBookingsPage /></UserProtectedRoute>} />
          <Route path="/my-profile" element={<UserProtectedRoute isUserAuthenticated={isUserAuthenticated}><MyProfilePage onProfileUpdate={handleProfileUpdate} /></UserProtectedRoute>} />
          <Route path="/payment" element={bookingDataForPayment ? <UserProtectedRoute isUserAuthenticated={isUserAuthenticated}><PaymentPage bookingData={bookingDataForPayment} handleAddRequest={handleAddRequest} /></UserProtectedRoute> : <Navigate to="/packages" />} />
        </Route>

        {/* --- Standalone Routes (Remain the same) --- */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<UserLoginPage handleUserLogin={handleUserLogin} />} />
        <Route path="/register" element={<UserRegisterPage />} />
        <Route path="/admin/login" element={<AdminLoginPage handleLogin={handleAdminLogin} />} />

        {/* Admin Section (Props adjusted) */}
        <Route path="/admin/*" element={
          <AdminProtectedRoute isAdminAuthenticated={isAdminAuthenticated}>
            <AdminPage
              handleLogout={handleLogout}
              packages={packages} // Still pass packages from initial load
              setPackages={setPackages} // Allow AdminPackages to update
              clientRequests={clientRequests} // Pass requests fetched for admin
              setClientRequests={setClientRequests} // Allow AdminRequests to update
              // TeamMembers are now fetched within AdminTeam
            />
          </AdminProtectedRoute>
        } />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}