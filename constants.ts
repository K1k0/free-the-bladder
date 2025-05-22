import { Vibe, Gender } from './types';

export const VIBE_COLORS: Record<Vibe, string> = {
  [Vibe.Chill]: 'bg-green-500 hover:bg-green-600',
  [Vibe.Neutral]: 'bg-yellow-500 hover:bg-yellow-600',
  [Vibe.Hostile]: 'bg-red-500 hover:bg-red-600',
};

export const VIBE_TEXT_COLORS: Record<Vibe, string> = {
  [Vibe.Chill]: 'text-green-700',
  [Vibe.Neutral]: 'text-yellow-700',
  [Vibe.Hostile]: 'text-red-700',
};

export const VIBE_BORDER_COLORS: Record<Vibe, string> = {
  [Vibe.Chill]: 'border-green-500',
  [Vibe.Neutral]: 'border-yellow-500',
  [Vibe.Hostile]: 'border-red-500',
};

export const GENDER_LABELS: Record<Gender, string> = {
  [Gender.AllWelcome]: 'All Welcome',
  [Gender.Male]: 'Male',
  [Gender.Female]: 'Female',
  [Gender.Neutral]: 'Gender Neutral',
};

export const GENDER_ICONS: Record<Gender, string> = {
  [Gender.AllWelcome]: '🚻', // General restroom symbol
  [Gender.Male]: '♂️',    // Male sign
  [Gender.Female]: '♀️',  // Female sign
  [Gender.Neutral]: '⚧️', // Transgender symbol or a simple single stall icon could also work
};


export const LONDON_CENTER = { lat: 51.5074, lng: -0.1278 }; 
export const INITIAL_ZOOM = 12;

export const LONDON_BOUNDS = {
  minLng: -0.510375, // West
  maxLng: 0.334015, // East
  minLat: 51.286760, // South
  maxLat: 51.691874  // North
};

export const MAP_CONTAINER_DIMENSIONS = {
  width: '100%', 
  height: '500px', 
};