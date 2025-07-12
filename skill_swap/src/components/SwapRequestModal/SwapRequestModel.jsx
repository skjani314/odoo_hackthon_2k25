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
 */
const InputField = ({ label, type = 'text', name, value, onChange, placeholder, error, required = false }) => {
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

// --- Reusable TextAreaField Component (Included for self-containment) ---
/**
 * TextAreaField Component
 * A highly reusable and customizable text area component.
 */
const TextAreaField = ({ label, name, value, onChange, placeholder, error, rows = 4, required = false }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700 text-sm font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className={`shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y ${error ? 'border-red-500' : 'border-gray-300'}`}
      ></textarea>
      {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
    </div>
  );
};

// --- Reusable LoadingSpinner Component (Included for self-containment) ---
/**
 * LoadingSpinner Component
 * A simple and reusable visual indicator for loading states.
 */
const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
};

// --- Reusable ErrorMessage Component (Included for self-containment) ---
/**
 * ErrorMessage Component
 * A simple and reusable component to display error messages.
 */
const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
      <strong className="font-bold">Error!</strong>
      <span className="block sm:inline"> {message}</span>
    </div>
  );
};

// --- Reusable Modal Component (Included for self-containment) ---
/**
 * Modal Component
 * A highly reusable and customizable modal (dialog box) component.
 */
const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md md:max-w-lg lg:max-w-xl p-6 relative transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl leading-none" aria-label="Close modal">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};


/**
 * SwapRequestModal Component
 *
 * This component provides a modal form for initiating a skill swap request
 * to a specific recipient user. It includes a text area for the message and
 * handles the submission process, showing loading and error states.
 *
 * Props:
 * - isOpen: (Boolean) Controls the visibility of the modal.
 * - onClose: (Function) Callback to close the modal.
 * - onSubmit: (Function) Callback triggered when the form is submitted.
 * It receives the message string as an argument. Expected to handle API call.
 * Should return an object like { success: boolean, error?: string }.
 * - recipientUser: (Object) The user object of the recipient of the swap request.
 * Expected to have at least a 'name' property.
 */
const SwapRequestModal = ({ isOpen, onClose, onSubmit, recipientUser }) => {
  // State to hold the message typed by the user.
  const [message, setMessage] = useState('');
  // State to manage the loading status during submission.
  const [isLoading, setIsLoading] = useState(false);
  // State to store and display any error messages.
  const [error, setError] = useState('');

  /**
   * Handles the form submission for sending a swap request.
   * Prevents default form behavior, calls the 'onSubmit' prop,
   * and manages loading/error states.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    setError(''); // Clear previous errors

    try {
      // Call the 'onSubmit' prop, which is expected to handle the actual API call.
      const result = await onSubmit(message);

      if (!result || !result.success) {
        // If submission failed, set the error message.
        setError(result?.error || 'Failed to send request.');
      } else {
        // If successful, clear the message and close the modal.
        setMessage('');
        onClose();
      }
    } catch (err) {
      // Catch any unexpected errors during the submission process.
      console.error('Swap request submission error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    // Uses the reusable Modal component to wrap the form content.
    <Modal isOpen={isOpen} onClose={onClose} title={`Send Swap Request to ${recipientUser?.name}`}>
      <form onSubmit={handleSubmit}>
        {/* Display error messages */}
        <ErrorMessage message={error} />

        {/* Informational text about the recipient */}
        <p className="text-gray-700 mb-4">
          You are requesting a skill swap with <span className="font-semibold">{recipientUser?.name}</span>.
          Consider mentioning which of your skills you'd like to offer and which of their skills you're interested in.
        </p>

        {/* Message input field using reusable TextAreaField */}
        <TextAreaField
          label="Your Message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Hi, I'm interested in your [skill] and can offer [my skill]. Let me know!"
          rows={5}
          required
        />

        {/*
          Action buttons (Send Request and Cancel):
          - 'flex justify-end space-x-4 mt-6': Aligns buttons to the right with spacing.
        */}
        <div className="flex justify-end space-x-4 mt-6">
          {/* Send Request Button */}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : 'Send Request'} {/* Show spinner when loading */}
          </Button>
          {/* Cancel Button */}
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SwapRequestModal;
