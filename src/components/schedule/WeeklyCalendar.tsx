import React from 'react';
import { format, parseISO, isToday, isSameDay } from 'date-fns';
import { Shift } from '../../types';
import { formatTime, getWeekDates } from '../../lib/utils';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';

interface WeeklyCalendarProps {
  shifts: Shift[];
  onShiftSelect?: (shift: Shift) => void;
  highlightedShifts?: string[];
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ 
  shifts,
  onShiftSelect,
  highlightedShifts = [],
}) => {
  const weekDates = getWeekDates();
  
  const getShiftsForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return shifts.filter(shift => shift.date === dateString);
  };
  
  return (
    <Card className="overflow-hidden border-0 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-dominos-blue to-dominos-darkblue text-white">
        <CardTitle className="text-center text-xl">
          {format(weekDates[0], 'MMMM d')} - {format(weekDates[6], 'MMMM d, yyyy')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-7 border-b bg-gray-50">
          {weekDates.map((date, index) => (
            <div
              key={index}
              className={`text-center p-3 font-medium ${
                isToday(date) ? 'bg-blue-50' : ''
              }`}
            >
              <div className="text-gray-600">{format(date, 'EEE')}</div>
              <div className={`text-xl mt-1 ${isToday(date) ? 'text-dominos-blue font-bold' : ''}`}>
                {format(date, 'd')}
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 min-h-[400px] bg-white">
          {weekDates.map((date, index) => (
            <div
              key={index}
              className={`border-r last:border-r-0 border-b p-2 ${
                isToday(date) ? 'bg-blue-50/30' : ''
              }`}
            >
              {getShiftsForDate(date).map(shift => (
                <div
                  key={shift.id}
                  className={`
                    my-1 p-2.5 rounded-lg text-sm transition-all
                    ${onShiftSelect ? 'cursor-pointer transform hover:scale-102 hover:shadow-md' : ''} 
                    ${
                      highlightedShifts.includes(shift.id)
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'bg-gradient-to-r from-dominos-blue to-dominos-darkblue text-white'
                    }
                  `}
                  onClick={() => onShiftSelect && onShiftSelect(shift)}
                >
                  <div className="font-medium">
                    {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                  </div>
                  <div className="text-white/90 text-xs mt-1">{shift.position}</div>
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