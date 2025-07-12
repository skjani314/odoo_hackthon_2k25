import React from 'react';

/**
 * ErrorMessage Component
 *
 * A simple and reusable component to display error messages to the user.
 * It provides clear visual feedback for issues like form validation errors,
 * API call failures, or other informational alerts.
 *
 * Props:
 * - message: (String) The error message text to be displayed.
 * If the message is empty or null, the component will not render.
 */
const ErrorMessage = ({ message }) => {
  // If no message is provided, the component does not render,
  // preventing empty error boxes from appearing.
  if (!message) {
    return null;
  }

  return (
    // Container div for the error message.
    // 'bg-red-100 border border-red-400 text-red-700': Provides a soft red background,
    // a darker red border, and red text for clear error indication.
    // 'px-4 py-3 rounded-lg relative mb-4': Adds padding, rounded corners,
    // and consistent bottom margin for spacing in forms.
    // 'role="alert"': Important for accessibility, informing screen readers that
    // this element conveys an important, time-sensitive message.
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
      {/*
        Strong bold text for emphasis:
        - 'font-bold': Makes the "Error!" text stand out.
      */}
      <strong className="font-bold">Error!</strong>
      {/*
        The actual error message:
        - 'block sm:inline': Displays as a block on small screens (if it wraps)
          and inline on larger screens, ensuring good flow.
      */}
      <span className="block sm:inline"> {message}</span>
    </div>
  );
};

export default ErrorMessage;
