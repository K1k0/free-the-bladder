import { Toilet, SubmissionFormData, Gender } from '../types';

// IMPORTANT: Replace this URL with your deployed Google Apps Script web app URL
// Or set it via an environment variable that Vite can access.
const SCRIPT_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE'; 

// Helper function to process toilet data from the server
const processToiletFromServer = (toiletData: any): Toilet => {
  let genderValue: Gender = Gender.AllWelcome; // Default
  if (toiletData.gender && Object.values(Gender).includes(toiletData.gender as Gender)) {
    genderValue = toiletData.gender as Gender;
  } else if (toiletData.gender) {
    // Attempt to map common string variations if backend sends strings not exactly matching enum keys
    const genderStr = String(toiletData.gender).toLowerCase();
    if (genderStr === "male") genderValue = Gender.Male;
    else if (genderStr === "female") genderValue = Gender.Female;
    else if (genderStr === "neutral" || genderStr === "gender neutral" || genderStr === "gender_neutral") genderValue = Gender.Neutral;
    // AllWelcome is the default if no other match
  }


  return {
    ...toiletData,
    latitude: parseFloat(toiletData.latitude) || 0,
    longitude: parseFloat(toiletData.longitude) || 0,
    isVerified: toiletData.isVerified === true || String(toiletData.isVerified).toLowerCase() === 'true',
    isStepFree: toiletData.isStepFree === true || String(toiletData.isStepFree).toLowerCase() === 'true',
    is24Hour: toiletData.is24Hour === true || String(toiletData.is24Hour).toLowerCase() === 'true',
    gender: genderValue,
    createdAt: new Date(toiletData.createdAt), // Ensure createdAt is a Date object
  };
};


export const getToilets = async (): Promise<Toilet[]> => {
  if (SCRIPT_URL === 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE') {
    console.warn("Apps Script URL not configured. Returning empty array.");
    // Consider throwing an error or returning a more specific error state
    // that the UI can handle, e.g., for prompting configuration.
    // For now, returning empty array to avoid breaking existing UI logic too much.
    return []; 
  }
  try {
    const response = await fetch(SCRIPT_URL, { method: 'GET', mode: 'cors' });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Failed to fetch toilets: ${errorData.message || response.statusText}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
        console.error("Fetched data is not an array:", data);
        throw new Error("Invalid data format received from server.");
    }
    return data.map(processToiletFromServer);
  } catch (error) {
    console.error("Error in getToilets:", error);
    throw error; // Re-throw to be caught by calling function in App.tsx
  }
};

export const addToilet = async (submission: SubmissionFormData, photoBase64?: string): Promise<Toilet> => {
   if (SCRIPT_URL === 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE') {
    throw new Error("Apps Script URL not configured. Cannot add toilet.");
  }
  try {
    const payload = {
      ...submission,
      photoUrl: photoBase64, // Send base64 string for photo
      gender: submission.gender || Gender.AllWelcome, // Ensure gender is sent
    };
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'add', payload }),
    });
    const result = await response.json();
    if (!response.ok || !result.success || !result.toilet) {
      throw new Error(result.message || 'Failed to add toilet on server');
    }
    return processToiletFromServer(result.toilet);
  } catch (error) {
    console.error("Error in addToilet:", error);
    throw error;
  }
};

export const updateToilet = async (updatedToiletData: Partial<Toilet> & { id: string }): Promise<Toilet> => {
  if (SCRIPT_URL === 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE') {
    throw new Error("Apps Script URL not configured. Cannot update toilet.");
  }
  try {
    const payloadToSend: { [key: string]: any } = { ...updatedToiletData };
    
    if (payloadToSend.createdAt && payloadToSend.createdAt instanceof Date) {
        payloadToSend.createdAt = (payloadToSend.createdAt as Date).toISOString();
    }
    // Ensure gender is a string if it's being sent to a backend expecting string enum keys
    if (payloadToSend.gender && typeof payloadToSend.gender === 'string' && Object.values(Gender).includes(payloadToSend.gender as Gender)) {
      // It's already a valid Gender enum string, no change needed.
    } else if (payloadToSend.gender) {
      // If it's somehow not a string from the enum, default or log error
      // For this app, updatedToiletData.gender should already be from Gender enum.
    }


    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'update', payload: payloadToSend }),
    });
    const result = await response.json();
    if (!response.ok || !result.success || !result.toilet) {
      throw new Error(result.message || 'Failed to update toilet on server');
    }
    return processToiletFromServer(result.toilet);
  } catch (error) {
    console.error("Error in updateToilet:", error);
    throw error;
  }
};

export const deleteToilet = async (toiletId: string): Promise<{ id: string }> => {
  if (SCRIPT_URL === 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE') {
    throw new Error("Apps Script URL not configured. Cannot delete toilet.");
  }
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'delete', payload: { id: toiletId } }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to delete toilet on server');
    }
    return { id: toiletId }; // Return the ID of the deleted toilet
  } catch (error) {
    console.error("Error in deleteToilet:", error);
    throw error;
  }
};