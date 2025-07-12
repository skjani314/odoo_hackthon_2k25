import React, { useState, useEffect, useContext } from 'react';
import { Download, Send, AlertCircle, UserX, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios'; // Import axios for API calls
import { toast } from 'react-toastify'; // For notifications

// --- Import Reusable Components (adjust paths as per your folder structure) ---
import Button from '../../components/ui/button/Button.jsx';
import { AuthContext } from '../../Context/AuthContext/AuthContext.jsx';
import TextAreaField from '../../components/ui/TextArea/TextArea.jsx'; // Assuming TextAreaField path
import LoadingSpinner from '../../components/ui/Loading/Loading.jsx';
import ErrorMessage from '../../components/ui/Error/Error.jsx';
import SwapRequestList from '../../components/SwapRequestList/SwapRequestList.jsx'; // Assuming SwapRequestList path

// --- API Base URL (Centralized for Frontend) ---
const API_BASE_URL = 'http://localhost:5000/api'; // Ensure this matches your backend URL


/**
 * AdminPage Component
 *
 * This component serves as the administrative dashboard for the Skill Swap platform.
 * It provides functionalities for:
 * - Monitoring and managing users (e.g., banning).
 * - Monitoring swap requests (pending, accepted, cancelled).
 * - Sending platform-wide messages.
 * - Downloading various reports (user activity, feedback, swap stats).
 *
 * It ensures access is restricted to admin users (via AuthContext check).
 * All necessary reusable components are assumed to be imported from their respective files.
 */
const AdminPage = () => {
  // Get the current user from AuthContext to check for admin role.
  const { user, loadingAuth, logout } = useContext(AuthContext);

  const [managedUsers, setManagedUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState('');

  const [allSwapRequests, setAllSwapRequests] = useState([]);
  const [loadingSwaps, setLoadingSwaps] = useState(true);
  const [swapsError, setSwapsError] = useState('');
  const [swapFilter, setSwapFilter] = useState('all'); // State for swap request filters

  const [platformMessage, setPlatformMessage] = useState('');
  const [messageSending, setMessageSending] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [messageSuccess, setMessageSuccess] = useState('');

  // Check if the current user has admin role.
  const isAdmin = user && user.role === 'admin';

  // Effect to fetch all users for management
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAdmin) return; // Only fetch if user is admin

      setLoadingUsers(true);
      setUsersError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication token missing.');

        const response = await axios.get(`${API_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Backend's /api/users returns only public users by default.
        // For admin, we might need a dedicated /api/admin/users endpoint or modify existing.
        // Assuming current /api/users returns all users for admin role.
        setManagedUsers(response.data.users);
        setLoadingUsers(false);
      } catch (err) {
        console.error('Failed to fetch users for admin:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load users.';
        setUsersError(errorMessage);
        toast.error(errorMessage);
        setLoadingUsers(false);
        if (err.response && err.response.status === 401) logout();
      }
    };
    if (!loadingAuth) { // Only fetch once auth status is determined
      fetchUsers();
    }
  }, [isAdmin, loadingAuth, logout]);

  // Effect to fetch all swap requests for monitoring
  useEffect(() => {
    const fetchSwapRequests = async () => {
      if (!isAdmin) return;

      setLoadingSwaps(true);
      setSwapsError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication token missing.');

        // For admin, we need an endpoint that returns ALL swap requests.
        // Assuming we can use /api/swaps/sent and /api/swaps/received and combine them,
        // or a new /api/swaps/all endpoint is implemented in backend.
        // For now, let's combine sent and received for the admin view.
        const sentResponse = await axios.get(`${API_BASE_URL}/swaps/sent`, { headers: { Authorization: `Bearer ${token}` } });
        const receivedResponse = await axios.get(`${API_BASE_URL}/swaps/received`, { headers: { Authorization: `Bearer ${token}` } });

        const allRequests = [...sentResponse.data.requests, ...receivedResponse.data.requests];
        // Remove duplicates if any (requests might appear in both sent and received for admin)
        const uniqueRequests = Array.from(new Map(allRequests.map(item => [item['_id'], item])).values());

        setAllSwapRequests(uniqueRequests);
        setLoadingSwaps(false);
      } catch (err) {
        console.error('Failed to fetch swap requests for admin:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load swap requests.';
        setSwapsError(errorMessage);
        toast.error(errorMessage);
        setLoadingSwaps(false);
        if (err.response && err.response.status === 401) logout();
      }
    };
    if (!loadingAuth) {
      fetchSwapRequests();
    }
  }, [isAdmin, loadingAuth, logout]);


  // If authentication is still loading, show spinner.
  if (loadingAuth) {
    return <LoadingSpinner />;
  }

  // If not an admin, display an access denied message.
  if (!isAdmin) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h2>
        <p className="text-lg text-gray-700">You do not have administrative privileges to view this page.</p>
        <p className="text-md text-gray-500 mt-2">Please log in with an admin account.</p>
      </div>
    );
  }

  // --- Admin Actions (Backend Integrated) ---

  const handleBanUser = async (userId) => {
    if (!window.confirm('Are you sure you want to ban this user?')) return; // Use browser confirm for now
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_BASE_URL}/users/${userId}/ban`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setManagedUsers(prevUsers =>
          prevUsers.map(u => (u._id === userId ? { ...u, status: 'banned' } : u))
        );
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error('Failed to ban user:', err);
      toast.error(err.response?.data?.message || 'Failed to ban user.');
      if (err.response && err.response.status === 401) logout();
    }
  };

  const handleUnbanUser = async (userId) => {
    if (!window.confirm('Are you sure you want to unban this user?')) return; // Use browser confirm for now
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_BASE_URL}/users/${userId}/unban`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setManagedUsers(prevUsers =>
          prevUsers.map(u => (u._id === userId ? { ...u, status: 'active' } : u))
        );
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error('Failed to unban user:', err);
      toast.error(err.response?.data?.message || 'Failed to unban user.');
      if (err.response && err.response.status === 401) logout();
    }
  };

  const handleSendPlatformMessage = async (e) => {
    e.preventDefault();
    if (!platformMessage.trim()) {
      setMessageError('Message cannot be empty.');
      return;
    }
    setMessageSending(true);
    setMessageError('');
    setMessageSuccess('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/admin/message`, { message: platformMessage }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setMessageSuccess(response.data.message);
        setPlatformMessage('');
        toast.success(response.data.message);
      } else {
        setMessageError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error('Failed to send platform message:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to send message.';
      setMessageError(errorMessage);
      toast.error(errorMessage);
      if (err.response && err.response.status === 401) logout();
    } finally {
      setMessageSending(false);
    }
  };

  const handleDownloadReport = async (reportType) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/admin/reports/${reportType}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob', // Important for file downloads
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}_report_${Date.now()}.json`); // Or .csv, .xlsx
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success(`Downloading ${reportType} report...`);
    } catch (err) {
      console.error(`Failed to download ${reportType} report:`, err);
      toast.error(err.response?.data?.message || `Failed to download ${reportType} report.`);
      if (err.response && err.response.status === 401) logout();
    }
  };

  // --- Swap Monitoring Handlers (passed to SwapRequestList) ---
  const handleAdminUpdateSwapStatus = async (requestId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_BASE_URL}/swaps/${requestId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (response.data.success) {
        setAllSwapRequests(prev => prev.map(req => req._id === requestId ? { ...req, status: newStatus } : req));
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error(`Error updating swap status to ${newStatus}:`, err);
      toast.error(err.response?.data?.message || `Failed to update swap status to ${newStatus}.`);
      if (err.response && err.response.status === 401) logout();
    }
  };

  const handleAdminDeleteSwap = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this swap request?')) return; // Use browser confirm for now
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_BASE_URL}/swaps/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setAllSwapRequests(prev => prev.filter(req => req._id !== requestId));
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error('Error deleting swap:', err);
      toast.error(err.response?.data?.message || 'Failed to delete swap request.');
      if (err.response && err.response.status === 401) logout();
    }
  };

  // Filtered swap requests based on current filter state
  const filteredSwapRequests = swapFilter === 'all'
    ? allSwapRequests
    : allSwapRequests.filter(req => req.status === swapFilter);

  return (
    // Main container for the Admin Page.
    // 'space-y-8' provides consistent vertical spacing between major sections.
    // 'p-4 sm:p-6 lg:p-8' ensures responsive padding.
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Page Title */}
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Admin Dashboard</h2>

      {/* Grid Layout for Admin Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* User Management Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <UserX className="mr-2" size={24} /> User Management
          </h3>
          <p className="text-gray-600 mb-4">Monitor and manage user accounts.</p>
          {loadingUsers ? (
            <LoadingSpinner />
          ) : usersError ? (
            <ErrorMessage message={usersError} />
          ) : (
            <div className="overflow-x-auto"> {/* Ensures table is scrollable on small screens */}
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Name</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Email</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {managedUsers.map((userItem) => (
                    <tr key={userItem._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b text-gray-800 text-sm">{userItem.name}</td>
                      <td className="py-3 px-4 border-b text-gray-600 text-sm">{userItem.email}</td>
                      <td className="py-3 px-4 border-b text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${userItem.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        `}>
                          {userItem.status ? userItem.status.charAt(0).toUpperCase() + userItem.status.slice(1) : 'Active'} {/* Default to Active if status is missing */}
                        </span>
                      </td>
                      <td className="py-3 px-4 border-b">
                        <div className="flex space-x-2">
                          {userItem.role !== 'admin' && ( // Prevent banning admins
                            userItem.status === 'active' ? (
                              <Button onClick={() => handleBanUser(userItem._id)} variant="danger" className="text-xs px-2 py-1">Ban</Button>
                            ) : (
                              <Button onClick={() => handleUnbanUser(userItem._id)} variant="secondary" className="text-xs px-2 py-1">Unban</Button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Platform-Wide Messages Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Send className="mr-2" size={24} /> Send Platform Message
          </h3>
          <p className="text-gray-600 mb-4">Send important announcements or updates to all users.</p>
          <form onSubmit={handleSendPlatformMessage}>
            <TextAreaField
              label="Message Content"
              name="platformMessage"
              value={platformMessage}
              onChange={(e) => setPlatformMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={6}
              required
            />
            <ErrorMessage message={messageError} />
            {messageSuccess && <p className="text-green-600 text-sm mb-4">{messageSuccess}</p>}
            <Button type="submit" className="w-full" disabled={messageSending}>
              {messageSending ? <LoadingSpinner /> : 'Send Message'}
            </Button>
          </form>
        </div>

        {/* Swap Monitoring Section */}
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2"> {/* Takes full width on large screens */}
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Clock className="mr-2" size={24} /> Swap Monitoring
          </h3>
          <p className="text-gray-600 mb-4">Overview of all pending, accepted, and cancelled swap requests.</p>
          {/* Filters for swap status */}
          <div className="flex flex-wrap gap-2 items-center justify-center sm:justify-start mb-4">
            <Button
              onClick={() => setSwapFilter('all')}
              variant={swapFilter === 'all' ? 'primary' : 'secondary'}
              className="text-sm px-4 py-2"
            >
              All
            </Button>
            <Button
              onClick={() => setSwapFilter('pending')}
              variant={swapFilter === 'pending' ? 'primary' : 'secondary'}
              className="text-sm px-4 py-2"
            >
              Pending
            </Button>
            <Button
              onClick={() => setSwapFilter('accepted')}
              variant={swapFilter === 'accepted' ? 'primary' : 'secondary'}
              className="text-sm px-4 py-2"
            >
              Accepted
            </Button>
            <Button
              onClick={() => setSwapFilter('rejected')}
              variant={swapFilter === 'rejected' ? 'primary' : 'secondary'}
              className="text-sm px-4 py-2"
            >
              Rejected
            </Button>
            <Button
              onClick={() => setSwapFilter('cancelled')}
              variant={swapFilter === 'cancelled' ? 'primary' : 'secondary'}
              className="text-sm px-4 py-2"
            >
              Cancelled
            </Button>
          </div>
          {loadingSwaps ? (
            <LoadingSpinner />
          ) : swapsError ? (
            <ErrorMessage message={swapsError} />
          ) : filteredSwapRequests.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-600">
              <p>No {swapFilter} swap requests found.</p>
            </div>
          ) : (
            <SwapRequestList
              requests={filteredSwapRequests}
              type="admin" // Indicate it's for admin view
              onAccept={(id) => handleAdminUpdateSwapStatus(id, 'accepted')}
              onReject={(id) => handleAdminUpdateSwapStatus(id, 'rejected')}
              onDelete={handleAdminDeleteSwap}
            />
          )}
        </div>

        {/* Reports Section */}
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2"> {/* Takes full width on large screens */}
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Download className="mr-2" size={24} /> Download Reports
          </h3>
          <p className="text-gray-600 mb-4">Generate and download various platform reports.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button onClick={() => handleDownloadReport('user_activity')} variant="secondary" className="flex items-center justify-center">
              <AlertCircle size={20} className="mr-2" /> User Activity Log
            </Button>
            <Button onClick={() => handleDownloadReport('feedback_logs')} variant="secondary" className="flex items-center justify-center">
              <CheckCircle size={20} className="mr-2" /> Feedback Logs
            </Button>
            <Button onClick={() => handleDownloadReport('swap_stats')} variant="secondary" className="flex items-center justify-center">
              <Clock size={20} className="mr-2" /> Swap Statistics
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPage;
