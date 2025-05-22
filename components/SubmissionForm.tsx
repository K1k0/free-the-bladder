
import React, { useState, useCallback } from 'react';
import { SubmissionFormData, Vibe, UserLocation, Gender } from '../types';
import { getCurrentLocation, reverseGeocode } from '../services/geolocationService';
import LoadingSpinner from './LoadingSpinner';
import AlertMessage from './AlertMessage';
import { GENDER_LABELS } from '../constants';

interface SubmissionFormProps {
  onSubmit: (data: SubmissionFormData, photoBase64?: string) => Promise<void>;
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({ onSubmit }) => {
  const initialFormData: SubmissionFormData = {
    name: '',
    address: '',
    latitude: 0, // Will be set but not displayed
    longitude: 0, // Will be set but not displayed
    code: '',
    openingHours: '',
    vibe: Vibe.Neutral,
    notes: '',
    submittedBy: '',
    isStepFree: false,
    is24Hour: false,
    gender: Gender.AllWelcome,
  };
  const [formData, setFormData] = useState<SubmissionFormData>(initialFormData);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const inputBaseClasses = "mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-colors duration-150";
  const checkboxClasses = "h-4 w-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500";
  const buttonPrimaryClasses = "w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-slate-400 transition-colors duration-150";
  const buttonSecondaryClasses = "w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-500 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 disabled:bg-slate-300 transition-colors duration-150";


  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === "gender") {
        setFormData(prev => ({ ...prev, [name]: value as Gender }));
    }
     else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  const handlePhotoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoFile(null);
      setPhotoPreview(null);
    }
  }, []);

  const handleGetCurrentAddress = useCallback(async () => {
    setIsFetchingLocation(true);
    setError(null);
    try {
      const location: UserLocation = await getCurrentLocation();
      setFormData(prev => ({
        ...prev,
        latitude: parseFloat(location.latitude.toFixed(6)),
        longitude: parseFloat(location.longitude.toFixed(6)),
      }));
      // Now reverse geocode
      const fetchedAddress = await reverseGeocode(location.latitude, location.longitude);
      setFormData(prev => ({
        ...prev,
        address: fetchedAddress,
      }));

    } catch (err: any) {
      setError(err.message || 'Could not fetch location or address. Please enter address manually.');
      // Keep potentially fetched coordinates even if address fails
    } finally {
      setIsFetchingLocation(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.code) {
      setError('Location Name, Address, and Toilet Code are required.');
      return;
    }
    // Latitude and longitude are no longer part of the direct validation for form submission UI
    // but they are expected by the backend. If (0,0) it might be an issue for the map.
    // The `addToilet` service still expects latitude and longitude.

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await onSubmit(formData, photoPreview ?? undefined);
      setSuccessMessage('Toilet submitted successfully! Thank you for your contribution.');
      setFormData(initialFormData); 
      setPhotoFile(null);
      setPhotoPreview(null);
    } catch (err: any) {
      setError(err.message || 'Failed to submit Toilet. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-2xl bg-white shadow-xl rounded-xl my-8">
      <h2 className="text-3xl font-bold text-center text-black mb-8">Add a New Toilet Location</h2>
      
      {error && <AlertMessage message={error} type="error" onClose={() => setError(null)} />}
      {successMessage && <AlertMessage message={successMessage} type="success" onClose={() => setSuccessMessage(null)} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Location Name (e.g., "Starbucks Finsbury Park")</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className={inputBaseClasses} />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">Address</label>
          <textarea name="address" id="address" value={formData.address} onChange={handleChange} rows={3} required className={inputBaseClasses} />
        </div>
        
        <button type="button" onClick={handleGetCurrentAddress} disabled={isFetchingLocation} className={buttonSecondaryClasses}>
            {isFetchingLocation ? <LoadingSpinner /> : '📍 Get Current Address'}
        </button>
        <p className="text-xs text-slate-500 text-center">Click to auto-fill address using your current location. You can also type it manually.</p>

        <div>
          <label htmlFor="code" className="block text-sm font-medium text-slate-700 mb-1">Toilet Code</label>
          <input type="text" name="code" id="code" value={formData.code} onChange={handleChange} required className={inputBaseClasses} />
        </div>

        <div>
          <label htmlFor="openingHours" className="block text-sm font-medium text-slate-700 mb-1">Opening Hours (optional)</label>
          <input type="text" name="openingHours" id="openingHours" value={formData.openingHours} onChange={handleChange} className={inputBaseClasses} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="vibe" className="block text-sm font-medium text-slate-700 mb-1">Vibe Check</label>
                <select name="vibe" id="vibe" value={formData.vibe} onChange={handleChange} className={`${inputBaseClasses} pl-3 pr-10 py-2 text-base`}>
                    {Object.values(Vibe).map(vibe => (
                    <option key={vibe} value={vibe}>{vibe}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-1">Gender Suitability</label>
                <select name="gender" id="gender" value={formData.gender} onChange={handleChange} className={`${inputBaseClasses} pl-3 pr-10 py-2 text-base`}>
                    {Object.values(Gender).map(genderOpt => (
                    <option key={genderOpt} value={genderOpt}>{GENDER_LABELS[genderOpt]}</option>
                    ))}
                </select>
            </div>
        </div>
        
        <div className="space-y-3">
            <div className="flex items-center">
                <input id="isStepFree" name="isStepFree" type="checkbox" checked={formData.isStepFree} onChange={handleChange} className={checkboxClasses}/>
                <label htmlFor="isStepFree" className="ml-2 block text-sm text-slate-800">Step-free access</label>
            </div>
            <div className="flex items-center">
                <input id="is24Hour" name="is24Hour" type="checkbox" checked={formData.is24Hour} onChange={handleChange} className={checkboxClasses}/>
                <label htmlFor="is24Hour" className="ml-2 block text-sm text-slate-800">Open 24 hours</label>
            </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">Notes (e.g., "ask at counter", "downstairs on the left", "clean")</label>
          <textarea name="notes" id="notes" value={formData.notes} onChange={handleChange} rows={3} className={inputBaseClasses}></textarea>
        </div>

        <div>
          <label htmlFor="photo" className="block text-sm font-medium text-slate-700 mb-1">Optional Photo</label>
          <input type="file" name="photo" id="photo" accept="image/*" onChange={handlePhotoChange} className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 transition-colors duration-150" />
          {photoPreview && <img src={photoPreview} alt="Preview" className="mt-3 max-h-48 w-auto rounded-lg shadow-md"/>}
        </div>
        
        <div>
          <label htmlFor="submittedBy" className="block text-sm font-medium text-slate-700 mb-1">Your @handle or Name (optional, for credit)</label>
          <input type="text" name="submittedBy" id="submittedBy" value={formData.submittedBy} onChange={handleChange} placeholder="Anonymous" className={inputBaseClasses} />
        </div>

        <div>
          <button 
            type="submit" 
            disabled={isSubmitting || !formData.name || !formData.address || !formData.code} 
            className={buttonPrimaryClasses}
          >
            {isSubmitting ? <LoadingSpinner /> : 'Submit Toilet'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmissionForm;
