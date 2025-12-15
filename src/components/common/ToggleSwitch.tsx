// src/components/common/ToggleSwitch.tsx

import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // Optional for styling
  className?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, className = '' }) => {
  return (
    <label 
      className={`relative inline-flex items-center cursor-pointer ${className}`}
    >
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={onChange} 
        className="sr-only peer" 
      />
      <div 
        className={`w-11 h-6 rounded-full peer peer-focus:outline-none transition-colors 
                    ${checked ? 'bg-primary-600' : 'bg-gray-200'}
                    peer-checked:after:translate-x-full peer-checked:after:border-white 
                    after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                    after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                    after:transition-all`}
      ></div>
    </label>
  );
};

export default ToggleSwitch;