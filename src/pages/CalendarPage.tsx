"use client";

import React from 'react';

const CalendarPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] p-4">
      <h1 className="text-4xl font-bold mb-4">Calendar Page</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        This is a placeholder for the appointment calendar.
      </p>
    </div>
  );
};

export default CalendarPage;