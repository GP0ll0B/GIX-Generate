import React from 'react';

interface ToggleSwitchProps {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  description?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, enabled, onChange, description }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <label htmlFor={`toggle-switch-${label}`} className="font-semibold text-gray-800 dark:text-gray-200">{label}</label>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
      </div>
      <button
        id={`toggle-switch-${label}`}
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 ${
          enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
        }`}
        role="switch"
        aria-checked={enabled}
      >
        <span
          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};
