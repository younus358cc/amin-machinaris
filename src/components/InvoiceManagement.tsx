import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, CreditCard as Edit, Trash2, Download, Copy, Send, Mail, FileText, DollarSign, Calendar, User, MoreVertical, Filter, Search, Plus, Archive, Printer, MessageSquare, History, CreditCard, RefreshCw, Settings, Shield, ChevronDown, X, CheckCircle, AlertCircle } from 'lucide-react';
import StatusIcon, { InvoiceStatus } from './StatusIcon';
import StatusBadge from './StatusBadge';
import InvoiceStatusIndicator from './InvoiceStatusIndicator';
import StatusSelector from './StatusSelector';

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  currency: string;
  notes?: string;
  lineItems: InvoiceLineItem[];
  paymentHistory: PaymentRecord[];
  lastSent?: string;
  remindersSent: number;
  partialPaymentAmount?: number;
  paidDate?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  method: string;
  reference?: string;
  notes?: string;
}

interface InvoiceAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: (invoice: Invoice) => void;
  variant: 'primary' | 'secondary' | 'danger' | 'success';
  permission?: string;
  confirmationRequired?: boolean;
  confirmationMessage?: string;
}

interface UserPermissions {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canSend: boolean;
  canExport: boolean;
  canManagePayments: boolean;
  isAdmin: boolean;
}

interface InvoiceManagementProps {
  userPermissions: UserPermissions;
  onInvoiceAction: (action: string, invoice: Invoice | Invoice[]) => void;
}

const InvoiceManagement: React.FC<InvoiceManagementProps> = ({ 
  userPermissions, 
  onInvoiceAction 
}) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant: 'danger' | 'warning' | 'info';
  }>({
    show: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'info'
  });

  // Sample data initialization
  useEffect(() => {
    const sampleInvoices: Invoice[] = [
      {
        id: '1',
        invoiceNumber: 'INV-2024-001',
        clientName: 'ঢাকা কনস্ট্রাকশন কোম্পানি',
        clientEmail: 'info@dhakaconst.com',
        clientPhone: '+880 1711-123456',
        issueDate: '2024-01-15',
        dueDate: '2024-02-15',
        status: 'sent',
        subtotal: 250000,
        tax: 37500,
        discount: 0,
        totalAmount: 287500,
        currency: 'BDT',
        notes: 'Payment terms: 30 days',
        lineItems: [
          { id: '1', description: 'হাইড্রোলিক এক্সকাভেটর', quantity: 1, rate: 250000, amount: 250000 }
        ],
        paymentHistory: [],
        remindersSent: 1,
        createdBy: 'admin',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        invoiceNumber: 'INV-2024-002',
        clientName: 'গ্রিন এগ্রো ফার্ম',
        clientEmail: 'contact@greenagro.com',
        clientPhone: '+880 1812-654321',
        issueDate: '2024-01-20',
        dueDate: '2024-02-05',
        status: 'paid',
        subtotal: 85000,
        tax: 12750,
        discount: 5000,
        totalAmount: 92750,
        paidDate: '2024-02-01',
        currency: 'BDT',
        lineItems: [
          { id: '1', description: 'এগ্রিকালচারাল পাম্প', quantity: 2, rate: 42500, amount: 85000 }
        ],
        paymentHistory: [
          { id: '1', amount: 92750, date: '2024-02-01', method: 'Bank Transfer', reference: 'TXN123456' }
        ],
        remindersSent: 0,
        createdBy: 'admin',
        createdAt: '2024-01-20T14:30:00Z',
        updatedAt: '2024-02-01T09:15:00Z'
      },
      {
        id: '3',
        invoiceNumber: 'INV-2024-003',
        clientName: 'টেক্সটাইল মিলস লিমিটেড',
        clientEmail: 'admin@textilemill.com',
        issueDate: '2024-01-10',
        dueDate: '2024-01-25',
        status: 'overdue',
        subtotal: 150000,
        tax: 22500,
        discount: 0,
        totalAmount: 172500,
        currency: 'BDT',
        lineItems: [
          { id: '1', description: 'ইন্ডাস্ট্রিয়াল জেনারেটর', quantity: 1, rate: 150000, amount: 150000 }
        ],
        paymentHistory: [],
        remindersSent: 3,
        createdBy: 'admin',
        createdAt: '2024-01-10T11:20:00Z',
        updatedAt: '2024-01-26T16:45:00Z'
      },
      {
        id: '4',
        invoiceNumber: 'INV-2024-004',
        clientName: 'স্মার্ট ইন্ডাস্ট্রিজ',
        clientEmail: 'info@smartind.com',
        clientPhone: '+880 1913-789012',
        issueDate: '2024-01-25',
        dueDate: '2024-02-25',
        status: 'partially_paid',
        subtotal: 120000,
        tax: 18000,
        discount: 0,
        totalAmount: 138000,
        partialPaymentAmount: 70000,
        currency: 'BDT',
        lineItems: [
          { id: '1', description: 'কম্প্রেসার মেশিন', quantity: 1, rate: 120000, amount: 120000 }
        ],
        paymentHistory: [
          { id: '1', amount: 70000, date: '2024-02-10', method: 'bKash', reference: 'BKS789012' }
        ],
        remindersSent: 1,
        createdBy: 'admin',
        createdAt: '2024-01-25T09:30:00Z',
        updatedAt: '2024-02-10T14:20:00Z'
      },
      {
        id: '5',
        invoiceNumber: 'INV-2024-005',
        clientName: 'নিউ এন্টারপ্রাইজ',
        clientEmail: 'contact@newent.com',
        issueDate: '2024-02-01',
        dueDate: '2024-03-01',
        status: 'draft',
        subtotal: 95000,
        tax: 14250,
        discount: 0,
        totalAmount: 109250,
        currency: 'BDT',
        lineItems: [
          { id: '1', description: 'ওয়েল্ডিং মেশিন', quantity: 1, rate: 95000, amount: 95000 }
        ],
        paymentHistory: [],
        remindersSent: 0,
        createdBy: 'admin',
        createdAt: '2024-02-01T11:00:00Z',
        updatedAt: '2024-02-01T11:00:00Z'
      }
    ];
    setInvoices(sampleInvoices);
  }, []);

  // Define invoice actions based on user permissions
  const getInvoiceActions = (invoice: Invoice): InvoiceAction[] => {
    const actions: InvoiceAction[] = [];

    // View action - always available if user can view
    if (userPermissions.canView) {
      actions.push({
        id: 'view',
        label: 'বিস্তারিত দেখুন',
        icon: <Eye size={16} />,
        onClick: (inv) => handleViewInvoice(inv),
        variant: 'secondary'
      });
    }

    // Preview action
    if (userPermissions.canView) {
      actions.push({
        id: 'preview',
        label: 'প্রিভিউ',
        icon: <FileText size={16} />,
        onClick: (inv) => handlePreviewInvoice(inv),
        variant: 'secondary'
      });
    }

    // Edit action
    if (userPermissions.canEdit && invoice.status !== 'paid') {
      actions.push({
        id: 'edit',
        label: 'সম্পাদনা',
        icon: <Edit size={16} />,
        onClick: (inv) => handleEditInvoice(inv),
        variant: 'primary'
      });
    }

    // Duplicate action
    if (userPermissions.canEdit) {
      actions.push({
        id: 'duplicate',
        label: 'কপি করুন',
        icon: <Copy size={16} />,
        onClick: (inv) => handleDuplicateInvoice(inv),
        variant: 'secondary'
      });
    }

    // Send action
    if (userPermissions.canSend && invoice.status !== 'paid') {
      actions.push({
        id: 'send',
        label: 'পাঠান',
        icon: <Send size={16} />,
        onClick: (inv) => handleSendInvoice(inv),
        variant: 'primary'
      });
    }

    // Send reminder
    if (userPermissions.canSend && (invoice.status === 'sent' || invoice.status === 'overdue')) {
      actions.push({
        id: 'reminder',
        label: 'রিমাইন্ডার পাঠান',
        icon: <Mail size={16} />,
        onClick: (inv) => handleSendReminder(inv),
        variant: 'secondary'
      });
    }

    // Payment actions
    if (userPermissions.canManagePayments) {
      if (invoice.status !== 'paid') {
        actions.push({
          id: 'mark-paid',
          label: 'পরিশোধিত চিহ্নিত করুন',
          icon: <CheckCircle size={16} />,
          onClick: (inv) => handleMarkAsPaid(inv),
          variant: 'success'
        });
      }

      actions.push({
        id: 'payment-history',
        label: 'পেমেন্ট হিস্টরি',
        icon: <History size={16} />,
        onClick: (inv) => handleViewPaymentHistory(inv),
        variant: 'secondary'
      });
    }

    // Export actions
    if (userPermissions.canExport) {
      actions.push({
        id: 'download-pdf',
        label: 'PDF ডাউনলোড',
        icon: <Download size={16} />,
        onClick: (inv) => handleDownloadPDF(inv),
        variant: 'secondary'
      });

      actions.push({
        id: 'download-excel',
        label: 'Excel ডাউনলোড',
        icon: <FileText size={16} />,
        onClick: (inv) => handleDownloadExcel(inv),
        variant: 'secondary'
      });

      actions.push({
        id: 'print',
        label: 'প্রিন্ট',
        icon: <Printer size={16} />,
        onClick: (inv) => handlePrintInvoice(inv),
        variant: 'secondary'
      });
    }

    // Notes action
    if (userPermissions.canEdit) {
      actions.push({
        id: 'add-notes',
        label: 'নোট যোগ করুন',
        icon: <MessageSquare size={16} />,
        onClick: (inv) => handleAddNotes(inv),
        variant: 'secondary'
      });
    }

    // Archive action
    if (userPermissions.canDelete) {
      actions.push({
        id: 'archive',
        label: 'আর্কাইভ',
        icon: <Archive size={16} />,
        onClick: (inv) => handleArchiveInvoice(inv),
        variant: 'secondary',
        confirmationRequired: true,
        confirmationMessage: 'আপনি কি এই ইনভয়েসটি আর্কাইভ করতে চান?'
      });
    }

    // Delete action
    if (userPermissions.canDelete && userPermissions.isAdmin) {
      actions.push({
        id: 'delete',
        label: 'মুছে ফেলুন',
        icon: <Trash2 size={16} />,
        onClick: (inv) => handleDeleteInvoice(inv),
        variant: 'danger',
        confirmationRequired: true,
        confirmationMessage: 'আপনি কি নিশ্চিত যে এই ইনভয়েসটি স্থায়ীভাবে মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।'
      });
    }

    return actions;
  };

  // Action handlers
  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    onInvoiceAction('view', invoice);
  };

  const handlePreviewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPreview(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    onInvoiceAction('edit', invoice);
  };

  const handleDuplicateInvoice = (invoice: Invoice) => {
    onInvoiceAction('duplicate', invoice);
  };

  const handleSendInvoice = (invoice: Invoice) => {
    onInvoiceAction('send', invoice);
  };

  const handleSendReminder = (invoice: Invoice) => {
    onInvoiceAction('send-reminder', invoice);
  };

  const handleMarkAsPaid = (invoice: Invoice) => {
    onInvoiceAction('mark-paid', invoice);
  };

  const handleViewPaymentHistory = (invoice: Invoice) => {
    onInvoiceAction('payment-history', invoice);
  };

  const handleDownloadPDF = (invoice: Invoice) => {
    onInvoiceAction('download-pdf', invoice);
  };

  const handleDownloadExcel = (invoice: Invoice) => {
    onInvoiceAction('download-excel', invoice);
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    onInvoiceAction('print', invoice);
  };

  const handleAddNotes = (invoice: Invoice) => {
    onInvoiceAction('add-notes', invoice);
  };

  const handleArchiveInvoice = (invoice: Invoice) => {
    onInvoiceAction('archive', invoice);
  };

  const handleDeleteInvoice = (invoice: Invoice) => {
    onInvoiceAction('delete', invoice);
  };

  // Handle status change
  const handleStatusChange = (invoice: Invoice, newStatus: InvoiceStatus) => {
    // Update the invoice status locally
    setInvoices(prev => prev.map(inv => 
      inv.id === invoice.id 
        ? { ...inv, status: newStatus, updatedAt: new Date().toISOString() }
        : inv
    ));
    
    // Trigger action for external handling
    onInvoiceAction('status-change', { ...invoice, status: newStatus });
  };

  // Bulk actions
  const handleBulkAction = (action: string) => {
    const selectedInvoiceObjects = invoices.filter(inv => selectedInvoices.includes(inv.id));
    onInvoiceAction(`bulk-${action}`, selectedInvoiceObjects);
    setSelectedInvoices([]);
    setShowBulkActions(false);
  };

  const formatCurrency = (amount: number, currency: string = 'BDT') => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bn-BD');
  };

  // Filter and sort invoices
  const filteredInvoices = invoices
    .filter(invoice => {
      const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.issueDate).getTime();
          bValue = new Date(b.issueDate).getTime();
          break;
        case 'amount':
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        case 'client':
          aValue = a.clientName.toLowerCase();
          bValue = b.clientName.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a.invoiceNumber;
          bValue = b.invoiceNumber;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const executeAction = (action: InvoiceAction, invoice: Invoice) => {
    if (action.confirmationRequired) {
      setConfirmationDialog({
        show: true,
        title: action.label,
        message: action.confirmationMessage || 'আপনি কি নিশ্চিত?',
        onConfirm: () => {
          action.onClick(invoice);
          setConfirmationDialog({ ...confirmationDialog, show: false });
        },
        variant: action.variant === 'danger' ? 'danger' : 'warning'
      });
    } else {
      action.onClick(invoice);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">ইনভয়েস ম্যানেজমেন্ট</h2>
            <p className="text-gray-600">সম্পূর্ণ ইনভয়েস নিয়ন্ত্রণ ও ব্যবস্থাপনা</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {userPermissions.canEdit && (
              <button
                onClick={() => onInvoiceAction('create', {} as Invoice)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={20} />
                <span>নতুন ইনভয়েস</span>
              </button>
            )}
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              <Filter size={20} />
              <span>ফিল্টার</span>
            </button>
          </div>
        </div>

        {/* Search and Quick Filters */}
        <div className="mt-6 flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="ইনভয়েস নম্বর বা ক্লায়েন্ট নাম খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="all">সকল স্ট্যাটাস</option>
            <option value="draft">খসড়া</option>
            <option value="sent">প্রেরিত</option>
            <option value="paid">পরিশোধিত</option>
            <option value="overdue">বকেয়া</option>
            <option value="cancelled">বাতিল</option>
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="date-desc">তারিখ (নতুন প্রথম)</option>
            <option value="date-asc">তারিখ (পুরাতন প্রথম)</option>
            <option value="amount-desc">পরিমাণ (বেশি প্রথম)</option>
            <option value="amount-asc">পরিমাণ (কম প্রথম)</option>
            <option value="client-asc">ক্লায়েন্ট (A-Z)</option>
            <option value="client-desc">ক্লায়েন্ট (Z-A)</option>
          </select>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-gray-50 rounded-lg border"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">তারিখ থেকে</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">তারিখ পর্যন্ত</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">পরিমাণ সীমা</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                    <option value="">সকল পরিমাণ</option>
                    <option value="0-50000">০ - ৫০,০০০</option>
                    <option value="50000-100000">৫০,০০০ - ১,০০,০০০</option>
                    <option value="100000+">১,০০,০০০+</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedInvoices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-blue-800 font-medium">
                  {selectedInvoices.length} টি ইনভয়েস নির্বাচিত
                </span>
                <button
                  onClick={() => setSelectedInvoices([])}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  নির্বাচন বাতিল
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                {userPermissions.canSend && (
                  <button
                    onClick={() => handleBulkAction('send')}
                    className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm transition-colors"
                  >
                    <Send size={14} />
                    <span>পাঠান</span>
                  </button>
                )}
                
                {userPermissions.canExport && (
                  <button
                    onClick={() => handleBulkAction('export')}
                    className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm transition-colors"
                  >
                    <Download size={14} />
                    <span>এক্সপোর্ট</span>
                  </button>
                )}
                
                {userPermissions.canDelete && (
                  <button
                    onClick={() => handleBulkAction('archive')}
                    className="flex items-center space-x-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-sm transition-colors"
                  >
                    <Archive size={14} />
                    <span>আর্কাইভ</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invoice List */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedInvoices(filteredInvoices.map(inv => inv.id));
                      } else {
                        setSelectedInvoices([]);
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ইনভয়েস
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ক্লায়েন্ট
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  পরিমাণ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  স্ট্যাটাস
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  নির্ধারিত তারিখ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  অ্যাকশন
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => {
                const actions = getInvoiceActions(invoice);
                const primaryActions = actions.slice(0, 3);
                const secondaryActions = actions.slice(3);

                return (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedInvoices.includes(invoice.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedInvoices([...selectedInvoices, invoice.id]);
                          } else {
                            setSelectedInvoices(selectedInvoices.filter(id => id !== invoice.id));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                        <div className="text-sm text-gray-500">{formatDate(invoice.issueDate)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{invoice.clientName}</div>
                        <div className="text-sm text-gray-500">{invoice.clientEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.totalAmount, invoice.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(invoice.dueDate)}
                      {new Date(invoice.dueDate) < new Date() && invoice.status !== 'paid' && (
                        <div className="text-xs text-red-600">
                          {Math.ceil((new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24))} দিন বিলম্ব
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {/* Status Selector */}
                        <StatusSelector
                          currentStatus={invoice.status}
                          onStatusChange={(newStatus) => handleStatusChange(invoice, newStatus)}
                          disabled={false}
                          className="min-w-[120px]"
                        />
                        
                        {/* Primary Actions */}
                        {primaryActions.map((action) => (
                          <button
                            key={action.id}
                            onClick={() => executeAction(action, invoice)}
                            className={`p-1.5 rounded transition-colors ${
                              action.variant === 'primary' ? 'text-blue-600 hover:text-blue-900 hover:bg-blue-50' :
                              action.variant === 'success' ? 'text-green-600 hover:text-green-900 hover:bg-green-50' :
                              action.variant === 'danger' ? 'text-red-600 hover:text-red-900 hover:bg-red-50' :
                              'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                            title={action.label}
                          >
                            {action.icon}
                          </button>
                        ))}

                        {/* More Actions Dropdown */}
                        {secondaryActions.length > 0 && (
                          <div className="relative group">
                            <button className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors">
                              <MoreVertical size={16} />
                            </button>
                            <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                              <div className="py-1">
                                {secondaryActions.map((action) => (
                                  <button
                                    key={action.id}
                                    onClick={() => executeAction(action, invoice)}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 ${
                                      action.variant === 'danger' ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'
                                    }`}
                                  >
                                    {action.icon}
                                    <span>{action.label}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">কোন ইনভয়েস পাওয়া যায়নি</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'আপনার অনুসন্ধান বা ফিল্টার অনুযায়ী কোন ইনভয়েস পাওয়া যায়নি।'
                : 'শুরু করতে একটি নতুন ইনভয়েস তৈরি করুন।'
              }
            </p>
            {userPermissions.canEdit && !searchTerm && statusFilter === 'all' && (
              <div className="mt-6">
                <button
                  onClick={() => onInvoiceAction('create', {} as Invoice)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  নতুন ইনভয়েস তৈরি করুন
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {confirmationDialog.show && (
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
                {confirmationDialog.variant === 'danger' ? (
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <AlertCircle className="text-red-600" size={20} />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                    <AlertCircle className="text-yellow-600" size={20} />
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900">
                  {confirmationDialog.title}
                </h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                {confirmationDialog.message}
              </p>
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setConfirmationDialog({ ...confirmationDialog, show: false })}
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  বাতিল
                </button>
                <button
                  onClick={confirmationDialog.onConfirm}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    confirmationDialog.variant === 'danger'
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

      {/* Invoice Preview Modal */}
      <AnimatePresence>
        {showPreview && selectedInvoice && (
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
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">ইনভয়েস প্রিভিউ - {selectedInvoice.invoiceNumber}</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Invoice Preview Content */}
                <div className="bg-white">
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">ইনভয়েস</h1>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">বিল প্রেরণকারী:</h3>
                        <div className="text-gray-600">
                          <p className="font-semibold">আমিন মেশিনারিজ</p>
                          <p>মেলান্দহ বাজার, মাহমুদপুর রোড</p>
                          <p>জামালপুর, বাংলাদেশ</p>
                          <p>ফোন: +880 1912-658599</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">বিল প্রাপক:</h3>
                        <div className="text-gray-600">
                          <p className="font-semibold">{selectedInvoice.clientName}</p>
                          <p>{selectedInvoice.clientEmail}</p>
                          {selectedInvoice.clientPhone && <p>{selectedInvoice.clientPhone}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <p><span className="font-semibold">ইনভয়েস নম্বর:</span> {selectedInvoice.invoiceNumber}</p>
                      <p><span className="font-semibold">ইস্যু তারিখ:</span> {formatDate(selectedInvoice.issueDate)}</p>
                      <p><span className="font-semibold">নির্ধারিত তারিখ:</span> {formatDate(selectedInvoice.dueDate)}</p>
                    </div>
                    <div>
                      <p><span className="font-semibold">স্ট্যাটাস:</span> 
                        <span className="ml-2">
                          <InvoiceStatusIndicator
                            status={selectedInvoice.status}
                            dueDate={selectedInvoice.dueDate}
                            paidDate={selectedInvoice.paidDate}
                            remindersSent={selectedInvoice.remindersSent}
                            partialPaymentAmount={selectedInvoice.partialPaymentAmount}
                            totalAmount={selectedInvoice.totalAmount}
                            size="md"
                            showDetails={true}
                          />
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <table className="w-full border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left border-b">বিবরণ</th>
                          <th className="px-4 py-2 text-right border-b">পরিমাণ</th>
                          <th className="px-4 py-2 text-right border-b">দর</th>
                          <th className="px-4 py-2 text-right border-b">মোট</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedInvoice.lineItems.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-2 border-b">{item.description}</td>
                            <td className="px-4 py-2 text-right border-b">{item.quantity}</td>
                            <td className="px-4 py-2 text-right border-b">{formatCurrency(item.rate)}</td>
                            <td className="px-4 py-2 text-right border-b">{formatCurrency(item.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="w-64">
                      <div className="flex justify-between py-2">
                        <span>সাবটোটাল:</span>
                        <span>{formatCurrency(selectedInvoice.subtotal)}</span>
                      </div>
                      {selectedInvoice.discount > 0 && (
                        <div className="flex justify-between py-2">
                          <span>ছাড়:</span>
                          <span>-{formatCurrency(selectedInvoice.discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-2">
                        <span>ট্যাক্স:</span>
                        <span>{formatCurrency(selectedInvoice.tax)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-t border-gray-200 font-bold text-lg">
                        <span>মোট পরিমাণ:</span>
                        <span>{formatCurrency(selectedInvoice.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedInvoice.notes && (
                    <div className="mt-8">
                      <h3 className="font-semibold text-gray-700 mb-2">নোট:</h3>
                      <p className="text-gray-600">{selectedInvoice.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  বন্ধ করুন
                </button>
                {userPermissions.canExport && (
                  <button
                    onClick={() => handleDownloadPDF(selectedInvoice)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Download size={16} />
                    <span>PDF ডাউনলোড</span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InvoiceManagement;