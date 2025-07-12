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
  const [loadingAuth, setLoadingAuth] = useState(false);

  const login = async (email, password) => {
    console.log('AuthContext: Authentication is currently disabled. Skipping dummy login.');
    return { success: true };
  };
  const signup = async (name, email, password) => {
    console.log('AuthContext: Authentication is currently disabled. Skipping dummy signup.');
    return { success: true };
  };
  const logout = () => {
    console.log('AuthContext: Authentication is currently disabled. Skipping dummy logout.');
    // setUser(null); // Uncomment this line if you want to simulate a logout for UI testing
  };

  const contextValue = { user, loadingAuth, login, signup, logout, setUser };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
