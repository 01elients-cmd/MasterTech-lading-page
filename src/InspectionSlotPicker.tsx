import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';

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

  // Pre-select first available date if none selected
  useEffect(() => {
    if (!selectedDate && availableDays.length > 0) {
      setSelectedDate(availableDays[0].dateStr);
    }
  }, [availableDays, selectedDate]);

  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedTime('');
    onSelectSlot('', false);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    const combined = `${selectedDate} (${time})`;
    onSelectSlot(combined, true);
  };

  const bookedForSelectedDate = selectedDate ? (occupiedSlots[selectedDate] || []) : [];

  return (
    <div className="bg-white/5 border border-white/10 p-3.5 sm:p-4 rounded-2xl text-left space-y-3">
      {/* 1. Días Disponibles (Lunes y Martes) */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5 ml-0.5">
          <Calendar size={13} /> Días de Inspección (Solo Lunes y Martes)
        </label>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {availableDays.map((d) => {
            const booked = occupiedSlots[d.dateStr] || [];
            const isFull = booked.length >= 5;
            const isSelected = selectedDate === d.dateStr;

            return (
              <button
                key={d.dateStr}
                type="button"
                disabled={isFull}
                onClick={() => handleDateSelect(d.dateStr)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border text-center flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap ${
                  isFull 
                    ? 'bg-red-500/10 border-red-500/20 text-red-400 line-through opacity-50 cursor-not-allowed'
                    : isSelected
                    ? 'bg-primary text-white border-primary shadow-[0_0_12px_rgba(255,42,42,0.5)] scale-[1.02]'
                    : 'bg-black/40 border-white/10 text-zinc-300 hover:border-white/30 hover:bg-white/10'
                }`}
              >
                <span>{d.label}</span>
                {isSelected && <CheckCircle2 size={12} className="text-white shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Horas Disponibles (8:00 AM - 11:30 AM) */}
      <div className="space-y-1.5 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between ml-0.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
            <Clock size={13} /> Horas Disponibles (5 turnos por día)
          </label>
          <span className="text-[10px] font-black text-zinc-400">
            {Math.max(0, 5 - bookedForSelectedDate.length)}/5 libres
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {INSPECTION_SLOTS.map((slot) => {
            const isTaken = bookedForSelectedDate.includes(slot);
            const isSelected = selectedTime === slot;

            return (
              <button
                key={slot}
                type="button"
                disabled={isTaken}
                onClick={() => handleTimeSelect(slot)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border text-center flex items-center justify-center gap-1 cursor-pointer ${
                  isTaken 
                    ? 'bg-red-500/10 border-red-500/20 text-red-500 line-through opacity-50 cursor-not-allowed'
                    : isSelected
                    ? 'bg-primary text-white border-primary shadow-[0_0_12px_rgba(255,42,42,0.5)] scale-[1.02]'
                    : 'bg-black/40 border-white/10 text-zinc-300 hover:border-white/30 hover:bg-white/10'
                }`}
              >
                <span>{slot}</span>
                {isTaken ? (
                  <span className="text-[9px] uppercase font-black text-red-400 ml-1">(OCUPADO)</span>
                ) : isSelected ? (
                  <CheckCircle2 size={12} className="text-white shrink-0 ml-1" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
