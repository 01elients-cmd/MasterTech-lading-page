import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle } from 'lucide-react';

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
  const [dateError, setDateError] = useState<string>('');
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

  const todayStr = new Date().toISOString().split('T')[0];

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDateError('');
    setSelectedTime('');

    if (!val) {
      setSelectedDate('');
      onSelectSlot('', false);
      return;
    }

    const [year, month, day] = val.split('-');
    const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
    const dayOfWeek = dateObj.getDay();

    if (dayOfWeek !== 1 && dayOfWeek !== 2) {
      setDateError('⚠️ Las inspecciones gratuitas SOLO están disponibles Lunes y Martes.');
      setSelectedDate('');
      onSelectSlot('', false);
      return;
    }

    setSelectedDate(val);
    onSelectSlot('', false);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    const combined = `${selectedDate} (${time})`;
    onSelectSlot(combined, true);
  };

  const bookedForSelectedDate = selectedDate ? (occupiedSlots[selectedDate] || []) : [];

  return (
    <div className="space-y-4 bg-white/5 border border-white/10 p-4 rounded-2xl text-left">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 ml-1">
          <Calendar size={14} /> Fecha de Inspección (Sólo Lunes o Martes)
        </label>
        <input 
          type="date"
          min={todayStr}
          value={selectedDate}
          onChange={handleDateChange}
          className="w-full bg-black/50 border border-white/15 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-primary [color-scheme:dark]"
        />
        {dateError && (
          <p className="text-xs font-bold text-red-400 flex items-center gap-1 mt-1 ml-1">
            <AlertCircle size={14} /> {dateError}
          </p>
        )}
      </div>

      {selectedDate && (
        <div className="space-y-3 pt-3 border-t border-white/10 animate-fade-in">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
            <span className="flex items-center gap-1.5"><Clock size={14} className="text-primary" /> Hora de Inspección (8:00 - 11:30 AM)</span>
            <span className="text-primary font-black">{Math.max(0, 5 - bookedForSelectedDate.length)}/5 disponibles</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {INSPECTION_SLOTS.map((slot) => {
              const isTaken = bookedForSelectedDate.includes(slot);
              const isSelected = selectedTime === slot;

              return (
                <button
                  key={slot}
                  type="button"
                  disabled={isTaken}
                  onClick={() => handleTimeSelect(slot)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer ${
                    isTaken 
                      ? 'bg-red-500/10 border-red-500/20 text-red-500 line-through opacity-50 cursor-not-allowed'
                      : isSelected
                      ? 'bg-primary text-white border-primary shadow-[0_0_15px_rgba(255,42,42,0.5)] scale-105'
                      : 'bg-black/40 border-white/10 text-zinc-300 hover:border-white/30 hover:bg-white/10'
                  }`}
                >
                  {slot} {isTaken ? '(OCUPADO)' : ''}
                </button>
              );
            })}
          </div>

          {bookedForSelectedDate.length >= 5 && (
            <p className="text-xs text-red-400 font-bold text-center pt-2">
              ¡Todos los 5 cupos de este día han sido reservados! Por favor selecciona otro Lunes o Martes.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
