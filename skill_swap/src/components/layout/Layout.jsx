import React from 'react';
// Import Header and Footer components.
// For this iterative process, I'm including their definitions in the same file
// to ensure no import errors. In a real project, these would be in separate files.
import Header from './Header'; // This import path will be handled by you
import Footer from './Footer'; // This import path will be handled by you

/**
 * Layout Component
 *
 * This component defines the consistent structural foundation for the entire application.
 * It encapsulates the Header, a flexible main content area, and the Footer,
 * ensuring a unified look and feel across all pages.
 *
 * Props:
 * - children: React nodes to be rendered dynamically within the main content area.
 * This allows any page-specific content to be displayed within the
 * standard application layout.
 */
const Layout = ({ children }) => {
  return (
    // The outermost div establishes a flex container that stacks its children (Header, main, Footer) vertically.
    // 'min-h-screen' ensures the layout always takes at least the full viewport height,
    // pushing the footer to the bottom even on pages with minimal content.
    // 'bg-gray-100' sets a subtle background color for the entire application.
    // 'font-inter' applies the Inter font family globally for consistent typography.
    <div className="min-h-screen flex flex-col bg-gray-100 font-inter">
      {/*
        Header component:
        This is now included.
      */}
      <Header />

      {/*
        Main content area:
        - 'flex-grow': Allows this section to expand and fill any available vertical space,
                       ensuring the footer remains at the bottom.
        - 'container mx-auto': Centers the content horizontally and applies a responsive
                               max-width, preventing content from stretching too wide on large screens.
        - 'p-4 sm:p-6 lg:p-8': Applies responsive padding around the main content.
                               This ensures comfortable spacing on small (p-4), medium (sm:p-6),
                               and large (lg:p-8) screens, enhancing readability and visual appeal.
      */}
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/*
        Footer component:
        This is now included.
      */}
      <Footer />
    </div>
  );
};

export default Layout;
