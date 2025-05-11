import React from 'react';
import { ShiftSwapStatus } from '../../types';
import { cn } from '../../lib/utils';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: ShiftSwapStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusConfig = () => {
    switch (status) {
      case ShiftSwapStatus.PENDING:
        return {
          icon: Clock,
          styles: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          text: 'Pending'
        };
      case ShiftSwapStatus.APPROVED:
        return {
          icon: CheckCircle,
          styles: 'bg-green-100 text-green-800 border-green-200',
          text: 'Approved'
        };
      case ShiftSwapStatus.REJECTED:
        return {
          icon: XCircle,
          styles: 'bg-red-100 text-red-800 border-red-200',
          text: 'Rejected'
        };
      default:
        return {
          icon: Clock,
          styles: 'bg-gray-100 text-gray-800 border-gray-200',
          text: 'Unknown'
        };
    }
  };

  const { icon: Icon, styles, text } = getStatusConfig();

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border gap-1.5',
        styles,
        className
      )}
    >
      <Icon size={14} />
      {text}
    </span>
  );
};

export default StatusBadge;