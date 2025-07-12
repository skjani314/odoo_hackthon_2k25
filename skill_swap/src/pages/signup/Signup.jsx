import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Assuming toast is available globally or imported from react-toastify

// --- Import Reusable Components (assuming these are in their respective files) ---
// You will need to adjust these import paths based on your actual folder structure.
import AuthForm from '../../components/AuthForm/AuthForm.jsx'; // Assuming AuthForm component path

import { AuthContext } from '../../Context/AuthContext/AuthContext.jsx'; // Central AuthContext
import Button from '../../components/ui/button/Button.jsx';
import InputField from '../../components/ui/input_field/InputField.jsx';
import LoadingSpinner from '../../components/ui/Loading/Loading.jsx';
import ErrorMessage from '../../components/ui/Error/Error.jsx';


/**
 * SignupPage Component
 *
 * This component represents the dedicated signup (registration) page for the application.
 * It uses the reusable AuthForm component to display the signup form and
 * handles the registration logic by interacting with the AuthContext,
 * sending data to the backend API.
 */
const SignupPage = () => {
  // Access the signup function and current user from AuthContext.
  const { signup, user, loadingAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  // State to manage loading status during the signup process.
  const [isLoading, setIsLoading] = useState(false);
  // State to store and display any signup-related error messages.
  const [error, setError] = useState('');

  // Effect to redirect if a user is already logged in or if AuthContext is still loading
  useEffect(() => {
    if (!loadingAuth && user) {
      console.log("User already logged in, redirecting to /my-profile.");
      navigate('/my-profile'); // Redirect to my-profile if already logged in
    }
  }, [user, loadingAuth, navigate]);

  /**
   * Handles the signup form submission.
   * Calls the 'signup' function from AuthContext with name, email, and password.
   * Manages loading and error states during the asynchronous operation.
   * On successful signup, it navigates to the email verification page.
   * @param {object} formData - Object containing name, email, and password from the form.
   */
  const handleSignup = async ({ name, email, password }) => {
    setIsLoading(true); // Start loading
    setError(''); // Clear previous errors

    try {
      // Call the signup function provided by AuthContext, which now interacts with the backend.
      const result = await signup(name, email, password);

      if (result.success) {
        console.log('Signup successful, navigating to email verification.');
        // Navigate to the email verification page, passing the email via state
        navigate('/emailverify', { state: { email: result.emailForVerification || email } });
      } else {
        // If signup failed, set the error message received from AuthContext/backend.
        setError(result.error || 'Signup failed. Please try again.');
        toast.error(result.error || 'Signup failed.'); // Show toast notification
      }
    } catch (err) {
      // Catch any unexpected errors during the signup process (e.g., network issues).
      console.error('Signup error:', err);
      setError('An unexpected error occurred. Please try again.');
      toast.error('An unexpected error occurred during signup.'); // Show toast notification
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
    // Container for the signup page content.
    // 'py-8' provides vertical padding around the form.
    // 'flex justify-center items-center min-h-[calc(100vh-120px)]' for centering.
    <div className="py-8 flex justify-center items-center min-h-[calc(100vh-120px)]">
      {/*
        AuthForm Component:
        - 'type="signup"': Configures AuthForm to display as a signup form.
        - 'onSubmit={handleSignup}': Passes the signup handler to AuthForm.
        - 'isLoading={isLoading}': Passes the loading state to AuthForm to disable button/show spinner.
        - 'error={error}': Passes any error message to AuthForm for display.
      */}
      <AuthForm type="signup" onSubmit={handleSignup} isLoading={isLoading} error={error} />
    </div>
  );
};

export default SignupPage;
