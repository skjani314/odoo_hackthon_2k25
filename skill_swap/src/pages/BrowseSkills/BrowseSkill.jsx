import { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/ui/Loading/Loading.jsx';
import ErrorMessage from '../../components/ui/Error/Error.jsx';
import SearchBar from '../../components/ui/searchBar/SearchBar.jsx';
import UserCard from '../../components/Cards/UserCard.jsx';
import Pagination from '../../components/ui/pagination/Pagination.jsx';  
import { useNavigate } from 'react-router-dom';



const BrowseSkillsPage = () => {
  const navigate=useNavigate();
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
    navigate(`/profile/${userId}`);
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

export default BrowseSkillsPage;  