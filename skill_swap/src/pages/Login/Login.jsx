import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Assuming toast is available globally or imported from react-toastify

// --- Import Reusable Components (adjust paths as per your folder structure) ---
import AuthForm from '../../components/AuthForm/AuthForm.jsx'; 

import { AuthContext } from '../../Context/AuthContext/AuthContext.jsx'; // Central AuthContext
import Button from '../../components/ui/button/Button.jsx';
import InputField from '../../components/ui/input_field/InputField.jsx';
import LoadingSpinner from '../../components/ui/Loading/Loading.jsx';
import ErrorMessage from '../../components/ui/Error/Error.jsx';

/**
 * LoginPage Component
 *
 * This component represents the dedicated login page for the application.
 * It uses the reusable AuthForm component to display the login form and
 * handles the authentication logic by interacting with the AuthContext,
 * sending data to the backend API.
 */
const LoginPage = () => {
  // Access the login function and current user from AuthContext.
  const { login, user, loadingAuth } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize useNavigate hook

  // State to manage loading status during the login process.
  const [isLoading, setIsLoading] = useState(false);
  // State to store and display any login-related error messages.
  const [error, setError] = useState('');

  // Effect to redirect if a user is already logged in or if AuthContext is still loading
  useEffect(() => {
    if (!loadingAuth && user) {
      console.log("User already logged in, redirecting to /my-profile.");
      navigate('/my-profile'); // Use navigate for react-router-dom
    }
  }, [user, loadingAuth, navigate]); // Add navigate to dependency array

  /**
   * Handles the login form submission.
   * Calls the 'login' function from AuthContext with email and password.
   * Manages loading and error states during the asynchronous operation.
   * On successful login, it triggers a redirect via the useEffect.
   * @param {object} formData - Object containing email and password from the form.
   */
  const handleLogin = async ({ email, password }) => {
    setIsLoading(true); // Start loading
    setError(''); // Clear previous errors

    try {
      // Call the login function provided by AuthContext, which now interacts with the backend.
      const result = await login(email, password);

      if (!result.success) {
        // If login failed, set the error message.
        setError(result.error || 'Login failed. Please check your credentials.');
        toast.error(result.error || 'Login failed.'); // Show toast notification
      } else {
        // If login was successful, AuthProvider's setUser would have updated the user.
        // The useEffect above will then handle the redirect to /my-profile.
        console.log('Login successful.');
      }
    } catch (err) {
      // Catch any unexpected errors during the login process (e.g., network issues).
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
      toast.error('An unexpected error occurred during login.'); // Show toast notification
    } finally {
      setIsLoading(false); // End loading
    }
  };

  // Display loading spinner if AuthContext is still determining auth status
  if (loadingAuth) {
    return <LoadingSpinner />;
  }

  // If user is already logged in (checked after loadingAuth is false),
  // this component won't render due to the useEffect redirect.
  // However, as a fallback or if the redirect hasn't happened yet,
  // we can show a spinner or a message.
  if (user) {
    return <LoadingSpinner />; // Or a message like "Redirecting..."
  }

  return (
    // Container for the login page content.
    // 'py-8' provides vertical padding around the form.
    // 'flex justify-center items-center min-h-[calc(100vh-120px)]' for centering.
    <div className="py-8 flex justify-center items-center min-h-[calc(100vh-120px)]">
      {/*
        AuthForm Component:
        - 'type="login"': Configures AuthForm to display as a login form.
        - 'onSubmit={handleLogin}': Passes the login handler to AuthForm.
        - 'isLoading={isLoading}': Passes the loading state to AuthForm to disable button/show spinner.
        - 'error={error}': Passes any error message to AuthForm for display.
      */}
      <AuthForm type="login" onSubmit={handleLogin} isLoading={isLoading} error={error} />
    </div>
  );
};

export default LoginPage;
