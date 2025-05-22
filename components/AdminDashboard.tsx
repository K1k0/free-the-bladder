import React, { useState, useMemo } from 'react';
import { Toilet, Vibe, Gender } from '../types';
import ToiletCard from './ToiletCard';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';
import { GENDER_LABELS, GENDER_ICONS } from '../constants';

interface AdminDashboardProps {
  toilets: Toilet[];
  onDeleteToilet: (id: string) => Promise<void>;
  onVerifyToggleToilet: (id: string) => Promise<void>;
  isLoading: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ toilets, onDeleteToilet, onVerifyToggleToilet, isLoading }) => {
  const [selectedToilet, setSelectedToilet] = useState<Toilet | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUnverifiedOnly, setShowUnverifiedOnly] = useState(false);

  const stats = useMemo(() => {
    const total = toilets.length;
    const verified = toilets.filter(t => t.isVerified).length;
    const unverified = total - verified;
    const vibesCount = toilets.reduce((acc, toilet) => {
      acc[toilet.vibe] = (acc[toilet.vibe] || 0) + 1;
      return acc;
    }, {} as Record<Vibe, number>);
    const genderCounts = toilets.reduce((acc, toilet) => {
      const genderKey = toilet.gender || Gender.AllWelcome;
      acc[genderKey] = (acc[genderKey] || 0) + 1;
      return acc;
    }, {} as Record<Gender, number>);
    return { total, verified, unverified, vibesCount, genderCounts };
  }, [toilets]);

  const filteredToilets = useMemo(() => {
    return toilets
      .filter(toilet => {
        const term = searchTerm.toLowerCase();
        const matchesSearch = toilet.name.toLowerCase().includes(term) ||
                              toilet.address.toLowerCase().includes(term) ||
                              (toilet.id === term);
        const matchesVerification = !showUnverifiedOnly || !toilet.isVerified;
        return matchesSearch && matchesVerification;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [toilets, searchTerm, showUnverifiedOnly]);

  const handleViewDetails = (toilet: Toilet) => {
    setSelectedToilet(toilet);
  };

  const closeModal = () => {
    setSelectedToilet(null);
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this toilet? This action cannot be undone.')) {
      await onDeleteToilet(id);
      if(selectedToilet?.id === id) closeModal();
    }
  };

  const handleVerifyToggle = async (id: string) => {
    await onVerifyToggleToilet(id);
    if (selectedToilet && selectedToilet.id === id) {
      setSelectedToilet(prev => {
        if (!prev) return null;
        const updatedToiletData = toilets.find(t => t.id === id) || { ...prev, isVerified: !prev.isVerified };
         return { ...prev, ...updatedToiletData };
      });
    }
  };

  const buttonBaseStyle = "px-3 py-1.5 text-sm font-medium rounded-md shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2";


  if (isLoading && filteredToilets.length === 0) {
    return <div className="pt-10"><LoadingSpinner /></div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h2 className="text-3xl font-bold text-sky-700 mb-8 text-center">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        <div className="bg-white p-6 shadow-xl rounded-xl text-center transition-transform hover:scale-105">
          <h3 className="text-lg font-semibold text-slate-700">Total Toilets</h3>
          <p className="text-4xl font-bold text-sky-600 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-6 shadow-xl rounded-xl text-center transition-transform hover:scale-105">
          <h3 className="text-lg font-semibold text-slate-700">Verified</h3>
          <p className="text-4xl font-bold text-green-600 mt-1">{stats.verified}</p>
        </div>
        <div className="bg-white p-6 shadow-xl rounded-xl text-center transition-transform hover:scale-105">
          <h3 className="text-lg font-semibold text-slate-700">Unverified</h3>
          <p className="text-4xl font-bold text-red-600 mt-1">{stats.unverified}</p>
        </div>
        <div className="bg-white p-5 shadow-xl rounded-xl md:col-span-1 lg:col-span-1.5">
          <h3 className="text-lg font-semibold text-slate-700 text-center mb-3">Vibes Distribution</h3>
          {Object.entries(stats.vibesCount).map(([vibe, count]) => (
            <div key={vibe} className="flex justify-between text-sm py-1 border-b border-slate-100 last:border-b-0">
              <span className="text-slate-600">{vibe}:</span>
              <span className="font-semibold text-slate-800">{count}</span>
            </div>
          ))}
          {(Object.keys(stats.vibesCount).length === 0 && toilets.length > 0) && <p className="text-xs text-slate-500 text-center py-2">No vibe data.</p>}
        </div>
         <div className="bg-white p-5 shadow-xl rounded-xl md:col-span-1 lg:col-span-1.5">
          <h3 className="text-lg font-semibold text-slate-700 text-center mb-3">Gender Distribution</h3>
          {Object.entries(stats.genderCounts).map(([gender, count]) => (
            <div key={gender} className="flex justify-between text-sm py-1 border-b border-slate-100 last:border-b-0">
              <span className="text-slate-600">{GENDER_ICONS[gender as Gender]} {GENDER_LABELS[gender as Gender]}:</span>
              <span className="font-semibold text-slate-800">{count}</span>
            </div>
          ))}
           {(Object.keys(stats.genderCounts).length === 0 && toilets.length > 0) && <p className="text-xs text-slate-500 text-center py-2">No gender data.</p>}
        </div>
      </div>

      <div className="mb-8 p-5 bg-white rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Search by name, address, or ID..."
            className="flex-grow p-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <label className="flex items-center space-x-2 p-3 bg-slate-50 border border-slate-300 rounded-lg shadow-sm hover:bg-slate-100 cursor-pointer transition-colors">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-sky-600 rounded border-slate-400 focus:ring-sky-500"
              checked={showUnverifiedOnly}
              onChange={(e) => setShowUnverifiedOnly(e.target.checked)}
            />
            <span className="text-sm font-medium text-slate-700">Show Unverified Only</span>
          </label>
        </div>
      </div>
      
      <div className="space-y-5">
        {filteredToilets.length === 0 && !isLoading && <p className="text-center text-slate-500 py-6 text-lg">No toilets match your current filters.</p>}
        {filteredToilets.map(toilet => (
          <div key={toilet.id} className={`p-5 bg-white shadow-lg rounded-xl border-l-4 ${toilet.isVerified ? 'border-green-500' : 'border-red-500'}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start">
              <div className="mb-3 sm:mb-0">
                <h4 className="text-lg font-semibold text-sky-700">{toilet.name}</h4>
                <p className="text-sm text-slate-600">{toilet.address}</p>
                <p className="text-xs text-slate-500 mt-1">
                  ID: {toilet.id} | Added: {new Date(toilet.createdAt).toLocaleDateString()} | {GENDER_ICONS[toilet.gender]} {GENDER_LABELS[toilet.gender]}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 items-center self-start sm:self-center">
                 <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${toilet.isVerified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {toilet.isVerified ? 'Verified' : 'Unverified'}
                </span>
                <button
                  onClick={() => handleViewDetails(toilet)}
                  className={`${buttonBaseStyle} bg-sky-500 hover:bg-sky-600 text-white focus:ring-sky-400`}
                >
                  Details
                </button>
                <button
                  onClick={() => handleVerifyToggle(toilet.id)}
                  className={`${buttonBaseStyle} text-white ${toilet.isVerified ? 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-400' : 'bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-400'}`}
                >
                  {toilet.isVerified ? 'Unverify' : 'Verify'}
                </button>
                <button
                  onClick={() => handleDelete(toilet.id)}
                  className={`${buttonBaseStyle} bg-red-500 hover:bg-red-600 text-white focus:ring-red-400`}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
         {isLoading && filteredToilets.length > 0 && <div className="pt-10"><LoadingSpinner /></div>}
      </div>

      {selectedToilet && (
        <Modal isOpen={!!selectedToilet} onClose={closeModal} title={`Admin View: ${selectedToilet.name}`}>
          <ToiletCard 
            toilet={selectedToilet} 
            userLocation={null}
            isDetailedView={true}
            onDelete={handleDelete}
            onVerifyToggle={handleVerifyToggle}
          />
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;