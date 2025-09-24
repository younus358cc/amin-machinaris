/**
 * Status utility functions for invoice management
 * Handles status transitions, validations, and business logic
 */

import { InvoiceStatus } from '../components/StatusIcon';

export interface StatusTransition {
  from: InvoiceStatus;
  to: InvoiceStatus;
  requiresConfirmation: boolean;
  confirmationMessage?: string;
  requiresPermission?: string;
  businessRules?: string[];
}

export interface StatusHistory {
  id: string;
  invoiceId: string;
  fromStatus: InvoiceStatus;
  toStatus: InvoiceStatus;
  changedBy: string;
  changedAt: string;
  reason?: string;
  notes?: string;
}

// Define valid status transitions with business rules
export const statusTransitions: StatusTransition[] = [
  // From Draft
  {
    from: 'draft',
    to: 'sent',
    requiresConfirmation: false,
    businessRules: ['Invoice must have at least one line item', 'Client information must be complete']
  },
  {
    from: 'draft',
    to: 'cancelled',
    requiresConfirmation: true,
    confirmationMessage: 'আপনি কি এই খসড়া ইনভয়েসটি বাতিল করতে চান?'
  },
  {
    from: 'draft',
    to: 'processing',
    requiresConfirmation: false,
    requiresPermission: 'process_invoices'
  },

  // From Sent
  {
    from: 'sent',
    to: 'paid',
    requiresConfirmation: false,
    requiresPermission: 'manage_payments'
  },
  {
    from: 'sent',
    to: 'partially_paid',
    requiresConfirmation: false,
    requiresPermission: 'manage_payments',
    businessRules: ['Partial payment amount must be greater than 0', 'Partial payment must be less than total amount']
  },
  {
    from: 'sent',
    to: 'overdue',
    requiresConfirmation: false,
    businessRules: ['Due date must have passed']
  },
  {
    from: 'sent',
    to: 'cancelled',
    requiresConfirmation: true,
    confirmationMessage: 'আপনি কি এই প্রেরিত ইনভয়েসটি বাতিল করতে চান?',
    requiresPermission: 'cancel_invoices'
  },

  // From Partially Paid
  {
    from: 'partially_paid',
    to: 'paid',
    requiresConfirmation: false,
    requiresPermission: 'manage_payments'
  },
  {
    from: 'partially_paid',
    to: 'overdue',
    requiresConfirmation: false,
    businessRules: ['Due date must have passed']
  },
  {
    from: 'partially_paid',
    to: 'cancelled',
    requiresConfirmation: true,
    confirmationMessage: 'আপনি কি এই আংশিক পরিশোধিত ইনভয়েসটি বাতিল করতে চান? রিফান্ড প্রক্রিয়া প্রয়োজন হতে পারে।',
    requiresPermission: 'cancel_invoices'
  },

  // From Overdue
  {
    from: 'overdue',
    to: 'paid',
    requiresConfirmation: false,
    requiresPermission: 'manage_payments'
  },
  {
    from: 'overdue',
    to: 'partially_paid',
    requiresConfirmation: false,
    requiresPermission: 'manage_payments'
  },
  {
    from: 'overdue',
    to: 'cancelled',
    requiresConfirmation: true,
    confirmationMessage: 'আপনি কি এই বকেয়া ইনভয়েসটি বাতিল করতে চান?',
    requiresPermission: 'cancel_invoices'
  },

  // From Processing
  {
    from: 'processing',
    to: 'sent',
    requiresConfirmation: false
  },
  {
    from: 'processing',
    to: 'cancelled',
    requiresConfirmation: true,
    confirmationMessage: 'আপনি কি প্রক্রিয়াকরণ বন্ধ করে ইনভয়েসটি বাতিল করতে চান?'
  }
];

/**
 * Check if a status transition is valid
 */
export const isValidTransition = (
  fromStatus: InvoiceStatus, 
  toStatus: InvoiceStatus
): boolean => {
  return statusTransitions.some(
    transition => transition.from === fromStatus && transition.to === toStatus
  );
};

/**
 * Get available status transitions for a given status
 */
export const getAvailableTransitions = (
  currentStatus: InvoiceStatus,
  userPermissions: string[] = []
): InvoiceStatus[] => {
  return statusTransitions
    .filter(transition => {
      if (transition.from !== currentStatus) return false;
      if (transition.requiresPermission && !userPermissions.includes(transition.requiresPermission)) {
        return false;
      }
      return true;
    })
    .map(transition => transition.to);
};

/**
 * Get transition configuration
 */
export const getTransitionConfig = (
  fromStatus: InvoiceStatus, 
  toStatus: InvoiceStatus
): StatusTransition | null => {
  return statusTransitions.find(
    transition => transition.from === fromStatus && transition.to === toStatus
  ) || null;
};

/**
 * Validate business rules for status transition
 */
export const validateStatusTransition = (
  fromStatus: InvoiceStatus,
  toStatus: InvoiceStatus,
  invoiceData: any
): { valid: boolean; errors: string[] } => {
  const transition = getTransitionConfig(fromStatus, toStatus);
  const errors: string[] = [];

  if (!transition) {
    errors.push(`Invalid transition from ${fromStatus} to ${toStatus}`);
    return { valid: false, errors };
  }

  // Check business rules
  if (transition.businessRules) {
    for (const rule of transition.businessRules) {
      switch (rule) {
        case 'Invoice must have at least one line item':
          if (!invoiceData.lineItems || invoiceData.lineItems.length === 0) {
            errors.push('ইনভয়েসে কমপক্ষে একটি লাইন আইটেম থাকতে হবে');
          }
          break;
        case 'Client information must be complete':
          if (!invoiceData.clientName || !invoiceData.clientEmail) {
            errors.push('ক্লায়েন্টের সম্পূর্ণ তথ্য প্রয়োজন');
          }
          break;
        case 'Due date must have passed':
          if (new Date(invoiceData.dueDate) >= new Date()) {
            errors.push('নির্ধারিত তারিখ অতিক্রম হওয়ার পর এই স্ট্যাটাস সেট করা যাবে');
          }
          break;
        case 'Partial payment amount must be greater than 0':
          if (!invoiceData.partialPaymentAmount || invoiceData.partialPaymentAmount <= 0) {
            errors.push('আংশিক পেমেন্টের পরিমাণ ০ এর চেয়ে বেশি হতে হবে');
          }
          break;
        case 'Partial payment must be less than total amount':
          if (invoiceData.partialPaymentAmount >= invoiceData.totalAmount) {
            errors.push('আংশিক পেমেন্ট মোট পরিমাণের চেয়ে কম হতে হবে');
          }
          break;
      }
    }
  }

  return { valid: errors.length === 0, errors };
};

/**
 * Get status priority for sorting (lower number = higher priority)
 */
export const getStatusPriority = (status: InvoiceStatus): number => {
  const priorities: Record<InvoiceStatus, number> = {
    overdue: 1,
    partially_paid: 2,
    sent: 3,
    processing: 4,
    draft: 5,
    paid: 6,
    cancelled: 7
  };
  return priorities[status] || 999;
};

/**
 * Check if status requires immediate attention
 */
export const requiresAttention = (status: InvoiceStatus): boolean => {
  return ['overdue', 'partially_paid'].includes(status);
};

/**
 * Get status-based action recommendations
 */
export const getStatusRecommendations = (
  status: InvoiceStatus,
  dueDate?: string,
  remindersSent?: number
): string[] => {
  const recommendations: string[] = [];

  switch (status) {
    case 'draft':
      recommendations.push('ইনভয়েস সম্পূর্ণ করুন এবং ক্লায়েন্টের কাছে পাঠান');
      break;
    case 'sent':
      if (dueDate && new Date(dueDate) <= new Date()) {
        recommendations.push('নির্ধারিত তারিখ কাছে এসেছে - রিমাইন্ডার পাঠান');
      }
      break;
    case 'overdue':
      if (!remindersSent || remindersSent < 3) {
        recommendations.push('পেমেন্ট রিমাইন্ডার পাঠান');
      }
      recommendations.push('ক্লায়েন্টের সাথে সরাসরি যোগাযোগ করুন');
      break;
    case 'partially_paid':
      recommendations.push('বাকি পেমেন্টের জন্য রিমাইন্ডার পাঠান');
      break;
    case 'processing':
      recommendations.push('প্রক্রিয়াকরণ সম্পূর্ণ করুন');
      break;
  }

  return recommendations;
};

/**
 * Auto-update status based on business rules
 */
export const autoUpdateStatus = (
  currentStatus: InvoiceStatus,
  dueDate: string,
  paymentAmount?: number,
  totalAmount?: number
): InvoiceStatus => {
  const today = new Date();
  const due = new Date(dueDate);

  // Auto-transition sent invoices to overdue if past due date
  if (currentStatus === 'sent' && due < today) {
    return 'overdue';
  }

  // Auto-transition to paid if full payment received
  if (
    (currentStatus === 'sent' || currentStatus === 'overdue' || currentStatus === 'partially_paid') &&
    paymentAmount && totalAmount && paymentAmount >= totalAmount
  ) {
    return 'paid';
  }

  // Auto-transition to partially paid if partial payment received
  if (
    (currentStatus === 'sent' || currentStatus === 'overdue') &&
    paymentAmount && totalAmount && paymentAmount > 0 && paymentAmount < totalAmount
  ) {
    return 'partially_paid';
  }

  return currentStatus;
};