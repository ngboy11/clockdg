import React, { useState, useRef, useCallback, useMemo } from 'react';

const StopwatchPage: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const timerRef = useRef<number | null>(null);

  const startTimer = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    const startTime = Date.now() - time;
    timerRef.current = window.setInterval(() => {
      setTime(Date.now() - startTime);
    }, 10);
  }, [isRunning, time]);

  const stopTimer = useCallback(() => {
    if (!isRunning || !timerRef.current) return;
    setIsRunning(false);
    clearInterval(timerRef.current);
    timerRef.current = null;
  }, [isRunning]);
  
  const resetTimer = useCallback(() => {
    stopTimer();
    setTime(0);
    setLaps([]);
  }, [stopTimer]);

  const addLap = useCallback(() => {
    if (!isRunning) return;
    setLaps([time, ...laps]);
  }, [isRunning, time, laps]);


  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };
  
  const { minLapTime, maxLapTime, hasUniqueLaps } = useMemo(() => {
    if (laps.length < 2) return { minLapTime: -1, maxLapTime: -1, hasUniqueLaps: false };
    const lapDurations = laps.map((lap, index) => lap - (laps[index + 1] || 0));
    const uniqueDurations = new Set(lapDurations);
    return {
      minLapTime: Math.min(...lapDurations),
      maxLapTime: Math.max(...lapDurations),
      hasUniqueLaps: uniqueDurations.size > 1,
    };
  }, [laps]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center">
      <h1 className="text-4xl font-bold mb-4">Stopwatch</h1>
      <div className="font-orbitron text-7xl md:text-8xl my-8 tracking-wider">{formatTime(time)}</div>

      <div className="flex justify-center items-center gap-4 md:gap-8 mb-8">
        <button 
          onClick={resetTimer} 
          disabled={isRunning || time === 0}
          className="w-20 h-20 rounded-full bg-gray-500 text-white text-lg font-semibold shadow-md hover:bg-gray-600 transition-all active:scale-95 disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset
        </button>
        
        {!isRunning ? (
          <button 
            onClick={startTimer}
            className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-green-500 text-white text-2xl font-bold shadow-lg hover:bg-green-600 transition-all active:scale-95 border-4 border-green-300 dark:border-green-700 flex items-center justify-center"
          >
            Start
          </button>
        ) : (
          <button 
            onClick={stopTimer}
            className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-red-500 text-white text-2xl font-bold shadow-lg hover:bg-red-600 transition-all active:scale-95 border-4 border-red-300 dark:border-red-700 flex items-center justify-center"
          >
            Stop
          </button>
        )}

        <button 
          onClick={addLap} 
          disabled={!isRunning}
          className="w-20 h-20 rounded-full bg-blue-600 text-white text-lg font-semibold shadow-md hover:bg-blue-700 transition-all active:scale-95 disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Lap
        </button>
      </div>

      <div className="w-full max-w-md h-64 overflow-y-auto bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-inner">
        {laps.length > 0 ? (
          <table className="w-full font-mono text-lg text-left">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-600">
                <th className="py-2 px-2 font-semibold text-gray-600 dark:text-gray-400">Lap</th>
                <th className="py-2 px-2 font-semibold text-gray-600 dark:text-gray-400 text-right">Lap Time</th>
                <th className="py-2 px-2 font-semibold text-gray-600 dark:text-gray-400 text-right">Total Time</th>
              </tr>
            </thead>
            <tbody>
              {laps.map((lap, index) => {
                const previousLapTime = laps[index + 1] || 0;
                const lapTime = lap - previousLapTime;
                
                let isFastest = false;
                let isSlowest = false;

                if (hasUniqueLaps) {
                  if (lapTime === minLapTime) isFastest = true;
                  else if (lapTime === maxLapTime) isSlowest = true;
                }

                const baseClass = "border-b border-gray-200 dark:border-gray-700 last:border-b-0 transition-colors";
                const fastestClass = "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 font-bold";
                const slowestClass = "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 font-bold";
                const normalClass = "text-gray-800 dark:text-gray-200";

                const rowClass = `${baseClass} ${isFastest ? fastestClass : isSlowest ? slowestClass : normalClass}`;

                return (
                   <tr key={index} className={rowClass}>
                    <td className="py-2 px-2">{laps.length - index}</td>
                    <td className="py-2 px-2 text-right">{formatTime(lapTime)}</td>
                    <td className={`py-2 px-2 text-right ${!isFastest && !isSlowest ? 'font-semibold' : ''}`}>{formatTime(lap)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Press 'Lap' to record times.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StopwatchPage;