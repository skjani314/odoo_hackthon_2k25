import React, { useContext, createContext, useState } from 'react';

// --- Dummy AuthContext and AuthProvider (Included for self-containment) ---
// This is the disabled authentication context from the Canvas.
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
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

  const login = async (email, password) => {
    console.log('Authentication is currently disabled. Skipping dummy login.');
    return { success: true };
  };

  const signup = async (name, email, password) => {
    console.log('Authentication is currently disabled. Skipping dummy signup.');
    return { success: true };
  };

  const logout = () => {
    console.log('Authentication is currently disabled. Skipping dummy logout.');
  };

  const loadingAuth = false;

  return (
    <AuthContext.Provider value={{ user, loadingAuth, login, signup, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};


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


// --- Reusable SwapRequestItem Component (Included for self-containment) ---
/**
 * SwapRequestItem Component
 * Displays details of a single swap request.
 */
const SwapRequestItem = ({ request, onAccept, onReject, onDelete }) => {
  const { user } = useContext(AuthContext); // Assuming AuthContext provides current user
  const isIncoming = request.recipientId === user?.id;
  const isPending = request.status === 'pending';

  const getStatusClasses = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'deleted':
        return 'bg-gray-100 text-gray-800';
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


/**
 * SwapRequestList Component
 *
 * This component is responsible for rendering a list of skill swap requests.
 * It iterates over an array of request objects and displays each one using the
 * SwapRequestItem component. It also provides a message when no requests are found.
 *
 * Props:
 * - requests: (Array of Objects) An array of swap request objects to be displayed.
 * Each object should conform to the structure expected by SwapRequestItem.
 * - type: (String) A descriptive string for the type of list (e.g., "my", "pending", "completed").
 * Used in the "No requests found" message for better context.
 * - onAccept: (Optional Function) Callback passed to SwapRequestItem for accepting a request.
 * - onReject: (Optional Function) Callback passed to SwapRequestItem for rejecting a request.
 * - onDelete: (Optional Function) Callback passed to SwapRequestItem for deleting/archiving a request.
 */
const SwapRequestList = ({ requests, type, onAccept, onReject, onDelete }) => {
  // If the requests array is empty, display a message indicating no requests are found.
  if (requests.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-600">
        <p>No {type} swap requests found.</p>
      </div>
    );
  }

  return (
    // Grid container for the list of swap request items.
    // 'grid gap-4': Creates a simple grid layout with consistent spacing between items.
    // This is suitable for a list where items are stacked vertically.
    <div className="grid gap-4">
      {/*
        Map over the 'requests' array to render each SwapRequestItem.
        - 'key={request.id}': Essential for React list rendering performance and stability.
        - All props for SwapRequestItem (request data and action callbacks) are passed down.
      */}
      {requests.map((request) => (
        <SwapRequestItem
          key={request.id}
          request={request}
          // Pass down the action callbacks. In a real app, these would trigger API calls.
          onAccept={onAccept || ((id) => console.log(`Accepting request: ${id}`))}
          onReject={onReject || ((id) => console.log(`Rejecting request: ${id}`))}
          onDelete={onDelete || ((id) => console.log(`Deleting request: ${id}`))}
        />
      ))}
    </div>
  );
};

export default SwapRequestList;
