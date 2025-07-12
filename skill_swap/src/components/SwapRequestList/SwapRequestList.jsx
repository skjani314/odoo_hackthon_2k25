import React from 'react';
import SwapRequestItem from '../SwapRequestItem/SwapRequestItem.jsx';



const SwapRequestList = ({ requests, type, onAccept, onReject, onDelete }) => {
  if (!requests || requests.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-600">
        <p>No {type} swap requests found.</p>
      </div>
    );
  }
  return (
    <div className="grid gap-4">
      {requests.map((request) => (
        <SwapRequestItem
          key={request._id}
          request={request}
          onAccept={()=>onAccept(request._id) || ((id) => console.log(`Accepting request: ${id}`))}
          onReject={()=>onReject(request._id) || ((id) => console.log(`Rejecting request: ${id}`))}
          onDelete={()=>onDelete(request._id) || ((id) => console.log(`Deleting request: ${id}`))}
        />
      ))}
    </div>
  );
};

export default SwapRequestList;