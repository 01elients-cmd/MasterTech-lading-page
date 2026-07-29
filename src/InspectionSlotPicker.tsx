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

  // Generate upcoming available Mondays and Tuesdays ONLY
  const availableDays = useMemo(() => {
    const dates: { dateStr: string; label: string; dayName: string }[] = [];
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
        const label = `${dayName} ${d.getDate()} de ${monthName}`;

        dates.push({ dateStr, label, dayName });
        if (dates.length >= 8) break; // Next 8 available inspection days
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
    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-left space-y-3">
      {/* 2-Column Grid: Left = Date (Lunes/Martes), Right = Time Slots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        
        {/* LEFT COLUMN: Fecha (Exclusivo Lunes o Martes) */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5 ml-1">
            <Calendar size={13} /> Día de Inspección (Lunes / Martes)
          </label>
          
          <select 
            value={selectedDate}
            onChange={(e) => handleDateSelect(e.target.value)}
            className="w-full bg-black/50 border border-white/15 rounded-xl py-3 px-3 text-white text-xs sm:text-sm font-bold outline-none focus:border-primary cursor-pointer appearance-none"
          >
            {availableDays.map((d) => {
              const booked = occupiedSlots[d.dateStr] || [];
              const isFull = booked.length >= 5;
              return (
                <option key={d.dateStr} value={d.dateStr} disabled={isFull} className="bg-[#12141a] text-white">
                  {d.label} {isFull ? '(COMPLETO)' : ''}
                </option>
              );
            })}
          </select>
          <p className="text-[10px] text-zinc-400 ml-1">
            📅 Solo días Lunes y Martes habilitados.
          </p>
        </div>

        {/* RIGHT COLUMN: Hora (8:00 AM - 11:30 AM) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between ml-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
              <Clock size={13} /> Hora (8:00 - 11:30 AM)
            </label>
            <span className="text-[10px] font-black text-zinc-400">
              {Math.max(0, 5 - bookedForSelectedDate.length)}/5 libres
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1.5 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
            {INSPECTION_SLOTS.map((slot) => {
              const isTaken = bookedForSelectedDate.includes(slot);
              const isSelected = selectedTime === slot;

              return (
                <button
                  key={slot}
                  type="button"
                  disabled={isTaken}
                  onClick={() => handleTimeSelect(slot)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border text-left flex items-center justify-between cursor-pointer ${
                    isTaken 
                      ? 'bg-red-500/10 border-red-500/20 text-red-500 line-through opacity-50 cursor-not-allowed'
                      : isSelected
                      ? 'bg-primary text-white border-primary shadow-[0_0_12px_rgba(255,42,42,0.5)]'
                      : 'bg-black/40 border-white/10 text-zinc-300 hover:border-white/30 hover:bg-white/10'
                  }`}
                >
                  <span>{slot}</span>
                  {isTaken ? (
                    <span className="text-[9px] uppercase font-black tracking-wider text-red-400">Ocupado</span>
                  ) : isSelected ? (
                    <CheckCircle2 size={12} className="text-white" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
