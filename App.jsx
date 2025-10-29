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
  const [clientRequests, setClientRequests] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(!!sessionStorage.getItem('adminAuthToken'));
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(!sessionStorage.getItem('adminAuthToken') && !!sessionStorage.getItem('userAuthToken'));
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingDataForPayment, setBookingDataForPayment] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userToken = sessionStorage.getItem('userAuthToken');
    if (isUserAuthenticated && userToken) {
      const userData = decodeJwt(userToken);
      if (userData) setCurrentUser(userData.user);
    } else {
      setCurrentUser(null);
    }
  }, [isUserAuthenticated]);

  useEffect(() => {
    const loadPublicData = async () => {
      setIsLoading(true);
      try {
        const [pkgsRes, testsRes, teamRes] = await Promise.allSettled([
          apiClient.get('/packages'),
          apiClient.get('/testimonials'),
          apiClient.get('/teams')
        ]);
        if (pkgsRes.status === 'fulfilled') setPackages(pkgsRes.value.data); else setPackages([]);
        if (testsRes.status === 'fulfilled') setTestimonials(testsRes.value.data); else setTestimonials([]);
        if (teamRes.status === 'fulfilled') setTeamMembers(teamRes.value.data); else setTeamMembers([]);
      } catch (error) { console.error("Failed to load public data", error); }
      finally { setIsLoading(false); }
    };
    loadPublicData();
  }, []);

  useEffect(() => {
    if (isAdminAuthenticated) {
      apiClient.get('/requests').then(res => setClientRequests(res.data)).catch(err => console.error("Failed to load admin data", err));
    }
  }, [isAdminAuthenticated]);

  useEffect(() => {
    if (isUserAuthenticated) {
      apiClient.get('/profile').then(res => setUserProfile(res.data)).catch(err => console.error("Failed to fetch user profile", err));
    } else {
      setUserProfile(null);
    }
  }, [isUserAuthenticated]);
  
  useEffect(() => {
    if (isAdminAuthenticated && !location.pathname.startsWith('/admin')) {
        navigate('/admin', { replace: true });
    }
    if (isUserAuthenticated && ['/landing', '/login', '/register'].includes(location.pathname)) {
        navigate('/', { replace: true });
    }
  }, [location.pathname, isAdminAuthenticated, isUserAuthenticated, navigate]);

  const handleAdminLogin = (token) => {
    sessionStorage.removeItem('userAuthToken');
    sessionStorage.setItem('adminAuthToken', token);
    setIsAdminAuthenticated(true);
    setIsUserAuthenticated(false);
    navigate('/admin');
  };
  
  const handleUserLogin = (token) => {
    sessionStorage.removeItem('adminAuthToken');
    sessionStorage.setItem('userAuthToken', token);
    setIsUserAuthenticated(true);
    setIsAdminAuthenticated(false);
    navigate('/');
  };

  const handleLogout = () => {
      sessionStorage.removeItem('adminAuthToken');
      sessionStorage.removeItem('userAuthToken');
      setIsAdminAuthenticated(false);
      setIsUserAuthenticated(false);
      setCurrentUser(null);
      navigate('/landing');
  };

  const handleViewDetails = (pkg) => { setSelectedPackage(pkg); navigate('/package-details'); };
  const handleProceedToPayment = (bd) => { setBookingDataForPayment(bd); navigate('/payment'); };
  const handleProfileUpdate = (up) => { setUserProfile(up); };
  const handleAddRequest = async (d) => { await apiClient.post('/requests/add', d); };
  const handleAddTestimonial = async (d) => { await apiClient.post('/testimonials/add', d); };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div></div>
  }
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* --- Group 1: Routes WITH the main layout --- */}
        <Route element={<Layout userProfile={userProfile} handleLogout={handleLogout} isUserAuthenticated={isUserAuthenticated} isAdminAuthenticated={isAdminAuthenticated} currentUser={currentUser} />}>
          <Route path="/" element={<HomePage onViewDetails={handleViewDetails} packages={packages} testimonials={testimonials} handleAddTestimonial={handleAddTestimonial} currentUser={currentUser} />} />
          <Route path="/packages" element={<PackagesPage packages={packages} onViewDetails={handleViewDetails} />} />
          <Route path="/about" element={<AboutPage teamMembers={teamMembers} />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/package-details" element={selectedPackage ? <PackageDetailsPage pkg={selectedPackage} handleProceedToPayment={handleProceedToPayment} isUserAuthenticated={isUserAuthenticated} currentUser={currentUser} /> : <Navigate to="/packages" />} />
          <Route path="/my-bookings" element={<UserProtectedRoute isUserAuthenticated={isUserAuthenticated}><MyBookingsPage /></UserProtectedRoute>} />
          <Route path="/my-profile" element={<UserProtectedRoute isUserAuthenticated={isUserAuthenticated}><MyProfilePage onProfileUpdate={handleProfileUpdate} /></UserProtectedRoute>} />
          <Route path="/payment" element={bookingDataForPayment ? <UserProtectedRoute isUserAuthenticated={isUserAuthenticated}><PaymentPage bookingData={bookingDataForPayment} handleAddRequest={handleAddRequest} /></UserProtectedRoute> : <Navigate to="/packages" />} />
        </Route>

        {/* --- Group 2: Standalone routes WITHOUT the main layout --- */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<UserLoginPage handleUserLogin={handleUserLogin} />} />
        <Route path="/register" element={<UserRegisterPage />} />
        <Route path="/admin/login" element={<AdminLoginPage handleLogin={handleAdminLogin} />} />
        
        {/* Admin Section (has its own internal layout) */}
        <Route path="/admin/*" element={<AdminProtectedRoute isAdminAuthenticated={isAdminAuthenticated}><AdminPage handleLogout={handleLogout} packages={packages} setPackages={setPackages} clientRequests={clientRequests} setClientRequests={setClientRequests} teamMembers={teamMembers} setTeamMembers={setTeamMembers} /></AdminProtectedRoute>} />
        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}