
import React from 'react';
import { DAYS, MONTHS, getDaysInMonth, getFirstDayOfMonth, formatDate, isSameDay } from './utils';

export const DateInputDisplay: React.FC<{ label: string; date: Date | null; icon: string }> = ({ label, date, icon }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
    <div className={`flex items-center gap-2 px-3 py-2.5 bg-white dark:bg-slate-900 border ${date ? 'border-primary ring-1 ring-primary/20' : 'border-slate-200 dark:border-slate-700'} rounded-lg transition-all`}>
      <span className={`material-symbols-outlined text-sm ${date ? 'text-primary' : 'text-slate-400'}`}>{icon}</span>
      <span className="text-sm font-medium text-[#0d121b] dark:text-white">{formatDate(date)}</span>
    </div>
  </div>
);

export const CalendarHeader: React.FC<{ viewDate: Date; onChangeMonth: (offset: number) => void }> = ({ viewDate, onChangeMonth }) => (
  <div className="flex items-center justify-between mb-4">
    <button onClick={() => onChangeMonth(-1)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 transition-colors">
      <span className="material-symbols-outlined text-lg">chevron_left</span>
    </button>
    <span className="text-sm font-bold text-[#0d121b] dark:text-white">
      {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
    </span>
    <button onClick={() => onChangeMonth(1)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 transition-colors">
      <span className="material-symbols-outlined text-lg">chevron_right</span>
    </button>
  </div>
);

export const CalendarGrid: React.FC<{ 
  viewDate: Date; 
  startDate: Date | null; 
  endDate: Date | null; 
  onDateClick: (day: number) => void 
}> = ({ viewDate, startDate, endDate, onDateClick }) => {
  const daysInMonth = getDaysInMonth(viewDate);
  const firstDay = getFirstDayOfMonth(viewDate);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingArray = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {DAYS.map(day => (
          <span key={day} className="text-[10px] text-slate-400 font-bold">{day}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-slate-600 dark:text-slate-300">
        {paddingArray.map(i => <span key={`pad-${i}`} />)}
        
        {daysArray.map(day => {
          const current = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
          const isStart = startDate && isSameDay(current, startDate);
          const isEnd = endDate && isSameDay(current, endDate);
          const isInRange = startDate && endDate && current > startDate && current < endDate;
          const isToday = isSameDay(current, new Date());

          let className = "relative cursor-pointer transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded";
          if (isStart) className = "bg-primary text-white rounded-l-lg z-10 hover:bg-primary";
          if (isEnd) className = "bg-primary text-white rounded-r-lg z-10 hover:bg-primary";
          if (isStart && isEnd) className = "bg-primary text-white rounded-lg z-10";
          
          // Replaced bg-blue-50 with bg-primary/10 for strict theming
          if (isInRange) className = "bg-primary/10 text-primary rounded-none hover:bg-primary/20";

          return (
            <button 
              key={day} 
              onClick={() => onDateClick(day)}
              className={`w-full h-8 flex items-center justify-center ${className}`}
            >
              {day}
              {isToday && !isStart && !isEnd && !isInRange && (
                <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 bg-energy rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
};
