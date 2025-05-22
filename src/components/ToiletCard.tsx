import React from 'react';
import { Toilet, UserLocation, Vibe, Gender } from '../types';
import { VIBE_BORDER_COLORS, VIBE_TEXT_COLORS, GENDER_ICONS, GENDER_LABELS } from '../constants';
import { calculateDistance } from '../services/geolocationService';

interface ToiletCardProps {
  toilet: Toilet;
  userLocation: UserLocation | null;
  onSelect?: (toilet: Toilet) => void;
  isDetailedView?: boolean;
  onDelete?: (id: string) => void;
  onVerifyToggle?: (id: string) => void;
}

const ToiletCard: React.FC<ToiletCardProps> = ({ 
    toilet, 
    userLocation, 
    onSelect, 
    isDetailedView = false,
    onDelete,
    onVerifyToggle 
}) => {
  const distance = userLocation
    ? calculateDistance(userLocation.latitude, userLocation.longitude, toilet.latitude, toilet.longitude).toFixed(1) + ' km away'
    : null;

  const vibeBorderColor = VIBE_BORDER_COLORS[toilet.vibe] || 'border-slate-300';
  const vibeTextColor = VIBE_TEXT_COLORS[toilet.vibe] || 'text-slate-700';
  const genderLabel = GENDER_LABELS[toilet.gender] || GENDER_LABELS[Gender.AllWelcome];
  const genderIcon = GENDER_ICONS[toilet.gender] || GENDER_ICONS[Gender.AllWelcome];

  const tagBaseStyle = "px-3 py-1 text-xs rounded-full font-medium";

  const cardContent = (
    <>
      <div className="flex justify-between items-start mb-1">
        <h3 className={`text-xl font-semibold ${isDetailedView ? 'text-2xl' : ''} ${vibeTextColor} mr-2`}>{toilet.name}</h3>
        <span className={`${tagBaseStyle} ${vibeTextColor} ${vibeBorderColor.replace('border-', 'bg-').replace('-500', '-100')} border ${vibeBorderColor}`}>
          {toilet.vibe}
        </span>
      </div>
      <p className="text-sm text-slate-600 mt-1 mb-2">{toilet.address}</p>
      {distance && <p className="text-sm text-sky-600 font-medium mt-1 mb-2">📍 {distance}</p>}

      <div className={`mt-3 space-y-1.5 text-sm text-slate-700 ${isDetailedView ? 'text-base' : ''}`}>
        {toilet.code && <p><strong className="font-medium text-slate-800">Code:</strong> {toilet.code}</p>}
        {toilet.openingHours && <p><strong className="font-medium text-slate-800">Hours:</strong> {toilet.openingHours}</p>}
        
        <div className="flex flex-wrap gap-2 mt-3 items-center">
            {toilet.isStepFree && <span className={`${tagBaseStyle} bg-green-100 text-green-700`}>♿ Step-Free</span>}
            {toilet.is24Hour && <span className={`${tagBaseStyle} bg-yellow-100 text-yellow-700`}>🌙 24 Hours</span>}
            <span className={`${tagBaseStyle} bg-purple-100 text-purple-700`}>{genderIcon} {genderLabel}</span>
            {!toilet.isVerified && <span className={`${tagBaseStyle} bg-orange-100 text-orange-700`}>⚠️ Unverified</span>}
        </div>

        {toilet.notes && <p className="mt-3 p-3 bg-slate-100 rounded-md text-slate-600"><strong className="font-medium text-slate-800">Notes:</strong> {toilet.notes}</p>}

        {isDetailedView && toilet.photoUrl && (
          <div className="mt-4">
            <h4 className="font-semibold text-slate-800 mb-1">Photo:</h4>
            <img src={toilet.photoUrl} alt={toilet.name} className="max-w-full h-auto rounded-lg shadow-md max-h-72 object-contain" />
          </div>
        )}
        {isDetailedView && toilet.submittedBy && <p className="mt-3 text-xs text-slate-500">Submitted by: {toilet.submittedBy}</p>}
        {isDetailedView && <p className="mt-1 text-xs text-slate-500">Added: {new Date(toilet.createdAt).toLocaleDateString()}</p>}
      </div>

      {onDelete && onVerifyToggle && isDetailedView && (
        <div className="mt-5 pt-4 border-t border-slate-200 flex flex-wrap gap-2">
          <button 
            onClick={() => onVerifyToggle(toilet.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-colors ${toilet.isVerified ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'} text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500`}
          >
            {toilet.isVerified ? 'Unverify' : 'Verify'}
          </button>
          <button 
            onClick={() => onDelete(toilet.id)}
            className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      )}
    </>
  );

  if (isDetailedView) {
    return <div className="p-1">{cardContent}</div>;
  }

  return (
    <div
      className={`bg-white shadow-lg hover:shadow-xl rounded-xl p-5 border-l-4 ${vibeBorderColor} transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2`}
      onClick={() => onSelect && onSelect(toilet)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => { if (e.key === 'Enter' && onSelect) onSelect(toilet);}}
      aria-label={`View details for ${toilet.name}`}
    >
      {cardContent}
    </div>
  );
};

export default ToiletCard;