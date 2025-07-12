import React, { useState, useContext, createContext } from 'react';
import { Menu, X } from 'lucide-react'; // Importing icons from lucide-react

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
  // Base styles applied to all buttons for consistent padding, rounded corners, font, and transitions.
  const baseStyles = 'px-4 py-2 rounded-lg font-semibold transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-75';

  // Variant-specific styles for different button appearances.
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

// --- Dummy AuthContext and AuthProvider (Included for self-containment) ---
// In a real application, AuthContext and AuthProvider would typically reside
// in a separate file (e.g., 'src/context/AuthContext.jsx') and manage actual
// authentication state using Firebase or a custom backend.
const AuthContext = createContext(null);

// This AuthProvider is a simplified version for demonstration purposes,
// simulating a logged-in user and a logout function.
const AuthProvider = ({ children }) => {
  // State to simulate a user being logged in. Initially, a dummy user is set.
  // Set to `null` to simulate a logged-out state.
  const [user, setUser] = useState({ id: 'dummyUser123', name: 'Test User' }); // Simulate logged-in user

  // Dummy logout function. In a real app, this would clear session, tokens, etc.
  const logout = () => {
    console.log("Dummy logout called: User logged out.");
    setUser(null); // Simulate logging out by setting user to null
  };

  // The context provider makes `user` and `logout` available to any
  // component wrapped by this provider.
  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


/**
 * Header Component
 *
 * This component represents the application's header, providing navigation,
 * branding (SkillSwap title), and user authentication status (Login/Signup/My Profile/Logout).
 * It is designed to be highly responsive, adapting its layout for mobile and desktop views.
 *
 * It consumes the AuthContext to dynamically change its display based on whether a user is logged in
 * and to provide the logout functionality. It utilizes Lucide React icons for a modern mobile menu toggle.
 */
const Header = () => {
  // Access user authentication status and logout function from AuthContext.
  // This allows the header to dynamically change based on whether a user is logged in.
  const { user, logout } = useContext(AuthContext);

  // State to control the visibility of the mobile navigation menu.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    // The header element with a vibrant blue background, subtle shadow, and responsive padding.
    // 'sticky top-0 z-40' ensures the header remains visible at the top when scrolling,
    // providing persistent navigation. 'z-40' gives it a high stacking order to appear
    // above other content.
    <header className="bg-blue-600 text-white shadow-md p-4 sticky top-0 z-40">
      {/*
        Container for header content:
        - 'container mx-auto': Centers the content horizontally and applies a responsive max-width,
                               preventing content from stretching too wide on very large screens.
        - 'flex justify-between items-center flex-wrap': Uses flexbox for alignment.
          'justify-between' spaces items evenly (title on left, menu/toggle on right).
          'items-center' vertically aligns them in the middle.
          'flex-wrap' allows items to wrap to the next line on smaller screens if they don't fit.
      */}
      <div className="container mx-auto flex justify-between items-center flex-wrap">
        {/* Application Title/Logo */}
        <h1 className="text-2xl font-bold">SkillSwap</h1>

        {/*
          Mobile Menu Toggle Button:
          - Only visible on small screens ('md:hidden').
          - Toggles the 'isMobileMenuOpen' state to show/hide the navigation menu.
          - Uses Lucide React icons (<Menu /> for closed, <X /> for open) for a modern, clear visual.
          - 'p-2 rounded-lg hover:bg-blue-700': Adds padding, rounded corners, and a hover effect
            for better touch target and visual feedback.
          - 'focus:outline-none': Removes default focus outline for cleaner UI.
          - 'aria-label': Provides accessibility for screen readers.
        */}
        <button
          className="md:hidden text-white focus:outline-none p-2 rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/*
          Navigation Menu:
          - 'w-full md:w-auto': Takes full width on mobile (when open), and auto width on medium screens and up.
          - 'md:flex': Always displays as a flex container on medium screens and up.
          - '${isMobileMenuOpen ? 'block' : 'hidden'}': Dynamically shows/hides the menu on mobile
            based on the 'isMobileMenuOpen' state.
          - 'md:!block': On medium screens and up, this `!important` utility ensures the navigation
            is always displayed as a block, overriding any `hidden` state from mobile.
        */}
        <nav className={`w-full md:w-auto md:flex ${isMobileMenuOpen ? 'block' : 'hidden'} md:!block`}>
          {/*
            Navigation Links List:
            - 'flex flex-col md:flex-row': Stacks links vertically on mobile, horizontally on desktop.
            - 'md:space-x-6': Adds horizontal spacing between links on desktop.
            - 'space-y-2 md:space-y-0': Adds vertical spacing between links on mobile, removes on desktop.
            - 'mt-4 md:mt-0': Adds top margin on mobile when menu expands, removes on desktop.
            - 'text-lg': Sets a consistent, legible font size for navigation links.
            - 'bg-blue-700 md:bg-transparent p-4 md:p-0 rounded-lg md:rounded-none':
              Adds a distinct background to the mobile menu when open for better visual separation
              and rounded corners. This background becomes transparent on desktop.
          */}
          <ul className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0 mt-4 md:mt-0 text-lg bg-blue-700 md:bg-transparent p-4 md:p-0 rounded-lg md:rounded-none">
            <li><a href="#" className="block py-2 md:py-0 hover:text-blue-200 transition duration-150 ease-in-out">Home</a></li>
            <li><a href="#browse-skills" className="block py-2 md:py-0 hover:text-blue-200 transition duration-150 ease-in-out">Browse Skills</a></li>
            {/* Conditional rendering based on user login status */}
            {user ? (
              <>
                <li><a href="#my-profile" className="block py-2 md:py-0 hover:text-blue-200 transition duration-150 ease-in-out">My Profile</a></li>
                {/* Logout button, using the reusable Button component */}
                <li><Button onClick={logout} variant="outline" className="w-full md:w-auto text-white border-white hover:bg-blue-800 mt-2 md:mt-0">Logout</Button></li>
              </>
            ) : (
              <>
                <li><a href="#login" className="block py-2 md:py-0 hover:text-blue-200 transition duration-150 ease-in-out">Login</a></li>
                <li><a href="#signup" className="block py-2 md:py-0 hover:text-blue-200 transition duration-150 ease-in-out">Signup</a></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

// To make this component runnable in isolation for testing,
// you might want to wrap it in a dummy App structure like this:
/*
const App = () => {
  return (
    <AuthProvider>
      <Header />
      <div className="p-8 text-center text-gray-700">
        <p>Main content would go here.</p>
        <p>Try resizing the window to see responsiveness.</p>
      </div>
    </AuthProvider>
  );
};
export default App;
*/

export default Header; // Exporting Header as the primary component for this file
