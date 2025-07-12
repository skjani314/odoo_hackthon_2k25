import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, AuthContext } from './Context/AuthContext/AuthContext.jsx'; // Central AuthProvider and Context
import Login from './pages/Login/Login.jsx'; // Assuming Login.jsx is in Auth folder
import Signup from './pages/signup/Signup.jsx'; // Assuming Signup.jsx is in Auth folder
import VerifyEmail from './pages/email verify/EmailVerify.jsx'; // Assuming EmailVerify.jsx is in Auth folder
import ForgotPassword from './pages/forgetpassword/forgetpasswordpage.jsx'; // Assuming ForgotPassword.jsx is in Auth folder
import ResetPassword from './pages/resetPassword/ResetPassword.jsx'; // Assuming ResetPassword.jsx is in Auth folder

import AdminPage from './pages/adminpage/AdminPage.jsx';
import Layout from './components/layout/Layout.jsx';
import BrowseSkillsPage from './pages/BrowseSkills/BrowseSkill.jsx';
import MyProfilePage from './pages/MyProfilePage/MyProfilePage.jsx';
import PublicProfilePage from './pages/PublicProfilePage/PublicProfilepage.jsx';

// --- API Base URL (Centralized for Frontend) ---
const API_BASE_URL = 'http://localhost:5000/api'; // Assuming your backend runs on port 5000

// --- Protected Route Component ---
/**
 * ProtectedRoute Component
 *
 * This component guards routes that require user authentication.
 * If the user is not authenticated, it redirects them to the login page.
 * It also shows a loading spinner while authentication status is being determined.
 */
const ProtectedRoute = ({ children, allowedRoles = ['user', 'admin'] }) => {
  const { user, loadingAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loadingAuth && !user) {
      // If not loading and no user, redirect to login
      toast.info('Please log in to access this page.');
      navigate('/login', { replace: true });
    } else if (!loadingAuth && user && !allowedRoles.includes(user.role)) {
      // If user is logged in but doesn't have the required role
      toast.error('You do not have permission to view this page.');
      navigate('/', { replace: true }); // Redirect to home or a suitable fallback
    }
  }, [user, loadingAuth, navigate, allowedRoles]);

  if (loadingAuth || !user || !allowedRoles.includes(user?.role)) {
    // Show a loading spinner while auth status is being determined
    // Or if user is not authenticated / not authorized, to prevent flickering before redirect
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return children; // Render the protected component
};

// --- Main App Component ---
const App = () => {
  return (
      <AuthProvider>
        <Layout>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<BrowseSkillsPage />} />
            <Route path="/home" element={<BrowseSkillsPage />} />
            <Route path="/browse-skills" element={<BrowseSkillsPage />} />
            <Route path="/profile/:userId" element={<PublicProfilePage />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/emailverify" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} /> {/* This route will expect a token query param */}

            {/* Protected Routes for Authenticated Users */}
            <Route
              path="/my-profile"
              element={
                <ProtectedRoute allowedRoles={['user', 'admin']}>
                  <MyProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Protected Route for Admin Users */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route for unmatched paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
  );
};

export default App;
