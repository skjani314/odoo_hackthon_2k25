import React, { useState, useEffect, createContext, useContext } from 'react';
import { Menu, X } from 'lucide-react'; // For Header component

// --- Central AuthContext and AuthProvider (as per the Canvas) ---
/**
 * AuthContext
 * This context provides global access to user authentication status and related functions.
 */
export const AuthContext = createContext(null);

/**
 * AuthProvider
 * This provider wraps the application and makes the authentication context available.
 * Currently, it always provides a dummy logged-in user.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 'dummyUserAlwaysLoggedIn',
    name: 'Always Logged In User',
    email: 'dummy@example.com',
    profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=DU',
    location: 'Virtual World',
    skillsOffered: ['Debugging', 'Testing', 'Dummy Data Management'],
    skillsWanted: ['Real API Integration', 'Deployment'],
    availability: '24/7',
    isPublic: true,
  });
  const [loadingAuth, setLoadingAuth] = useState(false);

  const login = async (email, password) => {
    console.log('AuthContext: Authentication is currently disabled. Skipping dummy login.');
    return { success: true };
  };
  const signup = async (name, email, password) => {
    console.log('AuthContext: Authentication is currently disabled. Skipping dummy signup.');
    return { success: true };
  };
  const logout = () => {
    console.log('AuthContext: Authentication is currently disabled. Skipping dummy logout.');
    // setUser(null); // Uncomment this line if you want to simulate a logout for UI testing
  };

  const contextValue = { user, loadingAuth, login, signup, logout, setUser };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Reusable Button Component ---
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

// --- Reusable InputField Component ---
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

// --- Reusable TextAreaField Component ---
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

// --- Reusable LoadingSpinner Component ---
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

// --- Reusable ErrorMessage Component ---
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

// --- Reusable Modal Component ---
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

// --- Reusable Pagination Component ---
/**
 * Pagination Component
 * A reusable component for navigating through paginated lists of data.
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <nav className="flex justify-center items-center space-x-2 my-8" aria-label="Pagination">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="secondary"
        className="px-3 py-1 text-sm md:px-4 md:py-2"
      >
        Previous
      </Button>
      {pages.map((page) => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          variant={currentPage === page ? 'primary' : 'secondary'}
          className="px-3 py-1 text-sm md:px-4 md:py-2"
        >
          {page}
        </Button>
      ))}
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="secondary"
        className="px-3 py-1 text-sm md:px-4 md:py-2"
      >
        Next
      </Button>
    </nav>
  );
};

// --- Reusable SearchBar Component ---
/**
 * SearchBar Component
 * A reusable search input field with an integrated search button.
 */
const SearchBar = ({ onSearch, placeholder = 'Search...' }) => {
  const [query, setQuery] = useState('');
  const handleChange = (e) => {
    setQuery(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim());
  };
  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl mx-auto mb-8">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-grow shadow appearance-none border rounded-l-lg py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-label={placeholder}
      />
      <Button type="submit" className="rounded-l-none">Search</Button>
    </form>
  );
};

// --- Reusable SkillList Component ---
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

// --- Reusable AvailabilityDisplay Component ---
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

// --- Reusable UserProfile Component ---
/**
 * UserProfile Component
 * Displays a user's comprehensive profile information.
 */
const UserProfile = ({ user, isEditable = false, onUpdateProfile, isLoading, error }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(user);

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
      await onUpdateProfile(profileData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setProfileData(user);
    setIsEditing(false);
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

// --- Reusable SwapRequestItem Component ---
/**
 * SwapRequestItem Component
 * Displays details of a single swap request.
 */
const SwapRequestItem = ({ request, onAccept, onReject, onDelete }) => {
  const { user } = useContext(AuthContext);
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
        {((!isIncoming && (request.status === 'accepted' || request.status === 'rejected')) ||
          (isIncoming && (request.status === 'accepted' || request.status === 'rejected'))) && (
          <Button onClick={() => onDelete(request.id)} variant="secondary" className="text-sm">Archive</Button>
        )}
      </div>
    </div>
  );
};

// --- Reusable SwapRequestList Component ---
/**
 * SwapRequestList Component
 * Displays a list of SwapRequestItem components.
 */
const SwapRequestList = ({ requests, type, onAccept, onReject, onDelete }) => {
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
          onAccept={onAccept || ((id) => console.log(`Accepting request: ${id}`))}
          onReject={onReject || ((id) => console.log(`Rejecting request: ${id}`))}
          onDelete={onDelete || ((id) => console.log(`Deleting request: ${id}`))}
        />
      ))}
    </div>
  );
};

// --- Reusable SwapRequestModal Component ---
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
    const result = await onSubmit(message);
    if (!result || !result.success) {
      setError(result?.error || 'Failed to send request.');
    }
    setIsLoading(false);
    if (result?.success) {
      setMessage('');
      onClose();
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


// --- Page Components ---

// Header Component
const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-blue-600 text-white shadow-md p-4 sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center flex-wrap">
        <h1 className="text-2xl font-bold">SkillSwap</h1>
        <button
          className="md:hidden text-white focus:outline-none p-2 rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        <nav className={`w-full md:w-auto md:flex ${isMobileMenuOpen ? 'block' : 'hidden'} md:!block`}>
          <ul className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0 mt-4 md:mt-0 text-lg bg-blue-700 md:bg-transparent p-4 md:p-0 rounded-lg md:rounded-none">
            <li><a href="#home" className="block py-2 md:py-0 hover:text-blue-200 transition duration-150 ease-in-out">Home</a></li>
            <li><a href="#browse-skills" className="block py-2 md:py-0 hover:text-blue-200 transition duration-150 ease-in-out">Browse Skills</a></li>
            {user ? (
              <>
                <li><a href="#my-profile" className="block py-2 md:py-0 hover:text-blue-200 transition duration-150 ease-in-out">My Profile</a></li>
                <li><Button onClick={logout} variant="outline" className="w-full md:w-auto text-white border-white hover:bg-blue-800 mt-2 md:mt-0">Logout</Button></li>
              </>
            ) : (
              // These links will currently just log, as Auth is disabled
              <>
                <li><a href="#login" className="block py-2 md:py-0 hover:text-blue-200 transition duration-150 ease-in-out">Login</a></li>
                <li><a href="#signup" className="block py-2 md:py-0 hover:text-blue-200 transition duration-150 ease-in-out">Signup</a></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 mt-8">
      <div className="container mx-auto text-center text-sm">
        <p>&copy; {new Date().getFullYear()} SkillSwap. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a href="#" className="hover:text-gray-300 transition duration-150 ease-in-out">Privacy Policy</a>
          <a href="#" className="hover:text-gray-300 transition duration-150 ease-in-out">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

// Layout Component
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-inter">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// UserCard Component
const UserCard = ({ user, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={() => onClick(user.id)}
      role="button"
      tabIndex="0"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(user.id);
        }
      }}
    >
      <img
        src={user.profilePhoto || 'https://placehold.co/100x100/cccccc/333333?text=No+Photo'}
        alt={`${user.name}'s profile`}
        className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-blue-200"
      />
      <h3 className="text-xl font-semibold text-gray-800 mb-1">{user.name}</h3>
      {user.location && <p className="text-gray-600 text-sm mb-2">{user.location}</p>}
      <div className="w-full mt-2">
        <SkillList skills={user.skillsOffered} type="offered" />
        <SkillList skills={user.skillsWanted} type="wanted" />
      </div>
    </div>
  );
};


// BrowseSkillsPage Component
const BrowseSkillsPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 6;

  const allDummyUsers = [
    { id: 'user456', name: 'Jane Smith', location: 'London, UK', profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=JS', skillsOffered: ['UI/UX Design', 'Figma', 'Sketch'], skillsWanted: ['React', 'Marketing'], availability: 'Weekdays', isPublic: true, },
    { id: 'user789', name: 'Mike Johnson', location: 'Berlin, Germany', profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=MJ', skillsOffered: ['Python', 'Data Science', 'Machine Learning'], skillsWanted: ['Node.js', 'DevOps'], availability: 'Evenings', isPublic: true, },
    { id: 'user101', name: 'Sarah Lee', location: 'Sydney, Australia', profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=SL', skillsOffered: ['Photography', 'Video Editing', 'Graphic Design'], skillsWanted: ['Web Development', 'SEO'], availability: 'Weekends', isPublic: true, },
    { id: 'user102', name: 'David Kim', location: 'Seoul, South Korea', profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=DK', skillsOffered: ['Korean Language', 'Translation'], skillsWanted: ['English Language', 'Public Speaking'], availability: 'Anytime', isPublic: true, },
    { id: 'user103', name: 'Maria Garcia', location: 'Madrid, Spain', profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=MG', skillsOffered: ['Spanish Language', 'Cooking'], skillsWanted: ['Guitar Lessons', 'Drawing'], availability: 'Weekdays, Evenings', isPublic: true, },
    { id: 'user104', name: 'Chen Wei', location: 'Beijing, China', profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=CW', skillsOffered: ['Mandarin Language', 'Calligraphy'], skillsWanted: ['Digital Marketing', 'Photography'], availability: 'Weekends', isPublic: true, },
    { id: 'user105', name: 'Emily White', location: 'Toronto, Canada', profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=EW', skillsOffered: ['Content Writing', 'Social Media Management'], skillsWanted: ['Video Editing', 'SEO'], availability: 'Weekdays', isPublic: true, },
    { id: 'user106', name: 'Omar Hassan', location: 'Dubai, UAE', profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=OH', skillsOffered: ['Arabic Language', 'Business Strategy'], skillsWanted: ['Web Development', 'Financial Modeling'], availability: 'Evenings', isPublic: true, },
    { id: 'user107', name: 'Alice Wonderland', location: 'San Francisco, USA', profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=AW', skillsOffered: ['Creative Writing', 'Storytelling'], skillsWanted: ['Illustration', 'Animation'], availability: 'Weekends', isPublic: true, },
    { id: 'user108', name: 'Bob The Builder', location: 'Construction Site, CA', profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=BB', skillsOffered: ['Carpentry', 'Plumbing'], skillsWanted: ['Electrical Work', 'Gardening'], availability: 'Weekdays', isPublic: true, },
    { id: 'user109', name: 'Charlie Chaplin', location: 'Hollywood, USA', profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=CC', skillsOffered: ['Acting', 'Directing'], skillsWanted: ['Screenwriting', 'Music Composition'], availability: 'Evenings', isPublic: true, },
    { id: 'user110', name: 'Diana Prince', location: 'Themyscira', profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=DP', skillsOffered: ['Combat Training', 'Leadership'], skillsWanted: ['Diplomacy', 'Modern History'], availability: 'Anytime', isPublic: true, },
  ];
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      const publicUsers = allDummyUsers.filter(u => u.isPublic);
      const filteredUsers = publicUsers.filter(user =>
        user.name.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
        user.skillsOffered.some(skill => skill.toLowerCase().includes(currentSearchQuery.toLowerCase())) ||
        user.skillsWanted.some(skill => skill.toLowerCase().includes(currentSearchQuery.toLowerCase()))
      );
      setUsers(filteredUsers);
      setTotalPages(Math.ceil(filteredUsers.length / usersPerPage));
      setLoading(false);
    }, 500);
  }, [currentPage, currentSearchQuery]);

  const handleSearch = (query) => {
    setCurrentSearchQuery(query);
    setCurrentPage(1);
  };

  const handleUserClick = (userId) => {
    window.location.hash = `#profile/${userId}`; // Using hash for simple routing
  };

  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = users.slice(startIndex, startIndex + usersPerPage);

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Browse Skills</h2>
      <SearchBar onSearch={handleSearch} placeholder="Search by skill or name (e.g., React, Photoshop)" />
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : currentUsers.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-600">
          <p>No users found matching your criteria.</p>
          {currentSearchQuery && <p className="mt-2">Try a different search term or clear your search.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentUsers.map((user) => (
            <UserCard key={user.id} user={user} onClick={handleUserClick} />
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </div>
  );
};

// MyProfilePage Component
const MyProfilePage = () => {
  const { user, loadingAuth, setUser } = useContext(AuthContext);
  const [isLoadingProfileUpdate, setIsLoadingProfileUpdate] = useState(false);
  const [profileUpdateError, setProfileUpdateError] = useState('');
  const [mySwapRequests, setMySwapRequests] = useState([]);

  useEffect(() => {
    if (user) {
      setMySwapRequests([
        { id: 'swap1', senderId: 'user123', senderName: 'John Doe', recipientId: 'dummyUserAlwaysLoggedIn', recipientName: 'Always Logged In User', skillsInvolved: ['React', 'UI/UX Design'], message: 'Hi, I\'d love to swap React skills for your UI/UX expertise!', status: 'pending', },
        { id: 'swap2', senderId: 'user789', senderName: 'Mike Johnson', recipientId: 'dummyUserAlwaysLoggedIn', recipientName: 'Always Logged In User', skillsInvolved: ['Python', 'Node.js'], message: 'Hey, interested in exchanging Python knowledge for Node.js help?', status: 'accepted', },
        { id: 'swap3', senderId: 'user101', senderName: 'Sarah Lee', recipientId: 'dummyUserAlwaysLoggedIn', recipientName: 'Always Logged In User', skillsInvolved: ['Photography', 'MongoDB'], message: 'Hi, I saw you need MongoDB help. I can offer photography lessons.', status: 'pending', },
        { id: 'swap4', senderId: 'dummyUserAlwaysLoggedIn', senderName: 'Always Logged In User', recipientId: 'user102', recipientName: 'David Kim', skillsInvolved: ['JavaScript', 'Korean Language'], message: 'Hi David, I\'m looking to learn Korean. Can offer JavaScript help!', status: 'rejected', },
      ]);
    }
  }, [user]);

  const handleUpdateProfile = async (updatedProfile) => {
    setIsLoadingProfileUpdate(true);
    setProfileUpdateError('');
    try {
      console.log('Simulating API call to update profile:', updatedProfile);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(updatedProfile);
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

  if (loadingAuth) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-700">Please <a href="#login" className="text-blue-600 hover:underline">log in</a> to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">My Profile</h2>
      <UserProfile
        user={user}
        isEditable={true}
        onUpdateProfile={handleUpdateProfile}
        isLoading={isLoadingProfileUpdate}
        error={profileUpdateError}
      />
      <h3 className="text-2xl font-bold text-gray-800 mt-10 mb-4 text-center">My Swap Requests</h3>
      <SwapRequestList requests={mySwapRequests} type="my" />
    </div>
  );
};

// PublicProfilePage Component
const PublicProfilePage = ({ userId }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);

  const { user: loggedInUser } = useContext(AuthContext);

  const dummyUsers = [
    { id: 'user123', name: 'John Doe', location: 'New York, USA', profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=JD', skillsOffered: ['React', 'Node.js', 'MongoDB'], skillsWanted: ['UI/UX Design', 'Python'], availability: 'Weekends, Evenings', isPublic: true, },
    { id: 'user456', name: 'Jane Smith', location: 'London, UK', profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=JS', skillsOffered: ['UI/UX Design', 'Figma', 'Sketch'], skillsWanted: ['React', 'Marketing'], availability: 'Weekdays', isPublic: true, },
    { id: 'user789', name: 'Mike Johnson', location: 'Berlin, Germany', profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=MJ', skillsOffered: ['Python', 'Data Science', 'Machine Learning'], skillsWanted: ['Node.js', 'DevOps'], availability: 'Evenings', isPublic: true, },
    { id: 'user101', name: 'Sarah Lee', location: 'Sydney, Australia', profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=SL', skillsOffered: ['Photography', 'Video Editing', 'Graphic Design'], skillsWanted: ['Web Development', 'SEO'], availability: 'Weekends', isPublic: true, },
  ];

  useEffect(() => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      const foundUser = dummyUsers.find(u => u.id === userId && u.isPublic);
      if (foundUser) {
        setUserProfile(foundUser);
      } else {
        setError('User not found or profile is private.');
      }
      setLoading(false);
    }, 500);
  }, [userId]);

  const handleSendSwapRequest = async (message) => {
    console.log(`Sending swap request from ${loggedInUser?.name} to ${userProfile?.name} with message: "${message}"`);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Swap request sent successfully (simulated).');
      return { success: true };
    } catch (err) {
      console.error('Failed to send swap request:', err);
      return { success: false, error: err.message || 'Failed to send swap request.' };
    }
  };

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
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Public Profile</h2>
      <UserProfile user={userProfile} isEditable={false} />
      {loggedInUser && loggedInUser.id !== userProfile.id && (
        <div className="flex justify-center mt-6">
          <Button onClick={() => setIsSwapModalOpen(true)}>Send Swap Request</Button>
        </div>
      )}
      <SwapRequestModal
        isOpen={isSwapModalOpen}
        onClose={() => setIsSwapModalOpen(false)}
        onSubmit={handleSendSwapRequest}
        recipientUser={userProfile}
      />
    </div>
  );
};


/**
 * App Component
 *
 * This is the main application component that orchestrates the entire Skill Swap platform.
 * It sets up the global authentication context, defines client-side routing using
 * hash-based navigation (to simulate react-router-dom for now), and renders the
 * appropriate page component based on the current URL hash.
 *
 * All reusable UI components and page components are included here for self-containment.
 */
const App = () => {
  // State to manage the current URL hash, used for basic client-side routing.
  const [currentPath, setCurrentPath] = useState(window.location.hash);

  // Effect to listen for hash changes in the URL.
  // This simulates the behavior of a router listening to URL changes.
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  /**
   * Renders the appropriate page component based on the current URL hash.
   * This acts as a simple router.
   */
  const renderPage = () => {
    // Handle dynamic public profile routes (e.g., #profile/user123)
    if (currentPath.startsWith('#profile/')) {
      const userId = currentPath.split('/')[1]; // Extract userId from the hash
      return <PublicProfilePage userId={userId} />;
    }

    // Handle static routes
    switch (currentPath) {
      case '#browse-skills':
        return <BrowseSkillsPage />;
      case '#my-profile':
        return <MyProfilePage />;
      case '': // Default route if no hash is present
      case '#home': // Explicit home route
      default: // Fallback for any unhandled hash
        return <BrowseSkillsPage />; // Default to Browse Skills page
    }
  };

  return (
    // Wrap the entire application with AuthProvider to make authentication context available globally.
    <AuthProvider>
      {/*
        Layout Component: Provides the consistent header, main content area, and footer.
        The 'renderPage()' function determines which specific page content to display
        within the layout.
      */}
      <Layout>
        {renderPage()}
      </Layout>
    </AuthProvider>
  );
};

export default App;
