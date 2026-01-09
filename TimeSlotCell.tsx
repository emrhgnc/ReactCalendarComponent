"use client"
import React from 'react';
import { TimeSlot, WeekDay, CalendarEvent } from './types';

interface TimeSlotCellProps {
  timeSlot: TimeSlot;
  day: WeekDay;
  isHourStart: boolean;
  events?: CalendarEvent[];
  timeSlotInterval: number;
  isNewDay: boolean;
  slotHeight: number;
  allTimeSlots: TimeSlot[];
  isDragging: boolean;
  isInDragSelection: boolean;
  onDragStart: () => void;
  onDragMove: () => void;
  onDragEnd: () => void;
  onClick?: () => void;
  onEventClick?: (event: CalendarEvent) => void;
  onEventDragStart?: (event: CalendarEvent) => void;
  onEventDragMove?: () => void;
  onEventDragEnd?: () => void;
  isDraggingEvent?: boolean;
  draggedEvent?: CalendarEvent | null;
}

export const TimeSlotCell: React.FC<TimeSlotCellProps> = ({
  timeSlot,
  day,
  isHourStart,
  events = [],
  timeSlotInterval,
  slotHeight,
  allTimeSlots,
  isDragging,
  isInDragSelection,
  isNewDay,
  onDragStart,
  onDragMove,
  onDragEnd,
  onClick,
  onEventClick,
  onEventDragStart,
  onEventDragMove,
  onEventDragEnd,
  isDraggingEvent = false,
  draggedEvent = null,
}) => {
  // Bu slot'ta başlayan event'leri bul (slot içinde herhangi bir yerde başlayan)
  const eventsStartingHere = events.filter(event => {
    const eventStart = new Date(event.startTime);
    const slotStartTime = new Date(day.date);
    slotStartTime.setHours(timeSlot.hour, timeSlot.minute, 0, 0);
    
    const slotEndTime = new Date(slotStartTime);
    slotEndTime.setMinutes(slotEndTime.getMinutes() + timeSlotInterval);
    
    // Event bu slot içinde başlıyorsa (slot başlangıcı <= event başlangıcı < slot bitişi)
    return eventStart >= slotStartTime && eventStart < slotEndTime;
  });

  // Event'in kaç slot yüksekliğinde olacağını hesapla
  const calculateEventHeight = (event: CalendarEvent) => {
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    const slots = Math.ceil(durationMinutes / timeSlotInterval);
    return slots * slotHeight;
  };

  // Event'in bu slot içindeki offset'ini hesapla (slot başından kaç piksel sonra başlıyor)
  const calculateEventTopOffset = (event: CalendarEvent) => {
    const eventStart = new Date(event.startTime);
    const slotStartTime = new Date(day.date);
    slotStartTime.setHours(timeSlot.hour, timeSlot.minute, 0, 0);
    
    // Event bu slottan önce başladıysa offset 0
    if (eventStart <= slotStartTime) {
      return 0;
    }
    
    // Event bu slot içinde başlıyorsa, slot başından kaç dakika sonra olduğunu hesapla
    const offsetMinutes = (eventStart.getTime() - slotStartTime.getTime()) / (1000 * 60);
    const offsetPixels = (offsetMinutes / timeSlotInterval) * slotHeight;
    return offsetPixels;
  };

  // Event rengi belirle
  const getEventColor = (category?: string) => {
    const colors: Record<string, string> = {
      'Haber': 'bg-blue-400',
      'Eğlence': 'bg-purple-400',
      'Spor': 'bg-green-400',
      'Belgesel': 'bg-yellow-400',
      'Film': 'bg-red-400',
    };
    return category && colors[category] ? colors[category] : 'bg-gray-400';
  };

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Sadece sol tık
    e.preventDefault();
    e.stopPropagation();
    onDragStart();
  };

  const handleMouseEnter = () => {
    if (isDragging) {
      onDragMove();
    }
    if (onEventDragMove) {
      onEventDragMove();
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging) {
      e.stopPropagation();
      onDragEnd();
    }
  };

  const handleEventMouseDown = (e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onEventDragStart) {
      onEventDragStart(event);
    }
  };

  return (
    <div
      className={`
        relative border-r border-gray-200 cursor-pointer transition-colors
        ${isHourStart ? 'border-t border-gray-300' : 'border-t border-gray-100'}
        'bg-blue-50/30' : 'bg-white'
        ${isInDragSelection ? 'bg-blue-200' : 'hover:bg-blue-50'}
        ${isNewDay ? 'border-t-4 border-gray-300' : 'border-t border-gray-100'}
      `}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseUp={handleMouseUp}
      style={{ minHeight: `${slotHeight}px`, userSelect: 'none' }}
    >
      {/* Event'leri render et */}
      {eventsStartingHere.map((event) => {
        const isBeingDragged = isDraggingEvent && draggedEvent?.id === event.id;
        const topOffset = calculateEventTopOffset(event);
        return (
          <div
            key={event.id}
            className={`absolute left-0 right-0 ${getEventColor(event.category)} text-white p-1 overflow-hidden z-10 border border-white cursor-move transition-opacity ${
              isBeingDragged ? 'opacity-30' : 'opacity-100'
            }`}
            style={{ 
              height: `${calculateEventHeight(event)}px`,
              top: `${topOffset}px`,
            }}
            onMouseDown={(e) => handleEventMouseDown(e, event)}
            onClick={(e) => {
              e.stopPropagation();
              onEventClick?.(event);
            }}
          >
            <div className="text-xs font-semibold truncate">{event.title}</div>
            {event.category && (
              <div className="text-xs opacity-90 truncate">{event.category}</div>
            )}
          </div>
        );
      })}

      {/* Ghost event - sürüklenme sırasında yeni konumda görünür */}
      {isDraggingEvent && draggedEvent && isInDragSelection && (
        <div
          className={`absolute left-0 right-0 ${getEventColor(draggedEvent.category)} text-white p-1 overflow-hidden z-20 border-2 border-white opacity-70`}
          style={{ 
            height: `${calculateEventHeight(draggedEvent)}px`,
            top: 0,
            pointerEvents: 'none',
          }}
        >
          <div className="text-xs font-semibold truncate">{draggedEvent.title}</div>
          {draggedEvent.category && (
            <div className="text-xs opacity-90 truncate">{draggedEvent.category}</div>
          )}
        </div>
      )}
    </div>
  );
};

interface TimeColumnProps {
  timeSlot: TimeSlot;
  isHourStart: boolean;
  slotHeight: number;
}

export const TimeColumn: React.FC<TimeColumnProps> = ({ timeSlot, isHourStart, slotHeight }) => {
  return (
    <div
      className={`
        relative bg-gray-50 border-r border-gray-200 text-right pr-2 flex items-start pt-0.5
        ${isHourStart ? 'border-t border-gray-300' : 'border-t border-gray-100'}
      `}
      style={{ minHeight: `${slotHeight}px` }}
    >
      <span className="text-xs text-gray-600 font-medium">
        {timeSlot.label}
      </span>
    </div>
  );
};
