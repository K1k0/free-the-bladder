
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Toilet, FilterOptions, UserLocation } from '../types';
import { LONDON_BOUNDS, MAP_CONTAINER_DIMENSIONS, VIBE_TEXT_COLORS } from '../constants';
import LocationPin from './LocationPin';
import Modal from './Modal';
import ToiletCard from './ToiletCard';
import FilterControls from './FilterControls';
import { calculateDistance } from '../services/geolocationService';

interface MapViewProps {
  toilets: Toilet[]; // This will be pre-filtered (e.g., only verified) if not admin
  filters: FilterOptions;
  onFilterChange: <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => void;
  userLocation: UserLocation | null;
}

const MapView: React.FC<MapViewProps> = ({ toilets, filters, onFilterChange, userLocation }) => {
  const [selectedToilet, setSelectedToilet] = useState<Toilet | null>(null);
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateMapDimensions = () => {
      if (mapContainerRef.current) {
        setMapDimensions({
          width: mapContainerRef.current.offsetWidth,
          height: parseInt(MAP_CONTAINER_DIMENSIONS.height, 10) || 500,
        });
      }
    };

    updateMapDimensions();
    window.addEventListener('resize', updateMapDimensions);
    return () => window.removeEventListener('resize', updateMapDimensions);
  }, []);

  const getPinPosition = useCallback((lat: number, lng: number) => {
    if (mapDimensions.width === 0 || mapDimensions.height === 0) {
      return { x: 0, y: 0, visible: false };
    }

    const clampedLng = Math.max(LONDON_BOUNDS.minLng, Math.min(lng, LONDON_BOUNDS.maxLng));
    const clampedLat = Math.max(LONDON_BOUNDS.minLat, Math.min(lat, LONDON_BOUNDS.maxLat));

    const x = ((clampedLng - LONDON_BOUNDS.minLng) / (LONDON_BOUNDS.maxLng - LONDON_BOUNDS.minLng)) * mapDimensions.width;
    const y = ((LONDON_BOUNDS.maxLat - clampedLat) / (LONDON_BOUNDS.maxLat - LONDON_BOUNDS.minLat)) * mapDimensions.height;
    
    const visible = lng >= LONDON_BOUNDS.minLng && lng <= LONDON_BOUNDS.maxLng &&
                    lat >= LONDON_BOUNDS.minLat && lat <= LONDON_BOUNDS.maxLat;

    return { x, y, visible };
  }, [mapDimensions]);

  const filteredToilets = useMemo(() => {
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
                          (filters.codeRequired === true && !!toilet.code) ||
                          (filters.codeRequired === false && !toilet.code);
      
      const matches24Hour = filters.is24Hour === null || toilet.is24Hour === filters.is24Hour;
      const matchesStepFree = filters.isStepFree === null || toilet.isStepFree === filters.isStepFree;
      const matchesGender = filters.gender === null || toilet.gender === filters.gender;
      // No explicit 'isVerified' filter here as the parent `App` component handles that differentiation

      return matchesSearch && matchesCode && matches24Hour && matchesStepFree && matchesGender;
    });
  }, [toilets, filters, userLocation]);

  const handlePinClick = (toilet: Toilet) => {
    setSelectedToilet(toilet);
  };

  const closeModal = () => {
    setSelectedToilet(null);
  };

  return (
    <div className="container mx-auto p-0 sm:p-4">
      <FilterControls 
        filters={filters} 
        onFilterChange={onFilterChange} 
        isLocationAvailable={!!userLocation}
        showSortByDistance={true}
      />
      <p className="text-sm text-slate-600 mb-4 text-center">
        Displaying {filteredToilets.length} of {toilets.length} available toilets matching current filters.
      </p>
      <div
        ref={mapContainerRef}
        className="relative bg-sky-50 border-2 border-sky-200 rounded-xl shadow-lg overflow-hidden"
        style={{ width: MAP_CONTAINER_DIMENSIONS.width, height: MAP_CONTAINER_DIMENSIONS.height }}
        aria-label="Map of London toilet locations"
      >
        {mapDimensions.width > 0 && mapDimensions.height > 0 && filteredToilets.map(toilet => {
          const { x, y, visible } = getPinPosition(toilet.latitude, toilet.longitude);
          if (!visible) return null;
          return (
            <LocationPin
              key={toilet.id}
              toilet={toilet}
              onClick={handlePinClick}
              isSelected={selectedToilet?.id === toilet.id}
              style={{ left: `${x}px`, top: `${y}px` }}
            />
          );
        })}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md text-xs text-slate-700">
          <h4 className="font-semibold mb-1.5 text-slate-800">Vibe Legend:</h4>
          {Object.entries(VIBE_TEXT_COLORS).map(([vibe, colorClass]) => (
            <div key={vibe} className="flex items-center mb-0.5">
              <span className={`w-3 h-3 rounded-full mr-1.5 ${colorClass.replace('text-', 'bg-').replace('-700', '-500')}`}></span>
              <span className={`${colorClass} font-medium`}>{vibe}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedToilet && (
        <Modal isOpen={!!selectedToilet} onClose={closeModal} title={selectedToilet.name}>
          <ToiletCard toilet={selectedToilet} userLocation={userLocation} isDetailedView={true} />
        </Modal>
      )}
    </div>
  );
};

export default MapView;
    