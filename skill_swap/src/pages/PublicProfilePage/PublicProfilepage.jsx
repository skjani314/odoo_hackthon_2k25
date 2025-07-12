import React, { useState, useEffect, useContext } from 'react';
import UserProfile from '../../components/UserProfile/UserProfilePage.jsx';
import SwapRequestModal from '../../components/SwapRequestModal/SwapRequestModel.jsx';
import LoadingSpinner from '../../components/ui/Loading/Loading.jsx';   
import { AuthContext } from '../../Context/AuthContext/AuthContext.jsx';
import ErrorMessage from '../../components/ui/Error/Error.jsx';
import { useParams } from 'react-router-dom';
import Button from '../../components/ui/button/Button.jsx';


const PublicProfilePage = ({ userId }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const params=useParams();
  userId = params.userId || userId; // Use userId from props or URL

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

export default PublicProfilePage;