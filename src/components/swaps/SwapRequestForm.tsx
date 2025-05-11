import React, { useState } from 'react';
import { Shift } from '../../types';
import { formatDate, formatTime } from '../../lib/utils';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import Select from '../ui/Select';

interface SwapRequestFormProps {
  selectedShift: Shift;
  availableEmployees: { id: string; name: string }[];
  onSubmit: (requesteeId: string) => void;
  onCancel: () => void;
}

const SwapRequestForm: React.FC<SwapRequestFormProps> = ({
  selectedShift,
  availableEmployees,
  onSubmit,
  onCancel,
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployeeId) {
      setError('Please select an employee');
      return;
    }
    
    onSubmit(selectedEmployeeId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Shift Swap</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Your Selected Shift:</h3>
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
            <p className="font-medium">{formatDate(selectedShift.date)}</p>
            <p>
              {formatTime(selectedShift.startTime)} - {formatTime(selectedShift.endTime)}
            </p>
            <p className="text-sm text-gray-600">{selectedShift.position}</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Select
            label="Select Employee to Request Swap With"
            options={availableEmployees.map(emp => ({
              value: emp.id,
              label: emp.name,
            }))}
            value={selectedEmployeeId}
            onChange={(e) => {
              setSelectedEmployeeId(e.target.value);
              setError('');
            }}
            placeholder="Choose an employee"
            error={error}
          />
          
          <div className="mt-4 bg-blue-50 p-3 rounded-md border border-blue-100">
            <p className="text-sm">
              <span className="font-medium">Note:</span> This will send a swap request to the 
              selected employee. They will need to accept the request before it's sent to a 
              manager for final approval.
            </p>
          </div>
        </form>
      </CardContent>
      
      <CardFooter>
        <Button variant="primary" onClick={handleSubmit}>
          Send Request
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SwapRequestForm;