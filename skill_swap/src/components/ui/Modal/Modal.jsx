import React from 'react';

/**
 * Modal Component
 *
 * A highly reusable and customizable modal (dialog box) component.
 * It displays content in an overlay on top of the main application UI,
 * typically used for focused interactions like forms, confirmations, or alerts.
 *
 * Props:
 * - isOpen: (Boolean) Controls the visibility of the modal. If true, the modal is displayed.
 * - onClose: (Function) Callback function triggered when the modal needs to be closed,
 * e.g., by clicking the close button or the overlay outside the modal content.
 * - children: React nodes to be rendered inside the modal's content area.
 * - title: (String) The title displayed at the top of the modal.
 */
const Modal = ({ isOpen, onClose, children, title }) => {
  // If the modal is not open, return null to prevent rendering anything,
  // optimizing performance and keeping the DOM clean.
  if (!isOpen) {
    return null;
  }

  return (
    // Outer overlay for the modal:
    // - 'fixed inset-0': Positions the overlay to cover the entire viewport.
    // - 'bg-gray-600 bg-opacity-75': Sets a dark, semi-transparent background,
    //   blurring out the content behind the modal.
    // - 'flex justify-center items-center': Uses flexbox to perfectly center the modal content
    //   horizontally and vertically within the overlay.
    // - 'z-50': Ensures the modal appears on top of all other content.
    // - 'p-4': Adds padding to the overlay itself, preventing the modal content
    //   from touching the screen edges on very small viewports.
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50 p-4">
      {/*
        Modal content container:
        - 'bg-white rounded-lg shadow-xl': Sets a white background, rounded corners,
          and a strong shadow for a prominent, modern look.
        - 'w-full max-w-md md:max-w-lg lg:max-w-xl': Ensures responsiveness.
          Takes full width on small screens, but caps its max-width on medium,
          large, and extra-large screens for optimal readability.
        - 'p-6 relative': Adds internal padding and sets positioning context for absolute children.
        - 'transform transition-all duration-300 scale-100': Prepares for potential
          entry/exit animations (though no specific animation is applied here,
          these classes are good practice for future transitions).
      */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md md:max-w-lg lg:max-w-xl p-6 relative transform transition-all duration-300 scale-100">
        {/*
          Modal Header (Title and Close Button):
          - 'flex justify-between items-center border-b pb-3 mb-4': Uses flexbox to
            align title and close button, adds a bottom border, padding, and margin.
        */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          {/* Modal Title */}
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          {/*
            Close Button:
            - 'text-gray-500 hover:text-gray-700 text-2xl leading-none': Styles the close icon.
            - '&times;': HTML entity for a multiplication sign, commonly used as a close icon.
          */}
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl leading-none" aria-label="Close modal">
            &times;
          </button>
        </div>

        {/*
          Modal Body:
          This is where the main content of the modal (passed via 'children' prop) will be rendered.
        */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
