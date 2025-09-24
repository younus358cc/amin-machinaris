import React from 'react';
import { motion } from 'framer-motion';
import StatusIcon, { InvoiceStatus, getStatusConfig } from './StatusIcon';

interface InvoiceStatusIndicatorProps {
  status: InvoiceStatus;
  dueDate?: string;
  paidDate?: string;
  remindersSent?: number;
  partialPaymentAmount?: number;
  totalAmount?: number;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}

const InvoiceStatusIndicator: React.FC<InvoiceStatusIndicatorProps> = ({
  status,
  dueDate,
  paidDate,
  remindersSent = 0,
  partialPaymentAmount,
  totalAmount,
  size = 'md',
  showDetails = true,
  className = ''
}) => {
  const config = getStatusConfig(status);
  
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bn-BD');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getDaysOverdue = () => {
    if (!dueDate || status !== 'overdue') return 0;
    const due = new Date(dueDate);
    const today = new Date();
    return Math.ceil((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getPartialPaymentPercentage = () => {
    if (!partialPaymentAmount || !totalAmount) return 0;
    return Math.round((partialPaymentAmount / totalAmount) * 100);
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={`
          inline-flex items-center px-2.5 py-0.5 rounded-full font-medium
          ${config.bgColor} ${config.color} ${sizeClasses[size]}
        `}
        role="status"
        aria-label={config.ariaLabel}
      >
        <StatusIcon 
          status={status} 
          size={iconSizes[size]} 
          showTooltip={false}
          animate={status === 'processing'}
          className="mr-1"
        />
        <span>{config.label}</span>
      </motion.div>

      {showDetails && (
        <div className="ml-2">
          {/* Overdue details */}
          {status === 'overdue' && dueDate && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs text-red-600"
            >
              {getDaysOverdue()} দিন বিলম্ব
              {remindersSent > 0 && (
                <span className="ml-1">
                  ({remindersSent} রিমাইন্ডার)
                </span>
              )}
            </motion.div>
          )}

          {/* Paid details */}
          {status === 'paid' && paidDate && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs text-green-600"
            >
              {formatDate(paidDate)} তারিখে পরিশোধিত
            </motion.div>
          )}

          {/* Partially paid details */}
          {status === 'partially_paid' && partialPaymentAmount && totalAmount && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs text-yellow-600"
            >
              {formatCurrency(partialPaymentAmount)} / {formatCurrency(totalAmount)}
              <span className="ml-1">({getPartialPaymentPercentage()}%)</span>
            </motion.div>
          )}

          {/* Sent details */}
          {status === 'sent' && dueDate && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs text-blue-600"
            >
              {formatDate(dueDate)} এর মধ্যে পেমেন্ট
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default InvoiceStatusIndicator;