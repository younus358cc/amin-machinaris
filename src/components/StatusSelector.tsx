import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { InvoiceStatus, canTransitionTo, getStatusConfig } from './StatusIcon';

interface StatusSelectorProps {
  currentStatus: InvoiceStatus;
  onStatusChange: (newStatus: InvoiceStatus) => void;
  disabled?: boolean;
  className?: string;
  showAllStatuses?: boolean; // If true, shows all statuses regardless of transition rules
}

const StatusSelector: React.FC<StatusSelectorProps> = ({
  currentStatus,
  onStatusChange,
  disabled = false,
  className = '',
  showAllStatuses = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const allStatuses: InvoiceStatus[] = [
    'draft', 'sent', 'paid', 'overdue', 'cancelled', 'partially_paid', 'processing'
  ];

  const availableStatuses = showAllStatuses 
    ? allStatuses
    : allStatuses.filter(status => 
        status === currentStatus || canTransitionTo(currentStatus, status)
      );

  const handleStatusSelect = (status: InvoiceStatus) => {
    if (status !== currentStatus && !disabled) {
      onStatusChange(status);
    }
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          flex items-center justify-between w-full px-3 py-2 
          bg-white border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none
          transition-colors duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 cursor-pointer'}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Current status: ${getStatusConfig(currentStatus).label}`}
      >
        <StatusBadge 
          status={currentStatus} 
          size="sm"
          showIcon={true}
          showLabel={true}
        />
        {!disabled && (
          <ChevronDown 
            size={16} 
            className={`text-gray-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
            role="listbox"
          >
            <div className="py-1 max-h-60 overflow-y-auto">
              {availableStatuses.map((status) => {
                const isSelected = status === currentStatus;
                const isTransitionValid = showAllStatuses || status === currentStatus || canTransitionTo(currentStatus, status);
                
                return (
                  <button
                    key={status}
                    onClick={() => handleStatusSelect(status)}
                    disabled={!isTransitionValid}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 text-left
                      transition-colors duration-150
                      ${isSelected 
                        ? 'bg-blue-50 text-blue-700' 
                        : isTransitionValid
                          ? 'hover:bg-gray-50 text-gray-900'
                          : 'text-gray-400 cursor-not-allowed'
                      }
                    `}
                    role="option"
                    aria-selected={isSelected}
                    aria-label={`Change status to ${getStatusConfig(status).label}`}
                  >
                    <StatusBadge 
                      status={status} 
                      size="sm"
                      showIcon={true}
                      showLabel={true}
                      animate={status === 'processing'}
                    />
                    {isSelected && (
                      <Check size={14} className="text-blue-600" />
                    )}
                  </button>
                );
              })}
            </div>
            
            {!showAllStatuses && (
              <div className="px-3 py-2 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-500">
                  শুধুমাত্র বৈধ স্ট্যাটাস ট্রানজিশন দেখানো হচ্ছে
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StatusSelector;