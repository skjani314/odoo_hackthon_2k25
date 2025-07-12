import React, { useState, useEffect, useContext, createContext } from 'react';

// --- Dummy AuthContext and AuthProvider (Included for self-containment) ---
// This is a simplified version for demonstration purposes.
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 'user123',
    name: 'John Doe',
    email: 'john.doe@example.com',
    profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=JD',
  }); // Simulate logged-in user

  const logout = () => {
    console.log("Dummy logout called");
    setUser(null);
  };
  const login = async (email, password) => {
    return new Promise(resolve => setTimeout(() => {
      if (email === 'test@example.com' && password === 'password') {
        setUser({
          id: 'user123',
          name: 'John Doe',
          email: 'test@example.com',
          profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=JD',
        });
        resolve({ success: true });
      } else {
        resolve({ success: false, error: 'Invalid credentials' });
      }
    }, 500));
  };
  return (
    <AuthContext.Provider value={{ user, logout, login, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};


// --- Reusable Button Component (Included for self-containment) ---
/**
 * Button Component
 * A highly reusable button component with various styling options.
 */
const Button = ({ onClick, children, variant = 'primary', className = '', disabled = false }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-semibold transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-75';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  };
  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// --- Reusable InputField Component (Included for self-containment) ---
/**
 * InputField Component
 * A highly reusable and customizable input field component.
 */
const InputField = ({ label, type = 'text', name, value, onChange, placeholder, error, required = false }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700 text-sm font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
      {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
    </div>
  );
};

// --- Reusable TextAreaField Component (Included for self-containment) ---
/**
 * TextAreaField Component
 * A highly reusable and customizable text area component.
 */
const TextAreaField = ({ label, name, value, onChange, placeholder, error, rows = 4, required = false }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700 text-sm font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className={`shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y ${error ? 'border-red-500' : 'border-gray-300'}`}
      ></textarea>
      {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
    </div>
  );
};

// --- Reusable LoadingSpinner Component (Included for self-containment) ---
/**
 * LoadingSpinner Component
 * A simple and reusable visual indicator for loading states.
 */
const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
};

// --- Reusable ErrorMessage Component (Included for self-containment) ---
/**
 * ErrorMessage Component
 * A simple and reusable component to display error messages.
 */
const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
      <strong className="font-bold">Error!</strong>
      <span className="block sm:inline"> {message}</span>
    </div>
  );
};

// --- Reusable Modal Component (Included for self-containment) ---
/**
 * Modal Component
 * A highly reusable and customizable modal (dialog box) component.
 */
const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md md:max-w-lg lg:max-w-xl p-6 relative transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl leading-none" aria-label="Close modal">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// --- Reusable SkillList Component (Included for self-containment) ---
/**
 * SkillList Component
 * A versatile component for displaying and optionally managing a list of skills.
 */
const SkillList = ({ skills, type, isEditable = false, onAddSkill, onRemoveSkill }) => {
  const [newSkill, setNewSkill] = useState('');
  const handleAdd = () => {
    if (newSkill.trim() && onAddSkill) {
      onAddSkill(newSkill.trim(), type);
      setNewSkill('');
    }
  };
  const headingText = type === 'offered' ? 'Skills Offered' : 'Skills Wanted';
  const placeholderText = `Add a new ${type === 'offered' ? 'offered' : 'wanted'} skill`;

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{headingText}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full flex items-center">
              {skill}
              {isEditable && (
                <button onClick={() => onRemoveSkill(skill, type)} className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none" aria-label={`Remove ${skill}`}>
                  &times;
                </button>
              )}
            </span>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No {type} skills listed yet.</p>
        )}
      </div>
      {isEditable && (
        <div className="flex mt-3">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder={placeholderText}
            className="flex-grow shadow appearance-none border rounded-l-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
            aria-label={placeholderText}
          />
          <Button onClick={handleAdd} className="rounded-l-none">Add</Button>
        </div>
      )}
    </div>
  );
};

// --- Reusable AvailabilityDisplay Component (Included for self-containment) ---
/**
 * AvailabilityDisplay Component
 * Displays and optionally allows editing of a user's availability.
 */
const AvailabilityDisplay = ({ availability, isEditable = false, onEditAvailability }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAvailability, setEditedAvailability] = useState(availability);

  const handleSave = () => {
    if (onEditAvailability) {
      onEditAvailability(editedAvailability);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedAvailability(availability);
    setIsEditing(false);
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Availability</h3>
      {isEditing ? (
        <div className="flex">
          <input
            type="text"
            value={editedAvailability}
            onChange={(e) => setEditedAvailability(e.target.value)}
            className="flex-grow shadow appearance-none border rounded-l-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Weekends, Evenings, Flexible"
            aria-label="Edit availability"
          />
          <Button onClick={handleSave} className="rounded-l-none">Save</Button>
          <Button onClick={handleCancel} variant="secondary" className="ml-2">Cancel</Button>
        </div>
      ) : (
        <p className="text-gray-600">
          {availability || 'Not specified.'}
          {isEditable && (
            <Button onClick={() => setIsEditing(true)} variant="secondary" className="ml-4 px-3 py-1 text-sm">Edit</Button>
          )}
        </p>
      )}
    </div>
  );
};

// --- Reusable UserProfile Component (Included for self-containment) ---
/**
 * UserProfile Component
 * Displays a user's comprehensive profile information.
 */
const UserProfile = ({ user, isEditable = false, onUpdateProfile, isLoading, error }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(user);
  // Using isLoading and error from props, so no internal state for them here.

  useEffect(() => {
    setProfileData(user);
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSkillChange = (skill, type, action) => {
    setProfileData((prev) => {
      const skillsArray = type === 'offered' ? [...prev.skillsOffered] : [...prev.skillsWanted];
      if (action === 'add' && !skillsArray.includes(skill)) {
        skillsArray.push(skill);
      } else if (action === 'remove') {
        return {
          ...prev,
          [type === 'offered' ? 'skillsOffered' : 'skillsWanted']: skillsArray.filter(s => s !== skill)
        };
      }
      return {
        ...prev,
        [type === 'offered' ? 'skillsOffered' : 'skillsWanted']: skillsArray
      };
    });
  };

  const handleSave = async () => {
    if (onUpdateProfile) {
      // onUpdateProfile is expected to handle its own loading/error states
      await onUpdateProfile(profileData);
      // If onUpdateProfile handles success/failure internally,
      // this component might not need to set isEditing=false directly on success.
      // For now, we assume it will be called by parent on success.
      setIsEditing(false); // Assume successful update for UI state
    }
  };

  const handleCancel = () => {
    setProfileData(user);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <ErrorMessage message={error} /> {/* Display error passed from parent */}
      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
        <div className="flex-shrink-0 mb-4 md:mb-0">
          <img
            src={profileData.profilePhoto || 'https://placehold.co/150x150/cccccc/333333?text=No+Photo'}
            alt={`${profileData.name}'s profile`}
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
          />
        </div>
        <div className="flex-grow text-center md:text-left">
          {isEditing ? (
            <>
              <InputField
                label="Name"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                required
              />
              <InputField
                label="Location"
                name="location"
                value={profileData.location}
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
          skills={profileData.skillsOffered}
          type="offered"
          isEditable={isEditing}
          onAddSkill={(skill) => handleSkillChange(skill, 'offered', 'add')}
          onRemoveSkill={(skill) => handleSkillChange(skill, 'offered', 'remove')}
        />
        <SkillList
          skills={profileData.skillsWanted}
          type="wanted"
          isEditable={isEditing}
          onAddSkill={(skill) => handleSkillChange(skill, 'wanted', 'add')}
          onRemoveSkill={(skill) => handleSkillChange(skill, 'wanted', 'remove')}
        />
        <AvailabilityDisplay
          availability={profileData.availability}
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

// --- Reusable SwapRequestModal Component (Included for self-containment) ---
/**
 * SwapRequestModal Component
 * A modal form for initiating a swap request to another user.
 */
const SwapRequestModal = ({ isOpen, onClose, onSubmit, recipientUser }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    // Call the parent's onSubmit function, which will handle the actual API call
    const result = await onSubmit(message);
    if (!result || !result.success) {
      setError(result?.error || 'Failed to send request.');
    }
    setIsLoading(false);
    if (result?.success) {
      setMessage(''); // Clear message on success
      onClose(); // Close modal on success
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Send Swap Request to ${recipientUser?.name}`}>
      <form onSubmit={handleSubmit}>
        <ErrorMessage message={error} />
        <p className="text-gray-700 mb-4">
          You are requesting a skill swap with <span className="font-semibold">{recipientUser?.name}</span>.
          Consider mentioning which of your skills you'd like to offer and which of their skills you're interested in.
        </p>
        <TextAreaField
          label="Your Message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Hi, I'm interested in your [skill] and can offer [my skill]. Let me know!"
          rows={5}
          required
        />
        <div className="flex justify-end space-x-4 mt-6">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : 'Send Request'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};


/**
 * PublicProfilePage Component
 *
 * This component represents the public profile view for any user in the Skill Swap platform.
 * It displays the user's profile information in a read-only format and allows a logged-in
 * user to send a swap request.
 *
 * Props:
 * - userId: (String) The ID of the user whose public profile is to be displayed.
 * In a real application, this would typically come from URL parameters (e.g., from react-router-dom).
 */
const PublicProfilePage = ({ userId }) => {
  // State to hold the fetched user profile data.
  const [userProfile, setUserProfile] = useState(null);
  // State to manage loading status.
  const [loading, setLoading] = useState(true);
  // State to store any error messages during data fetching.
  const [error, setError] = useState('');
  // State to control the visibility of the SwapRequestModal.
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);

  // Get the currently logged-in user from AuthContext to determine if a swap request can be sent.
  const { user: loggedInUser } = useContext(AuthContext);

  // Dummy data for users (should be fetched from a backend in a real app).
  const dummyUsers = [
    {
      id: 'user123',
      name: 'John Doe',
      location: 'New York, USA',
      profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=JD',
      skillsOffered: ['React', 'Node.js', 'MongoDB'],
      skillsWanted: ['UI/UX Design', 'Python'],
      availability: 'Weekends, Evenings',
      isPublic: true,
    },
    {
      id: 'user456',
      name: 'Jane Smith',
      location: 'London, UK',
      profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=JS',
      skillsOffered: ['UI/UX Design', 'Figma', 'Sketch'],
      skillsWanted: ['React', 'Marketing'],
      availability: 'Weekdays',
      isPublic: true,
    },
    {
      id: 'user789',
      name: 'Mike Johnson',
      location: 'Berlin, Germany',
      profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=MJ',
      skillsOffered: ['Python', 'Data Science', 'Machine Learning'],
      skillsWanted: ['Node.js', 'DevOps'],
      availability: 'Evenings',
      isPublic: true,
    },
    {
      id: 'user101',
      name: 'Sarah Lee',
      location: 'Sydney, Australia',
      profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=SL',
      skillsOffered: ['Photography', 'Video Editing', 'Graphic Design'],
      skillsWanted: ['Web Development', 'SEO'],
      availability: 'Weekends',
      isPublic: true,
    },
  ];

  // Effect to fetch the user's profile data based on userId.
  useEffect(() => {
    setLoading(true);
    setError('');
    // Simulate API call to fetch public user profile by userId.
    setTimeout(() => {
      const foundUser = dummyUsers.find(u => u.id === userId && u.isPublic);
      if (foundUser) {
        setUserProfile(foundUser);
      } else {
        setError('User not found or profile is private.');
      }
      setLoading(false);
    }, 500); // Simulate network delay
  }, [userId]); // Re-run effect when userId prop changes.

  // Handler for sending a swap request. This will be passed to SwapRequestModal.
  const handleSendSwapRequest = async (message) => {
    console.log(`Sending swap request from ${loggedInUser?.name} to ${userProfile?.name} with message: "${message}"`);
    // TODO: Replace with actual API call to send swap request to backend.
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      console.log('Swap request sent successfully (simulated).');
      // In a real app, you might show a success toast/notification.
      return { success: true };
    } catch (err) {
      console.error('Failed to send swap request:', err);
      return { success: false, error: err.message || 'Failed to send swap request.' };
    }
  };

  // Conditional rendering based on loading, error, or no profile found.
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!userProfile) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-700">Profile not found or is private.</p>
      </div>
    );
  }

  return (
    // Main container for the Public Profile page.
    // 'space-y-8' provides consistent vertical spacing between major sections.
    // 'p-4 sm:p-6 lg:p-8' ensures responsive padding.
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Page Title */}
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Public Profile</h2>

      {/* UserProfile Component: Displays the fetched user's profile in read-only mode */}
      <UserProfile user={userProfile} isEditable={false} />

      {/*
        "Send Swap Request" Button:
        - Only visible if a user is logged in AND the displayed profile is NOT the logged-in user's own profile.
      */}
      {loggedInUser && loggedInUser.id !== userProfile.id && (
        <div className="flex justify-center mt-6">
          <Button onClick={() => setIsSwapModalOpen(true)}>Send Swap Request</Button>
        </div>
      )}

      {/* SwapRequestModal Component */}
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
