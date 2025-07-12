import  { useContext } from 'react';
import Button from '../ui/button/Button.jsx'; // Assuming you have a Button component in your UI library
import { AuthContext } from '../../Context/AuthContext/AuthContext.jsx';


const SwapRequestItem = ({ request, onAccept, onReject, onDelete }) => {
  const { user } = useContext(AuthContext);
  const isIncoming = request.recipientId === user?.id;
  const isPending = request.status === 'pending';

  const getStatusClasses = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'deleted': return 'bg-gray-100 text-gray-800';
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

export default SwapRequestItem; 