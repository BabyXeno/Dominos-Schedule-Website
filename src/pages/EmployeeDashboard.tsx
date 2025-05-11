import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Layout from '../components/layout/Layout';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import WeeklyCalendar from '../components/schedule/WeeklyCalendar';
import ScheduleView from '../components/schedule/ScheduleView';
import StatusBadge from '../components/ui/StatusBadge';
import { formatDate, formatTime } from '../lib/utils';

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getEmployeeShifts, getEmployeeSwapRequests, getEmployeeNotifications, markNotificationAsRead } = useData();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  
  if (!user) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p>Please log in to view your dashboard.</p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => navigate('/login')}
          >
            Log In
          </Button>
        </div>
      </Layout>
    );
  }
  
  const shifts = getEmployeeShifts(user.id);
  const swapRequests = getEmployeeSwapRequests(user.id);
  const pendingSwapRequests = swapRequests.filter(req => req.status === 'pending');
  const notifications = getEmployeeNotifications(user.id);
  const unreadNotifications = notifications.filter(notif => !notif.read);
  
  const toggleView = () => {
    setViewMode(prev => prev === 'calendar' ? 'list' : 'calendar');
  };
  
  const handleShiftSelect = (shift: any) => {
    navigate('/swap-shifts');
  };
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user.name}</h1>
        <p className="text-gray-600">
          Employee ID: {user.employeeId}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Schedule</CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant={viewMode === 'calendar' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setViewMode('calendar')}
                >
                  <CalendarDays size={16} className="mr-1" />
                  Calendar
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <CalendarDays size={16} className="mr-1" />
                  List
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === 'calendar' ? (
                <WeeklyCalendar shifts={shifts} onShiftSelect={handleShiftSelect} />
              ) : (
                <ScheduleView shifts={shifts} onShiftSelect={handleShiftSelect} />
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Shift Swap Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingSwapRequests.length === 0 ? (
                <p className="text-gray-500 py-4 text-center">
                  No pending swap requests
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingSwapRequests.slice(0, 3).map((request) => (
                    <div key={request.id} className="border rounded-md p-3">
                      <div className="flex justify-between mb-2">
                        <p className="text-sm font-medium">Shift Swap Request</p>
                        <StatusBadge status={request.status} />
                      </div>
                      <p className="text-sm">
                        Created: {formatDate(request.createdAt)}
                      </p>
                      <div className="mt-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate('/my-swaps')}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {pendingSwapRequests.length > 3 && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => navigate('/my-swaps')}
                    >
                      View All ({pendingSwapRequests.length}) Requests
                    </Button>
                  )}
                </div>
              )}
              
              <div className="mt-4">
                <Button
                  variant="primary"
                  onClick={() => navigate('/swap-shifts')}
                  className="w-full"
                  leftIcon={<RefreshCw size={16} />}
                >
                  Request Shift Swap
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Shifts</CardTitle>
            </CardHeader>
            <CardContent>
              {shifts.length === 0 ? (
                <p className="text-gray-500 py-4 text-center">
                  No upcoming shifts scheduled
                </p>
              ) : (
                <div className="space-y-4">
                  {shifts.slice(0, 3).map((shift) => (
                    <div
                      key={shift.id}
                      className="border rounded-md p-3 hover:bg-gray-50"
                    >
                      <p className="font-medium">{formatDate(shift.date)}</p>
                      <p>
                        {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                      </p>
                      <p className="text-sm text-gray-600">{shift.position}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeDashboard;