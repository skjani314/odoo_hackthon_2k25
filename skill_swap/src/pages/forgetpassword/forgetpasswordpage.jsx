import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// --- Import Reusable Components (adjust paths as per your folder structure) ---
import { AuthContext } from '../../Context/AuthContext/AuthContext.jsx'; // Central AuthContext
import Button from '../../components/ui/button/Button.jsx';
import InputField from '../../components/ui/input_field/InputField.jsx';
import LoadingSpinner from '../../components/ui/Loading/Loading.jsx';
import ErrorMessage from '../../components/ui/Error/Error.jsx';


/**
 * ForgotPasswordPage Component
 *
 * This page allows users to initiate the password reset process.
 * Users enter their email, and the system sends a password reset link or OTP to that email.
 */
const ForgotPasswordPage = () => {
  // Access the forgotPassword function from AuthContext
  const { forgotPassword, user, loadingAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if user is already logged in
  useEffect(() => {
    if (!loadingAuth && user) {
      console.log("User already logged in, redirecting to home.");
      navigate('/');
    }
  }, [user, loadingAuth, navigate]);

  /**
   * Handles the forgot password form submission.
   * Calls the 'forgotPassword' function from AuthContext.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    if (!email) {
      setError('Please enter your email address.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setSuccessMessage(result.message || 'If an account with that email exists, a password reset link has been sent.');
        // Backend sends a link. User will click it and be redirected to /reset-password.
        // Frontend doesn't need to navigate here immediately.
      } else {
        setError(result.error || 'Failed to send password reset request.');
        toast.error(result.error || 'Failed to send password reset request.');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('An unexpected error occurred. Please try again.');
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // Display loading spinner while auth context is loading
  if (loadingAuth) {
    return <LoadingSpinner />;
  }

  // If user is already logged in, show spinner while redirecting
  if (user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="py-8 flex justify-center items-center min-h-[calc(100vh-120px)]">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Forgot Your Password?</h2>
        <p className="text-gray-600 mb-6">
          Enter your email address below and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <InputField
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@example.com"
            error={error}
            required
          />

          <ErrorMessage message={error} />
          {successMessage && <p className="text-green-600 text-sm mb-4">{successMessage}</p>}

          <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : 'Send Reset Link'}
          </Button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-600">
          Remember your password? <a href="/login" className="text-blue-600 hover:underline">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
