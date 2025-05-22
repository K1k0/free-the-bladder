
import React from 'react';
import { ViewMode } from '../types';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const navItems: { label: string; view: ViewMode, icon?: React.ReactNode }[] = [
    { label: 'Map View', view: 'map', icon: <MapIcon /> },
    { label: 'List View', view: 'list', icon: <ListIcon /> },
    { label: 'Submit Toilet', view: 'submit', icon: <PlusCircleIcon /> },
    { label: 'Admin', view: 'admin', icon: <CogIcon /> },
    { label: 'About', view: 'about', icon: <InformationCircleIcon /> },
  ];

  return (
    // Fix: Use brand.teal from Tailwind config for background color
    <nav className="bg-brand-teal p-4 shadow-lg sticky top-0 z-50">
      <div className="container max-w-screen-lg mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div 
          onClick={() => onNavigate('map')} 
          className="cursor-pointer flex items-center mb-4 sm:mb-0"
          aria-label="Go to Map View"
          role="button"
          tabIndex={0}
          onKeyPress={(e) => { if (e.key === 'Enter') onNavigate('map'); }}
        >
          <img src="/assets/logo.png" alt="Free The Bladder Logo" className="h-12 sm:h-14 mr-2"/>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              // Fix: Use brand.teal from Tailwind config for focus ring offset
              className={`flex items-center px-3 py-2 text-sm sm:text-base rounded-t-md font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-teal focus:ring-white
                ${currentView === item.view
                  ? 'border-b-2 border-white text-white font-semibold'
                  : 'border-b-2 border-transparent text-slate-100 hover:text-white hover:border-slate-300/70'
                }`}
            >
              {item.icon && <span className="mr-1.5 hidden sm:inline">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

// SVG Icons
const MapIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ListIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>;
const PlusCircleIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CogIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const InformationCircleIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export default Navbar;