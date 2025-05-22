
import { UserLocation } from '../types';

export const getCurrentLocation = (): Promise<UserLocation> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      }
    );
  });
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`Nominatim API request failed: ${response.statusText}`);
    }
    const data = await response.json();
    if (data && data.display_name) {
      return data.display_name;
    } else if (data && data.address) {
      // Fallback to constructing address if display_name is not available
      const addr = data.address;
      const parts = [
        addr.road || addr.pedestrian || addr.path,
        addr.house_number,
        addr.neighbourhood,
        addr.suburb,
        addr.city_district,
        addr.city,
        addr.town,
        addr.village,
        addr.postcode,
        addr.country
      ].filter(Boolean).join(', ');
      return parts || 'Address not found';
    }
    throw new Error('Could not parse address from Nominatim response.');
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw new Error('Failed to fetch address from coordinates.');
  }
};
