import React from 'react';
import { format, parseISO, isToday, isSameDay } from 'date-fns';
import { Shift } from '../../types';
import { formatTime, getWeekDates } from '../../lib/utils';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';

interface WeeklyCalendarProps {
  shifts: Shift[];
  onShiftSelect?: (shift: Shift) => void;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ 
  shifts,
  onShiftSelect,
}) => {
  const weekDates = getWeekDates();
  
  const getShiftsForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return shifts.filter(shift => shift.date === dateString);
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-dominos-blue text-white">
        <CardTitle className="text-center">
          {format(weekDates[0], 'MMMM d')} - {format(weekDates[6], 'MMMM d, yyyy')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-7 border-b">
          {weekDates.map((date, index) => (
            <div
              key={index}
              className={`text-center p-2 font-medium text-sm ${
                isToday(date) ? 'bg-blue-100' : ''
              }`}
            >
              <div>{format(date, 'EEE')}</div>
              <div className={`text-lg ${isToday(date) ? 'text-dominos-blue font-bold' : ''}`}>
                {format(date, 'd')}
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 min-h-[300px]">
          {weekDates.map((date, index) => (
            <div
              key={index}
              className={`border-r last:border-r-0 border-b p-2 ${
                isToday(date) ? 'bg-blue-50' : ''
              }`}
            >
              {getShiftsForDate(date).map(shift => (
                <div
                  key={shift.id}
                  className={`
                    my-1 p-2 rounded text-xs 
                    ${onShiftSelect ? 'cursor-pointer hover:opacity-80' : ''} 
                    bg-dominos-blue text-white
                  `}
                  onClick={() => onShiftSelect && onShiftSelect(shift)}
                >
                  <div className="font-medium">
                    {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                  </div>
                  <div>{shift.position}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyCalendar;