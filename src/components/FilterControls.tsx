import React, { useCallback } from 'react';
import { FilterOptions, Gender } from '../types';
import { GENDER_LABELS, GENDER_ICONS } from '../constants';

interface FilterControlsProps {
  filters: FilterOptions;
  onFilterChange: <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => void;
  showSortByDistance?: boolean;
  isLocationAvailable?: boolean;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  onFilterChange,
  showSortByDistance = true,
  isLocationAvailable = false,
}) => {

  const inputBaseClasses = "mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-colors duration-150 bg-white";
  const labelBaseClasses = "block text-sm font-medium text-slate-700";

  const handleSelectChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = event.target;
      const filterKey = name as keyof FilterOptions;

      let processedValue: boolean | string | Gender | null;

      if (value === "any" || value === "") {
        processedValue = null;
      } else if (value === "true") {
        processedValue = true;
      } else if (value === "false") {
        processedValue = false;
      } else if (Object.values(Gender).includes(value as Gender)) {
        processedValue = value as Gender;
      } else {
        processedValue = value;
      }
      
      onFilterChange(filterKey, processedValue as FilterOptions[typeof filterKey]);
    },
    [onFilterChange]
  );
  
  const handleCheckboxChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = event.target;
       if (name === 'sortByDistance') {
         onFilterChange(name as 'sortByDistance', checked);
       }
    }, [onFilterChange]
  );

  const nullableBooleanToString = (value: boolean | null | undefined): string => {
    if (value === true) return "true";
    if (value === false) return "false";
    return "any";
  };

  const genderToString = (value: Gender | null | undefined): string => {
    if (value === null || value === undefined) return "any";
    return value;
  }

  return (
    <div className="p-5 bg-white shadow-lg rounded-xl mb-8">
      <h3 className="text-xl font-semibold text-slate-700 mb-4">Filter Options</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4 items-end">
        <div>
          <label htmlFor="searchText" className={labelBaseClasses}>Search</label>
          <input
            type="text"
            id="searchText"
            name="searchText"
            placeholder="e.g., Pret, King's Cross"
            value={filters.searchText}
            onChange={(e) => onFilterChange('searchText', e.target.value)}
            className={inputBaseClasses}
          />
        </div>

        <div>
          <label htmlFor="codeRequired" className={labelBaseClasses}>Code Required</label>
          <select
            id="codeRequired"
            name="codeRequired"
            value={nullableBooleanToString(filters.codeRequired)}
            onChange={handleSelectChange}
            className={`${inputBaseClasses} pl-3 pr-10 py-2 text-base`}
          >
            <option value="any">Any</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <div>
          <label htmlFor="is24Hour" className={labelBaseClasses}>Open 24 Hours</label>
          <select
            id="is24Hour"
            name="is24Hour"
            value={nullableBooleanToString(filters.is24Hour)}
            onChange={handleSelectChange}
            className={`${inputBaseClasses} pl-3 pr-10 py-2 text-base`}
          >
            <option value="any">Any</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="isStepFree" className={labelBaseClasses}>Step-Free Access</label>
          <select
            id="isStepFree"
            name="isStepFree"
            value={nullableBooleanToString(filters.isStepFree)}
            onChange={handleSelectChange}
            className={`${inputBaseClasses} pl-3 pr-10 py-2 text-base`}
          >
            <option value="any">Any</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <div>
          <label htmlFor="gender" className={labelBaseClasses}>Gender</label>
          <select
            id="gender"
            name="gender"
            value={genderToString(filters.gender)}
            onChange={handleSelectChange}
            className={`${inputBaseClasses} pl-3 pr-10 py-2 text-base`}
          >
            <option value="any">Any</option>
            {Object.values(Gender).map(genderOpt => (
              <option key={genderOpt} value={genderOpt}>
                {GENDER_ICONS[genderOpt]} {GENDER_LABELS[genderOpt]}
              </option>
            ))}
          </select>
        </div>

        {showSortByDistance && (
          <div className="flex items-center mt-2 sm:mt-0 lg:col-span-1 justify-self-start sm:pb-1"> {/* Align baseline with inputs */}
            <input
              type="checkbox"
              id="sortByDistance"
              name="sortByDistance" 
              checked={filters.sortByDistance}
              onChange={handleCheckboxChange} 
              disabled={!isLocationAvailable}
              className="h-5 w-5 text-sky-600 border-slate-300 rounded focus:ring-sky-500 disabled:opacity-50"
            />
            <label htmlFor="sortByDistance" className={`ml-2 block text-sm ${isLocationAvailable ? 'text-slate-700' : 'text-slate-400'}`}>
              Sort by Distance {isLocationAvailable ? '' : '(Location N/A)'}
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterControls;