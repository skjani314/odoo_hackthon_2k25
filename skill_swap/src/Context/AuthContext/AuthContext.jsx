import React, { useState, createContext, useEffect } from 'react';
import { toast } from 'react-toastify'; // For notifications

/**
 * API Base URL from environment variables.
 * In a real project, you'd use process.env.REACT_APP_API_BASE_URL
 * For Canvas, we'll hardcode it or derive it.
 */
const API_BASE_URL = 'http://localhost:5000/api'; // Assuming your backend runs on port 5000

/**
 * AuthContext
 *
 * This context provides global access to user authentication status and related functions.
 * It now integrates with the backend API for actual login, signup, OTP verification,
 * password reset, and user session management.
 */
export const AuthContext = createContext(null);

/**
 * AuthProvider
 *
 * This provider component wraps the entire application to make the authentication context
 * available to all its child components. It manages the user's login state, JWT token,
 * and interacts with the backend authentication endpoints.
 *
 * Props:
 * - children: React nodes to be rendered within the provider's scope.
 */
export const AuthProvider = ({ children }) => {
  // State to hold the current user object.
  const [user, setUser] = useState(null);
  // State to indicate if the authentication status is currently being loaded (e.g., initial check).
  const [loadingAuth, setLoadingAuth] = useState(true); // Set to true initially for session check

  // Effect to check for existing token/session on component mount
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Attempt to fetch user details using the token
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            toast.success(`Welcome back, ${data.user.name}!`);
          } else {
            // Token might be invalid or expired, clear it
            localStorage.removeItem('token');
            setUser(null);
            console.error('Failed to re-authenticate session:', response.statusText);
          }
        } catch (error) {
          console.error('Network error during session check:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoadingAuth(false); // Authentication check complete
    };

    checkSession();
  }, []); // Run only once on mount

  // --- Authentication Functions (Backend Integrated) ---

  const login = async (email, password) => {
    setLoadingAuth(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token); // Store JWT
        setUser(data.user);
        toast.success(data.message || 'Logged in successfully!');
        return { success: true, user: data.user };
      } else {
        toast.error(data.message || 'Login failed.');
        return { success: false, error: data.message || 'Login failed.' };
      }
    } catch (error) {
      console.error('Login network error:', error);
      toast.error('Network error during login. Please try again.');
      return { success: false, error: 'Network error.' };
    } finally {
      setLoadingAuth(false);
    }
  };

  const signup = async (name, email, password) => {
    setLoadingAuth(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // For signup, we don't immediately set the user or token,
        // as email verification is required.
        toast.success(data.message || 'Signup successful! Please verify your email.');
        return { success: true, emailForVerification: data.emailForVerification };
      } else {
        toast.error(data.message || 'Signup failed.');
        return { success: false, error: data.message || 'Signup failed.' };
      }
    } catch (error) {
      console.error('Signup network error:', error);
      toast.error('Network error during signup. Please try again.');
      return { success: false, error: 'Network error.' };
    } finally {
      setLoadingAuth(false);
    }
  };

  const verifyOtp = async (email, otp) => {
    setLoadingAuth(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token); // Store JWT after verification
        setUser(data.user); // Set user as verified in context
        toast.success(data.message || 'Email verified successfully!');
        return { success: true, user: data.user };
      } else {
        toast.error(data.message || 'OTP verification failed.');
        return { success: false, error: data.message || 'OTP verification failed.' };
      }
    } catch (error) {
      console.error('Verify OTP network error:', error);
      toast.error('Network error during OTP verification. Please try again.');
      return { success: false, error: 'Network error.' };
    } finally {
      setLoadingAuth(false);
    }
  };

  const sendOtp = async (email) => {
    setLoadingAuth(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'OTP sent successfully!');
        return { success: true };
      } else {
        toast.error(data.message || 'Failed to send OTP.');
        return { success: false, error: data.message || 'Failed to send OTP.' };
      }
    } catch (error) {
      console.error('Send OTP network error:', error);
      toast.error('Network error during OTP resend. Please try again.');
      return { success: false, error: 'Network error.' };
    } finally {
      setLoadingAuth(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoadingAuth(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Password reset link sent!');
        return { success: true };
      } else {
        toast.error(data.message || 'Failed to send reset link.');
        return { success: false, error: data.message || 'Failed to send reset link.' };
      }
    } catch (error) {
      console.error('Forgot password network error:', error);
      toast.error('Network error during forgot password. Please try again.');
      return { success: false, error: 'Network error.' };
    } finally {
      setLoadingAuth(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    setLoadingAuth(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Password reset successfully!');
        return { success: true };
      } else {
        toast.error(data.message || 'Failed to reset password.');
        return { success: false, error: data.message || 'Failed to reset password.' };
      }
    } catch (error) {
      console.error('Reset password network error:', error);
      toast.error('Network error during password reset. Please try again.');
      return { success: false, error: 'Network error.' };
    } finally {
      setLoadingAuth(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token'); // Clear JWT
    setUser(null); // Clear user from context
    toast.info('Logged out successfully!');
    console.log('Logged out.');
  };

  const contextValue = { user, loadingAuth, login, signup, verifyOtp, sendOtp, forgotPassword, resetPassword, logout, setUser };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
