import React from 'react';
import { ShiftSwapRequest, ShiftSwapStatus } from '../../types';
import { formatDate, formatTime } from '../../lib/utils';
import StatusBadge from '../ui/StatusBadge';
import Card, { CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';

interface SwapRequestItemProps {
  swapRequest: ShiftSwapRequest;
  requesterShift?: any;
  requesteeShift?: any;
  isRequester?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
}

const SwapRequestItem: React.FC<SwapRequestItemProps> = ({
  swapRequest,
  requesterShift,
  requesteeShift,
  isRequester = false,
  onApprove,
  onReject,
  onCancel,
}) => {
  return (
    <Card className="mb-4">
      <CardContent>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium">Shift Swap Request</h3>
          <StatusBadge status={swapRequest.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-md p-3">
            <h4 className="font-medium mb-2 text-sm text-gray-500">
              {isRequester ? 'Your Shift' : 'Requester Shift'}
            </h4>
            {requesterShift ? (
              <div>
                <p className="font-medium">{formatDate(requesterShift.date)}</p>
                <p>
                  {formatTime(requesterShift.startTime)} - {formatTime(requesterShift.endTime)}
                </p>
                <p className="text-sm text-gray-600">{requesterShift.position}</p>
              </div>
            ) : (
              <p className="text-gray-500">Shift details not available</p>
            )}
          </div>

          <div className="border rounded-md p-3">
            <h4 className="font-medium mb-2 text-sm text-gray-500">
              {isRequester ? 'Requested Shift' : 'Your Shift'}
            </h4>
            {requesteeShift ? (
              <div>
                <p className="font-medium">{formatDate(requesteeShift.date)}</p>
                <p>
                  {formatTime(requesteeShift.startTime)} - {formatTime(requesteeShift.endTime)}
                </p>
                <p className="text-sm text-gray-600">{requesteeShift.position}</p>
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

        {swapRequest.managerNote && (
          <div className="mt-4 bg-gray-50 rounded p-3 border border-gray-200">
            <h4 className="font-medium text-sm">Manager Note:</h4>
            <p className="text-sm">{swapRequest.managerNote}</p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        {swapRequest.status === ShiftSwapStatus.PENDING && (
          <>
            {onApprove && onReject && (
              <>
                <Button variant="primary" onClick={onApprove}>
                  Approve
                </Button>
                <Button variant="danger" onClick={onReject}>
                  Reject
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