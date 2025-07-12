import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Import axios for API calls
import { toast } from 'react-toastify'; // For notifications

// --- Import Reusable Components (adjust paths as per your folder structure) ---
import UserProfile from '../../components/UserProfile/UserProfilePage.jsx'; // Assuming this is your UserProfile component
import SwapRequestModal from '../../components/SwapRequestModal/SwapRequestModel.jsx'; // Assuming this is your SwapRequestModal component
import LoadingSpinner from '../../components/ui/Loading/Loading.jsx';
import ErrorMessage from '../../components/ui/Error/Error.jsx';
import Button from '../../components/ui/button/Button.jsx'; // Assuming Button component path
import { AuthContext } from '../../Context/AuthContext/AuthContext.jsx'; // Central AuthContext

// --- API Base URL (Centralized for Frontend) ---
const API_BASE_URL = 'http://localhost:5000/api'; // Ensure this matches your backend URL


/**
 * PublicProfilePage Component
 *
 * This page displays a public user's profile. Authenticated users can send
 * skill swap requests to the displayed user. It fetches user data from the backend API.
 */
const PublicProfilePage = () => {
  // Use useParams to get userId from the URL (e.g., /profile/:userId)
  const params = useParams();
  const userId = params.userId; // This will directly give us the userId from the URL

  const { user: loggedInUser, logout } = useContext(AuthContext); // Get loggedInUser and logout for token expiry

  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);

  // Effect to fetch the public user profile from the backend
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token'); // Get token if available (for authenticated requests)
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Make API call to get user by ID
        const response = await axios.get(`${API_BASE_URL}/users/${userId}`, { headers });

        if (response.data.success && response.data.user.isPublic) {
          setUserProfile(response.data.user);
        } else {
          // If user not found, or profile is explicitly not public
          setError('User not found or profile is private.');
          toast.error('Profile not found or is private.');
        }
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch public profile:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load profile. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
        setLoading(false);
        // If error is due to token expiration, log out
        if (err.response && err.response.status === 401) {
          logout();
        }
      }
    };

    if (userId) { // Only fetch if userId is available from URL params
      fetchUserProfile();
    } else {
      setLoading(false);
      setError('No user ID provided in the URL.');
    }
  }, [userId, logout]); // Re-fetch when userId changes

  /**
   * Handles sending a skill swap request to the displayed user.
   * @param {string} message - The message content for the swap request.
   */
  const handleSendSwapRequest = async (message) => {
    if (!loggedInUser) {
      toast.error('You must be logged in to send a swap request.');
      return { success: false, error: 'Not authenticated.' };
    }
    if (!userProfile) {
      toast.error('Cannot send request: User profile not loaded.');
      return { success: false, error: 'Recipient profile not loaded.' };
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token missing.');
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const payload = {
        recipientId: userProfile._id, // Use _id from MongoDB
        skillsInvolved: [...(loggedInUser.skillsOffered || []), ...(userProfile.skillsWanted || [])].filter((v, i, a) => a.indexOf(v) === i), // Example: combine offered/wanted skills
        message: message,
      };

      const response = await axios.post(`${API_BASE_URL}/swaps`, payload, { headers });

      if (response.data.success) {
        toast.success(response.data.message || 'Swap request sent successfully!');
        setIsSwapModalOpen(false); // Close modal on success
        return { success: true };
      } else {
        toast.error(response.data.message || 'Failed to send swap request.');
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      console.error('Failed to send swap request:', err);
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred while sending request.';
      toast.error(errorMessage);
      // If error is due to token expiration, log out
      if (err.response && err.response.status === 401) {
        logout();
      }
      return { success: false, error: errorMessage };
    }
  };

  // Display loading spinner while fetching profile
  if (loading) {
    return <LoadingSpinner />;
  }

  // Display error message if fetching failed
  if (error) {
    return <ErrorMessage message={error} />;
  }

  // If no user profile is found after loading (e.g., ID was invalid or profile is private)
  if (!userProfile) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-700">Profile not found or is private.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Public Profile</h2>
      <UserProfile user={userProfile} isEditable={false} />

      {/* Show "Send Swap Request" button only if logged in and not viewing own profile */}
      {loggedInUser && loggedInUser._id !== userProfile._id && ( // Use _id for comparison
        <div className="flex justify-center mt-6">
          <Button onClick={() => setIsSwapModalOpen(true)}>Send Swap Request</Button>
        </div>
      )}

      {/* Swap Request Modal */}
      <SwapRequestModal
        isOpen={isSwapModalOpen}
        onClose={() => setIsSwapModalOpen(false)}
        onSubmit={handleSendSwapRequest}
        recipientUser={userProfile}
      />
    </div>
  );
};

export default PublicProfilePage;
