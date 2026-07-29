import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock } from 'lucide-react';

export const INSPECTION_SLOTS = [
  "08:00 AM",
  "08:45 AM",
  "09:30 AM",
  "10:15 AM",
  "11:00 AM"
];

interface InspectionSlotPickerProps {
  onSelectSlot: (dateTimeString: string, isValid: boolean) => void;
}

export default function InspectionSlotPicker({ onSelectSlot }: InspectionSlotPickerProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [occupiedSlots, setOccupiedSlots] = useState<Record<string, string[]>>({});

  useEffect(() => {
    fetchOccupiedSlots();
  }, []);

  const fetchOccupiedSlots = async () => {
    try {
      const res = await fetch('/api/inspection-slots');
      if (res.ok) {
        const data = await res.json();
        setOccupiedSlots(data.occupied || {});
      }
    } catch (e) {
      console.error("Error fetching inspection slots:", e);
    }
  };

  // Generate ONLY upcoming Mondays and Tuesdays
  const availableDays = useMemo(() => {
    const dates: { dateStr: string; label: string }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 40; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayOfWeek = d.getDay(); // 1 = Lunes, 2 = Martes
      if (dayOfWeek === 1 || dayOfWeek === 2) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const dayName = dayOfWeek === 1 ? 'Lunes' : 'Martes';
        const monthName = d.toLocaleDateString('es-ES', { month: 'short' });
        const label = `${dayName} ${d.getDate()} ${monthName}`;

        dates.push({ dateStr, label });
        if (dates.length >= 6) break;
      }
    }
    return dates;
  }, []);

  // Pre-select first available date & time slot automatically
  useEffect(() => {
    if (availableDays.length > 0) {
      const activeDate = selectedDate || availableDays[0].dateStr;
      if (!selectedDate) {
        setSelectedDate(activeDate);
      }
      const booked = occupiedSlots[activeDate] || [];
      const firstFree = INSPECTION_SLOTS.find(slot => !booked.includes(slot)) || INSPECTION_SLOTS[0];
      const activeTime = selectedTime || firstFree;
      if (!selectedTime) {
        setSelectedTime(firstFree);
      }
      onSelectSlot(`${activeDate} (${activeTime})`, true);
    }
  }, [availableDays, selectedDate, selectedTime, occupiedSlots]);

  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
    const booked = occupiedSlots[dateStr] || [];
    const firstFree = INSPECTION_SLOTS.find(slot => !booked.includes(slot)) || INSPECTION_SLOTS[0];
    setSelectedTime(firstFree);
    onSelectSlot(`${dateStr} (${firstFree})`, true);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    const combined = `${selectedDate} (${time})`;
    onSelectSlot(combined, true);
  };

  const bookedForSelectedDate = selectedDate ? (occupiedSlots[selectedDate] || []) : [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Cubículo 1: Fecha (Lunes y Martes) */}
      <div className="space-y-2 text-left">
        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2 sm:ml-4 flex items-center gap-1.5 whitespace-nowrap h-4">
          <Calendar size={13} className="text-primary shrink-0" /> <span>Fecha (Lunes y Martes)</span>
        </label>
        <div className="relative">
          <select 
            value={selectedDate}
            onChange={(e) => handleDateSelect(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl sm:rounded-2xl py-3 sm:py-4 px-4 sm:px-6 focus:border-primary outline-none transition-all appearance-none cursor-pointer text-white text-sm font-bold pr-10"
          >
            {availableDays.map((d) => {
              const booked = occupiedSlots[d.dateStr] || [];
              const isFull = booked.length >= 5;
              return (
                <option key={d.dateStr} value={d.dateStr} disabled={isFull} className="bg-[#12141a] text-white">
                  {d.label} {isFull ? '(LLENO)' : ''}
                </option>
              );
            })}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-xs">
            ▼
          </div>
        </div>
      </div>

      {/* Cubículo 2: Hora (8:00 AM - 11:30 AM) */}
      <div className="space-y-2 text-left">
        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2 sm:ml-4 flex items-center justify-between pr-2 whitespace-nowrap h-4">
          <span className="flex items-center gap-1.5"><Clock size={13} className="text-primary shrink-0" /> Hora (Turno)</span>
          <span className="text-primary font-bold">{Math.max(0, 5 - bookedForSelectedDate.length)}/5 libres</span>
        </label>
        <div className="relative">
          <select 
            value={selectedTime}
            onChange={(e) => handleTimeSelect(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl sm:rounded-2xl py-3 sm:py-4 px-4 sm:px-6 focus:border-primary outline-none transition-all appearance-none cursor-pointer text-white text-sm font-bold pr-10"
          >
            {INSPECTION_SLOTS.map((slot) => {
              const isTaken = bookedForSelectedDate.includes(slot);
              return (
                <option key={slot} value={slot} disabled={isTaken} className="bg-[#12141a] text-white">
                  {slot} {isTaken ? '(OCUPADO)' : ''}
                </option>
              );
            })}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-xs">
            ▼
          </div>
        </div>
      </div>
    </div>
  );
}
