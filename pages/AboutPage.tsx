import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="text-center max-w-2xl">
      <h1 className="text-4xl font-bold mb-6">About ClockDG</h1>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-lg space-y-4">
        <p>This application was designed to be a simple, elegant, and powerful time-keeping tool for all your devices.</p>
        <p>
          <span className="font-semibold">Owner:</span> Nilkamal-444
        </p>
        <p>
          <span className="font-semibold">Built by:</span> Google AI Studio
        </p>
      </div>
    </div>
  );
};

export default AboutPage;