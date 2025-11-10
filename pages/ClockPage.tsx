import React, { useState, useEffect, useCallback } from 'react';

const ClockPage: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [theme, setTheme] = useState('digital-classic');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const ClockDisplay = useCallback(() => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    switch (theme) {
      case 'analog':
        return (
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-slate-100 dark:bg-slate-800 shadow-xl flex items-center justify-center">
            {/* Markers */}
            {[...Array(12)].map((_, i) => {
              const isMajorMarker = (i + 1) % 3 === 0;
              return (
                <div
                  key={i}
                  className="absolute w-full h-full"
                  style={{ transform: `rotate(${(i + 1) * 30}deg)` }}
                >
                  <div className={`absolute ${isMajorMarker ? 'w-1 h-5' : 'w-0.5 h-3'} bg-gray-400 dark:bg-gray-500 top-[3px] left-1/2 -translate-x-1/2 rounded-full`}></div>
                </div>
              );
            })}
            
            {/* Hands */}
            <div
              className="absolute top-1/2 left-1/2 w-2 h-16 bg-gray-800 dark:bg-gray-200 origin-top transform rounded-full"
              style={{ transform: `translateX(-50%) rotate(${hours * 30 + minutes / 2}deg) translateY(-50%)` }}
            ></div>
            <div
              className="absolute top-1/2 left-1/2 w-1.5 h-24 bg-gray-800 dark:bg-gray-200 origin-top transform rounded-full"
              style={{ transform: `translateX(-50%) rotate(${minutes * 6}deg) translateY(-50%)` }}
            ></div>
            <div
              className="absolute top-1/2 left-1/2 w-1 h-28 bg-red-500 origin-top transform"
              style={{ transform: `translateX(-50%) rotate(${seconds * 6}deg) translateY(-50%)` }}
            ></div>
            
             {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 w-4 h-4 -mt-2 -ml-2 bg-gray-800 dark:bg-gray-200 rounded-full z-10 shadow-sm"></div>
            <div className="absolute top-1/2 left-1/2 w-2 h-2 -mt-1 -ml-1 bg-red-500 rounded-full z-20"></div>

          </div>
        );
      case 'modern-analog':
        return (
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-gray-100 dark:bg-gray-800/50 shadow-inner flex items-center justify-center border-8 border-white dark:border-gray-900">
                {/* Markers */}
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="absolute w-full h-full" style={{ transform: `rotate(${i * 30}deg)` }}>
                        <div className={`absolute top-1 w-0.5 ${i % 3 === 0 ? 'h-5' : 'h-2'} bg-gray-400 dark:bg-gray-500 left-1/2 -translate-x-1/2`}></div>
                    </div>
                ))}
                {/* Hour Hand */}
                <div className="absolute top-0 left-1/2 w-1.5 h-1/2 origin-bottom" style={{ transform: `translateX(-50%) rotate(${hours * 30 + minutes / 2}deg)` }}>
                    <div className="w-full h-[60%] bg-gray-700 dark:bg-gray-300 rounded-t-full"></div>
                </div>
                {/* Minute Hand */}
                <div className="absolute top-0 left-1/2 w-1 h-1/2 origin-bottom" style={{ transform: `translateX(-50%) rotate(${minutes * 6 + seconds / 10}deg)` }}>
                    <div className="w-full h-[85%] bg-gray-700 dark:bg-gray-300 rounded-t-full"></div>
                </div>
                {/* Second Hand */}
                <div className="absolute top-0 left-1/2 w-0.5 h-1/2 origin-bottom" style={{ transform: `translateX(-50%) rotate(${seconds * 6}deg)` }}>
                    <div className="w-full h-[90%] bg-red-500"></div>
                </div>
                {/* Center dot */}
                <div className="absolute w-3 h-3 bg-gray-700 dark:bg-gray-300 rounded-full z-10 border-2 border-gray-100 dark:border-gray-800/50"></div>
            </div>
        );
      case 'word-clock':
        const h = hours % 12 || 12;
        const m = Math.floor(minutes / 5) * 5;
        // This is a simplified word clock for brevity
        return <div className="text-4xl md:text-6xl font-semibold">It's about {h}:{m < 10 ? '0'+m : m}</div>;
      case 'binary':
        const toBinary = (n: number) => n.toString(2).padStart(6, '0');
        return (
          <div className="font-mono text-xl md:text-3xl tracking-widest">
            <div>{toBinary(hours)}</div>
            <div>{toBinary(minutes)}</div>
            <div>{toBinary(seconds)}</div>
          </div>
        );
      default: // digital-classic
        return (
          <div className="font-orbitron text-6xl md:text-9xl font-bold tracking-wider">
            {time.toLocaleTimeString()}
          </div>
        );
    }
  }, [time, theme]);

  const clockThemes = [
    { id: 'digital-classic', name: 'Digital Classic' },
    { id: 'analog', name: 'Analog' },
    { id: 'modern-analog', name: 'Modern Analog' },
    { id: 'word-clock', name: 'Word Clock' },
    { id: 'binary', name: 'Binary' },
  ];

  return (
    <div className="flex flex-col items-center justify-center text-center w-full h-full">
      <div className="flex-grow flex flex-col items-center justify-center">
        <ClockDisplay />
        <p className="mt-6 text-xl md:text-2xl text-gray-500 dark:text-gray-400">{formatDate(time)}</p>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all"
      >
        Change Clock Theme
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Select a Theme</h2>
            <div className="grid grid-cols-2 gap-4">
              {clockThemes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsModalOpen(false);
                  }}
                  className={`p-4 rounded-lg text-center font-medium transition-all ${
                    theme === t.id
                      ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-8 w-full py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClockPage;