import React from 'react';
import { DateInputDisplay, CalendarHeader, CalendarGrid } from '@blueprints/components/functional/DateRangePicker/components';
import { useDateRangePicker } from '@blueprints/components/functional/DateRangePicker/useDateRangePicker';

interface DateRangePickerProps {
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
  onRangeChange?: (start: Date | null, end: Date | null) => void;
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ 
  initialStartDate = new Date(), 
  initialEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 1 week range
  onRangeChange,
  className = ""
}) => {
  const { 
    startDate, 
    endDate, 
    viewDate, 
    handleDateClick, 
    changeMonth 
  } = useDateRangePicker(initialStartDate, initialEndDate, onRangeChange);

  return (
    <div className={`bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm relative overflow-visible group h-full ${className}`}>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <DateInputDisplay label="Start Date" date={startDate} icon="calendar_today" />
        <DateInputDisplay label="End Date" date={endDate} icon="event" />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow-xl">
        <CalendarHeader viewDate={viewDate} onChangeMonth={changeMonth} />
        <CalendarGrid 
          viewDate={viewDate} 
          startDate={startDate} 
          endDate={endDate} 
          onDateClick={handleDateClick} 
        />
      </div>
    </div>
  );
};