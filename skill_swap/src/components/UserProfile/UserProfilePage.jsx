import React, { useState, useEffect } from 'react';

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


/**
 * UserProfile Component
 *
 * This component displays a user's comprehensive profile information,
 * including their name, location, profile photo, skills offered, skills wanted,
 * and availability. It supports both a read-only display for public profiles
 * and an editable mode for the logged-in user's own profile.
 *
 * Props:
 * - user: (Object) An object containing the user's profile data. Expected properties:
 * - id: (String) User's unique ID.
 * - name: (String) User's full name.
 * - location: (Optional String) User's location.
 * - profilePhoto: (Optional String) URL to the user's profile picture.
 * - skillsOffered: (Array of Strings) Skills the user offers.
 * - skillsWanted: (Array of Strings) Skills the user wants.
 * - availability: (Optional String) User's availability.
 * - isPublic: (Boolean) Whether the profile is public or private.
 * - isEditable: (Optional Boolean) If true, allows editing of profile details,
 * skills, and availability. Defaults to false (read-only).
 * - onUpdateProfile: (Optional Function) Callback triggered when the profile is saved
 * in editable mode. Receives the updated user object as an argument.
 * Required when 'isEditable' is true.
 */
const UserProfile = ({ user, isEditable = false, onUpdateProfile }) => {
  // State to control whether the profile is currently in editing mode.
  const [isEditing, setIsEditing] = useState(false);
  // State to hold the profile data during editing.
  // Initialized with the 'user' prop, updated when 'user' prop changes.
  const [profileData, setProfileData] = useState(user);
  // State for error messages during profile updates.
  const [error, setError] = useState('');
  // State for loading status during profile updates.
  const [isLoading, setIsLoading] = useState(false);

  // Effect to update 'profileData' state if the 'user' prop changes.
  // This is important if the parent component fetches a new user object.
  useEffect(() => {
    setProfileData(user);
  }, [user]);

  // Handler for changes in basic input fields (name, location, isPublic).
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handler for adding or removing skills.
  const handleSkillChange = (skill, type, action) => {
    setProfileData((prev) => {
      // Create a copy of the relevant skills array.
      const skillsArray = type === 'offered' ? [...prev.skillsOffered] : [...prev.skillsWanted];
      if (action === 'add' && !skillsArray.includes(skill)) {
        // Add skill if it's not already present.
        skillsArray.push(skill);
      } else if (action === 'remove') {
        // Remove skill by filtering.
        return {
          ...prev,
          [type === 'offered' ? 'skillsOffered' : 'skillsWanted']: skillsArray.filter(s => s !== skill)
        };
      }
      // Return updated state for the specific skill type.
      return {
        ...prev,
        [type === 'offered' ? 'skillsOffered' : 'skillsWanted']: skillsArray
      };
    });
  };

  // Handler for saving all changes to the profile.
  const handleSave = async () => {
    if (onUpdateProfile) {
      setIsLoading(true);
      setError('');
      try {
        // Call the parent's update function with the current profile data.
        await onUpdateProfile(profileData);
        setIsEditing(false); // Exit editing mode on successful save.
      } catch (err) {
        setError(err.message || 'Failed to update profile.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handler for canceling editing.
  // Resets 'profileData' to the original 'user' prop and exits editing mode.
  const handleCancel = () => {
    setProfileData(user); // Revert all changes
    setIsEditing(false);
    setError(''); // Clear any errors
  };

  return (
    // Main container for the user profile.
    // 'bg-white p-6 rounded-lg shadow-md': Provides a clean, card-like appearance.
    // 'max-w-4xl mx-auto': Limits max width and centers the component on larger screens.
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      {/* Display error messages if any */}
      <ErrorMessage message={error} />

      {/*
        Top section: Profile photo, name, location, and public/private status.
        - 'flex flex-col md:flex-row items-center md:items-start md:space-x-6':
          Stacks vertically on mobile, horizontally on medium screens and up,
          with appropriate spacing and alignment.
      */}
      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
        {/* Profile Photo */}
        <div className="flex-shrink-0 mb-4 md:mb-0">
          <img
            src={profileData.profilePhoto || 'https://placehold.co/150x150/cccccc/333333?text=No+Photo'}
            alt={`${profileData.name}'s profile`}
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
          />
        </div>
        {/* User Basic Info (Name, Location, Public/Private status) */}
        <div className="flex-grow text-center md:text-left">
          {isEditing ? (
            // Editable basic info fields
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
            // Read-only basic info display
            <>
              <h2 className="text-3xl font-bold text-gray-800">{profileData.name}</h2>
              {profileData.location && <p className="text-gray-600 text-lg mt-1">{profileData.location}</p>}
              <p className="text-gray-500 text-sm mt-2">Status: {profileData.isPublic ? 'Public' : 'Private'}</p>
            </>
          )}
        </div>
      </div>

      {/*
        Skills and Availability Section:
        - 'mt-6 border-t pt-6': Adds top margin, a separator line, and top padding.
      */}
      <div className="mt-6 border-t pt-6">
        {/* Skills Offered List */}
        <SkillList
          skills={profileData.skillsOffered}
          type="offered"
          isEditable={isEditing}
          onAddSkill={(skill) => handleSkillChange(skill, 'offered', 'add')}
          onRemoveSkill={(skill) => handleSkillChange(skill, 'offered', 'remove')}
        />
        {/* Skills Wanted List */}
        <SkillList
          skills={profileData.skillsWanted}
          type="wanted"
          isEditable={isEditing}
          onAddSkill={(skill) => handleSkillChange(skill, 'wanted', 'add')}
          onRemoveSkill={(skill) => handleSkillChange(skill, 'wanted', 'remove')}
        />
        {/* Availability Display */}
        <AvailabilityDisplay
          availability={profileData.availability}
          isEditable={isEditing}
          onEditAvailability={(newAvailability) => setProfileData((prev) => ({ ...prev, availability: newAvailability }))}
        />
      </div>

      {/*
        Edit/Save/Cancel Buttons (only shown if 'isEditable' is true):
        - 'mt-6 flex justify-end space-x-4': Adds top margin, uses flexbox to align buttons
          to the right, with spacing between them.
      */}
      {isEditable && (
        <div className="mt-6 flex justify-end space-x-4">
          {isEditing ? (
            // Save and Cancel buttons when in editing mode
            <>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="secondary" onClick={handleCancel} disabled={isLoading}>Cancel</Button>
            </>
          ) : (
            // Edit Profile button when in read-only mode
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
