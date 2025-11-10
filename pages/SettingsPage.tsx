
import React from 'react';
import { Theme, TemperatureUnit } from '../types';
import { Sun, Moon } from '../components/icons/Icons';

interface SettingsPageProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  tempUnit: TemperatureUnit;
  setTempUnit: (unit: TemperatureUnit) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ theme, setTheme, tempUnit, setTempUnit }) => {
  const toggleTheme = () => {
    setTheme(theme === Theme.Light ? Theme.Dark : Theme.Light);
  };

  const toggleTempUnit = () => {
    setTempUnit(tempUnit === TemperatureUnit.Celsius ? TemperatureUnit.Fahrenheit : TemperatureUnit.Celsius);
  };

  return (
    <div className="w-full max-w-lg text-center">
      <h1 className="text-4xl font-bold mb-12">Settings</h1>
      
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg space-y-8">
        <div className="flex justify-between items-center">
          <span className="text-xl font-medium">Appearance</span>
          <div className="flex items-center gap-4">
            <Sun className={`${theme === Theme.Light ? 'text-yellow-500' : 'text-gray-500'}`} />
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === Theme.Light ? 'dark' : 'light'} mode`}
              className={`relative inline-flex items-center h-8 w-16 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 ${
                theme === Theme.Dark ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform duration-300 ${
                  theme === Theme.Dark ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
            <Moon className={`${theme === Theme.Dark ? 'text-blue-400' : 'text-gray-500'}`} />
          </div>
        </div>

        {/* New temperature unit setting */}
        <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-8">
          <span className="text-xl font-medium">Temperature Unit</span>
          <div className="flex items-center gap-4">
            <span className={`font-semibold ${tempUnit === TemperatureUnit.Celsius ? 'text-blue-500' : 'text-gray-500'}`}>°C</span>
            <button
              onClick={toggleTempUnit}
              aria-label={`Switch to ${tempUnit === TemperatureUnit.Celsius ? 'Fahrenheit' : 'Celsius'}`}
              className={`relative inline-flex items-center h-8 w-16 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 ${
                tempUnit === TemperatureUnit.Fahrenheit ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform duration-300 ${
                  tempUnit === TemperatureUnit.Fahrenheit ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`font-semibold ${tempUnit === TemperatureUnit.Fahrenheit ? 'text-blue-500' : 'text-gray-500'}`}>°F</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;