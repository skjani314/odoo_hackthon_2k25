import  { useState, useContext} from 'react';
import { Download, Send, AlertCircle, UserX, CheckCircle, Clock } from 'lucide-react'; 
import Button  from '../../components/ui/button/Button'; 
import { AuthContext } from '../../Context/AuthContext/AuthContext';
import TextAreaField from '../../components/ui/TextArea/TextArea';
import LoadingSpinner from '../../components/ui/Loading/Loading';
import ErrorMessage from '../../components/ui/Error/Error';
import SwapRequestList from '../../components/SwapRequestList/SwapRequestList';



const AdminPage = () => {

    const { user, loadingAuth } = useContext(AuthContext);

  const [managedUsers, setManagedUsers] = useState([
    { id: 'user123', name: 'John Doe', email: 'john@example.com', status: 'active', skills: ['React', 'Node.js'] },
    { id: 'user456', name: 'Jane Smith', email: 'jane@example.com', status: 'active', skills: ['UI/UX', 'Figma'] },
    { id: 'user789', name: 'Mike Johnson', email: 'mike@example.com', status: 'banned', skills: ['Python', 'Data Science'] },
    { id: 'user101', name: 'Sarah Lee', email: 'sarah@example.com', status: 'active', skills: ['Photography'] },
  ]);

  const [allSwapRequests, setAllSwapRequests] = useState([
    { id: 'reqA', senderId: 'user123', senderName: 'John Doe', recipientId: 'user456', recipientName: 'Jane Smith', skillsInvolved: ['React', 'UI/UX Design'], message: 'Seeking UI/UX help!', status: 'pending' },
    { id: 'reqB', senderId: 'user456', senderName: 'Jane Smith', recipientId: 'user123', recipientName: 'John Doe', skillsInvolved: ['Figma', 'Node.js'], message: 'Offering Figma for Node.js!', status: 'accepted' },
    { id: 'reqC', senderId: 'user789', senderName: 'Mike Johnson', recipientId: 'user101', recipientName: 'Sarah Lee', skillsInvolved: ['Python', 'Photography'], message: 'Python for Photography?', status: 'rejected' },
    { id: 'reqD', senderId: 'user101', senderName: 'Sarah Lee', recipientId: 'user123', recipientName: 'John Doe', skillsInvolved: ['Graphic Design', 'MongoDB'], message: 'Graphic Design for MongoDB help.', status: 'pending' },
  ]);

  const [platformMessage, setPlatformMessage] = useState('');
  const [messageSending, setMessageSending] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [messageSuccess, setMessageSuccess] = useState('');

  const isAdmin = user && user.role === 'admin';

  if (loadingAuth) {
    return <LoadingSpinner />;
  }

  if (!isAdmin) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h2>
        <p className="text-lg text-gray-700">You do not have administrative privileges to view this page.</p>
        <p className="text-md text-gray-500 mt-2">Please log in with an admin account.</p>
      </div>
    );
  }


  const handleBanUser = (userId) => {
    console.log(`Admin action: Banning user ${userId}`);
    // Simulate API call
    setManagedUsers(prevUsers =>
      prevUsers.map(u => (u.id === userId ? { ...u, status: 'banned' } : u))
    );
    // TODO: Implement actual API call to ban user
    alert(`User ${userId} banned (simulated).`); // Use custom message box
  };

  const handleUnbanUser = (userId) => {
    console.log(`Admin action: Unbanning user ${userId}`);
    // Simulate API call
    setManagedUsers(prevUsers =>
      prevUsers.map(u => (u.id === userId ? { ...u, status: 'active' } : u))
    );
    // TODO: Implement actual API call to unban user
    alert(`User ${userId} unbanned (simulated).`); // Use custom message box
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
    console.log('Admin action: Sending platform-wide message:', platformMessage);
    // TODO: Implement actual API call to send message
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessageSuccess('Message sent successfully!');
      setPlatformMessage(''); // Clear message
    } catch (err) {
      setMessageError('Failed to send message. Please try again.');
    } finally {
      setMessageSending(false);
    }
  };

  const handleDownloadReport = (reportType) => {
    console.log(`Admin action: Downloading ${reportType} report`);
    // Simulate file download
    const dummyData = JSON.stringify({
      reportType,
      timestamp: new Date().toISOString(),
      data: `Dummy data for ${reportType} report.`
    }, null, 2);
    const blob = new Blob([dummyData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_report_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert(`Downloading ${reportType} report (simulated). Check your downloads.`); // Use custom message box
  };

  // --- Swap Monitoring Handlers (passed to SwapRequestList) ---
  const handleAdminAcceptSwap = (requestId) => {
    console.log(`Admin accepting swap: ${requestId}`);
    setAllSwapRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'accepted' } : req));
    // TODO: API call to update swap status
  };

  const handleAdminRejectSwap = (requestId) => {
    console.log(`Admin rejecting swap: ${requestId}`);
    setAllSwapRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'rejected' } : req));
    // TODO: API call to update swap status
  };

  const handleAdminDeleteSwap = (requestId) => {
    console.log(`Admin deleting/archiving swap: ${requestId}`);
    setAllSwapRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'deleted' } : req));
    // TODO: API call to update swap status (or remove from list)
  };


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
                  <tr key={userItem.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b text-gray-800 text-sm">{userItem.name}</td>
                    <td className="py-3 px-4 border-b text-gray-600 text-sm">{userItem.email}</td>
                    <td className="py-3 px-4 border-b text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${userItem.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      `}>
                        {userItem.status.charAt(0).toUpperCase() + userItem.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 border-b">
                      <div className="flex space-x-2">
                        {userItem.status === 'active' ? (
                          <Button onClick={() => handleBanUser(userItem.id)} variant="danger" className="text-xs px-2 py-1">Ban</Button>
                        ) : (
                          <Button onClick={() => handleUnbanUser(userItem.id)} variant="secondary" className="text-xs px-2 py-1">Unban</Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
          {/* Filters for swap status (optional, but good for UX) */}
          <div className="flex flex-wrap gap-2 items-center justify-center space-x-2 mb-4">
            <Button variant="secondary" className="text-sm w-23">All</Button>
            <Button variant="secondary" className="text-sm">Pending</Button>
            <Button variant="secondary" className="text-sm">Accepted</Button>
            <Button variant="secondary" className="text-sm">Rejected</Button>
          </div>
          <SwapRequestList
            requests={allSwapRequests}
            type="all"
            onAccept={handleAdminAcceptSwap}
            onReject={handleAdminRejectSwap}
            onDelete={handleAdminDeleteSwap}
          />
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
