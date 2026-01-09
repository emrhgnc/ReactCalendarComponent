'use client';

import React, { useState, useMemo } from 'react';
import { CalendarProps, CalendarConfig } from './types';
import { DateHeader } from './DateHeader';
import { TimeGrid } from './TimeGrid';
import {
  DEFAULT_CONFIG,
  getWeekStart,
  getWeekDays,
  generateTimeSlots,
  formatMonthYear,
  getWeekNumber,
} from './utils';

export const WeeklyCalendar: React.FC<CalendarProps> = ({
  config: userConfig,
  events = [],
  onTimeSlotClick,
  onEventClick,
  onEventCreate,
  onEventUpdate,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [zoomLevel, setZoomLevel] = useState(1);

  // Config'i merge et
  const config: CalendarConfig = useMemo(
    () => ({
      ...DEFAULT_CONFIG,
      ...userConfig,
    }),
    [userConfig]
  );

  // Validate config
  useMemo(() => {
    if (config.timeSlotInterval < 5 || config.timeSlotInterval > 30) {
      console.warn(
        `timeSlotInterval must be between 5 and 30. Using default: ${DEFAULT_CONFIG.timeSlotInterval}`
      );
      config.timeSlotInterval = DEFAULT_CONFIG.timeSlotInterval;
    }
  }, [config]);

  // Hafta başlangıcını hesapla
  const weekStart = useMemo(() => getWeekStart(currentDate), [currentDate]);

  // Hafta günlerini oluştur
  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);

  // Zaman slotlarını oluştur
  const timeSlots = useMemo(() => generateTimeSlots(config), [config]);

  // Ay ve yıl bilgisi
  const currentMonthYear = useMemo(() => formatMonthYear(weekStart), [weekStart]);

  // Hafta numarası
  const weekNumber = useMemo(() => getWeekNumber(weekStart), [weekStart]);

  // Navigation handlers
  const handlePrevWeek = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
  };

  const handleNextWeek = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Zoom handlers
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 3)); // Max 3x zoom
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5)); // Min 0.5x zoom
  };

  // Slot height'ı zoom seviyesine göre hesapla
  const slotHeight = useMemo(() => 40 * zoomLevel, [zoomLevel]);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      <DateHeader
        weekDays={weekDays}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        onToday={handleToday}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        currentMonthYear={currentMonthYear}
        weekNumber={weekNumber}
      />
      <TimeGrid
        timeSlots={timeSlots}
        weekDays={weekDays}
        events={events}
        slotHeight={slotHeight}
        onTimeSlotClick={onTimeSlotClick}
        onEventClick={onEventClick}
        onEventCreate={onEventCreate}
        onEventUpdate={onEventUpdate}
      />
    </div>
  );
};
