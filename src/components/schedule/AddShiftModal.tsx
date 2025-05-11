import React, { useState } from 'react';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

interface AddShiftModalProps {
  date: Date;
  hour: number;
  onClose: () => void;
  onAdd: (shiftData: any) => void;
}

const AddShiftModal: React.FC<AddShiftModalProps> = ({
  date,
  hour,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState({
    employeeName: '',
    position: '',
    startTime: `${hour.toString().padStart(2, '0')}:00`,
    endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
  });

  const positions = [
    { value: 'delivery', label: 'Delivery Driver' },
    { value: 'customer-service', label: 'Customer Service' },
    { value: 'manager', label: 'Manager' },
    { value: 'cook', label: 'Cook' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      date: format(date, 'yyyy-MM-dd'),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Shift</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Employee Name"
            value={formData.employeeName}
            onChange={(e) => setFormData(prev => ({ ...prev, employeeName: e.target.value }))}
            required
          />

          <Select
            label="Position"
            options={positions}
            value={formData.position}
            onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time"
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              required
            />
            <Input
              label="End Time"
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              required
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Shift
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddShiftModal;