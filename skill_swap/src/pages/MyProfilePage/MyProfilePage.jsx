import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// --- Import Reusable Components (adjust paths as per your folder structure) ---
// Assuming these are now in common/ui or components/ folders
import LoadingSpinner from '../../components/ui/Loading/Loading.jsx';
import ErrorMessage from '../../components/ui/Error/Error.jsx';
import Button from '../../components/ui/button/Button.jsx';
import InputField from '../../components/ui/input_field/InputField.jsx'; // Assuming InputField path, renamed from common/InputField
import TextAreaField from '../../components/ui/TextArea/TextArea.jsx'; // Assuming TextAreaField path
import Modal from '../../components/ui/Modal/Modal.jsx'; // Assuming Modal path

// Assuming these are application-specific components
import { AuthContext } from '../../Context/AuthContext/AuthContext.jsx';
// Corrected import path for SwapRequestList if it's in a different folder than MyProfilePage
// If SwapRequestList is in the same folder as MyProfilePage, the path would be './SwapRequestList.jsx'
// Based on your previous structure, it seems to be in '../../components/SwapRequestList/SwapRequestList.jsx'
import SwapRequestList from '../../components/SwapRequestList/SwapRequestList.jsx';
import SwapRequestItem from '../../components/SwapRequestItem/SwapRequestItem.jsx'; // Assuming SwapRequestItem path
import SkillList from '../../components/SkillList/SkillList.jsx'; // Assuming SkillList path
import AvailabilityDisplay from '../../components/Availability Display/AvailabilityDisplay.jsx'; // Assuming AvailabilityDisplay path


// --- API Base URL (Centralized for Frontend) ---
const API_BASE_URL = 'http://localhost:5000/api'; // Ensure this matches your backend URL


// --- UserProfile Component (Updated to include image upload and robust skill handling) ---
/**
 * UserProfile Component
 * Displays and optionally allows editing of a user's profile information,
 * including name, location, public status, skills, availability, and profile photo.
 */
const UserProfile = ({ user, isEditable = false, onUpdateProfile, isLoading, error }) => {
  const [isEditing, setIsEditing] = useState(false);
  // Use a deep copy and ensure default empty arrays for skills if not present
  const [profileData, setProfileData] = useState(user ? {
    ...user,
    skillsOffered: user.skillsOffered || [],
    skillsWanted: user.skillsWanted || [],
  } : null);

  useEffect(() => {
    // Update internal state when the 'user' prop changes (e.g., after initial fetch or successful update)
    setProfileData(user ? {
      ...user,
      skillsOffered: user.skillsOffered || [],
      skillsWanted: user.skillsWanted || [],
    } : null);
  }, [user]);

  // Handle changes for text inputs and checkboxes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle file input change for profile photo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Set the profilePhoto to the Base64 string
        setProfileData((prev) => ({ ...prev, profilePhoto: reader.result }));
      };
      reader.readAsDataURL(file); // Read file as Base64
    }
  };

  // Handle adding/removing skills - MODIFIED TO SAFELY ACCESS SKILLS ARRAYS
  const handleSkillChange = (skill, type, action) => {
    setProfileData((prev) => {
      // Ensure skills arrays are initialized to empty arrays if they are null/undefined
      const currentSkillsOffered = prev.skillsOffered || [];
      const currentSkillsWanted = prev.skillsWanted || [];

      let skillsArray;
      let updatedSkills = {};

      if (type === 'offered') {
        skillsArray = [...currentSkillsOffered];
      } else { // type === 'wanted'
        skillsArray = [...currentSkillsWanted];
      }

      if (action === 'add' && !skillsArray.includes(skill)) {
        skillsArray.push(skill);
      } else if (action === 'remove') {
        skillsArray = skillsArray.filter(s => s !== skill);
      }

      if (type === 'offered') {
        updatedSkills = { skillsOffered: skillsArray };
      } else {
        updatedSkills = { skillsWanted: skillsArray };
      }

      return {
        ...prev,
        ...updatedSkills
      };
    });
  };

  // Save changes by calling the parent's onUpdateProfile
  const handleSave = async () => {
    if (onUpdateProfile) {
      // Pass the entire profileData, including the potential new Base64 image
      await onUpdateProfile(profileData);
      setIsEditing(false); // Exit editing mode after save attempt
    }
  };

  // Cancel editing and revert to original user data
  const handleCancel = () => {
    setProfileData(user ? {
      ...user,
      skillsOffered: user.skillsOffered || [],
      skillsWanted: user.skillsWanted || [],
    } : null); // Revert to original user data
    setIsEditing(false);
  };

  if (!profileData) {
    return null; // Or a loading state if user is expected to be loaded
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      {error && <ErrorMessage message={error} />} {/* Display error from parent */}
      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
        <div className="flex-shrink-0 mb-4 md:mb-0 text-center">
          <img
            // Display the current profile photo (either existing URL or new Base64 string)
            src={profileData.profilePhoto || 'https://placehold.co/150x150/cccccc/333333?text=No+Photo'}
            alt={`${profileData.name}'s profile`}
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 mx-auto"
          />
          {isEditable && isEditing && (
            <div className="mt-2">
              <label htmlFor="profilePhotoInput" className="cursor-pointer text-blue-600 hover:underline text-sm">
                Change Photo
              </label>
              <input
                id="profilePhotoInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden" // Hide the default file input
              />
            </div>
          )}
        </div>
        <div className="flex-grow text-center md:text-left">
          {isEditing ? (
            <>
              <InputField
                label="Name"
                name="name"
                value={profileData.name || ''}
                onChange={handleChange}
                required
              />
              <InputField
                label="Location"
                name="location"
                value={profileData.location || ''}
                onChange={handleChange}
                placeholder="e.g., New York, USA"
              />
              <div className="mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={profileData.isPublic}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-blue-600 rounded"
                  />
                  <span className="ml-2 text-gray-700">Make profile public</span>
                </label>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-800">{profileData.name}</h2>
              {profileData.location && <p className="text-gray-600 text-lg mt-1">{profileData.location}</p>}
              <p className="text-gray-500 text-sm mt-2">Status: {profileData.isPublic ? 'Public' : 'Private'}</p>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 border-t pt-6">
        <SkillList
          skills={profileData.skillsOffered || []}
          type="offered"
          isEditable={isEditing}
          onAddSkill={(skill) => handleSkillChange(skill, 'offered', 'add')}
          onRemoveSkill={(skill) => handleSkillChange(skill, 'offered', 'remove')}
        />
        <SkillList
          skills={profileData.skillsWanted || []}
          type="wanted"
          isEditable={isEditing}
          onAddSkill={(skill) => handleSkillChange(skill, 'wanted', 'add')}
          onRemoveSkill={(skill) => handleSkillChange(skill, 'wanted', 'remove')}
        />
        <AvailabilityDisplay
          availability={profileData.availability || ''}
          isEditable={isEditing}
          onEditAvailability={(newAvailability) => setProfileData((prev) => ({ ...prev, availability: newAvailability }))}
        />
      </div>

      {isEditable && (
        <div className="mt-6 flex justify-end space-x-4">
          {isEditing ? (
            <>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="secondary" onClick={handleCancel} disabled={isLoading}>Cancel</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>
      )}
    </div>
  );
};


/**
 * MyProfilePage Component
 *
 * This page displays the authenticated user's profile and their skill swap requests.
 * It allows the user to edit their profile and manage their swap requests by interacting
 * with the backend API.
 */
const MyProfilePage = () => {
  const { user, loadingAuth, setUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isLoadingProfileUpdate, setIsLoadingProfileUpdate] = useState(false);
  const [profileUpdateError, setProfileUpdateError] = useState('');
  const [mySwapRequests, setMySwapRequests] = useState([]);
  const [loadingSwaps, setLoadingSwaps] = useState(true);
  const [swapsError, setSwapsError] = useState('');

  // Effect to redirect if user is not authenticated after auth loads
  useEffect(() => {
    if (!loadingAuth && !user) {
      toast.info('Please log in to view your profile.');
      navigate('/login', { replace: true });
    }
  }, [user, loadingAuth, navigate]);

  // Effect to fetch user's swap requests from the backend
  useEffect(() => {
    const fetchSwapRequests = async () => {
      if (!user) return;

      setLoadingSwaps(true);
      setSwapsError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found.');
        }

        const headers = { Authorization: `Bearer ${token}` };

        // Fetch sent requests
        const sentResponse = await axios.get(`${API_BASE_URL}/swaps/sent`, { headers });
        const sentRequests = sentResponse.data.requests.map(req => ({
          ...req,
          senderName: req.sender.name,
          recipientName: req.recipient.name,
        }));

        // Fetch received requests
        const receivedResponse = await axios.get(`${API_BASE_URL}/swaps/received`, { headers });
        const receivedRequests = receivedResponse.data.requests.map(req => ({
          ...req,
          senderName: req.sender.name,
          recipientName: req.recipient.name,
        }));

        // Combine and set requests
        setMySwapRequests([...sentRequests, ...receivedRequests]);
        setLoadingSwaps(false);
      } catch (err) {
        console.error('Failed to fetch swap requests:', err);
        setSwapsError('Failed to load swap requests. Please try again.');
        toast.error('Failed to load swap requests.');
        setLoadingSwaps(false);
        if (err.response && err.response.status === 401) {
          logout();
        }
      }
    };

    fetchSwapRequests();
  }, [user, logout]);


  /**
   * Handles updating the user's profile.
   * Sends updated profile data to the backend API.
   * @param {object} updatedProfile - The new profile data, potentially including a Base64 image string.
   */
  const handleUpdateProfile = async (updatedProfile) => {
    setIsLoadingProfileUpdate(true);
    setProfileUpdateError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token missing.');
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', // Keep as JSON for now, backend expects this for base64
      };

      const response = await axios.put(`${API_BASE_URL}/users/profile`, updatedProfile, { headers });

      if (response.data.success) {
        setUser(response.data.user); // Update user in AuthContext with the fresh data from backend
        toast.success(response.data.message || 'Profile updated successfully!');
        return { success: true };
      } else {
        setProfileUpdateError(response.data.message || 'Failed to update profile.');
        toast.error(response.data.message || 'Failed to update profile.');
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred during profile update.';
      setProfileUpdateError(errorMessage);
      toast.error(errorMessage);
      if (err.response && err.response.status === 401) {
        logout();
      }
      return { success: false, error: errorMessage };
    } finally {
      setIsLoadingProfileUpdate(false);
    }
  };

  /**
   * Handles accepting a swap request.
   * @param {string} requestId - The ID of the swap request.
   */
  const handleAcceptSwap = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
      const response = await axios.put(`${API_BASE_URL}/swaps/${requestId}/status`, { status: 'accepted' }, { headers });
      if (response.data.success) {
        toast.success(response.data.message);
        setMySwapRequests(prev => prev.map(req => req._id === requestId ? { ...req, status: 'accepted' } : req));
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error('Error accepting swap:', err);
      toast.error(err.response?.data?.message || 'Failed to accept swap request.');
      if (err.response && err.response.status === 401) {
        logout();
      }
    }
  };

  /**
   * Handles rejecting a swap request.
   * @param {string} requestId - The ID of the swap request.
   */
  const handleRejectSwap = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
      const response = await axios.put(`${API_BASE_URL}/swaps/${requestId}/status`, { status: 'rejected' }, { headers });
      if (response.data.success) {
        toast.success(response.data.message);
        setMySwapRequests(prev => prev.map(req => req._id === requestId ? { ...req, status: 'rejected' } : req));
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error('Error rejecting swap:', err);
      toast.error(err.response?.data?.message || 'Failed to reject swap request.');
      if (err.response && err.response.status === 401) {
        logout();
      }
    }
  };

  /**
   * Handles deleting/archiving a swap request.
   * @param {string} requestId - The ID of the swap request.
   */
  const handleDeleteSwap = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this swap request?')) return;
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      const response = await axios.delete(`${API_BASE_URL}/swaps/${requestId}`, { headers });
      if (response.data.success) {
        toast.success(response.data.message);
        setMySwapRequests(prev => prev.filter(req => req._id !== requestId));
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error('Error deleting swap:', err);
      toast.error(err.response?.data?.message || 'Failed to delete swap request.');
      if (err.response && err.response.status === 401) {
        logout();
      }
    }
  };


  // Display loading spinner while authentication status is being determined
  if (loadingAuth) {
    return <LoadingSpinner />;
  }

  // If user is not logged in after auth loads, display a message and prompt to login
  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-700">Please <a href="/login" className="text-blue-600 hover:underline">log in</a> to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">My Profile</h2>
      <UserProfile
        user={user} // User data comes from AuthContext
        isEditable={true}
        onUpdateProfile={handleUpdateProfile}
        isLoading={isLoadingProfileUpdate}
        error={profileUpdateError}
      />

      <h3 className="text-2xl font-bold text-gray-800 mt-10 mb-4 text-center">My Swap Requests</h3>
      {loadingSwaps ? (
        <LoadingSpinner />
      ) : swapsError ? (
        <ErrorMessage message={swapsError} />
      ) : mySwapRequests.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-600">
          <p>You have no swap requests yet.</p>
        </div>
      ) : (
        <SwapRequestList
          requests={mySwapRequests}
          type="my"
          onAccept={handleAcceptSwap}
          onReject={handleRejectSwap}
          onDelete={handleDeleteSwap}
        />
      )}
    </div>
  );
};

export default MyProfilePage;
