import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Mail, 
  Download, 
  Printer, 
  Copy, 
  Edit, 
  Trash2, 
  Archive, 
  MessageSquare, 
  History, 
  CreditCard, 
  FileText, 
  Eye, 
  Settings,
  AlertCircle,
  DollarSign,
  Calendar,
  User
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import InvoiceStatusIndicator from './InvoiceStatusIndicator';
import { InvoiceStatus } from './StatusIcon';

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  status: InvoiceStatus;
  totalAmount: number;
  currency: string;
  dueDate: string;
  issueDate: string;
  paidDate?: string;
  partialPaymentAmount?: number;
  remindersSent?: number;
}

interface ActionConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  category: 'view' | 'edit' | 'send' | 'payment' | 'export' | 'manage';
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
  permissions: string[];
  availableFor: string[]; // invoice statuses
}

interface InvoiceActionPanelProps {
  invoice: Invoice;
  userPermissions: string[];
  onAction: (actionId: string, invoice: Invoice) => void;
  layout?: 'horizontal' | 'vertical' | 'grid';
  showLabels?: boolean;
  groupByCategory?: boolean;
}

const InvoiceActionPanel: React.FC<InvoiceActionPanelProps> = ({
  invoice,
  userPermissions,
  onAction,
  layout = 'horizontal',
  showLabels = true,
  groupByCategory = false
}) => {
  const [showConfirmation, setShowConfirmation] = useState<{
    show: boolean;
    action: ActionConfig | null;
  }>({ show: false, action: null });

  // Define all possible actions
  const actionConfigs: ActionConfig[] = [
    // View Actions
    {
      id: 'view-details',
      label: 'বিস্তারিত দেখুন',
      icon: <Eye size={16} />,
      description: 'ইনভয়েসের সম্পূর্ণ বিবরণ দেখুন',
      variant: 'secondary',
      category: 'view',
      permissions: ['view_invoices'],
      availableFor: ['draft', 'sent', 'paid', 'overdue', 'cancelled', 'partially_paid', 'processing']
    },
    {
      id: 'preview',
      label: 'প্রিভিউ',
      icon: <FileText size={16} />,
      description: 'ইনভয়েসের প্রিন্ট প্রিভিউ দেখুন',
      variant: 'secondary',
      category: 'view',
      permissions: ['view_invoices'],
      availableFor: ['draft', 'sent', 'paid', 'overdue', 'cancelled', 'partially_paid']
    },
    {
      id: 'payment-history',
      label: 'পেমেন্ট হিস্টরি',
      icon: <History size={16} />,
      description: 'পেমেন্ট ইতিহাস দেখুন',
      variant: 'secondary',
      category: 'view',
      permissions: ['view_payments'],
      availableFor: ['sent', 'paid', 'overdue', 'partially_paid']
    },

    // Edit Actions
    {
      id: 'edit',
      label: 'সম্পাদনা',
      icon: <Edit size={18} />,
      description: 'ইনভয়েস সম্পাদনা করুন',
      variant: 'primary',
      category: 'edit',
      permissions: ['edit_invoices'],
      availableFor: ['draft', 'sent']
    },
    {
      id: 'duplicate',
      label: 'কপি তৈরি',
      icon: <Copy size={18} />,
      description: 'এই ইনভয়েসের একটি কপি তৈরি করুন',
      variant: 'secondary',
      category: 'edit',
      permissions: ['create_invoices'],
      availableFor: ['draft', 'sent', 'paid', 'overdue', 'cancelled']
    },
    {
      id: 'add-notes',
      label: 'নোট যোগ করুন',
      icon: <MessageSquare size={18} />,
      description: 'ইনভয়েসে নোট বা মন্তব্য যোগ করুন',
      variant: 'secondary',
      category: 'edit',
      permissions: ['edit_invoices'],
      availableFor: ['draft', 'sent', 'paid', 'overdue']
    },

    // Send Actions
    {
      id: 'send-email',
      label: 'ইমেইল পাঠান',
      icon: <Send size={18} />,
      description: 'ক্লায়েন্টের কাছে ইনভয়েস ইমেইল করুন',
      variant: 'primary',
      category: 'send',
      permissions: ['send_invoices'],
      availableFor: ['draft', 'sent']
    },
    {
      id: 'send-reminder',
      label: 'রিমাইন্ডার পাঠান',
      icon: <Mail size={18} />,
      description: 'পেমেন্ট রিমাইন্ডার পাঠান',
      variant: 'warning',
      category: 'send',
      permissions: ['send_invoices'],
      availableFor: ['sent', 'overdue']
    },
    {
      id: 'send-sms',
      label: 'SMS পাঠান',
      icon: <MessageSquare size={18} />,
      description: 'ক্লায়েন্টের কাছে SMS পাঠান',
      variant: 'secondary',
      category: 'send',
      permissions: ['send_sms'],
      availableFor: ['sent', 'overdue']
    },

    // Payment Actions
    {
      id: 'mark-paid',
      label: 'পরিশোধিত চিহ্নিত করুন',
      icon: <CheckCircle size={16} />,
      description: 'ইনভয়েসটি পরিশোধিত হিসেবে চিহ্নিত করুন',
      variant: 'success',
      category: 'payment',
      permissions: ['manage_payments'],
      availableFor: ['sent', 'overdue', 'partially_paid']
    },
    {
      id: 'record-payment',
      label: 'পেমেন্ট রেকর্ড করুন',
      icon: <CreditCard size={16} />,
      description: 'আংশিক বা সম্পূর্ণ পেমেন্ট রেকর্ড করুন',
      variant: 'success',
      category: 'payment',
      permissions: ['manage_payments'],
      availableFor: ['sent', 'overdue', 'partially_paid']
    },
    {
      id: 'refund',
      label: 'রিফান্ড',
      icon: <DollarSign size={16} />,
      description: 'পেমেন্ট রিফান্ড প্রক্রিয়া করুন',
      variant: 'warning',
      category: 'payment',
      permissions: ['manage_refunds'],
      availableFor: ['paid', 'partially_paid'],
      requiresConfirmation: true,
      confirmationMessage: 'আপনি কি নিশ্চিত যে এই পেমেন্ট রিফান্ড করতে চান?'
    },

    // Export Actions
    {
      id: 'download-pdf',
      label: 'PDF ডাউনলোড',
      icon: <Download size={18} />,
      description: 'ইনভয়েস PDF ফরম্যাটে ডাউনলোড করুন',
      variant: 'secondary',
      category: 'export',
      permissions: ['export_invoices'],
      availableFor: ['draft', 'sent', 'paid', 'overdue', 'cancelled']
    },
    {
      id: 'download-excel',
      label: 'Excel ডাউনলোড',
      icon: <FileText size={18} />,
      description: 'ইনভয়েস Excel ফরম্যাটে ডাউনলোড করুন',
      variant: 'secondary',
      category: 'export',
      permissions: ['export_invoices'],
      availableFor: ['draft', 'sent', 'paid', 'overdue', 'cancelled']
    },
    {
      id: 'print',
      label: 'প্রিন্ট',
      icon: <Printer size={18} />,
      description: 'ইনভয়েস প্রিন্ট করুন',
      variant: 'secondary',
      category: 'export',
      permissions: ['print_invoices'],
      availableFor: ['draft', 'sent', 'paid', 'overdue', 'cancelled']
    },

    // Management Actions
    {
      id: 'change-status',
      label: 'স্ট্যাটাস পরিবর্তন',
      icon: <Settings size={18} />,
      description: 'ইনভয়েসের স্ট্যাটাস পরিবর্তন করুন',
      variant: 'secondary',
      category: 'manage',
      permissions: ['manage_invoice_status'],
      availableFor: ['draft', 'sent', 'overdue']
    },
    {
      id: 'archive',
      label: 'আর্কাইভ',
      icon: <Archive size={18} />,
      description: 'ইনভয়েসটি আর্কাইভ করুন',
      variant: 'secondary',
      category: 'manage',
      permissions: ['archive_invoices'],
      availableFor: ['paid', 'cancelled'],
      requiresConfirmation: true,
      confirmationMessage: 'আপনি কি এই ইনভয়েসটি আর্কাইভ করতে চান?'
    },
    {
      id: 'cancel',
      label: 'বাতিল করুন',
      icon: <XCircle size={18} />,
      description: 'ইনভয়েস বাতিল করুন',
      variant: 'danger',
      category: 'manage',
      permissions: ['cancel_invoices'],
      availableFor: ['draft', 'sent'],
      requiresConfirmation: true,
      confirmationMessage: 'আপনি কি নিশ্চিত যে এই ইনভয়েসটি বাতিল করতে চান?'
    },
    {
      id: 'delete',
      label: 'মুছে ফেলুন',
      icon: <Trash2 size={18} />,
      description: 'ইনভয়েস স্থায়ীভাবে মুছে ফেলুন',
      variant: 'danger',
      category: 'manage',
      permissions: ['delete_invoices', 'admin'],
      availableFor: ['draft', 'cancelled'],
      requiresConfirmation: true,
      confirmationMessage: 'আপনি কি নিশ্চিত যে এই ইনভয়েসটি স্থায়ীভাবে মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।'
    }
  ];

  // Filter actions based on permissions and invoice status
  const availableActions = actionConfigs.filter(action => {
    const hasPermission = action.permissions.some(permission => 
      userPermissions.includes(permission)
    );
    const statusAllowed = action.availableFor.includes(invoice.status);
    return hasPermission && statusAllowed;
  });

  // Group actions by category if requested
  const groupedActions = groupByCategory 
    ? availableActions.reduce((groups, action) => {
        if (!groups[action.category]) {
          groups[action.category] = [];
        }
        groups[action.category].push(action);
        return groups;
      }, {} as Record<string, ActionConfig[]>)
    : { all: availableActions };

  const handleActionClick = (action: ActionConfig) => {
    if (action.requiresConfirmation) {
      setShowConfirmation({ show: true, action });
    } else {
      onAction(action.id, invoice);
    }
  };

  const handleConfirmAction = () => {
    if (showConfirmation.action) {
      onAction(showConfirmation.action.id, invoice);
      setShowConfirmation({ show: false, action: null });
    }
  };

  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white border-green-600';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-600';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white border-red-600';
      default:
        return 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300';
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'view': return 'দেখুন';
      case 'edit': return 'সম্পাদনা';
      case 'send': return 'পাঠান';
      case 'payment': return 'পেমেন্ট';
      case 'export': return 'এক্সপোর্ট';
      case 'manage': return 'ব্যবস্থাপনা';
      default: return 'অন্যান্য';
    }
  };

  const renderActions = (actions: ActionConfig[]) => {
    if (layout === 'grid') {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${getVariantClasses(action.variant)}`}
              title={action.description}
            >
              <div className="mb-2">{action.icon}</div>
              {showLabels && (
                <span className="text-sm font-medium text-center">{action.label}</span>
              )}
            </button>
          ))}
        </div>
      );
    }

    if (layout === 'vertical') {
      return (
        <div className="space-y-2">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${getVariantClasses(action.variant)}`}
              title={action.description}
            >
              {action.icon}
              {showLabels && <span className="font-medium">{action.label}</span>}
            </button>
          ))}
        </div>
      );
    }

    // Horizontal layout (default)
    return (
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 hover:shadow-md ${getVariantClasses(action.variant)}`}
            title={action.description}
          >
            {action.icon}
            {showLabels && <span className="font-medium">{action.label}</span>}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Invoice Summary */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{invoice.invoiceNumber}</h3>
            <p className="text-sm text-gray-600">{invoice.clientName}</p>
            <div className="mt-2">
              <InvoiceStatusIndicator
                status={invoice.status}
                dueDate={invoice.dueDate}
                paidDate={invoice.paidDate}
                remindersSent={invoice.remindersSent}
                partialPaymentAmount={invoice.partialPaymentAmount}
                totalAmount={invoice.totalAmount}
                size="sm"
                showDetails={true}
              />
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900">
              {new Intl.NumberFormat('bn-BD', {
                style: 'currency',
                currency: invoice.currency,
                minimumFractionDigits: 0
              }).format(invoice.totalAmount)}
            </p>
            <p className="text-sm text-gray-600">
              {new Date(invoice.dueDate).toLocaleDateString('bn-BD')}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {groupByCategory ? (
        <div className="space-y-6">
          {Object.entries(groupedActions).map(([category, actions]) => (
            <div key={category}>
              <h4 className="font-medium text-gray-700 mb-3">{getCategoryTitle(category)}</h4>
              {renderActions(actions)}
            </div>
          ))}
        </div>
      ) : (
        renderActions(availableActions)
      )}

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmation.show && showConfirmation.action && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-center mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  showConfirmation.action.variant === 'danger' 
                    ? 'bg-red-100' 
                    : 'bg-yellow-100'
                }`}>
                  <AlertCircle className={
                    showConfirmation.action.variant === 'danger' 
                      ? 'text-red-600' 
                      : 'text-yellow-600'
                  } size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {showConfirmation.action.label}
                </h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                {showConfirmation.action.confirmationMessage}
              </p>
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmation({ show: false, action: null })}
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  বাতিল
                </button>
                <button
                  onClick={handleConfirmAction}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    showConfirmation.action.variant === 'danger'
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  }`}
                >
                  নিশ্চিত করুন
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InvoiceActionPanel;