
import React, { useState, useEffect } from 'react';
import { Reminder } from '../types';
import { ChevronLeft, ChevronRight } from '../components/icons/Icons';

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reminders, setReminders] = useState<Record<string, Reminder[]>>(() => {
    const saved = localStorage.getItem('reminders');
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [reminderText, setReminderText] = useState('');

  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [reminders]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const changeMonth = (delta: number) => {
    setCurrentDate(new Date(year, month + delta, 1));
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(year, month, day));
  };
  
  const addReminder = () => {
    if (!selectedDate || !reminderText.trim()) return;
    const dateKey = selectedDate.toISOString().split('T')[0];
    const newReminder: Reminder = { id: Date.now(), text: reminderText.trim() };
    const dayReminders = reminders[dateKey] || [];
    setReminders({ ...reminders, [dateKey]: [...dayReminders, newReminder] });
    setReminderText('');
    setSelectedDate(null);
  };

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="border-r border-b border-gray-200 dark:border-gray-700"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = new Date(year, month, day).toISOString().split('T')[0];
      const hasReminder = reminders[dateKey] && reminders[dateKey].length > 0;
      days.push(
        <div key={day} onClick={() => handleDateClick(day)} className="p-2 border-r border-b border-gray-200 dark:border-gray-700 text-center cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition relative">
          <span>{day}</span>
          {hasReminder && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></div>}
        </div>
      );
    }
    return days;
  };
  
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Calendar</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><ChevronLeft /></button>
          <h2 className="text-2xl font-semibold">{monthName} {year}</h2>
          <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><ChevronRight /></button>
        </div>
        <div className="grid grid-cols-7 border-t border-l border-gray-200 dark:border-gray-700">
          {weekdays.map(day => <div key={day} className="p-2 font-bold text-center border-r border-b border-gray-200 dark:border-gray-700">{day}</div>)}
          {renderDays()}
        </div>
      </div>
      
      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add Reminder for {selectedDate.toLocaleDateString()}</h3>
            <textarea
              value={reminderText}
              onChange={(e) => setReminderText(e.target.value)}
              className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700"
              rows={3}
              placeholder="What do you want to remember?"
            ></textarea>
            <div className="flex justify-end gap-4 mt-4">
              <button onClick={() => setSelectedDate(null)} className="px-4 py-2 bg-gray-500 text-white rounded-lg">Cancel</button>
              <button onClick={addReminder} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Add</button>
            </div>
            <div className="mt-6">
                <h4 className="font-semibold">Reminders for this day:</h4>
                <ul className="list-disc pl-5 mt-2 max-h-32 overflow-y-auto">
                    {(reminders[selectedDate.toISOString().split('T')[0]] || []).map(r => (
                        <li key={r.id}>{r.text}</li>
                    ))}
                    {(reminders[selectedDate.toISOString().split('T')[0]] || []).length === 0 && (
                        <li className="list-none text-gray-500">No reminders yet.</li>
                    )}
                </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
