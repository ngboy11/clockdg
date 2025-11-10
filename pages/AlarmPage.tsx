import React, { useState, useEffect, useRef } from 'react';
import { Alarm } from '../types';

const defaultSounds = ['Classic', 'Digital', 'Beep', 'Zen'];

const AlarmPage: React.FC = () => {
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const savedAlarms = localStorage.getItem('alarms');
    return savedAlarms ? JSON.parse(savedAlarms) : [];
  });
  const [newAlarmTime, setNewAlarmTime] = useState('07:00');
  const [newAlarmLabel, setNewAlarmLabel] = useState('');
  const [newAlarmSound, setNewAlarmSound] = useState(defaultSounds[0]);
  const [customSoundFile, setCustomSoundFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('alarms', JSON.stringify(alarms));
  }, [alarms]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCustomSoundFile(e.target.files[0]);
    }
  };

  const addAlarm = async () => {
    if (!newAlarmTime) return;

    let soundName = newAlarmSound;
    let soundDataUrl: string | undefined = undefined;

    if (customSoundFile) {
      soundName = customSoundFile.name;
      try {
        soundDataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target?.result as string);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(customSoundFile);
        });
      } catch (error) {
        console.error("Error reading file:", error);
        return; // Or show an error to the user
      }
    }

    const newAlarm: Alarm = {
      id: Date.now(),
      time: newAlarmTime,
      label: newAlarmLabel || 'Alarm',
      sound: soundName,
      customSound: soundDataUrl,
      enabled: true,
    };
    setAlarms([...alarms, newAlarm].sort((a, b) => a.time.localeCompare(b.time)));
    setNewAlarmLabel('');
    setCustomSoundFile(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleAlarm = (id: number) => {
    setAlarms(
      alarms.map((alarm) =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      )
    );
  };

  const deleteAlarm = (id: number) => {
    setAlarms(alarms.filter((alarm) => alarm.id !== id));
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Alarms</h1>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Alarm</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <input
            type="time"
            value={newAlarmTime}
            onChange={(e) => setNewAlarmTime(e.target.value)}
            className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg w-full"
          />
          <input
            type="text"
            placeholder="Label"
            value={newAlarmLabel}
            onChange={(e) => setNewAlarmLabel(e.target.value)}
            className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg w-full"
          />
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              value={newAlarmSound}
              onChange={(e) => {setNewAlarmSound(e.target.value); setCustomSoundFile(null);}}
              disabled={!!customSoundFile}
              className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg w-full disabled:opacity-50"
            >
              {defaultSounds.map(sound => <option key={sound} value={sound}>{sound}</option>)}
            </select>
            <div className="relative">
              <label htmlFor="sound-upload" className="w-full text-center px-4 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition cursor-pointer block">
                {customSoundFile ? "Change Sound" : "Upload Sound"}
              </label>
              <input id="sound-upload" ref={fileInputRef} type="file" accept="audio/*" onChange={handleFileChange} className="hidden" />
            </div>
          </div>
          {customSoundFile && (
            <div className="md:col-span-2 flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                <span className="truncate text-sm">{customSoundFile.name}</span>
                <button onClick={() => {setCustomSoundFile(null); if(fileInputRef.current) fileInputRef.current.value = "";}} className="text-red-500 font-bold ml-2 p-1">X</button>
            </div>
          )}
        </div>
        <button
            onClick={addAlarm}
            className="w-full mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
        >
            Add Alarm
        </button>
      </div>

      <div className="space-y-4">
        {alarms.length > 0 ? (
          alarms.map((alarm) => (
            <div
              key={alarm.id}
              className={`flex items-center justify-between p-4 rounded-lg shadow transition-all ${
                alarm.enabled ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-gray-200 dark:bg-gray-800 opacity-60'
              }`}
            >
              <div>
                <p className="text-3xl font-bold">{alarm.time}</p>
                <p className="text-gray-600 dark:text-gray-400 truncate max-w-xs">{alarm.label} - {alarm.sound}</p>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => deleteAlarm(alarm.id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alarm.enabled}
                    onChange={() => toggleAlarm(alarm.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-400 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">No alarms set.</p>
        )}
      </div>
    </div>
  );
};

export default AlarmPage;