import React, { useState, createContext, useEffect } from 'react';

/**
 * AuthContext
 *
 * This context provides global access to user authentication status and related functions.
 * Components can consume this context to get the current user, check login status,
 * and trigger login/signup/logout actions.
 */
export const AuthContext = createContext(null);

/**
 * AuthProvider
 *
 * This provider component wraps the entire application (or a significant part of it)
 * to make the authentication context available to all its child components.
 *
 * Currently, for development and demonstration purposes, authentication is disabled.
 * It always provides a dummy logged-in user, allowing other components to function
 * as if a user is authenticated, without requiring actual login/signup.
 *
 * Props:
 * - children: React nodes to be rendered within the provider's scope.
 */
export const AuthProvider = ({ children }) => {
  // State to hold the current user object.
  // For now, it's initialized with a dummy user to simulate being always logged in.
  // In a real application, this would typically start as `null` or be derived
  // from a persistent session (e.g., local storage, token validation).
  const [user, setUser] = useState({
    id: 'dummyUserAlwaysLoggedIn',
    name: 'Always Logged In User',
    email: 'dummy@example.com',
    profilePhoto: 'https://placehold.co/150x150/007bff/ffffff?text=DU',
    location: 'Virtual World',
    skillsOffered: ['Debugging', 'Testing', 'Dummy Data Management'],
    skillsWanted: ['Real API Integration', 'Deployment'],
    availability: '24/7',
    isPublic: true,
  });

  // State to indicate if the authentication status is currently being loaded.
  // Set to `false` as authentication is currently disabled and instantly available.
  const [loadingAuth, setLoadingAuth] = useState(false); // Always false for disabled auth

  // --- Dummy Authentication Functions (Disabled for development) ---
  // These functions simulate API calls but do not perform actual authentication.
  // They are included to maintain the API shape expected by consuming components.

  const login = async (email, password) => {
    console.log('AuthContext: Authentication is currently disabled. Skipping dummy login.');
    // Always return success for now to allow other components to proceed.
    return { success: true };
  };

  const signup = async (name, email, password) => {
    console.log('AuthContext: Authentication is currently disabled. Skipping dummy signup.');
    // Always return success for now.
    return { success: true };
  };

  const logout = () => {
    console.log('AuthContext: Authentication is currently disabled. Skipping dummy logout.');
    // For an "always logged in" state, we typically don't actually clear the user here.
    // If you need to test logout UI, you could temporarily uncomment `setUser(null);`
    // setUser(null); // Uncomment this line if you want to simulate a logout for UI testing
  };

  // The value object provided by the context.
  // It exposes the current user, loading status, and authentication functions.
  const contextValue = {
    user,
    loadingAuth,
    login,
    signup,
    logout,
    setUser // Allows other components (like MyProfilePage) to update the user object
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
