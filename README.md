# Haftalık Takvim Componenti

Bu klasör, haftalık takvim görünümü için gerekli tüm bileşenleri içerir.

## Özellikler

- ✅ Haftalık görünüm (Pazartesi-Pazar)
- ✅ Özelleştirilebilir başlangıç saati (varsayılan: 06:00)
- ✅ Her gün başlangıç saatinden 24 saat devam eder (örn: Pazartesi 06:00 - Salı 06:00)
- ✅ Ayarlanabilir zaman aralıkları (5-30 dakika arası)
- ✅ Responsive tasarım
- ✅ Bugünü vurgulama
- ✅ Hafta gezintisi (önceki/sonraki hafta)
- ✅ Tıklanabilir zaman slotları

## Kullanım

```tsx
import { WeeklyCalendar } from '@/components/calendar';

function MyPage() {
  const handleTimeSlotClick = (date: Date, timeSlot: TimeSlot) => {
    console.log('Tıklanan zaman:', date, timeSlot);
  };

  return (
    <div className="h-screen">
      <WeeklyCalendar
        config={{
          startHour: 6,        // Başlangıç saati: 06:00 (Pazartesi 06:00 - Salı 06:00)
          timeSlotInterval: 15 // 15 dakikalık aralıklar
        }}
        onTimeSlotClick={handleTimeSlotClick}
      />
    </div>
  );
}
```

## Yapı

```
calendar/
├── index.tsx              # Export dosyası
├── types.ts               # TypeScript tip tanımlamaları
├── utils.ts               # Yardımcı fonksiyonlar
├── WeeklyCalendar.tsx     # Ana takvim componenti
├── DateHeader.tsx         # Günler ve navigasyon başlığı
├── TimeGrid.tsx           # Zaman grid'i
├── TimeSlotCell.tsx       # Zaman slot hücreleri
└── README.md              # Bu dosya
```

## Props

### WeeklyCalendar

| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `config` | `Partial<CalendarConfig>` | `{ startHour: 6, timeSlotInterval: 15 }` | Takvim yapılandırması |
| `events` | `CalendarEvent[]` | `[]` | Takvimde gösterilecek etkinlikler |
| `onTimeSlotClick` | `(date: Date, time: TimeSlot) => void` | - | Zaman slot'una tıklandığında çağrılır |
| `onEventClick` | `(event: CalendarEvent) => void` | - | Etkinliğe tıklandığında çağrılır |

### CalendarConfig

```typescript
interface CalendarConfig {
  startHour: number;        // Başlangıç saati (0-23) - Her gün bu saatten 24 saat devam eder
  timeSlotInterval: number; // Zaman aralığı dakika (5-30)
}
```

## Özelleştirme

### Başlangıç Saatini Değiştirme

```tsx
<WeeklyCalendar
  config={{
    startHour: 8,  // 08:00'den başla (Pazartesi 08:00 - Salı 08:00)
  }}
/>
```

### Zaman Aralığını Ayarlama

```tsx
<WeeklyCalendar
  config={{
    timeSlotInterval: 30  // 30 dakikalık aralıklar
  }}
/>
```

**Not:** `timeSlotInterval` değeri 5 ile 30 dakika arasında olmalıdır.

## Gelecek Geliştirmeler

- [ ] Etkinlik gösterimi
- [ ] Drag & drop desteği
- [ ] Etkinlik oluşturma modal'ı
- [ ] Farklı görünüm modları (günlük, aylık)
- [ ] Etkinlik filtreleme
- [ ] Export/Import fonksiyonları
