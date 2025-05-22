// Fix: Add triple-slash directive to ensure Jest-DOM matchers are recognized by TypeScript
/// <reference types="@testing-library/jest-dom" />

import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi } from 'vitest';
// Fix: Import LoadingSpinner component.
import LoadingSpinner from './components/LoadingSpinner';

// Mock navigator.geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn(),
  watchPosition: vi.fn()
};
// Fix: Replace 'global' with 'globalThis' for standard global object access.
vi.stubGlobal('navigator', {
    ...globalThis.navigator, // Preserve other navigator properties
    geolocation: mockGeolocation
});


// Mock toiletService
vi.mock('./services/toiletService', () => ({
  getToilets: vi.fn(() => Promise.resolve([])),
  addToilet: vi.fn(() => Promise.resolve({})),
  updateToilet: vi.fn(() => Promise.resolve({})),
  deleteToilet: vi.fn(() => Promise.resolve({})),
}));


describe('App', () => {
  it('renders the Navbar', () => {
    // Mock getCurrentPosition to resolve successfully for initial location fetch
    mockGeolocation.getCurrentPosition.mockImplementationOnce((success) => success({
        coords: { latitude: 51.5074, longitude: -0.1278, accuracy: 100, altitude: null, altitudeAccuracy: null, heading: null, speed: null },
        timestamp: Date.now()
      } as GeolocationPosition)
    );

    render(<App />);
    // Check for a piece of text or element that is reliably in the Navbar
    // For example, if the logo alt text is always present:
    expect(screen.getByAltText('Free The Bladder Logo')).toBeInTheDocument();
  });

  it('shows loading spinner initially while fetching data', async () => {
    // Mock getCurrentPosition for this test
    mockGeolocation.getCurrentPosition.mockImplementationOnce((success) => success({
      coords: { latitude: 51.5074, longitude: -0.1278, accuracy: 100, altitude: null, altitudeAccuracy: null, heading: null, speed: null },
      timestamp: Date.now()
    } as GeolocationPosition));
    
    // Make getToilets take a moment to resolve
    vi.mocked(await import('./services/toiletService')).getToilets.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve([]), 100)));


    render(<App />);
    // Check for the loading spinner. The class name might be specific.
    // If LoadingSpinner renders a div with class 'animate-spin', this could work:
    // This needs to be robust to the actual output of LoadingSpinner
    expect(screen.getByRole('alert', { name: /loading/i, hidden: true }) || screen.getByTestId('loading-spinner-container')).toBeInTheDocument();
    // Wait for loading to complete (spinner to disappear)
    // await screen.findByAltText('Free The Bladder Logo'); // or some other element that appears after load
  });
});

// Simple test for LoadingSpinner component
describe('LoadingSpinner', () => {
    it('renders the spinner element', () => {
      render(<LoadingSpinner />);
      const spinner = screen.getByRole('alert', {name: /loading/i, hidden: true})?.firstChild; // Assuming the spinner is inside a div with role alert
      if (spinner) { // Check if spinner is found
         expect(spinner).toHaveClass('animate-spin');
      } else {
        // Fallback or specific test for how LoadingSpinner is structured
        // For example, if it has a data-testid
        const spinnerContainer = screen.getByTestId('loading-spinner-container'); // Add data-testid to LoadingSpinner
        expect(spinnerContainer.firstChild).toHaveClass('animate-spin');
      }
    });
  });

// Add a data-testid to LoadingSpinner for easier testing
// components/LoadingSpinner.tsx:
// const LoadingSpinner: React.FC = () => {
//   return (
//     <div className="flex justify-center items-center p-4" data-testid="loading-spinner-container" role="alert" aria-busy="true" aria-live="polite" aria-label="Loading content">
//       <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-sky-500"></div>
//     </div>
//   );
// };
// Note: The LoadingSpinner was updated to include data-testid and ARIA attributes.
// This is a better way to test its presence if its internal structure changes.
// The original LoadingSpinner.tsx will be updated to reflect this.