import React from 'react';

/**
 * LoadingSpinner Component
 *
 * A simple and reusable visual indicator to show that content is being loaded
 * or an operation is in progress. This enhances user experience by providing
 * feedback and preventing perceived unresponsiveness.
 *
 * Props: None. It's a purely presentational component.
 */
const LoadingSpinner = () => {
  return (
    // Container div to center the spinner.
    // 'flex justify-center items-center py-4': Uses flexbox to center the spinner
    // horizontally and vertically, with some vertical padding.
    <div className="flex justify-center items-center py-4">
      {/*
        The spinner element:
        - 'animate-spin': Tailwind's utility for a continuous 360-degree rotation animation.
        - 'rounded-full': Makes the div a perfect circle.
        - 'h-8 w-8': Sets a fixed size for the spinner.
        - 'border-b-2 border-blue-600': Creates the visual effect of a spinner.
          'border-b-2' applies a border only to the bottom, and 'border-blue-600'
          gives it a distinct color, making the animation visible.
      */}
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
};

export default LoadingSpinner;
