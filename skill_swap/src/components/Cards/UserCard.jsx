import React from 'react';

// --- Simplified SkillList Component (Included for self-containment) ---
// In a full application, this would be imported from its own file (e.g., './SkillList').
// This version is simplified to only display skills, without edit functionality.
/**
 * SkillList Component (Simplified for UserCard)
 * Displays a list of skills (either offered or wanted).
 *
 * Props:
 * - skills: (Array of Strings) The list of skill names to display.
 * - type: (String) Indicates if the skills are 'offered' or 'wanted'. Used for heading.
 */
const SkillList = ({ skills, type }) => {
  return (
    <div className="mb-2">
      <h4 className="text-md font-semibold text-gray-700 mb-1">
        {type === 'offered' ? 'Skills Offered' : 'Skills Wanted'}
      </h4>
      <div className="flex flex-wrap gap-1">
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
              {skill}
            </span>
          ))
        ) : (
          <p className="text-gray-500 text-xs italic">None listed</p>
        )}
      </div>
    </div>
  );
};


/**
 * UserCard Component
 *
 * A reusable component designed to display a compact summary of a user's profile.
 * This is primarily used in lists, such as the "Browse Skills" page, to provide
 * a quick overview and allow navigation to the full user profile.
 *
 * Props:
 * - user: (Object) An object containing user data, expected to have:
 * - id: (String) Unique identifier for the user.
 * - name: (String) The user's full name.
 * - profilePhoto: (Optional String) URL to the user's profile picture.
 * - location: (Optional String) The user's location.
 * - skillsOffered: (Array of Strings) List of skills the user offers.
 * - skillsWanted: (Array of Strings) List of skills the user is seeking.
 * - onClick: (Function) Callback function triggered when the card is clicked.
 * It typically receives the user's ID as an argument to navigate to their full profile.
 */
const UserCard = ({ user, onClick }) => {
  return (
    // The main container for the user card.
    // 'bg-white rounded-lg shadow-md p-4': Provides a white background, rounded corners,
    // a subtle shadow, and internal padding for a clean look.
    // 'flex flex-col items-center text-center': Uses flexbox to stack content vertically
    // and center-align text and items.
    // 'cursor-pointer hover:shadow-lg transition-shadow duration-200':
    // Enhances user experience by indicating interactivity and providing a smooth
    // shadow transition on hover.
    <div
      className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={() => onClick(user.id)} // Calls the onClick prop with the user's ID
      role="button" // Indicates to assistive technologies that this div is clickable
      tabIndex="0" // Makes the div focusable for keyboard navigation
      onKeyDown={(e) => { // Allows activation with Enter/Space keys
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(user.id);
        }
      }}
    >
      {/*
        User Profile Photo:
        - 'w-24 h-24 rounded-full object-cover': Sets a fixed size, makes it circular,
          and ensures the image covers the area without distortion.
        - 'mb-3': Adds bottom margin for spacing.
        - 'border-2 border-blue-200': Adds a subtle border.
        - Fallback placeholder image if 'profilePhoto' is not provided.
      */}
      <img
        src={user.profilePhoto || 'https://placehold.co/100x100/cccccc/333333?text=No+Photo'}
        alt={`${user.name}'s profile`}
        className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-blue-200"
      />

      {/*
        User Name:
        - 'text-xl font-semibold text-gray-800 mb-1': Styles the name prominently.
      */}
      <h3 className="text-xl font-semibold text-gray-800 mb-1">{user.name}</h3>

      {/*
        User Location (Optional):
        - Only renders if 'user.location' is provided.
        - 'text-gray-600 text-sm mb-2': Styles the location text.
      */}
      {user.location && <p className="text-gray-600 text-sm mb-2">{user.location}</p>}

      {/*
        Skills Section:
        - 'w-full': Ensures the skill lists take full width within the card.
        - Uses the simplified 'SkillList' component for both offered and wanted skills.
      */}
      <div className="w-full mt-2">
        <SkillList skills={user.skillsOffered} type="offered" />
        <SkillList skills={user.skillsWanted} type="wanted" />
      </div>
    </div>
  );
};

export default UserCard;
