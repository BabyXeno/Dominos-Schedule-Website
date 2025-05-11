import React, { createContext, useContext, useState } from 'react';
import { format } from 'date-fns';
import { generateId } from '../lib/utils';
import { ShiftSwapRequest, ShiftSwapStatus, Notification } from '../types';

interface DataContextType {
  requestSwap: (
    requesterId: string,
    requesterShiftId: string,
    requesteeId: string,
    requesteeShiftId: string | null
  ) => void;
  shifts: any[];
  swapRequests: ShiftSwapRequest[];
  notifications: Notification[];
  setSwapRequests: React.Dispatch<React.SetStateAction<ShiftSwapRequest[]>>;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [shifts, setShifts] = useState<any[]>([]);
  const [swapRequests, setSwapRequests] = useState<ShiftSwapRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

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
    const requesteeShift = requesteeShiftId ? shifts.find(s => s.id === requesteeShiftId) : null;
    
    if (requesterShift) {
      const newNotification: Notification = {
        id: generateId(),
        userId: requesteeId,
        title: 'New Shift Swap Request',
        message: `You have a new shift swap request for ${format(
          new Date(requesterShift.date),
          'MMMM d'
        )}${requesteeShift ? ` in exchange for your shift on ${format(
          new Date(requesteeShift.date),
          'MMMM d'
        )}` : ''}.`,
        read: false,
        createdAt: format(new Date(), 'yyyy-MM-dd'),
        link: '/swap-requests',
      };
      
      setNotifications(prev => [...prev, newNotification]);
    }
  };

  const value = {
    requestSwap,
    shifts,
    swapRequests,
    notifications,
    setSwapRequests,
    setNotifications,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}