import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import SubmissionForm from './components/SubmissionForm';
import MapView from './components/MapView';
import ListView from './components/ListView';
import AdminDashboard from './components/AdminDashboard';
import AboutPage from './components/AboutPage';
import LoadingSpinner from './components/LoadingSpinner';
import AlertMessage from './components/AlertMessage';
import { Toilet, SubmissionFormData, ViewMode, FilterOptions, UserLocation, Gender } from './types';
import * as toiletService from './services/toiletService';
import { getCurrentLocation } from './services/geolocationService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('map');
  const [allToilets, setAllToilets] = useState<Toilet[]>([]); // Renamed from toilets
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [appError, setAppError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(true);

  const initialFilters: FilterOptions = {
    codeRequired: null,
    is24Hour: null,
    isStepFree: null,
    gender: null,
    searchText: '',
    sortByDistance: true,
  };
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  const loadToilets = useCallback(async () => {
    setIsLoadingData(true);
    setAppError(null);
    try {
      const data = await toiletService.getToilets();
      setAllToilets(data);
    } catch (error: any) {
      console.error("Error loading toilets:", error);
      setAppError(error.message || "Failed to load toilet data. Please check your connection or Apps Script setup.");
      setAllToilets([]);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  const fetchUserLocation = useCallback(async () => {
    setIsFetchingLocation(true);
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
      setFilters(prev => ({...prev, sortByDistance: true}));
    } catch (error: any) {
      console.warn("Could not get user location:", error.message);
      setUserLocation(null);
      setFilters(prev => ({...prev, sortByDistance: false}));
    } finally {
      setIsFetchingLocation(false);
    }
  }, []);

  useEffect(() => {
    fetchUserLocation();
    loadToilets();
  }, [loadToilets, fetchUserLocation]);

  // Derived state for what toilets to show based on view
  const displayedToilets = useMemo(() => {
    if (currentView === 'admin') {
      return allToilets; // Admin sees all toilets for management
    }
    // Regular users (map, list views) see only verified toilets
    return allToilets.filter(toilet => toilet.isVerified);
  }, [allToilets, currentView]);


  const handleNavigation = (view: ViewMode) => {
    setCurrentView(view);
    if (view === 'about' || view === 'submit') {
      // Allow navigation even if there was a data loading error for other views
    } else if (appError && (view === 'map' || view === 'list' || view === 'admin')) {
      // Keep error if navigating to a data-dependent page with an existing error
    } else {
      setAppError(null); // Clear error for non-data pages or on successful navigation
    }
  };

  const handleFilterChange = useCallback(<K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value,
    }));
  }, []);

  const handleToiletSubmission = async (data: SubmissionFormData, photoBase64?: string): Promise<void> => {
    setAppError(null);
    // No setIsLoadingData(true) here, as it's a quick operation usually.
    try {
      const submissionDataWithGender = {
        ...data,
        gender: data.gender || Gender.AllWelcome,
      };
      const newToilet = await toiletService.addToilet(submissionDataWithGender, photoBase64);
      // Add to allToilets; displayedToilets will update via useMemo
      setAllToilets(prevToilets => [newToilet, ...prevToilets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error: any) {
      console.error("Error submitting toilet:", error);
      throw new Error(error.message || "Submission failed. Please check your input and try again.");
    }
  };

  const handleDeleteToilet = async (id: string): Promise<void> => {
    // Optimistically update UI or show loader
    // setIsLoadingData(true); // Or a more specific loading state for this action
    setAppError(null);
    try {
      await toiletService.deleteToilet(id);
      setAllToilets(prevToilets => prevToilets.filter(t => t.id !== id));
    } catch (error: any) {
      console.error("Error deleting toilet:", error);
      setAppError(error.message || "Failed to delete toilet.");
    } finally {
      // setIsLoadingData(false);
    }
  };

  const handleVerifyToggleToilet = async (id: string): Promise<void> => {
    // setIsLoadingData(true); // Or a more specific loading state
    setAppError(null);
    try {
      const toiletToUpdate = allToilets.find(t => t.id === id);
      if (toiletToUpdate) {
        const updatePayload = {
          ...toiletToUpdate, // Send all fields, backend might expect full object or handle partial
          isVerified: !toiletToUpdate.isVerified
        };
        const updatedToilet = await toiletService.updateToilet(updatePayload);
        setAllToilets(prevToilets => prevToilets.map(t => t.id === id ? updatedToilet : t));
      } else {
        throw new Error("Toilet not found for verification toggle.");
      }
    } catch (error: any) {
      console.error("Error updating toilet verification:", error);
      setAppError(error.message || "Failed to update toilet verification status.");
    } finally {
      // setIsLoadingData(false);
    }
  };


  const renderView = () => {
    if (currentView === 'about') {
      return <AboutPage />;
    }
    if (currentView === 'submit') {
      return <SubmissionForm onSubmit={handleToiletSubmission} />;
    }

    // For map, list, admin views:
    const showOverallLoading = isLoadingData || (isFetchingLocation && (currentView === 'map' || currentView === 'list'));

    // Show main loading spinner only if no data (allToilets) has been loaded yet
    if (showOverallLoading && allToilets.length === 0) {
        return <div className="mt-20 flex-grow flex items-center justify-center"><LoadingSpinner /></div>;
    }

    if (appError) {
        return (
          <div className="p-6 flex-grow flex flex-col items-center justify-center">
            <AlertMessage message={appError} type="error" onClose={() => { setAppError(null); loadToilets(); }} />
            <button
              onClick={loadToilets}
              className="mt-6 px-5 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium shadow-md"
            >
              Retry Loading Data
            </button>
          </div>
        );
    }

    switch (currentView) {
      case 'map':
        // Users see only verified toilets (handled by displayedToilets)
        return <MapView toilets={displayedToilets} filters={filters} onFilterChange={handleFilterChange} userLocation={userLocation} />;
      case 'list':
        // Users see only verified toilets
        return <ListView toilets={displayedToilets} isLoading={isLoadingData} filters={filters} onFilterChange={handleFilterChange} userLocation={userLocation} />;
      case 'admin':
        // Admin sees all toilets for management
        return <AdminDashboard toilets={allToilets} onDeleteToilet={handleDeleteToilet} onVerifyToggleToilet={handleVerifyToggleToilet} isLoading={isLoadingData} />;
      default:
        // Fallback, should ideally show verified toilets like map view
        return <MapView toilets={displayedToilets} filters={filters} onFilterChange={handleFilterChange} userLocation={userLocation} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar currentView={currentView} onNavigate={handleNavigation} />
      <main className="flex-grow container mx-auto px-2 sm:px-4 py-6 sm:py-8">
        {renderView()}
      </main>
      <footer className="bg-slate-800 text-slate-300 text-center p-6 text-sm">
        <p className="font-medium text-slate-200">&copy; {new Date().getFullYear()} Free The Bladder.</p>
        <p className="mt-1">Community-powered relief for everyone. Data bravely served via Google Sheets.</p>
      </footer>
    </div>
  );
};

export default App;