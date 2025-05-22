import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div 
      className="flex justify-center items-center p-4" 
      data-testid="loading-spinner-container" 
      role="alert" // Use 'alert' if it's announcing loading of new content, or 'status' for general busy indicator
      aria-busy="true" 
      aria-live="polite" // polite or assertive depending on urgency
      aria-label="Loading content" // Descriptive label
    >
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-sky-500"></div>
    </div>
  );
};

export default LoadingSpinner;