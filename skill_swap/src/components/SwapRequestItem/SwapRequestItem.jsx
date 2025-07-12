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


/**
 * SwapRequestItem Component
 *
 * This component displays the detailed information for a single skill swap request.
 * It shows the sender/recipient, skills involved, message, and current status.
 * It also provides conditional action buttons (Accept, Reject, Delete/Archive)
 * based on the request's status and the current user's role (sender or recipient).
 *
 * Props:
 * - request: (Object) An object containing the swap request data. Expected properties:
 * - id: (String) Unique ID of the request.
 * - senderId: (String) ID of the user who sent the request.
 * - senderName: (String) Name of the user who sent the request.
 * - recipientId: (String) ID of the user who received the request.
 * - recipientName: (String) Name of the user who received the request.
 * - skillsInvolved: (Array of Strings) List of skills mentioned in the swap.
 * - message: (String) The message included in the request.
 * - status: (String) The current status of the request ('pending', 'accepted', 'rejected', 'deleted').
 * - onAccept: (Function) Callback for accepting a pending incoming request. Receives request ID.
 * - onReject: (Function) Callback for rejecting a pending incoming request. Receives request ID.
 * - onDelete: (Function) Callback for deleting/archiving a request. Receives request ID.
 */
const SwapRequestItem = ({ request, onAccept, onReject, onDelete }) => {
  // Get the currently logged-in user from AuthContext.
  // This is used to determine if the request is incoming or outgoing for the current user.
  const { user } = useContext(AuthContext);

  // Determine if the current user is the recipient of this request.
  const isIncoming = request.recipientId === user?.id;
  // Determine if the request is currently in a 'pending' status.
  const isPending = request.status === 'pending';

  /**
   * Helper function to determine Tailwind CSS classes for the status badge.
   * @param {string} status - The status of the swap request.
   * @returns {string} Tailwind CSS classes for styling the badge.
   */
  const getStatusClasses = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'deleted': // For archived/deleted status
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800'; // Default neutral style
    }
  };

  return (
    // Main container for a single swap request item.
    // 'bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-200':
    // Provides a clean, card-like appearance with padding, rounded corners, shadow,
    // bottom margin, and a subtle border.
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-200">
      {/*
        Header section of the request item:
        Displays who the request is from/to and its current status.
        - 'flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2':
          Stacks vertically on small screens, horizontally on medium screens and up,
          with content spaced out and vertically aligned.
      */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
        {/* Request Title (From/To User) */}
        <h3 className="text-lg font-semibold text-gray-800">
          Swap Request {isIncoming ? 'From' : 'To'}: {isIncoming ? request.senderName : request.recipientName}
        </h3>
        {/* Status Badge */}
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(request.status)}`}>
          {/* Capitalize the first letter of the status for display */}
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </span>
      </div>

      {/* Skills Involved */}
      <p className="text-gray-600 text-sm mb-2">
        <span className="font-medium">Skills Involved:</span> {request.skillsInvolved.join(', ')}
      </p>

      {/* Request Message */}
      <p className="text-gray-700 mb-3">{request.message}</p>

      {/*
        Action Buttons:
        - 'flex flex-wrap gap-2': Uses flexbox to arrange buttons, allowing them to wrap,
          with consistent spacing.
        - Buttons are conditionally rendered based on 'isIncoming', 'isPending', and 'user' status.
      */}
      <div className="flex flex-wrap gap-2">
        {/*
          Accept and Reject buttons (only for incoming and pending requests):
          - 'isIncoming && isPending': Ensures these buttons only appear for requests
            that the current user has received and that are still awaiting action.
        */}
        {isIncoming && isPending && (
          <>
            <Button onClick={() => onAccept(request.id)} className="text-sm">Accept</Button>
            <Button onClick={() => onReject(request.id)} variant="danger" className="text-sm">Reject</Button>
          </>
        )}

        {/*
          Delete Request button (only for outgoing and pending requests):
          - '!isIncoming && isPending': Ensures this button appears for requests
            the current user sent that are still pending.
        */}
        {!isIncoming && isPending && (
          <Button onClick={() => onDelete(request.id)} variant="danger" className="text-sm">Delete Request</Button>
        )}

        {/*
          Archive/Delete button for completed/rejected requests (for both sender and recipient):
          - This provides a way to clear requests from the active list once they are no longer pending.
          - The logic `((!isIncoming && (request.status === 'accepted' || request.status === 'rejected')) || ...)`
            covers cases where the sender or recipient might want to archive a non-pending request.
        */}
        {((!isIncoming && (request.status === 'accepted' || request.status === 'rejected')) ||
          (isIncoming && (request.status === 'accepted' || request.status === 'rejected'))) && (
          <Button onClick={() => onDelete(request.id)} variant="secondary" className="text-sm">Archive</Button>
        )}
      </div>
    </div>
  );
};

export default SwapRequestItem;
