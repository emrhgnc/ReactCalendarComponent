import { CalendarConfig, WeekDay, TimeSlot } from './types';

export const DEFAULT_CONFIG: CalendarConfig = {
  startHour: 6,
  timeSlotInterval: 15,
};

/**
 * Haftanın başlangıç gününü (Pazartesi) bulur
 */
export const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Pazartesi'yi bul
  return new Date(d.setDate(diff));
};

/**
 * Verilen tarihten itibaren 7 günlük hafta dizisi oluşturur
 */
export const getWeekDays = (weekStart: Date): WeekDay[] => {
  const days: WeekDay[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    date.setHours(0, 0, 0, 0);

    const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    
    days.push({
      date,
      dayName: dayNames[date.getDay()],
      dayOfMonth: date.getDate(),
      isToday: date.getTime() === today.getTime(),
    });
  }

  return days;
};

/**
 * Belirtilen saat aralığında zaman slotları oluşturur
 * Başlangıç saatinden itibaren 24 saat boyunca slotlar oluşturur
 */
export const generateTimeSlots = (config: CalendarConfig): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const { startHour, timeSlotInterval } = config;
  
  // 24 saat boyunca slot oluştur
  for (let i = 0; i < 24 * 60; i += timeSlotInterval) {
    const totalMinutes = startHour * 60 + i;
    const hour = Math.floor(totalMinutes / 60) % 24;
    const minute = totalMinutes % 60;
    
    const hourStr = hour.toString().padStart(2, '0');
    const minuteStr = minute.toString().padStart(2, '0');
    
    slots.push({
      hour,
      minute,
      label: `${hourStr}:${minuteStr}`,
    });
  }

  return slots;
};

/**
 * Saat stringini formatlı şekilde döndürür
 */
export const formatTime = (hour: number, minute: number): string => {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

/**
 * İki tarih arasındaki saat farkını dakika cinsinden hesaplar
 */
export const getMinutesBetween = (start: Date, end: Date): number => {
  return Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
};

/**
 * Tarih ve saatten Date nesnesi oluşturur
 * startHour parametresi verilirse, saat startHour'dan küçükse ertesi güne geçer
 */
export const createDateTime = (date: Date, hour: number, minute: number, startHour?: number): Date => {
  const dt = new Date(date);
  
  // Eğer startHour belirtilmişse ve saat startHour'dan küçükse, ertesi güne geç
  if (startHour !== undefined && hour < startHour) {
    dt.setDate(dt.getDate() + 1);
  }
  
  dt.setHours(hour, minute, 0, 0);
  return dt;
};

/**
 * Ay ve yıl bilgisini formatlı string olarak döndürür
 */
export const formatMonthYear = (date: Date): string => {
  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

/**
 * Hafta numarasını hesaplar
 */
export const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};
