export enum Vibe {
  Chill = 'Chill',
  Neutral = 'Neutral',
  Hostile = 'Hostile',
}

export enum Gender {
  AllWelcome = 'All Welcome', // For facilities explicitly welcoming all, or not gender-specific
  Male = 'Male',
  Female = 'Female',
  Neutral = 'Gender Neutral', // For single-stall, gender-neutral specific facilities
}

export interface Toilet {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  code: string; // Keep optional here as existing DB entries might not have it or admin might edit
  openingHours?: string;
  vibe: Vibe;
  notes?: string;
  photoUrl?: string; // base64 data URL
  submittedBy?: string; // Optional @handle or anonymous
  isVerified: boolean;
  isStepFree?: boolean;
  is24Hour?: boolean;
  gender: Gender; // Added gender property
  createdAt: Date;
}

export interface SubmissionFormData {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  code: string; // Changed to required
  openingHours?: string;
  vibe: Vibe;
  notes?: string;
  submittedBy?: string;
  isStepFree?: boolean;
  is24Hour?: boolean;
  gender: Gender; // Added gender property
}

export type FilterOptions = {
  codeRequired?: boolean | null; // null for 'any'
  is24Hour?: boolean | null;
  isStepFree?: boolean | null;
  gender: Gender | null; // null for 'any'
  searchText: string;
  sortByDistance: boolean;
};

export type ViewMode = 'map' | 'list' | 'submit' | 'admin' | 'about';

export interface UserLocation {
  latitude: number;
  longitude: number;
}