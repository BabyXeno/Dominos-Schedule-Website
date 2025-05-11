import React, { createContext, useContext, useState } from 'react';
import { format, addDays } from 'date-fns';
import { Shift, ShiftSwapRequest, ShiftSwapStatus, Notification } from '../types';
import { useAuth } from './AuthContext';
import { generateId } from '../lib/utils';

interface DataContextType {
  shifts: Shift[];
  swapRequests: ShiftSwapRequest[];
  notifications: Notification[];
  addShift: (shift: Omit<Shift, 'id'>) => void;
  updateShift: (shift: Shift) => void;
  deleteShift: (shiftId: string) => void;
  requestSwap: (
    requesterId: string,
    requesterShiftId: string,
    requesteeId: string,
    requesteeShiftId: string | null
  ) => void;
  updateSwapRequest: (
    swapId: string,
    status: ShiftSwapStatus,
    managerNote?: string
  ) => void;
  markNotificationAsRead: (notificationId: string) => void;
  getEmployeeShifts: (employeeId: string) => Shift[];
  getEmployeeSwapRequests: (employeeId: string) => ShiftSwapRequest[];
  getPendingSwapRequests: () => ShiftSwapRequest[];
  getEmployeeNotifications: (employeeId: string) => Notification[];
  bulkAddShifts: (shifts: Omit<Shift, 'id'>[]) => void;
  processCSVUpload: (file: File) => Promise<void>;
}

// Generate mock data for demo
const today = new Date();
const createMockShifts = (): Shift[] => {
  const shifts: Shift[] = [];
  
  // Employee 1 shifts
  for (let i = 0; i < 5; i++) {
    shifts.push({
      id: `shift-${i + 1}`,
      employeeId: '1',
      storeId: 'store1',
      date: format(addDays(today, i), 'yyyy-MM-dd'),
      startTime: '11:00',
      endTime: '19:00',
      position: i % 2 === 0 ? 'Delivery Driver' : 'Customer Service',
    });
  }
  
  // Employee 2 shifts (Manager)
  for (let i = 0; i < 5; i++) {
    shifts.push({
      id: `shift-${i + 6}`,
      employeeId: '2',
      storeId: 'store1',
      date: format(addDays(today, i), 'yyyy-MM-dd'),
      startTime: '08:00',
      endTime: '16:00',
      position: 'Manager',
    });
  }
  
  return shifts;
};

const createMockSwapRequests = (): ShiftSwapRequest[] => {
  return [
    {
      id: 'swap-1',
      requesterId: '1',
      requesteeId: '3',
      requesterShiftId: 'shift-1',
      requesteeShiftId: 'shift-8',
      status: ShiftSwapStatus.PENDING,
      createdAt: format(addDays(today, -2), 'yyyy-MM-dd'),
      updatedAt: format(addDays(today, -2), 'yyyy-MM-dd'),
    },
  ];
};

const createMockNotifications = (): Notification[] => {
  return [
    {
      id: 'notif-1',
      userId: '1',
      title: 'New Schedule Available',
      message: 'Your schedule for next week has been posted.',
      read: false,
      createdAt: format(addDays(today, -1), 'yyyy-MM-dd'),
      link: '/dashboard',
    },
    {
      id: 'notif-2',
      userId: '2',
      title: 'Swap Request Pending',
      message: 'There is a new shift swap request waiting for your approval.',
      read: false,
      createdAt: format(today, 'yyyy-MM-dd'),
      link: '/swap-requests',
    },
  ];
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { user } = useAuth();
  const [shifts, setShifts] = useState<Shift[]>(createMockShifts());
  const [swapRequests, setSwapRequests] = useState<ShiftSwapRequest[]>(
    createMockSwapRequests()
  );
  const [notifications, setNotifications] = useState<Notification[]>(
    createMockNotifications()
  );

  const addShift = (shiftData: Omit<Shift, 'id'>) => {
    const newShift: Shift = {
      ...shiftData,
      id: generateId(),
    };
    setShifts(prev => [...prev, newShift]);
  };

  const bulkAddShifts = (shiftsData: Omit<Shift, 'id'>[]) => {
    const newShifts = shiftsData.map(shift => ({
      ...shift,
      id: generateId(),
    }));
    setShifts(prev => [...prev, ...newShifts]);
  };

  const updateShift = (updatedShift: Shift) => {
    setShifts(prev => 
      prev.map(shift => 
        shift.id === updatedShift.id ? updatedShift : shift
      )
    );
  };

  const deleteShift = (shiftId: string) => {
    setShifts(prev => prev.filter(shift => shift.id !== shiftId));
  };

  const requestSwap = (
    requesterId: string,
    requesterShiftId: string,
    requesteeId: string,
    requesteeShiftId: string | null
  ) => {
    const newSwapRequest: ShiftSwapRequest = {
      id: generateId(),
      requesterId,
      requesteeId,
      requesterShiftId,
      requesteeShiftId,
      status: ShiftSwapStatus.PENDING,
      createdAt: format(new Date(), 'yyyy-MM-dd'),
      updatedAt: format(new Date(), 'yyyy-MM-dd'),
    };
    
    setSwapRequests(prev => [...prev, newSwapRequest]);
    
    // Create notification for the requestee
    const requesterShift = shifts.find(s => s.id === requesterShiftId);
    if (requesterShift) {
      const newNotification: Notification = {
        id: generateId(),
        userId: requesteeId,
        title: 'New Shift Swap Request',
        message: `You have a new shift swap request for ${format(
          new Date(requesterShift.date),
          'MMMM d'
        )}.`,
        read: false,
        createdAt: format(new Date(), 'yyyy-MM-dd'),
        link: '/swap-requests',
      };
      
      setNotifications(prev => [...prev, newNotification]);
    }
  };

  const updateSwapRequest = (
    swapId: string,
    status: ShiftSwapStatus,
    managerNote?: string
  ) => {
    setSwapRequests(prev => 
      prev.map(swap => 
        swap.id === swapId 
          ? { 
              ...swap, 
              status,
              managerNote: managerNote || swap.managerNote,
              updatedAt: format(new Date(), 'yyyy-MM-dd'), 
            } 
          : swap
      )
    );
    
    // Find the updated swap request
    const updatedSwap = swapRequests.find(swap => swap.id === swapId);
    
    if (updatedSwap) {
      // Create notification for the requester
      const statusText = 
        status === ShiftSwapStatus.APPROVED 
          ? 'approved' 
          : 'rejected';
      
      const newNotification: Notification = {
        id: generateId(),
        userId: updatedSwap.requesterId,
        title: `Swap Request ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}`,
        message: `Your shift swap request has been ${statusText}${
          managerNote ? `: "${managerNote}"` : '.'
        }`,
        read: false,
        createdAt: format(new Date(), 'yyyy-MM-dd'),
        link: '/my-swaps',
      };
      
      setNotifications(prev => [...prev, newNotification]);
    }
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true } 
          : notif
      )
    );
  };

  const getEmployeeShifts = (employeeId: string) => {
    return shifts.filter(shift => shift.employeeId === employeeId);
  };

  const getEmployeeSwapRequests = (employeeId: string) => {
    return swapRequests.filter(
      swap => swap.requesterId === employeeId || swap.requesteeId === employeeId
    );
  };

  const getPendingSwapRequests = () => {
    return swapRequests.filter(
      swap => swap.status === ShiftSwapStatus.PENDING
    );
  };

  const getEmployeeNotifications = (employeeId: string) => {
    return notifications.filter(notif => notif.userId === employeeId);
  };

  const processCSVUpload = async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const rows = text.split('\n');
          
          // Skip header row and process data
          const newShifts = rows.slice(1).map(row => {
            const [employeeId, date, startTime, endTime, position] = row.split(',');
            return {
              employeeId: employeeId.trim(),
              storeId: user?.storeId || 'store1',
              date: date.trim(),
              startTime: startTime.trim(),
              endTime: endTime.trim(),
              position: position.trim(),
            };
          });
          
          bulkAddShifts(newShifts);
          resolve();
        } catch (error) {
          reject(new Error('Failed to process CSV file'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read CSV file'));
      };
      
      reader.readAsText(file);
    });
  };

  return (
    <DataContext.Provider
      value={{
        shifts,
        swapRequests,
        notifications,
        addShift,
        updateShift,
        deleteShift,
        requestSwap,
        updateSwapRequest,
        markNotificationAsRead,
        getEmployeeShifts,
        getEmployeeSwapRequests,
        getPendingSwapRequests,
        getEmployeeNotifications,
        bulkAddShifts,
        processCSVUpload,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};