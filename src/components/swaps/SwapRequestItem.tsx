import React from 'react';
import { ShiftSwapRequest, ShiftSwapStatus } from '../../types';
import { formatDate, formatTime } from '../../lib/utils';
import StatusBadge from '../ui/StatusBadge';
import Card, { CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { ArrowRight } from 'lucide-react';

interface SwapRequestItemProps {
  swapRequest: ShiftSwapRequest;
  requesterName: string;
  requesteeName: string;
  requesterShift?: any;
  requesteeShift?: any;
  isRequester?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
}

const SwapRequestItem: React.FC<SwapRequestItemProps> = ({
  swapRequest,
  requesterName,
  requesteeName,
  requesterShift,
  requesteeShift,
  isRequester = false,
  onApprove,
  onReject,
  onCancel,
}) => {
  return (
    <Card className="mb-4 overflow-hidden">
      <div className="bg-gradient-to-r from-dominos-blue to-dominos-darkblue p-4 text-white">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Shift Swap Request</h3>
          <StatusBadge status={swapRequest.status} className="bg-white/10" />
        </div>
        <p className="text-sm mt-1 text-white/80">
          {requesterName} → {requesteeName}
        </p>
      </div>

      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <div className="absolute -top-3 left-4 bg-dominos-blue text-white text-xs px-2 py-1 rounded">
              {isRequester ? 'Your Shift' : 'Requester Shift'}
            </div>
            <div className="border-2 border-dominos-blue rounded-md p-4">
              {requesterShift ? (
                <div>
                  <p className="font-medium text-lg">{formatDate(requesterShift.date)}</p>
                  <p className="text-gray-600">
                    {formatTime(requesterShift.startTime)} - {formatTime(requesterShift.endTime)}
                  </p>
                  <p className="mt-1 inline-block bg-blue-50 text-dominos-blue px-2 py-1 rounded text-sm">
                    {requesterShift.position}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">Shift details not available</p>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-3 left-4 bg-dominos-darkblue text-white text-xs px-2 py-1 rounded">
              {isRequester ? 'Requested Shift' : 'Your Shift'}
            </div>
            <div className="border-2 border-dominos-darkblue rounded-md p-4">
              {requesteeShift ? (
                <div>
                  <p className="font-medium text-lg">{formatDate(requesteeShift.date)}</p>
                  <p className="text-gray-600">
                    {formatTime(requesteeShift.startTime)} - {formatTime(requesteeShift.endTime)}
                  </p>
                  <p className="mt-1 inline-block bg-blue-50 text-dominos-darkblue px-2 py-1 rounded text-sm">
                    {requesteeShift.position}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">
                  {requesteeShift === null 
                    ? 'Open request - no specific shift requested'
                    : 'Shift details not available'}
                </p>
              )}
            </div>
          </div>
        </div>

        {swapRequest.managerNote && (
          <div className="mt-6 bg-yellow-50 rounded-md p-4 border border-yellow-200">
            <h4 className="font-medium text-yellow-800">Manager Note:</h4>
            <p className="text-sm text-yellow-700 mt-1">{swapRequest.managerNote}</p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        {swapRequest.status === ShiftSwapStatus.PENDING && (
          <>
            {onApprove && onReject && (
              <>
                <Button variant="primary" onClick={onApprove}>
                  Approve Swap
                </Button>
                <Button variant="danger" onClick={onReject}>
                  Reject Swap
                </Button>
              </>
            )}
            {onCancel && (
              <Button variant="secondary" onClick={onCancel}>
                Cancel Request
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default SwapRequestItem;