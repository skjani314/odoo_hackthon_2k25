import React, { useState, useEffect, useContext } from 'react';
import UserProfile from '../../components/UserProfile/UserProfilePage.jsx';
import SwapRequestList from '../../components/SwapRequestList/SwapRequestList.jsx';
import LoadingSpinner from '../../components/ui/Loading/Loading.jsx';
import { AuthContext } from '../../Context/AuthContext/AuthContext.jsx';    


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

export default MyProfilePage; 