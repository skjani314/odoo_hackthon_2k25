import React, { useState } from 'react';

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

// --- Reusable InputField Component (Included for self-containment) ---
/**
 * InputField Component
 * A highly reusable and customizable input field component.
 * Note: This simplified version is included for self-containment.
 * In a real project, it would be imported.
 */
const InputField = ({ label, type, name, value, onChange, placeholder, error, required = false }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700 text-sm font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
      {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
    </div>
  );
};


/**
 * AvailabilityDisplay Component
 *
 * This component is used to display a user's availability information.
 * It supports both a read-only display mode and an editable mode,
 * allowing users to update their availability.
 *
 * Props:
 * - availability: (String) The current availability text (e.g., "Weekends", "Evenings").
 * - isEditable: (Optional Boolean) If true, an input field and "Save"/"Cancel" buttons are shown
 * to allow editing. Defaults to false (read-only).
 * - onEditAvailability: (Optional Function) Callback function triggered when the availability
 * is saved in editable mode. Receives the new availability string as an argument.
 * Required when 'isEditable' is true.
 */
const AvailabilityDisplay = ({ availability, isEditable = false, onEditAvailability }) => {
  // State to control whether the availability is currently being edited.
  const [isEditing, setIsEditing] = useState(false);
  // State to hold the availability text during editing.
  const [editedAvailability, setEditedAvailability] = useState(availability);

  // Handler for saving the edited availability.
  // Calls the 'onEditAvailability' prop if provided and then exits editing mode.
  const handleSave = () => {
    if (onEditAvailability) {
      onEditAvailability(editedAvailability);
      setIsEditing(false);
    }
  };

  // Handler for canceling the editing process.
  // Resets the edited availability to the original prop value and exits editing mode.
  const handleCancel = () => {
    setEditedAvailability(availability); // Revert to original availability
    setIsEditing(false);
  };

  return (
    // Container for the availability section.
    // 'mb-4' provides consistent vertical spacing.
    <div className="mb-4">
      {/* Section Heading */}
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Availability</h3>

      {/* Conditional rendering based on whether the component is in editing mode */}
      {isEditing ? (
        // Editing mode: Displays an input field and Save/Cancel buttons.
        <div className="flex">
          {/*
            Input field for editing availability:
            - 'flex-grow': Allows the input to take up available space.
            - Consistent styling with other form inputs (shadow, border, rounded-l-lg).
          */}
          <input
            type="text"
            value={editedAvailability}
            onChange={(e) => setEditedAvailability(e.target.value)}
            className="flex-grow shadow appearance-none border rounded-l-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Weekends, Evenings, Flexible"
            aria-label="Edit availability"
          />
          {/* Save Button */}
          <Button onClick={handleSave} className="rounded-l-none">Save</Button>
          {/* Cancel Button */}
          <Button onClick={handleCancel} variant="secondary" className="ml-2">Cancel</Button>
        </div>
      ) : (
        // Read-only mode: Displays the availability text and an "Edit" button (if editable).
        <p className="text-gray-600">
          {availability || 'Not specified.'} {/* Display availability or a default message */}
          {/*
            "Edit" Button (only shown if 'isEditable' is true):
            - 'ml-4 px-3 py-1 text-sm': Adds left margin, smaller padding, and font size.
            - Calls 'setIsEditing(true)' to switch to editing mode.
          */}
          {isEditable && (
            <Button onClick={() => setIsEditing(true)} variant="secondary" className="ml-4 px-3 py-1 text-sm">Edit</Button>
          )}
        </p>
      )}
    </div>
  );
};

export default AvailabilityDisplay;
