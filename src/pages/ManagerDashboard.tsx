import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, RefreshCw, Users, Calendar, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Layout from '../components/layout/Layout';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import { formatDate } from '../lib/utils';
import WeeklyCalendar from '../components/schedule/WeeklyCalendar';
import ScheduleUploadForm from '../components/manager/ScheduleUploadForm';

const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { shifts, swapRequests, getPendingSwapRequests, processCSVUpload, updateSwapRequest } = useData();
  const navigate = useNavigate();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  if (!user) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p>Please log in to view your dashboard.</p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => navigate('/login')}
          >
            Log In
          </Button>
        </div>
      </Layout>
    );
  }
  
  const storeShifts = shifts.filter(shift => shift.storeId === user.storeId);
  const pendingSwapRequests = getPendingSwapRequests();
  
  // Employee count by calculating unique employee IDs
  const uniqueEmployeeIds = new Set(storeShifts.map(shift => shift.employeeId));
  const employeeCount = uniqueEmployeeIds.size;

  const handleUpload = async (file: File) => {
    setIsProcessing(true);
    try {
      await processCSVUpload(file);
      setShowUploadForm(false);
    } catch (error) {
      console.error('Failed to upload schedule:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualEntry = () => {
    navigate('/schedule/new');
  };

  const handleApproveSwap = (swapId: string) => {
    updateSwapRequest(swapId, 'approved', 'Swap request approved by manager');
  };

  const handleRejectSwap = (swapId: string) => {
    updateSwapRequest(swapId, 'rejected', 'Swap request rejected by manager');
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Manager Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user.name}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Users className="text-dominos-blue" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Employees</p>
                <p className="text-2xl font-bold">{employeeCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Calendar className="text-dominos-blue" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Scheduled Shifts</p>
                <p className="text-2xl font-bold">{storeShifts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="rounded-full bg-yellow-100 p-3 mr-4">
                <RefreshCw className="text-yellow-500" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Swaps</p>
                <p className="text-2xl font-bold">{pendingSwapRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {showUploadForm ? (
            <ScheduleUploadForm
              onUpload={handleUpload}
              onManualEntry={handleManualEntry}
            />
          ) : (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Store Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <WeeklyCalendar shifts={storeShifts} />
              </CardContent>
              <CardFooter>
                <Button
                  variant="primary"
                  onClick={() => setShowUploadForm(true)}
                  leftIcon={<UploadCloud size={16} />}
                  className="mr-2"
                  isLoading={isProcessing}
                >
                  Upload Schedule
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleManualEntry}
                  leftIcon={<Calendar size={16} />}
                >
                  Manual Entry
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {storeShifts.length === 0 && !showUploadForm && (
            <Card className="bg-yellow-50 border border-yellow-200">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <AlertCircle className="text-yellow-500 mt-0.5 mr-3 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-medium text-yellow-800 mb-1">No Schedule Uploaded</h3>
                    <p className="text-yellow-700 text-sm">
                      You haven't uploaded a schedule yet. Upload a schedule to enable shift swap requests.
                    </p>
                    <Button
                      variant="primary"
                      className="mt-3"
                      size="sm"
                      onClick={() => setShowUploadForm(true)}
                      leftIcon={<UploadCloud size={16} />}
                    >
                      Upload Schedule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Pending Swap Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingSwapRequests.length === 0 ? (
                <p className="text-gray-500 py-4 text-center">
                  No pending swap requests
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingSwapRequests.slice(0, 5).map((request) => (
                    <div key={request.id} className="border rounded-md p-3">
                      <div className="flex justify-between mb-2">
                        <p className="text-sm font-medium">Shift Swap Request</p>
                        <StatusBadge status={request.status} />
                      </div>
                      <p className="text-sm">
                        Created: {formatDate(request.createdAt)}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleApproveSwap(request.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRejectSwap(request.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {pendingSwapRequests.length > 5 && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => navigate('/swap-requests')}
                    >
                      View All ({pendingSwapRequests.length}) Requests
                    </Button>
                  )}
                </div>
              )}
              
              <div className="mt-4">
                <Button
                  variant="primary"
                  onClick={() => navigate('/swap-requests')}
                  className="w-full"
                  leftIcon={<RefreshCw size={16} />}
                >
                  Manage Swap Requests
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ManagerDashboard;