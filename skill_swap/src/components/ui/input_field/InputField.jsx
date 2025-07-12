import React from 'react';

/**
 * Button Component
 *
 * A highly reusable and customizable button component designed for various interactive actions
 * across the Skill Swap platform. It supports different visual styles (variants),
 * accepts additional Tailwind CSS classes for fine-tuning, and handles disabled states.
 *
 * Props:
 * - onClick: Function to be executed when the button is clicked.
 * - children: React nodes (e.g., text, icons) to be displayed inside the button.
 * - variant: (Optional) Defines the button's visual style.
 * Accepted values: 'primary', 'secondary', 'danger', 'outline'.
 * Defaults to 'primary' if not specified.
 * - className: (Optional) Additional Tailwind CSS classes to apply for custom styling,
 * allowing for overrides or extensions of the default styles.
 * - disabled: (Optional) Boolean flag. If true, the button will be visually
 * disabled (reduced opacity, no hover effects) and non-interactive.
 * Defaults to false.
 */
const Button = ({ onClick, children, variant = 'primary', className = '', disabled = false }) => {
  // Base styles applied to all buttons for consistent padding, rounded corners, font weight,
  // and smooth transitions on hover/focus.
  // 'focus:outline-none focus:ring-2 focus:ring-opacity-75' provides accessible focus states.
  const baseStyles = 'px-4 py-2 rounded-lg font-semibold transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-75';

  // Object defining different visual variants for the button.
  // Each variant has specific background, text, hover, and focus ring colors.
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  };

  return (
    <button
      // The onClick handler is passed directly from props.
      onClick={onClick}
      // Combine base styles, variant-specific styles, disabled styles, and any additional custom classes.
      // The 'disabled' prop dynamically applies opacity and changes cursor for non-interactivity.
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      // The HTML 'disabled' attribute is set based on the 'disabled' prop.
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
