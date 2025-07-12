import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

// --- Import Reusable Components (adjust paths as per your folder structure) ---
import { AuthContext } from '../../Context/AuthContext/AuthContext.jsx'; // Central AuthContext
import Button from '../../components/ui/button/Button.jsx';
import InputField from '../../components/ui/input_field/InputField.jsx';
import LoadingSpinner from '../../components/ui/Loading/Loading.jsx';
import ErrorMessage from '../../components/ui/Error/Error.jsx';


/**
 * EmailVerificationPage Component
 *
 * This page allows users to verify their email address by entering an OTP (One-Time Password).
 * It expects the user's email to be passed via router state (e.g., after signup).
 * Upon successful verification, it redirects the user to the home page.
 */
const EmailVerificationPage = () => {
  // Access verifyOtp, sendOtp, user, and loadingAuth from AuthContext
  const { verifyOtp, sendOtp, user, loadingAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from router state or default to user's email if available and unverified
  // This ensures the email is persistent even on refresh if user is in unverified state
  const emailForVerification = location.state?.email || (user && !user.isVerified ? user.email : null);

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  // Redirect if already verified or if no email to verify after auth loads
  useEffect(() => {
    if (loadingAuth) return; // Wait for auth to load

    if (user && user.isVerified) {
      console.log("User already verified, redirecting to home.");
      toast.success("Email already verified. Redirecting to home.");
      navigate('/'); // Redirect to home if already verified
    } else if (!emailForVerification) {
      console.log("No email for verification, redirecting to signup.");
      toast.warn("No email provided for verification. Please sign up first.");
      navigate('/signup'); // Redirect to signup if no email to verify
    }
  }, [user, loadingAuth, emailForVerification, navigate]);


  /**
   * Handles the OTP verification form submission.
   * Calls the 'verifyOtp' function from AuthContext.
   * @param {Event} e - The form submission event.
   */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!otp) {
      setError('Please enter the OTP.');
      setIsLoading(false);
      return;
    }

    if (!emailForVerification) {
      setError('Email for verification is missing. Please go back to signup.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await verifyOtp(emailForVerification, otp);
      if (result.success) {
        // AuthContext's verifyOtp should have updated the user.isVerified flag
        // The useEffect above will handle the redirect to home.
        // toast.success is handled by AuthContext already.
      } else {
        setError(result.error || 'Invalid OTP. Please try again.');
        toast.error(result.error || 'Invalid OTP.');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError('An unexpected error occurred during verification.');
      toast.error('An unexpected error occurred during verification.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles the resend OTP request.
   * Calls the 'sendOtp' function from AuthContext.
   */
  const handleResendOtp = async () => {
    setResendLoading(true);
    setError(''); // Clear main error
    // No separate resend success/error state needed, toast handles it.

    if (!emailForVerification) {
      setError('Email is missing to resend OTP.');
      setResendLoading(false);
      return;
    }

    try {
      const result = await sendOtp(emailForVerification);
      if (!result.success) {
        setError(result.error || 'Failed to resend OTP.');
      }
      // toast.success/error handled by AuthContext
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError('An error occurred while resending OTP.');
      toast.error('An error occurred while resending OTP.');
    } finally {
      setResendLoading(false);
    }
  };

  // Display loading spinner while auth context is loading
  if (loadingAuth) {
    return <LoadingSpinner />;
  }

  // If no email to verify after auth loads, or if user is already verified,
  // the useEffect will handle the redirect. This part won't be reached.
  // This is a fallback to prevent rendering if for some reason the useEffect fails.
  if (!emailForVerification || (user && user.isVerified)) {
    return <LoadingSpinner />; // Or null, depending on desired behavior
  }

  return (
    <div className="py-8 flex justify-center items-center min-h-[calc(100vh-120px)]">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Verify Your Email</h2>
        <p className="text-gray-600 mb-6">
          A 6-digit OTP has been sent to <span className="font-semibold">{emailForVerification}</span>.
          Please enter it below to verify your account.
        </p>

        <form onSubmit={handleVerifyOtp}>
          <InputField
            label="OTP"
            type="text"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            error={error}
            required
            // Consider adding pattern="\d{6}" and title="OTP must be 6 digits" for client-side validation
          />

          <ErrorMessage message={error} />

          <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : 'Verify OTP'}
          </Button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-600">
          Didn't receive the OTP?
          <Button
            onClick={handleResendOtp}
            variant="outline"
            className="ml-2 px-3 py-1 text-sm border-blue-600 text-blue-600 hover:bg-blue-50"
            disabled={resendLoading}
          >
            {resendLoading ? 'Sending...' : 'Resend OTP'}
          </Button>
        </p>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
