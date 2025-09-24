import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileText, 
  XCircle, 
  CircleDot,
  Loader2
} from 'lucide-react';

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'partially_paid' | 'processing';

interface StatusIconProps {
  status: InvoiceStatus;
  size?: number;
  showTooltip?: boolean;
  className?: string;
  animate?: boolean;
}

interface StatusConfig {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  bgColor: string;
  label: string;
  description: string;
  ariaLabel: string;
}

const statusConfigs: Record<InvoiceStatus, StatusConfig> = {
  draft: {
    icon: FileText,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    label: 'খসড়া',
    description: 'ইনভয়েসটি এখনও খসড়া অবস্থায় রয়েছে',
    ariaLabel: 'Draft invoice status'
  },
  sent: {
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    label: 'প্রেরিত',
    description: 'ইনভয়েস ক্লায়েন্টের কাছে পাঠানো হয়েছে, পেমেন্টের অপেক্ষায়',
    ariaLabel: 'Sent invoice status, awaiting payment'
  },
  paid: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    label: 'পরিশোধিত',
    description: 'ইনভয়েসের সম্পূর্ণ পেমেন্ট সম্পন্ন হয়েছে',
    ariaLabel: 'Paid invoice status, payment completed'
  },
  overdue: {
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    label: 'বকেয়া',
    description: 'ইনভয়েসের পেমেন্ট নির্ধারিত সময়ের পর বকেয়া রয়েছে',
    ariaLabel: 'Overdue invoice status, payment is late'
  },
  cancelled: {
    icon: XCircle,
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    label: 'বাতিল',
    description: 'ইনভয়েসটি বাতিল করা হয়েছে',
    ariaLabel: 'Cancelled invoice status'
  },
  partially_paid: {
    icon: CircleDot,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    label: 'আংশিক পরিশোধিত',
    description: 'ইনভয়েসের আংশিক পেমেন্ট সম্পন্ন হয়েছে',
    ariaLabel: 'Partially paid invoice status'
  },
  processing: {
    icon: Loader2,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    label: 'প্রক্রিয়াকরণ',
    description: 'ইনভয়েস প্রক্রিয়াকরণ চলছে',
    ariaLabel: 'Processing invoice status'
  }
};

const StatusIcon: React.FC<StatusIconProps> = ({ 
  status, 
  size = 16, 
  showTooltip = true, 
  className = '',
  animate = false
}) => {
  const config = statusConfigs[status];
  
  if (!config) {
    console.warn(`Unknown invoice status: ${status}`);
    return (
      <div 
        className={`inline-flex items-center justify-center ${className}`}
        title="অজানা স্ট্যাটাস"
        aria-label="Unknown status"
      >
        <AlertCircle size={size} className="text-gray-400" />
      </div>
    );
  }

  const Icon = config.icon;
  const iconClassName = `${config.color} ${animate && status === 'processing' ? 'animate-spin' : ''} transition-colors duration-200`;

  const iconElement = (
    <div 
      className={`inline-flex items-center justify-center ${className}`}
      title={showTooltip ? config.description : undefined}
      aria-label={config.ariaLabel}
      role="img"
    >
      <Icon 
        size={size} 
        className={iconClassName}
        aria-hidden="true"
      />
    </div>
  );

  return iconElement;
};

export default StatusIcon;

// Export utility functions for status management
export const getStatusConfig = (status: InvoiceStatus) => {
  return statusConfigs[status] || statusConfigs.draft;
};

export const getStatusLabel = (status: InvoiceStatus): string => {
  return statusConfigs[status]?.label || 'অজানা';
};

export const getStatusColor = (status: InvoiceStatus): string => {
  return statusConfigs[status]?.color || 'text-gray-600';
};

export const getStatusBgColor = (status: InvoiceStatus): string => {
  return statusConfigs[status]?.bgColor || 'bg-gray-100';
};

export const isValidStatus = (status: string): status is InvoiceStatus => {
  return Object.keys(statusConfigs).includes(status);
};

// Status transition validation
export const canTransitionTo = (currentStatus: InvoiceStatus, targetStatus: InvoiceStatus): boolean => {
  const transitions: Record<InvoiceStatus, InvoiceStatus[]> = {
    draft: ['sent', 'cancelled'],
    sent: ['paid', 'overdue', 'partially_paid', 'cancelled'],
    paid: [], // Paid invoices cannot transition to other states
    overdue: ['paid', 'partially_paid', 'cancelled'],
    cancelled: [], // Cancelled invoices cannot transition
    partially_paid: ['paid', 'overdue', 'cancelled'],
    processing: ['sent', 'cancelled'] // Processing can go to sent or be cancelled
  };

  return transitions[currentStatus]?.includes(targetStatus) || false;
};