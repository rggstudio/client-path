import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday, isYesterday, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: Date | string | number): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  return format(dateObj, 'MMM d, yyyy');
}

export function formatTimeAgo(date: Date | string | number): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  if (isToday(dateObj)) {
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } else if (isYesterday(dateObj)) {
    return 'Yesterday';
  } else {
    return format(dateObj, 'MMM d, yyyy');
  }
}

export function generateInvoiceNumber(): string {
  const prefix = 'INV';
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${randomNum}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getStatusColor(status: string): {
  bg: string; 
  text: string;
} {
  switch (status.toLowerCase()) {
    case 'paid':
    case 'completed':
    case 'signed':
    case 'accepted':
      return { bg: 'bg-green-100', text: 'text-green-800' };
    case 'pending':
    case 'scheduled':
    case 'sent':
      return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
    case 'overdue':
    case 'cancelled':
    case 'declined':
    case 'expired':
      return { bg: 'bg-red-100', text: 'text-red-800' };
    case 'draft':
      return { bg: 'bg-slate-100', text: 'text-slate-800' };
    default:
      return { bg: 'bg-blue-100', text: 'text-blue-800' };
  }
}

export function getActivityIcon(type: string): string {
  switch (type.toLowerCase()) {
    case 'invoice':
    case 'invoice_created':
    case 'invoice_sent':
    case 'invoice_paid':
      return 'file-list-3-line';
    case 'contract':
    case 'contract_created':
    case 'contract_sent':
    case 'contract_signed':
      return 'file-text-line';
    case 'proposal':
    case 'proposal_created':
    case 'proposal_sent':
    case 'proposal_accepted':
      return 'file-paper-2-line';
    case 'meeting':
    case 'meeting_scheduled':
    case 'meeting_completed':
      return 'calendar-check-line';
    case 'payment':
    case 'payment_received':
      return 'money-dollar-circle-line';
    case 'client':
    case 'client_added':
      return 'user-line';
    default:
      return 'information-line';
  }
}

export function getActivityIconColor(type: string): {
  bg: string;
  text: string;
} {
  switch (type.toLowerCase()) {
    case 'invoice':
    case 'invoice_created':
    case 'invoice_sent':
    case 'invoice_paid':
      return { bg: 'bg-primary-100', text: 'text-primary-600' };
    case 'contract':
    case 'contract_created':
    case 'contract_sent':
    case 'contract_signed':
      return { bg: 'bg-green-100', text: 'text-green-600' };
    case 'proposal':
    case 'proposal_created':
    case 'proposal_sent':
    case 'proposal_accepted':
      return { bg: 'bg-secondary-100', text: 'text-secondary-600' };
    case 'meeting':
    case 'meeting_scheduled':
    case 'meeting_completed':
      return { bg: 'bg-blue-100', text: 'text-blue-600' };
    case 'payment':
    case 'payment_received':
      return { bg: 'bg-secondary-100', text: 'text-secondary-600' };
    case 'client':
    case 'client_added':
      return { bg: 'bg-primary-100', text: 'text-primary-600' };
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-600' };
  }
}
