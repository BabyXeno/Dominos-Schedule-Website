// Update the requestSwap function in DataContext.tsx
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