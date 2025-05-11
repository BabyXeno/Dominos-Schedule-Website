import React from 'react';
import { format, isToday, parseISO } from 'date-fns';
import { Shift } from '../../types';
import { formatTime } from '../../lib/utils';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';

interface ScheduleViewProps {
  shifts: Shift[];
  currentEmployee?: boolean;
  onShiftSelect?: (shift: Shift) => void;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({
  shifts,
  currentEmployee = true,
  onShiftSelect,
}) => {
  // Group shifts by date
  const shiftsByDate = shifts.reduce((acc, shift) => {
    const date = shift.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(shift);
    return acc;
  }, {} as Record<string, Shift[]>);

  // Sort dates
  const sortedDates = Object.keys(shiftsByDate).sort(
    (a, b) => parseISO(a).getTime() - parseISO(b).getTime()
  );

  return (
    <div className="space-y-6">
      {sortedDates.length === 0 ? (
        <Card>
          <CardContent>
            <p className="text-center text-gray-500 py-8">
              No shifts scheduled yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        sortedDates.map((date) => (
          <Card
            key={date}
            className={`${
              isToday(parseISO(date)) ? 'border-2 border-dominos-blue' : ''
            }`}
          >
            <CardHeader>
              <CardTitle>
                <div className="flex items-center">
                  <span>{format(parseISO(date), 'EEEE, MMMM d, yyyy')}</span>
                  {isToday(parseISO(date)) && (
                    <span className="ml-2 text-xs bg-dominos-blue text-white px-2 py-0.5 rounded-full">
                      Today
                    </span>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {shiftsByDate[date].map((shift) => (
                  <div
                    key={shift.id}
                    className={`p-3 rounded-md border ${
                      onShiftSelect
                        ? 'cursor-pointer hover:bg-slate-50'
                        : ''
                    } ${
                      isToday(parseISO(date))
                        ? 'bg-blue-50 border-blue-100'
                        : 'bg-white border-slate-200'
                    }`}
                    onClick={() => onShiftSelect && onShiftSelect(shift)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          {formatTime(shift.startTime)} -{' '}
                          {formatTime(shift.endTime)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {shift.position}
                        </p>
                      </div>
                      {onShiftSelect && (
                        <button className="text-xs border border-slate-300 rounded px-2 py-1 hover:bg-slate-100">
                          {currentEmployee ? 'Request Swap' : 'Offer Swap'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ScheduleView;