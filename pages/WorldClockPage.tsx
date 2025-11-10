import React, { useState, useEffect, useMemo } from 'react';
import { WorldClockEntry, TemperatureUnit } from '../types';
import { Plus, Sun, Cloud, CloudRain } from '../components/icons/Icons';

// FIX: Cast Intl to `any` to bypass a TypeScript error. `Intl.supportedValuesOf` is a standard, modern API for which type definitions may be missing in the current project configuration.
const timezones = (Intl as any).supportedValuesOf('timeZone')
  .filter(tz => tz.includes('/') && !tz.startsWith('Etc/'))
  .map(tz => ({
    timezone: tz,
    city: tz.split('/').pop()?.replace(/_/g, ' ') || ''
  }))
  .sort((a, b) => a.city.localeCompare(b.city));

interface WorldClockPageProps {
  tempUnit: TemperatureUnit;
}

const GlobeVisual = () => (
  <div className="w-full flex justify-center items-center my-4 md:my-0 md:mb-8" aria-hidden="true">
    <div className="relative w-40 h-40 md:w-56 md:h-56">
      {/* Outer circle */}
      <div className="w-full h-full rounded-full border-2 border-blue-500/40 absolute"></div>
      {/* Spinning Meridian */}
      <div className="w-full h-full rounded-full border border-dashed border-blue-500/60 absolute animate-spin-slow"></div>
      {/* Equator (oval) */}
      <div className="w-full h-full absolute flex items-center">
        <div className="w-full h-1/2 border-y border-blue-500/40 rounded-[50%]"></div>
      </div>
    </div>
  </div>
);


const WorldClockPage: React.FC<WorldClockPageProps> = ({ tempUnit }) => {
  const [clocks, setClocks] = useState<WorldClockEntry[]>(() => {
    const savedClocks = localStorage.getItem('worldClocks');
    return savedClocks ? JSON.parse(savedClocks) : [{ timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, city: 'Local Time' }];
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    localStorage.setItem('worldClocks', JSON.stringify(clocks));
  }, [clocks]);

  const addClock = (clock: WorldClockEntry) => {
    if (!clocks.some(c => c.timezone === clock.timezone)) {
      setClocks([...clocks, clock]);
    }
    setIsModalOpen(false);
    setSearchTerm('');
  };

  const removeClock = (timezone: string) => {
    setClocks(clocks.filter(c => c.timezone !== timezone));
  };

  const getSimulatedWeather = useMemo(() => (city: string) => {
    const hash = city.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    const tempC = (hash % 35) + 5;
    const condition = hash % 3;

    const temp = tempUnit === TemperatureUnit.Fahrenheit ? Math.round(tempC * 9 / 5 + 32) : tempC;
    const icon = condition === 0 ? <Sun className="w-5 h-5 text-yellow-500" /> : condition === 1 ? <Cloud className="w-5 h-5 text-gray-400" /> : <CloudRain className="w-5 h-5 text-blue-400" />;
    
    return { temp, icon, unit: tempUnit === TemperatureUnit.Fahrenheit ? '°F' : '°C' };
  }, [tempUnit]);

  const filteredTimezones = useMemo(() => {
    return timezones.filter(tz => tz.city.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 h-full flex flex-col">
      <h1 className="text-4xl font-bold text-center mb-4">World Clock</h1>
      <GlobeVisual />
      <div className="flex-grow overflow-y-auto space-y-4 pr-2">
        {clocks.map(({ timezone, city }) => {
          const timeInZone = new Date(currentTime.toLocaleString('en-US', { timeZone: timezone }));
          const weather = getSimulatedWeather(city);

          // Robust offset calculation
          const dtfWithOffset = new Intl.DateTimeFormat('en-US', { timeZone: timezone, timeZoneName: 'longOffset' });
          const parts = dtfWithOffset.formatToParts(currentTime);
          const timezoneOffsetString = parts.find(p => p.type === 'timeZoneName')?.value || 'GMT+0';
          const remoteOffset = parseInt(timezoneOffsetString.replace('GMT', ''), 10);
          const localOffset = -new Date().getTimezoneOffset() / 60;
          const relativeOffset = remoteOffset - localOffset;

          let offsetString = 'Same as local';
            if (city === 'Local Time') {
                offsetString = 'Your local time';
            } else if (relativeOffset !== 0) {
                const hours = Math.abs(relativeOffset);
                const aheadOrBehind = relativeOffset > 0 ? 'ahead' : 'behind';
                offsetString = `${hours} hour${hours > 1 ? 's' : ''} ${aheadOrBehind}`;
            }


          return (
            <div key={timezone} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">{city}</h2>
                <p className="text-gray-500 dark:text-gray-400">{offsetString}</p>
              </div>
              <div className="text-right">
                 <p className="font-orbitron text-4xl font-bold">{timeInZone.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                 <div className="flex items-center justify-end gap-2 text-gray-500 dark:text-gray-400">
                    {weather.icon}
                    <span>{weather.temp}{weather.unit}</span>
                 </div>
              </div>
              {city !== 'Local Time' && (
                <button onClick={() => removeClock(timezone)} className="ml-4 text-red-500 hover:text-red-700 font-medium self-start text-xs">Remove</button>
              )}
            </div>
          );
        })}
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-8 md:bottom-12 md:right-12 bg-blue-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition transform hover:scale-110 active:scale-100 z-30"
        aria-label="Add new clock"
      >
        <Plus className="w-8 h-8" />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full flex flex-col h-[80vh]">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Add City</h2>
            <input
              type="text"
              placeholder="Search for a city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
              autoFocus
            />
            <div className="flex-grow overflow-y-auto">
              {filteredTimezones.map(tz => (
                <button
                  key={tz.timezone}
                  onClick={() => addClock(tz)}
                  className="w-full text-left p-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  {tz.city}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 w-full py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorldClockPage;