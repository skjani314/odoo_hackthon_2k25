import React, { useState } from 'react';

// --- Reusable Button Component (Included for self-containment) ---
/**
 * Button Component
 * A highly reusable button component with various styling options.
 *
 * Props:
 * - onClick: Function to be called when the button is clicked.
 * - children: The content to be displayed inside the button (e.g., text, icons).
 * - variant: Defines the button's visual style ('primary', 'secondary', 'danger', 'outline').
 * Defaults to 'primary'.
 * - className: Additional Tailwind CSS classes to apply for custom styling.
 * - disabled: Boolean to disable the button, changing its appearance and preventing clicks.
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
 * SearchBar Component
 *
 * A reusable search input field with an integrated search button.
 * It allows users to enter a query and trigger a search action.
 *
 * Props:
 * - onSearch: (Function) Callback function triggered when the search button is clicked
 * or Enter is pressed. It receives the current search query string as an argument.
 * - placeholder: (Optional String) Text displayed inside the input when it's empty,
 * providing a hint about what to search for.
 */
const SearchBar = ({ onSearch, placeholder = 'Search...' }) => {
  // State to hold the current value of the search input field.
  const [query, setQuery] = useState('');

  // Handler for input change, updates the 'query' state.
  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  // Handler for form submission (when search button is clicked or Enter is pressed).
  // Prevents default form submission behavior and calls the 'onSearch' prop with the current query.
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim()); // Trim whitespace from the query before sending
  };

  return (
    // Form element to encapsulate the search input and button.
    // 'flex w-full max-w-xl mx-auto mb-8': Uses flexbox for layout, takes full width on small screens,
    // caps max-width on larger screens, centers horizontally, and adds bottom margin.
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl mx-auto mb-8">
      {/*
        Search Input Field:
        - 'flex-grow': Allows the input field to take up most of the available space.
        - 'shadow appearance-none border rounded-l-lg': Consistent styling with other form inputs.
        - 'py-3 px-4': Larger padding for a more prominent search bar.
        - 'text-gray-700 leading-tight': Text styling.
        - 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent':
          Custom focus styles for accessibility and visual feedback.
      */}
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-grow shadow appearance-none border rounded-l-lg py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-label={placeholder} // Accessibility for screen readers
      />

      {/*
        Search Button:
        - Uses the reusable 'Button' component.
        - 'type="submit"': Ensures the button triggers form submission.
        - 'rounded-l-none': Removes the left rounded corner to seamlessly connect with the input.
      */}
      <Button type="submit" className="rounded-l-none">Search</Button>
    </form>
  );
};

export default SearchBar;
