export interface CalendarConfig {
  startHour: number; // Başlangıç saati (örn: 6 = 06:00) - Her gün bu saatten başlayıp 24 saat devam eder
  timeSlotInterval: number; // Dakika cinsinden zaman aralığı (5-30 arası)
}

export interface WeekDay {
  date: Date;
  dayName: string;
  dayOfMonth: number;
  isToday: boolean;
}

export interface TimeSlot {
  hour: number;
  minute: number;
  label: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  category?: string;
  startTime: Date;
  endTime: Date;
  color?: string;
}

export interface CalendarProps {
  config?: Partial<CalendarConfig>;
  events?: CalendarEvent[];
  onTimeSlotClick?: (date: Date, time: TimeSlot) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onEventCreate?: (startTime: Date, endTime: Date) => void;
  onEventUpdate?: (event: CalendarEvent, newStartTime: Date, newEndTime: Date) => void;
}
