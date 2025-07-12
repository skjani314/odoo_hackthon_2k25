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
const InputField = ({ label, type, name, value, onChange, placeholder, error, required = false }) => {
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

// --- Reusable Pagination Component (Included for self-containment) ---
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

// --- Reusable SearchBar Component (Included for self-containment) ---
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

// --- Reusable SkillList Component (Included for self-containment) ---
// Simplified version for display purposes within UserCard.
/**
 * SkillList Component (Simplified for Display)
 * Displays a list of skills.
 */
const SkillList = ({ skills, type }) => {
  const headingText = type === 'offered' ? 'Skills Offered' : 'Skills Wanted';
  return (
    <div className="mb-2">
      <h4 className="text-md font-semibold text-gray-700 mb-1">
        {headingText}
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

// --- Reusable UserCard Component (Included for self-containment) ---
/**
 * UserCard Component
 * A reusable component to display a compact summary of a user's profile.
 */
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


/**
 * BrowseSkillsPage Component
 *
 * This component represents the main "Browse Skills" screen of the application.
 * It allows users to view a list of other users, search for specific skills or names,
 * and navigate through paginated results.
 * It integrates the SearchBar, UserCard, Pagination, LoadingSpinner, and ErrorMessage components.
 */
const BrowseSkillsPage = () => {
  // State to store the list of users to display.
  const [users, setUsers] = useState([]);
  // State to manage loading status.
  const [loading, setLoading] = useState(true);
  // State to store any error messages.
  const [error, setError] = useState('');
  // State for current page number in pagination.
  const [currentPage, setCurrentPage] = useState(1);
  // State for total number of pages.
  const [totalPages, setTotalPages] = useState(1);
  // Number of users to display per page.
  const usersPerPage = 6;

  // Dummy data for users to populate the page.
  // In a real application, this data would be fetched from a backend API.
  const allDummyUsers = [
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
    {
      id: 'user102',
      name: 'David Kim',
      location: 'Seoul, South Korea',
      profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=DK',
      skillsOffered: ['Korean Language', 'Translation'],
      skillsWanted: ['English Language', 'Public Speaking'],
      availability: 'Anytime',
      isPublic: true,
    },
    {
      id: 'user103',
      name: 'Maria Garcia',
      location: 'Madrid, Spain',
      profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=MG',
      skillsOffered: ['Spanish Language', 'Cooking'],
      skillsWanted: ['Guitar Lessons', 'Drawing'],
      availability: 'Weekdays, Evenings',
      isPublic: true,
    },
    {
      id: 'user104',
      name: 'Chen Wei',
      location: 'Beijing, China',
      profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=CW',
      skillsOffered: ['Mandarin Language', 'Calligraphy'],
      skillsWanted: ['Digital Marketing', 'Photography'],
      availability: 'Weekends',
      isPublic: true,
    },
    {
      id: 'user105',
      name: 'Emily White',
      location: 'Toronto, Canada',
      profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=EW',
      skillsOffered: ['Content Writing', 'Social Media Management'],
      skillsWanted: ['Video Editing', 'SEO'],
      availability: 'Weekdays',
      isPublic: true,
    },
    {
      id: 'user106',
      name: 'Omar Hassan',
      location: 'Dubai, UAE',
      profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=OH',
      skillsOffered: ['Arabic Language', 'Business Strategy'],
      skillsWanted: ['Web Development', 'Financial Modeling'],
      availability: 'Evenings',
      isPublic: true,
    },
    {
      id: 'user107',
      name: 'Alice Wonderland',
      location: 'San Francisco, USA',
      profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=AW',
      skillsOffered: ['Creative Writing', 'Storytelling'],
      skillsWanted: ['Illustration', 'Animation'],
      availability: 'Weekends',
      isPublic: true,
    },
    {
      id: 'user108',
      name: 'Bob The Builder',
      location: 'Construction Site, CA',
      profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=BB',
      skillsOffered: ['Carpentry', 'Plumbing'],
      skillsWanted: ['Electrical Work', 'Gardening'],
      availability: 'Weekdays',
      isPublic: true,
    },
    {
      id: 'user109',
      name: 'Charlie Chaplin',
      location: 'Hollywood, USA',
      profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=CC',
      skillsOffered: ['Acting', 'Directing'],
      skillsWanted: ['Screenwriting', 'Music Composition'],
      availability: 'Evenings',
      isPublic: true,
    },
    {
      id: 'user110',
      name: 'Diana Prince',
      location: 'Themyscira',
      profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=DP',
      skillsOffered: ['Combat Training', 'Leadership'],
      skillsWanted: ['Diplomacy', 'Modern History'],
      availability: 'Anytime',
      isPublic: true,
    },
  ];

  // Effect to simulate fetching users on component mount or when search/pagination changes.
  useEffect(() => {
    setLoading(true);
    setError('');

    // Simulate API call delay
    setTimeout(() => {
      // Filter out non-public profiles (all dummy data is public for now)
      const publicUsers = allDummyUsers.filter(u => u.isPublic);

      // Apply current search query filter
      const filteredUsers = publicUsers.filter(user =>
        user.name.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
        user.skillsOffered.some(skill => skill.toLowerCase().includes(currentSearchQuery.toLowerCase())) ||
        user.skillsWanted.some(skill => skill.toLowerCase().includes(currentSearchQuery.toLowerCase()))
      );

      setUsers(filteredUsers);
      setTotalPages(Math.ceil(filteredUsers.length / usersPerPage));
      setLoading(false);
    }, 500); // Simulate network delay
  }, [currentPage, currentSearchQuery]); // Re-run effect when page or search query changes

  // State to hold the current search query, separate from the input's internal state.
  // This allows us to trigger the search effect only when the 'onSearch' is called.
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');

  // Handler for when a search is performed from the SearchBar.
  const handleSearch = (query) => {
    setCurrentSearchQuery(query);
    setCurrentPage(1); // Reset to the first page for new search results
  };

  // Handler for when a UserCard is clicked.
  // In a real app, this would likely navigate to a PublicProfilePage.
  const handleUserClick = (userId) => {
    console.log(`Navigating to user profile: ${userId}`);
    // Example: window.location.hash = `#profile/${userId}`;
    // For now, we'll just log to console.
  };

  // Calculate which users to display based on current page and usersPerPage.
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = users.slice(startIndex, startIndex + usersPerPage);

  return (
    // Main container for the Browse Skills page.
    // 'space-y-8' provides consistent vertical spacing between major sections.
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Page Title */}
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Browse Skills</h2>

      {/* Search Bar Component */}
      <SearchBar onSearch={handleSearch} placeholder="Search by skill or name (e.g., React, Photoshop)" />

      {/* Conditional rendering based on loading, error, or no results */}
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
        // Grid for displaying User Cards.
        // 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6':
        // - 'grid': Enables CSS Grid layout.
        // - 'grid-cols-1': One column on small screens.
        // - 'sm:grid-cols-2': Two columns on small-medium screens.
        // - 'lg:grid-cols-3': Three columns on large screens.
        // - 'gap-6': Adds consistent spacing between grid items.
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentUsers.map((user) => (
            <UserCard key={user.id} user={user} onClick={handleUserClick} />
          ))}
        </div>
      )}

      {/* Pagination Component (only renders if there's more than one page) */}
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </div>
  );
};

export default BrowseSkillsPage;
