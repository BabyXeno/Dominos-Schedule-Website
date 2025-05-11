import React, { useState } from 'react';
import { format, parseISO, isToday, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Shift, UserRole } from '../../types';
import { formatTime, getWeekDates } from '../../lib/utils';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

interface WeeklyCalendarProps {
  shifts: Shift[];
  onShiftSelect?: (shift: Shift) => void;
  highlightedShifts?: string[];
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ 
  shifts,
  onShiftSelect,
  highlightedShifts = [],
}) => {
  const { user } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; hour: number } | null>(null);
  
  const weekDates = getWeekDates(currentWeek);
  
  const getShiftsForDateAndHour = (date: Date, hour: number) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return shifts.filter(shift => {
      const shiftDate = shift.date;
      const shiftHour = parseInt(shift.startTime.split(':')[0]);
      return shiftDate === dateString && shiftHour === hour;
    });
  };

  const handlePrevWeek = () => setCurrentWeek(prev => subWeeks(prev, 1));
  const handleNextWeek = () => setCurrentWeek(prev => addWeeks(prev, 1));
  
  const handleSlotClick = (date: Date, hour: number) => {
    if (user?.role === UserRole.MANAGER) {
      setSelectedSlot({ date, hour });
      setShowAddModal(true);
    }
  };
  
  return (
    <Card className="overflow-hidden border-0 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-dominos-blue to-dominos-darkblue text-white">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevWeek}
            className="text-white hover:bg-white/10"
          >
            <ChevronLeft size={20} />
          </Button>
          <CardTitle className="text-center text-xl">
            {format(weekDates[0], 'MMMM d')} - {format(weekDates[6], 'MMMM d, yyyy')}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextWeek}
            className="text-white hover:bg-white/10"
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="grid grid-cols-8 border-b bg-gray-50">
          <div className="w-20 p-3 font-medium text-gray-500 text-center">Hour</div>
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
        
        <div className="grid grid-cols-8 min-h-[800px] bg-white">
          {HOURS.map(hour => (
            <React.Fragment key={hour}>
              <div className="border-r border-b p-2 text-center text-sm text-gray-500 bg-gray-50">
                {format(new Date().setHours(hour), 'ha')}
              </div>
              {weekDates.map((date, dateIndex) => (
                <div
                  key={`${hour}-${dateIndex}`}
                  className={`border-r last:border-r-0 border-b p-2 relative min-h-[60px] ${
                    isToday(date) ? 'bg-blue-50/30' : ''
                  }`}
                  onClick={() => handleSlotClick(date, hour)}
                >
                  {getShiftsForDateAndHour(date, hour).map(shift => (
                    <div
                      key={shift.id}
                      className={`
                        my-1 p-2.5 rounded-lg text-sm transition-all
                        ${onShiftSelect ? 'cursor-pointer transform hover:scale-102 hover:shadow-md' : ''} 
                        ${
                          highlightedShifts?.includes(shift.id)
                            ? 'bg-green-500 text-white shadow-lg'
                            : 'bg-gradient-to-r from-dominos-blue to-dominos-darkblue text-white'
                        }
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        onShiftSelect && onShiftSelect(shift);
                      }}
                    >
                      <div className="font-medium">
                        {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                      </div>
                      <div className="text-white/90 text-xs mt-1">
                        {shift.employeeName} - {shift.position}
                      </div>
                    </div>
                  ))}
                  {user?.role === UserRole.MANAGER && (
                    <div className="absolute inset-0 hover:bg-blue-50/50 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                      <Plus size={20} className="text-dominos-blue" />
                    </div>
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
      
      {showAddModal && selectedSlot && (
        <AddShiftModal
          date={selectedSlot.date}
          hour={selectedSlot.hour}
          onClose={() => setShowAddModal(false)}
          onAdd={(shiftData) => {
            // Handle adding new shift
            setShowAddModal(false);
          }}
        />
      )}
    </Card>
  );
};

export default WeeklyCalendar;