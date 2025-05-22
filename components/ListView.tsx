
import React, { useMemo, useState } from 'react';
import { Toilet, FilterOptions, UserLocation } from '../types';
import ToiletCard from './ToiletCard';
import Modal from './Modal';
import FilterControls from './FilterControls';
import LoadingSpinner from './LoadingSpinner';
import { calculateDistance } from '../services/geolocationService';

interface ListViewProps {
  toilets: Toilet[]; // This will be pre-filtered (e.g., only verified) if not admin
  isLoading: boolean;
  filters: FilterOptions;
  onFilterChange: <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => void;
  userLocation: UserLocation | null;
}

const ListView: React.FC<ListViewProps> = ({ toilets, isLoading, filters, onFilterChange, userLocation }) => {
  const [selectedToilet, setSelectedToilet] = useState<Toilet | null>(null);

  const filteredAndSortedToilets = useMemo(() => {
    // The 'toilets' prop is already potentially filtered (e.g. only verified ones for users)
    let sortedToilets = [...toilets]; 

    if (filters.sortByDistance && userLocation) {
      sortedToilets.sort((a, b) => {
        const distA = calculateDistance(userLocation.latitude, userLocation.longitude, a.latitude, a.longitude);
        const distB = calculateDistance(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude);
        return distA - distB;
      });
    } else {
      // Fallback sort if not sorting by distance or no location
      sortedToilets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    return sortedToilets.filter(toilet => {
      const searchTextLower = filters.searchText.toLowerCase();
      const matchesSearch = toilet.name.toLowerCase().includes(searchTextLower) ||
                            toilet.address.toLowerCase().includes(searchTextLower) ||
                            (toilet.notes && toilet.notes.toLowerCase().includes(searchTextLower));
      
      const matchesCode = filters.codeRequired === null || 
                          (filters.codeRequired === true && !!toilet.code && toilet.code.toLowerCase() !== 'n/a' && toilet.code !== '') ||
                          (filters.codeRequired === false && (!toilet.code || toilet.code.toLowerCase() === 'n/a' || toilet.code === ''));
      
      const matches24Hour = filters.is24Hour === null || toilet.is24Hour === filters.is24Hour;
      const matchesStepFree = filters.isStepFree === null || toilet.isStepFree === filters.isStepFree;
      const matchesGender = filters.gender === null || toilet.gender === filters.gender;
      // No explicit 'isVerified' filter here as the parent `App` component handles that differentiation

      return matchesSearch && matchesCode && matches24Hour && matchesStepFree && matchesGender;
    });
  }, [toilets, filters, userLocation]);

  const handleCardClick = (toilet: Toilet) => {
    setSelectedToilet(toilet);
  };

  const closeModal = () => {
    setSelectedToilet(null);
  };

  // Show spinner only if initial data is loading and nothing is displayed yet
  if (isLoading && toilets.length === 0 && filteredAndSortedToilets.length === 0) { 
    return <div className="pt-10"><LoadingSpinner /></div>;
  }

  return (
    <div className="container mx-auto p-0 sm:p-4">
      <FilterControls 
        filters={filters} 
        onFilterChange={onFilterChange}
        isLocationAvailable={!!userLocation}
        showSortByDistance={true}
      />
      
      {filteredAndSortedToilets.length === 0 && !isLoading && (
         <div className="text-center py-12">
            <p className="text-5xl mb-4">🚽</p>
            <p className="text-xl text-slate-600 font-medium">No toilets found matching your criteria.</p>
            <p className="text-slate-500">Try adjusting filters or broadening your search!</p>
            { toilets.length > 0 && <p className="text-slate-500 mt-2 text-sm">(Note: You are viewing verified toilets. More may be pending review.)</p>}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedToilets.map(toilet => (
          <ToiletCard 
            key={toilet.id} 
            toilet={toilet} 
            userLocation={userLocation} 
            onSelect={handleCardClick} 
          />
        ))}
      </div>
      {/* Show loading spinner at the bottom if loading more or refreshing and some data is already visible */}
      {isLoading && (filteredAndSortedToilets.length > 0 || toilets.length > 0) && <div className="pt-10"><LoadingSpinner /></div>}


      {selectedToilet && (
        <Modal isOpen={!!selectedToilet} onClose={closeModal} title={selectedToilet.name}>
          <ToiletCard toilet={selectedToilet} userLocation={userLocation} isDetailedView={true} />
        </Modal>
      )}
    </div>
  );
};

export default ListView;
    