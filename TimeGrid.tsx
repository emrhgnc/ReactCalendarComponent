"use client"
import React, { useEffect, useState } from 'react';
import { TimeSlot, WeekDay, CalendarEvent } from './types';
import { TimeSlotCell, TimeColumn } from './TimeSlotCell';
import { createDateTime } from './utils';
import moment from 'moment';

interface TimeGridProps {
  timeSlots: TimeSlot[];
  weekDays: WeekDay[];
  events?: CalendarEvent[];
  slotHeight?: number;
  onTimeSlotClick?: (date: Date, time: TimeSlot) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onEventCreate?: (startTime: Date, endTime: Date) => void;
  onEventUpdate?: (event: CalendarEvent, newStartTime: Date, newEndTime: Date) => void;
}

interface DragState {
  isDragging: boolean;
  startSlot: { day: WeekDay; timeSlot: TimeSlot } | null;
  currentSlot: { day: WeekDay; timeSlot: TimeSlot } | null;
}

interface EventDragState {
  isDragging: boolean;
  event: CalendarEvent | null;
  startSlot: { day: WeekDay; timeSlot: TimeSlot } | null;
  currentSlot: { day: WeekDay; timeSlot: TimeSlot } | null;
}

export const TimeGrid: React.FC<TimeGridProps> = ({
  timeSlots,
  weekDays,
  events = [],
  slotHeight = 40,
  onTimeSlotClick,
  onEventClick,
  onEventCreate,
  onEventUpdate,
}) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startSlot: null,
    currentSlot: null,
  });

  const [eventDragState, setEventDragState] = useState<EventDragState>({
    isDragging: false,
    event: null,
    startSlot: null,
    currentSlot: null,
  });

  const handleSlotClick = (day: WeekDay, timeSlot: TimeSlot) => {
    if (onTimeSlotClick) {
      const dateTime = createDateTime(day.date, timeSlot.hour, timeSlot.minute);
      onTimeSlotClick(dateTime, timeSlot);
    }
  };

  // Drag handlers
  const handleDragStart = (day: WeekDay, timeSlot: TimeSlot) => {
    setDragState({
      isDragging: true,
      startSlot: { day, timeSlot },
      currentSlot: { day, timeSlot },
    });
  };

  const handleDragMove = (day: WeekDay, timeSlot: TimeSlot) => {
    if (dragState.isDragging) {
      setDragState(prev => ({
        ...prev,
        currentSlot: { day, timeSlot },
      }));
    }
  };

  const handleDragEnd = () => {
    if (dragState.isDragging && dragState.startSlot && dragState.currentSlot) {
      const { day: startDay, timeSlot: startTimeSlot } = dragState.startSlot;
      const { day: endDay, timeSlot: endTimeSlot } = dragState.currentSlot;
      
      const startHour = timeSlots.length > 0 ? timeSlots[0].hour : 6;
      const startTime = createDateTime(startDay.date, startTimeSlot.hour, startTimeSlot.minute, startHour);
      const endTime = createDateTime(endDay.date, endTimeSlot.hour, endTimeSlot.minute + timeSlotInterval, startHour);
      
      // Başlangıç ve bitiş zamanlarını düzenle (küçük olan başlangıç olmalı)
      const actualStart = startTime < endTime ? startTime : endTime;
      const actualEnd = startTime < endTime ? endTime : startTime;
      
      console.log('Event created:', {
        startTime: actualStart,
        endTime: actualEnd,
        // startFormatted: actualStart.toLocaleString('tr-TR'),
        // endFormatted: actualEnd.toLocaleString('tr-TR')
      });
      
      if (onEventCreate) {
        onEventCreate(actualStart, actualEnd);
      }
    }
    
    setDragState({
      isDragging: false,
      startSlot: null,
      currentSlot: null,
    });
  };

  // Event drag handlers
  const handleEventDragStart = (event: CalendarEvent, day: WeekDay, timeSlot: TimeSlot) => {
    const eventStart = new Date(event.startTime);
    setEventDragState({
      isDragging: true,
      event,
      startSlot: { day, timeSlot },
      currentSlot: { day, timeSlot },
    });
  };

  const handleEventDragMove = (day: WeekDay, timeSlot: TimeSlot) => {
    if (eventDragState.isDragging) {
      setEventDragState(prev => ({
        ...prev,
        currentSlot: { day, timeSlot },
      }));
    }
  };

  const handleEventDragEnd = () => {
    if (eventDragState.isDragging && eventDragState.event && eventDragState.startSlot && eventDragState.currentSlot) {
      const { event } = eventDragState;
      const { day: startDay, timeSlot: startTimeSlot } = eventDragState.startSlot;
      const { day: currentDay, timeSlot: currentTimeSlot } = eventDragState.currentSlot;
      
      // Orijinal event süresi
      const originalDuration = new Date(event.endTime).getTime() - new Date(event.startTime).getTime();
      
      // Yeni başlangıç zamanını hesapla
      const startHour = timeSlots.length > 0 ? timeSlots[0].hour : 6;
      const newStartTime = createDateTime(currentDay.date, currentTimeSlot.hour, currentTimeSlot.minute, startHour);
      
      // Yeni bitiş zamanı (aynı süreyi koru)
      const newEndTime = new Date(newStartTime.getTime() + originalDuration);
      
      console.log('Event updated:', {
        eventId: event.id,
        oldStart: event.startTime,
        oldEnd: event.endTime,
        newStart: newStartTime.toISOString(),
        newEnd: newEndTime.toISOString(),
        newStartFormatted: newStartTime.toLocaleString('tr-TR'),
        newEndFormatted: newEndTime.toLocaleString('tr-TR')
      });
      
      if (onEventUpdate) {
        onEventUpdate(event, newStartTime, newEndTime);
      }
    }
    
    setEventDragState({
      isDragging: false,
      event: null,
      startSlot: null,
      currentSlot: null,
    });
  };

  // Check if slot is in drag selection
  const isInDragSelection = (day: WeekDay, timeSlot: TimeSlot): boolean => {
    if (!dragState.isDragging || !dragState.startSlot || !dragState.currentSlot) return false;
    
    // Sadece aynı gün içinde drag yapılıyorsa
    if (dragState.startSlot.day.date.getTime() === dragState.currentSlot.day.date.getTime()) {
      // Sadece bu gün seçiliyse
      if (day.date.getTime() !== dragState.startSlot.day.date.getTime()) return false;
      
      const currentMinutes = timeSlot.hour * 60 + timeSlot.minute;
      const startMinutes = dragState.startSlot.timeSlot.hour * 60 + dragState.startSlot.timeSlot.minute;
      const endMinutes = dragState.currentSlot.timeSlot.hour * 60 + dragState.currentSlot.timeSlot.minute;
      
      const min = Math.min(startMinutes, endMinutes);
      const max = Math.max(startMinutes, endMinutes);
      
      return currentMinutes >= min && currentMinutes <= max;
    }
    
    // Farklı günler arasında drag yapılıyorsa
    const startDate = dragState.startSlot.day.date.getTime();
    const endDate = dragState.currentSlot.day.date.getTime();
    const currentDate = day.date.getTime();
    
    const minDate = Math.min(startDate, endDate);
    const maxDate = Math.max(startDate, endDate);
    
    // Bu gün seçili aralıkta değilse
    if (currentDate < minDate || currentDate > maxDate) return false;
    
    // Başlangıç günü
    if (currentDate === minDate) {
      const currentMinutes = timeSlot.hour * 60 + timeSlot.minute;
      const startMinutes = (startDate === minDate ? dragState.startSlot : dragState.currentSlot).timeSlot.hour * 60 + 
                          (startDate === minDate ? dragState.startSlot : dragState.currentSlot).timeSlot.minute;
      return currentMinutes >= startMinutes;
    }
    
    // Bitiş günü
    if (currentDate === maxDate) {
      const currentMinutes = timeSlot.hour * 60 + timeSlot.minute;
      const endMinutes = (endDate === maxDate ? dragState.currentSlot : dragState.startSlot).timeSlot.hour * 60 + 
                        (endDate === maxDate ? dragState.currentSlot : dragState.startSlot).timeSlot.minute;
      return currentMinutes <= endMinutes;
    }
    
    // Aradaki günler tamamen seçili
    return true;
  };

  // Global mouseup event listener
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (dragState.isDragging) {
        handleDragEnd();
      }
      if (eventDragState.isDragging) {
        handleEventDragEnd();
      }
    };
    
    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragState.isDragging, eventDragState.isDragging]);

  // Event'leri gün bazında grupla
  // Her sütun startHour'dan başlayıp 24 saat devam eder
  const getEventsForDay = (day: WeekDay) => {
    const startHour = timeSlots.length > 0 ? timeSlots[0].hour : 6;
    
    // Sütunun başlangıç zamanı: day.date + startHour
    const columnStart = new Date(day.date);
    columnStart.setHours(startHour, 0, 0, 0);
    
    // Sütunun bitiş zamanı: ertesi gün startHour
    const columnEnd = new Date(columnStart);
    columnEnd.setDate(columnEnd.getDate() + 1);
    
    return events.filter(event => {
      const eventStart = new Date(event.startTime);
      // Event başlangıcı, sütunun zaman aralığında mı?
      return eventStart >= columnStart && eventStart < columnEnd;
    });
  };

  // TimeSlot interval'ı hesapla
  const timeSlotInterval = timeSlots.length > 1 
    ? (timeSlots[1].hour * 60 + timeSlots[1].minute) - (timeSlots[0].hour * 60 + timeSlots[0].minute)
    : 15;

  return (
    <div className="flex-1 overflow-auto">
      <div className="grid grid-cols-8 relative">
        {timeSlots.map((timeSlot, timeIndex) => {
          const isHourStart = timeSlot.minute === 0;
          const isNewDay = timeSlot.hour === 0 && timeSlot.minute === 0;
          
          return (
            <React.Fragment key={timeIndex}>
              {/* Time label column */}
              <TimeColumn timeSlot={timeSlot} isHourStart={isHourStart} slotHeight={slotHeight} />
              
              {/* Day columns */}
              {weekDays.map((day, dayIndex) => {
                const dayEvents = getEventsForDay(day);
                return (
                  <TimeSlotCell
                    key={`${timeIndex}-${dayIndex}`}
                    timeSlot={timeSlot}
                    day={day}
                    isHourStart={isHourStart}
                    isNewDay={isNewDay}
                    events={dayEvents}
                    timeSlotInterval={timeSlotInterval}
                    slotHeight={slotHeight}
                    allTimeSlots={timeSlots}
                    isDragging={dragState.isDragging}
                    isInDragSelection={isInDragSelection(day, timeSlot)}
                    onDragStart={() => handleDragStart(day, timeSlot)}
                    onDragMove={() => handleDragMove(day, timeSlot)}
                    onDragEnd={handleDragEnd}
                    onClick={() => handleSlotClick(day, timeSlot)}
                    onEventClick={onEventClick}
                    onEventDragStart={(event) => handleEventDragStart(event, day, timeSlot)}
                    onEventDragMove={() => handleEventDragMove(day, timeSlot)}
                    onEventDragEnd={handleEventDragEnd}
                    isDraggingEvent={eventDragState.isDragging}
                    draggedEvent={eventDragState.event}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
