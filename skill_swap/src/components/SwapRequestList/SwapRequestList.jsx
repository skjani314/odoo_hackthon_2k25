import React from 'react';
import SwapRequestItem from '../SwapRequestItem/SwapRequestItem.jsx';



const SwapRequestList = ({ requests, type, onAccept, onReject, onDelete }) => {
  if (requests.length === 0) {
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
          key={request.id}
          request={request}
          onAccept={onAccept || ((id) => console.log(`Accepting request: ${id}`))}
          onReject={onReject || ((id) => console.log(`Rejecting request: ${id}`))}
          onDelete={onDelete || ((id) => console.log(`Deleting request: ${id}`))}
        />
      ))}
    </div>
  );
};

export default SwapRequestList;