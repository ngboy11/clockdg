import React, { useState, useEffect, useCallback } from 'react';
import { Page, Theme, TemperatureUnit } from './types';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import ClockPage from './pages/ClockPage';
import WorldClockPage from './pages/WorldClockPage';
import AlarmPage from './pages/AlarmPage';
import StopwatchPage from './pages/StopwatchPage';
import CalendarPage from './pages/CalendarPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import { Menu, X } from './components/icons/Icons';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as Theme) || Theme.Dark;
  });
  const [tempUnit, setTempUnit] = useState<TemperatureUnit>(() => {
    const savedUnit = localStorage.getItem('tempUnit');
    return (savedUnit as TemperatureUnit) || TemperatureUnit.Celsius;
  });

  useEffect(() => {
    if (theme === Theme.Dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('tempUnit', tempUnit);
  }, [tempUnit]);

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
    setIsSidebarOpen(false);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <HomePage navigate={navigate} />;
      case Page.Clock:
        return <ClockPage />;
      case Page.WorldClock:
        return <WorldClockPage tempUnit={tempUnit} />;
      case Page.Alarm:
        return <AlarmPage />;
      case Page.Stopwatch:
        return <StopwatchPage />;
      case Page.Calendar:
        return <CalendarPage />;
      case Page.Settings:
        return <SettingsPage theme={theme} setTheme={setTheme} tempUnit={tempUnit} setTempUnit={setTempUnit} />;
      case Page.About:
        return <AboutPage />;
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div className={`min-h-screen font-sans bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300 flex flex-col`}>
      <Sidebar isOpen={isSidebarOpen} navigate={navigate} currentPage={currentPage} />

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-50"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-5 left-5 z-30 p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
        
        <div className="w-full flex-1 flex items-center justify-center">
          {renderPage()}
        </div>
      </main>

      <footer className="text-center py-4 px-4 text-gray-500 dark:text-gray-400 text-sm">
        &copy; 2025 ClockDG. All rights reserved.
      </footer>
    </div>
  );
};

export default App;