import { useState } from 'react';

export const useDateRangePicker = (
  initialStartDate: Date | null,
  initialEndDate: Date | null,
  onRangeChange?: (start: Date | null, end: Date | null) => void
) => {
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);
  const [viewDate, setViewDate] = useState(initialStartDate || new Date());

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    let newStart = startDate;
    let newEnd = endDate;

    if (!startDate || (startDate && endDate)) {
      newStart = clickedDate;
      newEnd = null;
    } else if (startDate && !endDate) {
      if (clickedDate < startDate) {
        newStart = clickedDate;
        newEnd = null;
      } else {
        newEnd = clickedDate;
      }
    }

    setStartDate(newStart);
    setEndDate(newEnd);
    if (onRangeChange) onRangeChange(newStart, newEnd);
  };

  const changeMonth = (offset: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  return {
    startDate,
    endDate,
    viewDate,
    handleDateClick,
    changeMonth
  };
};