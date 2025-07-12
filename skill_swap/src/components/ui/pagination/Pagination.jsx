import React from 'react';
// Assuming the Button component is available and imported by you.
// It is a reusable UI component that Pagination will utilize.

/**
 * Pagination Component
 *
 * A reusable component for navigating through paginated lists of data.
 * It displays "Previous" and "Next" buttons, along with individual page numbers,
 * allowing users to easily browse through results.
 *
 * Props:
 * - currentPage: (Number) The currently active page number.
 * - totalPages: (Number) The total number of available pages.
 * - onPageChange: (Function) Callback function triggered when a page button is clicked.
 * It receives the new page number as an argument.
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Generate an array of page numbers from 1 to totalPages.
  // This array will be used to render individual page buttons.
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    // Navigation container for pagination controls.
    // 'flex justify-center items-center': Uses flexbox to center the controls horizontally.
    // 'space-x-2': Adds horizontal spacing between the buttons.
    // 'my-8': Provides vertical margin above and below the pagination block.
    <nav className="flex justify-center items-center space-x-2 my-8" aria-label="Pagination">
      {/*
        "Previous" Button:
        - Calls 'onPageChange' with 'currentPage - 1' when clicked.
        - 'disabled={currentPage === 1}': Disables the button when on the first page.
        - 'variant="secondary"': Uses the secondary button style.
        - 'px-3 py-1 text-sm md:px-4 md:py-2': Responsive padding and font size for the button,
          making it slightly smaller on mobile and larger on desktop.
      */}
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="secondary"
        className="px-3 py-1 text-sm md:px-4 md:py-2"
      >
        Previous
      </Button>

      {/*
        Individual Page Number Buttons:
        - Maps over the 'pages' array to create a button for each page.
        - 'key={page}': Essential for React list rendering performance and stability.
        - 'onClick={() => onPageChange(page)}': Navigates to the clicked page.
        - 'variant={currentPage === page ? 'primary' : 'secondary'}':
          Highlights the current page with the primary button style, others with secondary.
        - Responsive padding and font size, consistent with the "Previous" button.
      */}
      {pages.map((page) => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          variant={currentPage === page ? 'primary' : 'secondary'}
          className="px-3 py-1 text-sm md:px-4 md:py-2"
        >
          {page}
        </Button>
      ))}

      {/*
        "Next" Button:
        - Calls 'onPageChange' with 'currentPage + 1' when clicked.
        - 'disabled={currentPage === totalPages}': Disables the button when on the last page.
        - Responsive padding and font size, consistent with other pagination buttons.
      */}
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="secondary"
        className="px-3 py-1 text-sm md:px-4 md:py-2"
      >
        Next
      </Button>
    </nav>
  );
};

export default Pagination;
