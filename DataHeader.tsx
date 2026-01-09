import React from 'react';
import { WeekDay } from './types';

interface DateHeaderProps {
  weekDays: WeekDay[];
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  currentMonthYear: string;
  weekNumber: number;
}

export const DateHeader: React.FC<DateHeaderProps> = ({
  weekDays,
  onPrevWeek,
  onNextWeek,
  onToday,
  onZoomIn,
  onZoomOut,
  currentMonthYear,
  weekNumber,
}) => {
  return (
    <div className="bg-white border-b border-gray-200">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button
            onClick={onToday}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            Bugün
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={onPrevWeek}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
              aria-label="Önceki hafta"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={onNextWeek}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
              aria-label="Sonraki hafta"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-1 ml-2 border-l border-gray-300 pl-2">
            <button
              onClick={onZoomOut}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
              aria-label="Zoom out"
              title="Uzaklaştır"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>
            <button
              onClick={onZoomIn}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
              aria-label="Zoom in"
              title="Yakınlaştır"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">{currentMonthYear}</h2>
          <span className="text-sm text-gray-500">Hafta {weekNumber}</span>
        </div>
        <div className="w-32">{/* Spacer for balance */}</div>
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-8 border-b border-gray-200 pe-[15px]">
        {/* Empty cell for time column */}
        <div className="bg-gray-50 border-r border-gray-200"></div>
        
        {/* Day columns */}
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={`py-3 text-center border-r border-gray-200 ${
              day.isToday ? 'bg-blue-50' : 'bg-gray-50'
            }`}
          >
            <div
              className={`text-xs font-medium uppercase ${
                day.isToday ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              {day.dayName.substring(0, 3)}
            </div>
            <div
              className={`mt-1 text-2xl font-semibold ${
                day.isToday
                  ? 'text-blue-600'
                  : day.date.getDay() === 0 || day.date.getDay() === 6
                  ? 'text-gray-400'
                  : 'text-gray-900'
              }`}
            >
              {day.dayOfMonth}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
