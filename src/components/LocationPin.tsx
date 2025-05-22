import React from 'react';
import { Toilet, Vibe } from '../types';
import { VIBE_COLORS } from '../constants';

interface LocationPinProps {
  toilet: Toilet;
  onClick: (toilet: Toilet) => void;
  isSelected: boolean;
  style?: React.CSSProperties;
}

const LocationPin: React.FC<LocationPinProps> = ({ toilet, onClick, isSelected, style }) => {
  const vibeColor = VIBE_COLORS[toilet.vibe] || 'bg-slate-500';
  const sizeClasses = isSelected ? 'w-9 h-9 text-lg' : 'w-7 h-7 text-base'; // Slightly larger when selected
  const ringClasses = isSelected ? 'ring-4 ring-offset-1 ring-sky-500 ring-offset-slate-100' : 'ring-1 ring-black/20'; // Ring for better visibility
  
  return (
    <button
      onClick={() => onClick(toilet)}
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${sizeClasses} ${vibeColor} rounded-full shadow-lg hover:shadow-xl cursor-pointer transition-all duration-200 ease-in-out ${ringClasses} flex items-center justify-center text-white font-bold`}
      title={toilet.name}
      aria-label={`Toilet: ${toilet.name}`}
      style={style}
    >
      🚽
    </button>
  );
};

export default LocationPin;