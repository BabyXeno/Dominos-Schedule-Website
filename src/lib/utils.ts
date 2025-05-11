import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';
import { ShiftSwapStatus } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string): string {
  return format(parseISO(date), 'EEEE, MMMM d, yyyy');
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  let hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12; // Convert 0 to 12
  return `${hour}:${minutes} ${ampm}`;
}

export function getStatusColor(status: ShiftSwapStatus): string {
  switch (status) {
    case ShiftSwapStatus.PENDING:
      return 'bg-status-pending';
    case ShiftSwapStatus.APPROVED:
      return 'bg-status-approved';
    case ShiftSwapStatus.REJECTED:
      return 'bg-status-rejected';
    default:
      return 'bg-gray-400';
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export function getDayOfWeek(date: string): string {
  return format(parseISO(date), 'EEEE');
}

export function getShortDate(date: string): string {
  return format(parseISO(date), 'MMM d');
}

export function getWeekDates(date: Date = new Date()): Date[] {
  const day = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const diff = date.getDate() - day; // Adjust to get Sunday
  
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const newDate = new Date(date);
    newDate.setDate(diff + i);
    weekDates.push(newDate);
  }
  
  return weekDates;
}