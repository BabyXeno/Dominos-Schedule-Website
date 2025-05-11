import React from 'react';
import { ShiftSwapStatus } from '../../types';
import { cn } from '../../lib/utils';

interface StatusBadgeProps {
  status: ShiftSwapStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusStyles = () => {
    switch (status) {
      case ShiftSwapStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case ShiftSwapStatus.APPROVED:
        return 'bg-green-100 text-green-800 border-green-200';
      case ShiftSwapStatus.REJECTED:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case ShiftSwapStatus.PENDING:
        return 'Pending';
      case ShiftSwapStatus.APPROVED:
        return 'Approved';
      case ShiftSwapStatus.REJECTED:
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        getStatusStyles(),
        className
      )}
    >
      {getStatusText()}
    </span>
  );
};

export default StatusBadge;