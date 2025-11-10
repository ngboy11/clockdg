import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Page } from '../types';
import { Clock, Alarm, Timer, Calendar, Globe, ChevronLeft, ChevronRight } from '../components/icons/Icons';

interface HomePageProps {
  navigate: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const menuItems = [
    { page: Page.Clock, icon: <Clock />, label: 'Clock' },
    { page: Page.WorldClock, icon: <Globe />, label: 'World Clock' },
    { page: Page.Alarm, icon: <Alarm />, label: 'Alarm' },
    { page: Page.Stopwatch, icon: <Timer />, label: 'Stopwatch' },
    { page: Page.Calendar, icon: <Calendar />, label: 'Calendar' },
  ];

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const handleScrollCheck = useCallback(() => {
    const el = scrollContainerRef.current;
    if (el) {
      const isAtStart = el.scrollLeft < 10;
      const isAtEnd = el.scrollWidth - el.scrollLeft - el.clientWidth < 10;
      setCanScrollLeft(!isAtStart);
      setCanScrollRight(!isAtEnd);
    }
  }, []);
  
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      const checkScrollability = () => {
        const hasOverflow = el.scrollWidth > el.clientWidth;
        if (!hasOverflow) {
          setCanScrollLeft(false);
          setCanScrollRight(false);
        } else {
          handleScrollCheck();
        }
      };

      checkScrollability();
      
      const observer = new ResizeObserver(checkScrollability);
      observer.observe(el);

      return () => {
        observer.disconnect();
      };
    }
  }, [menuItems, handleScrollCheck]);


  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (el) {
      const scrollAmount = el.clientWidth * 0.8; // Scroll by 80% of visible width
      el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="text-center w-full">
      <h1 className="text-5xl md:text-7xl font-bold text-gray-800 dark:text-white mb-4 animate-fade-in">ClockDG</h1>
      <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 mb-12 animate-fade-in" style={{animationDelay: '0.2s', animationFillMode: 'backwards'}}>Your Time, Your Way. Everywhere.</p>

      <div className="relative w-full max-w-5xl mx-auto">
        <div 
          ref={scrollContainerRef} 
          onScroll={handleScrollCheck}
          className="flex overflow-x-auto space-x-4 md:space-x-6 py-4 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {menuItems.map((item, index) => (
            <button
              key={item.page}
              onClick={() => navigate(item.page)}
              className="group flex-shrink-0 w-48 h-56 md:w-56 md:h-64 flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg hover:shadow-2xl dark:hover:bg-gray-700/50 transform hover:-translate-y-2 active:scale-95 transition-all duration-300 ease-in-out"
              style={{ animation: `fadeInUp 0.5s ease-out ${0.3 + index * 0.1}s both` }}
            >
              <div className="text-blue-500 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                 {React.cloneElement(item.icon, { className: 'w-12 h-12 md:w-16 md:h-16' })}
              </div>
              <span className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-300">{item.label}</span>
            </button>
          ))}
        </div>
        
        <button 
          onClick={() => scroll('left')}
          className={`absolute top-1/2 -translate-y-1/2 left-0 z-10 p-2 bg-white/50 dark:bg-gray-800/50 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-800 transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-label="Scroll left"
        >
          <ChevronLeft />
        </button>
        <button 
          onClick={() => scroll('right')}
          className={`absolute top-1/2 -translate-y-1/2 right-0 z-10 p-2 bg-white/50 dark:bg-gray-800/50 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-800 transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-label="Scroll right"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default HomePage;