export enum UserRole {
  EMPLOYEE = 'employee',
  MANAGER = 'manager',
}

export enum ShiftSwapStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface User {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  role: UserRole;
  storeId: string;
}

export interface Shift {
  id: string;
  employeeId: string;
  storeId: string;
  date: string; // ISO date string
  startTime: string; // 24-hour format HH:MM
  endTime: string; // 24-hour format HH:MM
  position: string;
}

export interface ShiftSwapRequest {
  id: string;
  requesterId: string;
  requesteeId: string;
  requesterShiftId: string;
  requesteeShiftId: string | null; // null if open request
  status: ShiftSwapStatus;
  createdAt: string;
  updatedAt: string;
  managerNote?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
}