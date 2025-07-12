import React from 'react';

/**
 * Footer Component
 *
 * This component provides the application's footer, typically containing
 * copyright information and links to legal pages like Privacy Policy and Terms of Service.
 * It is designed to be simple, consistent, and responsive across all devices.
 */
const Footer = () => {
  return (
    // The footer element with a dark gray background and white text.
    // 'p-6' provides consistent padding around the footer content.
    // 'mt-8' adds a top margin to separate it from the main content.
    <footer className="bg-gray-800 text-white p-6 mt-8">
      {/*
        Container for footer content:
        - 'container mx-auto': Centers the content horizontally and applies a responsive max-width.
        - 'text-center': Centers the text content within the footer.
        - 'text-sm': Sets a smaller font size for copyright and links.
      */}
      <div className="container mx-auto text-center text-sm">
        {/* Copyright information, dynamically updated with the current year */}
        <p>&copy; {new Date().getFullYear()} SkillSwap. All rights reserved.</p>

        {/*
          Additional links (e.g., Privacy Policy, Terms of Service):
          - 'mt-2': Adds a small top margin for separation from the copyright text.
          - 'space-x-4': Adds horizontal spacing between the links.
          - 'hover:text-gray-300': Provides a subtle hover effect for visual feedback.
        */}
        <div className="mt-2 space-x-4">
          <a href="#" className="hover:text-gray-300 transition duration-150 ease-in-out">Privacy Policy</a>
          <a href="#" className="hover:text-gray-300 transition duration-150 ease-in-out">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
