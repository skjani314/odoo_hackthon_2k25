import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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


/**
 * AuthForm Component
 *
 * A highly reusable form component designed for both user login and signup functionalities.
 * It dynamically adjusts its fields and submission text based on the 'type' prop.
 *
 * Props:
 * - type: (String) Specifies the form's purpose. Accepted values: 'login' or 'signup'.
 * - onSubmit: (Function) Callback function triggered when the form is submitted.
 * It receives an object containing the form data (email, password, and optionally name).
 * - isLoading: (Boolean) If true, displays a loading spinner in the submit button and disables it.
 * - error: (Optional String) An error message to display at the top of the form.
 */
const AuthForm = ({ type, onSubmit, isLoading, error }) => {
  // State to manage the form input values.
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Handler for input field changes, updates the corresponding state.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for form submission.
  // Prevents default form submission and calls the 'onSubmit' prop with current form data.
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    // Form container with consistent styling: white background, padding, rounded corners, shadow.
    // 'w-full max-w-sm mx-auto': Ensures responsiveness, takes full width on small screens,
    // caps max-width on larger screens, and centers horizontally.
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm mx-auto">
      {/* Form Title */}
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        {type === 'login' ? 'Login' : 'Sign Up'} {/* Dynamic title based on 'type' prop */}
      </h2>

      {/* Error Message display */}
      <ErrorMessage message={error} />

      {/*
        Name Input Field (only for signup form):
        - Conditionally rendered based on 'type' prop.
        - Uses the reusable InputField component.
      */}
      {type === 'signup' && (
        <InputField
          label="Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
        />
      )}

      {/* Email Input Field */}
      <InputField
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="your@example.com"
        required
      />

      {/* Password Input Field */}
      <InputField
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="********"
        required
      />

      {/*
        Submit Button:
        - Uses the reusable Button component.
        - 'w-full mt-4': Takes full width and adds top margin.
        - 'disabled={isLoading}': Disables the button when loading.
        - Dynamically displays "Login", "Sign Up", or a LoadingSpinner.
      */}
      <Button type="submit" className="w-full mt-4" disabled={isLoading}>
        {isLoading ? <LoadingSpinner /> : (type === 'login' ? 'Login' : 'Sign Up')}
      </Button>

      {/*
        Conditional Links for switching between Login/Signup:
        - Provides a link to switch to the other authentication form.
        - Uses hash-based links for now, compatible with our current simple routing.
      */}
      {type === 'login' && (
        <p className="text-center text-sm mt-4 text-gray-600">
          Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
        </p>
      )}
      {type === 'signup' && (
        <p className="text-center text-sm mt-4 text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      )}
    </form>
  );
};

export default AuthForm;
