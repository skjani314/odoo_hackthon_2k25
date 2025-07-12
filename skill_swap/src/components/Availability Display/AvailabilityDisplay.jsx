import  { useState } from 'react';
import Button from '../../components/ui/button/Button'; 


const AvailabilityDisplay = ({ availability, isEditable = false, onEditAvailability }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAvailability, setEditedAvailability] = useState(availability);

  const handleSave = () => {
    if (onEditAvailability) {
      onEditAvailability(editedAvailability);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedAvailability(availability);
    setIsEditing(false);
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Availability</h3>
      {isEditing ? (
        <div className="flex">
          <input
            type="text"
            value={editedAvailability}
            onChange={(e) => setEditedAvailability(e.target.value)}
            className="flex-grow shadow appearance-none border rounded-l-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Weekends, Evenings, Flexible"
            aria-label="Edit availability"
          />
          <Button onClick={handleSave} className="rounded-l-none">Save</Button>
          <Button onClick={handleCancel} variant="secondary" className="ml-2">Cancel</Button>
        </div>
      ) : (
        <p className="text-gray-600">
          {availability || 'Not specified.'}
          {isEditable && (
            <Button onClick={() => setIsEditing(true)} variant="secondary" className="ml-4 px-3 py-1 text-sm">Edit</Button>
          )}
        </p>
      )}
    </div>
  );
};


export default AvailabilityDisplay;