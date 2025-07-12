import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; // For routing and URL params
import { toast } from 'react-toastify';

// --- Import Reusable Components (adjust paths as per your folder structure) ---
import { AuthContext } from '../../Context/AuthContext/AuthContext.jsx'; // Central AuthContext
import Button from '../../components/ui/button/Button.jsx';
import InputField from '../../components/ui/input_field/InputField.jsx';
import LoadingSpinner from '../../components/ui/Loading/Loading.jsx';
import ErrorMessage from '../../components/ui/Error/Error.jsx';

/**
 * ResetPasswordPage Component
 *
 * This page allows a user to reset their password using a token received via email.
 * It expects a 'token' query parameter in the URL (e.g., /reset-password?token=YOUR_TOKEN).
 * Users enter a new password, and upon successful reset, are redirected to the login page.
 */
const ResetPasswordPage = () => {
  // Access the resetPassword function from AuthContext
  const { resetPassword, user, loadingAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Hook to get URL query parameters

  // Get the token from the URL query parameters
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if user is already logged in or if no token is present
  useEffect(() => {
    if (!loadingAuth && user) {
      console.log("User already logged in, redirecting to home.");
      navigate('/');
    } else if (!token) {
      console.log("No reset token found in URL, redirecting to forgot password.");
      toast.error("Password reset link is missing or invalid.");
      navigate('/forgot-password');
    }
  }, [user, loadingAuth, token, navigate]);

  /**
   * Handles the password reset form submission.
   * Calls the 'resetPassword' function from AuthContext.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    if (!newPassword || !confirmPassword) {
      setError('Please fill in both password fields.');
      setIsLoading(false);
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }
    if (!token) {
      setError('Password reset token is missing.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await resetPassword(token, newPassword);
      if (result.success) {
        setSuccessMessage(result.message || 'Your password has been reset successfully!');
        toast.success(result.message || 'Password reset successfully! Please log in.');
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.error || 'Failed to reset password. Please try again.');
        toast.error(result.error || 'Failed to reset password.');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError('An unexpected error occurred. Please try again.');
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // Display loading spinner while auth context is loading or if user is already logged in
  if (loadingAuth || user) {
    return <LoadingSpinner />;
  }

  // If no token is found after auth loads, this component won't render due to useEffect redirect.
  // This is a fallback to prevent rendering if for some reason the useEffect fails.
  if (!token) {
    return <LoadingSpinner />; // Or null, depending on desired behavior
  }

  return (
    <div className="py-8 flex justify-center items-center min-h-[calc(100vh-120px)]">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Reset Your Password</h2>
        <p className="text-gray-600 mb-6">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit}>
          <InputField
            label="New Password"
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            error={error && newPassword.length < 6 ? error : ''} // Show specific error for length
            required
          />
          <InputField
            label="Confirm New Password"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            error={error && newPassword !== confirmPassword ? error : ''} // Show specific error for mismatch
            required
          />

          <ErrorMessage message={error} />
          {successMessage && <p className="text-green-600 text-sm mb-4">{successMessage}</p>}

          <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : 'Reset Password'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
