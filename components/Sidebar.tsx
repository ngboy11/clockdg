import React from 'react';
import { Page } from '../types';
import { Home, Clock, Globe, Alarm, Timer, Calendar, Settings, Info } from './icons/Icons';

interface SidebarProps {
  isOpen: boolean;
  navigate: (page: Page) => void;
  currentPage: Page;
}

const navItems = [
  { page: Page.Home, icon: <Home />, label: 'Home' },
  { page: Page.Clock, icon: <Clock />, label: 'Clock' },
  { page: Page.WorldClock, icon: <Globe />, label: 'World Clock' },
  { page: Page.Alarm, icon: <Alarm />, label: 'Alarm' },
  { page: Page.Stopwatch, icon: <Timer />, label: 'Stopwatch' },
  { page: Page.Calendar, icon: <Calendar />, label: 'Calendar' },
  { page: Page.Settings, icon: <Settings />, label: 'Settings' },
  { page: Page.About, icon: <Info />, label: 'About' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, navigate, currentPage }) => {
  const baseItemClass = "flex items-center w-full px-4 py-3 text-lg rounded-lg transition-all duration-200 ease-in-out";
  const activeItemClass = "bg-blue-600 text-white shadow-lg";
  const inactiveItemClass = "text-gray-400 hover:bg-gray-700 hover:text-white";

  return (
    <aside className={`fixed top-0 left-0 h-full bg-gray-800 dark:bg-black text-white w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-40 shadow-2xl`}>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white tracking-wider">ClockDG</h1>
      </div>
      <nav className="mt-8 px-4 space-y-2">
        {navItems.map(item => (
          <button
            key={item.page}
            onClick={() => navigate(item.page)}
            className={`${baseItemClass} ${currentPage === item.page ? activeItemClass : inactiveItemClass}`}
          >
            <span className="mr-4">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;