import React, { useState, useEffect, useContext, createContext } from 'react';

// --- Dummy AuthContext and AuthProvider (Included for self-containment) ---
// In a real application, AuthContext and AuthProvider would typically reside
// in a separate file (e.g., 'src/context/AuthContext.jsx') and manage actual
// authentication state using Firebase or a custom backend.
const AuthContext = createContext(null);

// This AuthProvider is a simplified version for demonstration purposes,
// simulating a logged-in user and a logout function.
const AuthProvider = ({ children }) => {
  // State to simulate a user being logged in. Initially, a dummy user is set.
  // Set to `null` to simulate a logged-out state.
  const [user, setUser] = useState({
    id: 'user123',
    name: 'John Doe',
    email: 'john.doe@example.com',
    location: 'New York, USA',
    profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=JD',
    skillsOffered: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
    skillsWanted: ['UI/UX Design', 'Python', 'Go Lang'],
    availability: 'Weekends, Evenings',
    isPublic: true,
  });

  // Dummy logout function. In a real app, this would clear session, tokens, etc.
  const logout = () => {
    console.log("Dummy logout called: User logged out.");
    setUser(null); // Simulate logging out by setting user to null
  };

  // Dummy login function for testing purposes (not directly used by MyProfilePage, but good to have)
  const login = async (email, password) => {
    return new Promise(resolve => setTimeout(() => {
      if (email === 'test@example.com' && password === 'password') {
        setUser({
          id: 'user123',
          name: 'John Doe',
          email: 'test@example.com',
          location: 'New York, USA',
          profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=JD',
          skillsOffered: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
          skillsWanted: ['UI/UX Design', 'Python', 'Go Lang'],
          availability: 'Weekends, Evenings',
          isPublic: true,
        });
        resolve({ success: true });
      } else {
        resolve({ success: false, error: 'Invalid credentials' });
      }
    }, 500));
  };


  // The context provider makes `user` and `logout` available to any
  // component wrapped by this provider.
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

// --- Reusable UserProfile Component (Included for self-containment) ---
/**
 * UserProfile Component
 * Displays a user's comprehensive profile information.
 */
const UserProfile = ({ user, isEditable = false, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(user);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
      setError('');
      try {
        await onUpdateProfile(profileData);
        setIsEditing(false);
      } catch (err) {
        setError(err.message || 'Failed to update profile.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setProfileData(user);
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <ErrorMessage message={error} />
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

// --- Reusable SwapRequestItem Component (Included for self-containment) ---
/**
 * SwapRequestItem Component
 * Displays details of a single swap request.
 */
const SwapRequestItem = ({ request, onAccept, onReject, onDelete }) => {
  const { user } = useContext(AuthContext); // Assuming AuthContext provides current user
  const isIncoming = request.recipientId === user?.id;
  const isPending = request.status === 'pending';

  const getStatusClasses = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'deleted': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">
          Swap Request {isIncoming ? 'From' : 'To'}: {isIncoming ? request.senderName : request.recipientName}
        </h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(request.status)}`}>
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-2">
        <span className="font-medium">Skills Involved:</span> {request.skillsInvolved.join(', ')}
      </p>
      <p className="text-gray-700 mb-3">{request.message}</p>

      <div className="flex flex-wrap gap-2">
        {isIncoming && isPending && (
          <>
            <Button onClick={() => onAccept(request.id)} className="text-sm">Accept</Button>
            <Button onClick={() => onReject(request.id)} variant="danger" className="text-sm">Reject</Button>
          </>
        )}
        {!isIncoming && isPending && (
          <Button onClick={() => onDelete(request.id)} variant="danger" className="text-sm">Delete Request</Button>
        )}
        {/* Optionally show delete for accepted/rejected by sender/recipient */}
        {((!isIncoming && (request.status === 'accepted' || request.status === 'rejected')) ||
          (isIncoming && (request.status === 'accepted' || request.status === 'rejected'))) && (
          <Button onClick={() => onDelete(request.id)} variant="secondary" className="text-sm">Archive</Button>
        )}
      </div>
    </div>
  );
};

// --- Reusable SwapRequestList Component (Included for self-containment) ---
/**
 * SwapRequestList Component
 * Displays a list of SwapRequestItem components.
 */
const SwapRequestList = ({ requests, type }) => {
  if (requests.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-600">
        <p>No {type} swap requests found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {requests.map((request) => (
        <SwapRequestItem
          key={request.id}
          request={request}
          onAccept={(id) => console.log(`Accept ${id}`)} // TODO: API call
          onReject={(id) => console.log(`Reject ${id}`)} // TODO: API call
          onDelete={(id) => console.log(`Delete ${id}`)} // TODO: API call
        />
      ))}
    </div>
  );
};


/**
 * MyProfilePage Component
 *
 * This component represents the "My Profile" screen for the logged-in user.
 * It displays their comprehensive profile information (editable) and a list of
 * their ongoing and completed swap requests.
 *
 * It consumes the AuthContext to get the current user's data.
 * It integrates UserProfile and SwapRequestList components.
 */
const MyProfilePage = () => {
  // Get the current user and authentication loading status from AuthContext.
  const { user, loadingAuth, setUser } = useContext(AuthContext);

  // State for loading status of profile updates.
  const [isLoadingProfileUpdate, setIsLoadingProfileUpdate] = useState(false);
  // State for error messages related to profile updates.
  const [profileUpdateError, setProfileUpdateError] = useState('');
  // State to hold dummy swap requests for the current user.
  const [mySwapRequests, setMySwapRequests] = useState([]);

  // Simulate fetching swap requests when the user object is available.
  useEffect(() => {
    if (user) {
      // In a real application, this would be an API call to fetch
      // swap requests related to the logged-in user.
      setMySwapRequests([
        {
          id: 'swap1',
          senderId: 'user123', // This user
          senderName: 'John Doe',
          recipientId: 'user456',
          recipientName: 'Jane Smith',
          skillsInvolved: ['React', 'UI/UX Design'],
          message: 'Hi Jane, I\'d love to swap React skills for your UI/UX expertise!',
          status: 'pending',
        },
        {
          id: 'swap2',
          senderId: 'user789',
          senderName: 'Mike Johnson',
          recipientId: 'user123', // This user
          recipientName: 'John Doe',
          skillsInvolved: ['Python', 'Node.js'],
          message: 'Hey John, interested in exchanging Python knowledge for Node.js help?',
          status: 'accepted',
        },
        {
          id: 'swap3',
          senderId: 'user101',
          senderName: 'Sarah Lee',
          recipientId: 'user123', // This user
          recipientName: 'John Doe',
          skillsInvolved: ['Photography', 'MongoDB'],
          message: 'Hi John, I saw you need MongoDB help. I can offer photography lessons.',
          status: 'pending',
        },
        {
          id: 'swap4',
          senderId: 'user123', // This user
          senderName: 'John Doe',
          recipientId: 'user102',
          recipientName: 'David Kim',
          skillsInvolved: ['JavaScript', 'Korean Language'],
          message: 'Hi David, I\'m looking to learn Korean. Can offer JavaScript help!',
          status: 'rejected',
        },
      ]);
    }
  }, [user]); // Re-run when user context changes

  // Handler for updating the user's profile.
  // This function would typically make an API call to the backend.
  const handleUpdateProfile = async (updatedProfile) => {
    setIsLoadingProfileUpdate(true);
    setProfileUpdateError('');
    try {
      // TODO: Replace with actual API call to update user profile
      console.log('Simulating API call to update profile:', updatedProfile);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      setUser(updatedProfile); // Update user in AuthContext
      // In a real app, you'd also update local storage here if needed
      // localStorage.setItem('skillSwapUser', JSON.stringify(updatedProfile));
      console.log('Profile updated successfully (simulated).');
      return { success: true };
    } catch (err) {
      console.error('Failed to update profile:', err);
      setProfileUpdateError(err.message || 'Failed to update profile. Please try again.');
      return { success: false, error: err.message || 'Failed to update profile.' };
    } finally {
      setIsLoadingProfileUpdate(false);
    }
  };

  // Display loading spinner if authentication status is still being determined.
  if (loadingAuth) {
    return <LoadingSpinner />;
  }

  // If no user is logged in, prompt them to log in.
  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-700">Please <a href="#login" className="text-blue-600 hover:underline">log in</a> to view your profile.</p>
      </div>
    );
  }

  return (
    // Main container for the My Profile page.
    // 'space-y-8' provides consistent vertical spacing between major sections.
    // 'p-4 sm:p-6 lg:p-8' ensures responsive padding.
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Page Title */}
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">My Profile</h2>

      {/* UserProfile Component: Displays and allows editing of the current user's profile */}
      <UserProfile
        user={user}
        isEditable={true} // Set to true to enable editing
        onUpdateProfile={handleUpdateProfile}
        isLoading={isLoadingProfileUpdate} // Pass loading state to UserProfile
        error={profileUpdateError} // Pass error state to UserProfile
      />

      {/* Swap Requests Section */}
      <h3 className="text-2xl font-bold text-gray-800 mt-10 mb-4 text-center">My Swap Requests</h3>
      <SwapRequestList requests={mySwapRequests} type="my" /> {/* 'type="my"' for display context */}
    </div>
  );
};

export default MyProfilePage;
