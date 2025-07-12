import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API calls
import { toast } from 'react-toastify'; // For notifications

// --- Import Reusable Components (adjust paths as per your folder structure) ---
import LoadingSpinner from '../../components/ui/Loading/Loading.jsx';
import ErrorMessage from '../../components/ui/Error/Error.jsx';
import SearchBar from '../../components/ui/searchBar/SearchBar.jsx';
import UserCard from '../../components/Cards/UserCard.jsx';
import Pagination from '../../components/ui/pagination/Pagination.jsx';

// --- API Base URL (Centralized for Frontend) ---
const API_BASE_URL = 'http://localhost:5000/api'; // Ensure this matches your backend URL


/**
 * BrowseSkillsPage Component
 *
 * This page displays a list of public user profiles, allowing users to browse
 * and search for skills. It fetches user data from the backend API.
 */
const BrowseSkillsPage = () => {
  const navigate = useNavigate();

  const [allUsersData, setAllUsersData] = useState([]); // Stores all fetched users for client-side filtering/pagination
  const [displayedUsers, setDisplayedUsers] = useState([]); // Users currently displayed after search/pagination
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 6; // Number of users to display per page

  const [currentSearchQuery, setCurrentSearchQuery] = useState('');

  // Effect to fetch all public users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token'); // Get token if needed for authenticated access to public profiles
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await axios.get(`${API_BASE_URL}/users`, { headers });
        const publicUsers = response.data.users.filter(user => user.isPublic); // Ensure only public profiles are shown
        setAllUsersData(publicUsers); // Store all public users
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to fetch users. Please try again later.');
        toast.error('Failed to load user profiles.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // Empty dependency array means this runs once on mount to fetch all users

  // Effect to apply search and pagination filters whenever allUsersData, currentPage, or currentSearchQuery changes
  useEffect(() => {
    let filtered = allUsersData;

    // Apply search filter
    if (currentSearchQuery) {
      const lowerCaseQuery = currentSearchQuery.toLowerCase();
      filtered = allUsersData.filter(user =>
        user.name.toLowerCase().includes(lowerCaseQuery) ||
        user.skillsOffered.some(skill => skill.toLowerCase().includes(lowerCaseQuery)) ||
        user.skillsWanted.some(skill => skill.toLowerCase().includes(lowerCaseQuery)) ||
        user.location.toLowerCase().includes(lowerCaseQuery) // Include location in search
      );
    }

    // Calculate total pages based on filtered results
    const newTotalPages = Math.ceil(filtered.length / usersPerPage);
    setTotalPages(newTotalPages > 0 ? newTotalPages : 1); // Ensure at least 1 page

    // Adjust current page if it's out of bounds after filtering
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    } else if (currentPage === 0 && newTotalPages > 0) {
      setCurrentPage(1); // Reset to first page if it somehow became 0
    }

    // Apply pagination
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    setDisplayedUsers(filtered.slice(startIndex, endIndex));

  }, [allUsersData, currentPage, currentSearchQuery, usersPerPage]);


  /**
   * Handles the search submission.
   * Updates the search query and resets the current page to 1.
   * @param {string} query - The search query string.
   */
  const handleSearch = (query) => {
    setCurrentSearchQuery(query);
    setCurrentPage(1); // Reset to first page for new search
  };

  /**
   * Navigates to a specific user's public profile page.
   * @param {string} userId - The ID of the user to navigate to.
   */
  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Browse Skills</h2>
      <SearchBar onSearch={handleSearch} placeholder="Search by skill, name, or location (e.g., React, John Doe, New York)" />

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : displayedUsers.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-600">
          <p>No users found matching your criteria.</p>
          {currentSearchQuery && <p className="mt-2">Try a different search term or clear your search.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedUsers.map((user) => (
            <UserCard key={user._id} user={user} onClick={handleUserClick} /> // Use user._id from MongoDB
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </div>
  );
};

export default BrowseSkillsPage;
