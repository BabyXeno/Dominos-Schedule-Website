import React, { useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { FileText, Upload, AlertCircle } from 'lucide-react';

interface ScheduleUploadFormProps {
  onUpload: (file: File) => void;
  onManualEntry: () => void;
}

const ScheduleUploadForm: React.FC<ScheduleUploadFormProps> = ({
  onUpload,
  onManualEntry,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateFile(e.target.files[0]);
    }
  };

  const validateFile = (file: File) => {
    // Check file type (only allow CSV)
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      setSelectedFile(null);
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setError('');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }
    
    onUpload(selectedFile);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Schedule</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center mb-4 ${
            isDragOver ? 'border-dominos-blue bg-blue-50' : 'border-gray-300'
          } ${error ? 'border-red-300' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {selectedFile ? (
            <div className="flex flex-col items-center">
              <FileText size={48} className="text-dominos-blue mb-2" />
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-2"
                onClick={() => setSelectedFile(null)}
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload size={48} className="text-gray-400 mb-2" />
              <p className="mb-2 font-medium">
                Drag and drop your CSV file here, or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports CSV files up to 5MB
              </p>
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="fileUpload"
              />
              <label htmlFor="fileUpload">
                <Button variant="secondary" type="button">
                  Browse Files
                </Button>
              </label>
            </div>
          )}
        </div>
        
        {error && (
          <div className="flex items-start gap-2 text-red-500 mb-4">
            <AlertCircle size={16} className="mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-medium mb-2">CSV Format Guidelines:</h3>
          <p className="text-sm mb-2">
            Your CSV file should include the following columns:
          </p>
          <ul className="text-sm list-disc list-inside mb-2">
            <li>Employee ID</li>
            <li>Date (YYYY-MM-DD format)</li>
            <li>Start Time (HH:MM format, 24-hour)</li>
            <li>End Time (HH:MM format, 24-hour)</li>
            <li>Position</li>
          </ul>
          <p className="text-sm">
            Need to create schedules manually?{' '}
            <button
              className="text-dominos-blue hover:underline"
              onClick={onManualEntry}
            >
              Use manual entry
            </button>
          </p>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!selectedFile}
        >
          Upload Schedule
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScheduleUploadForm;