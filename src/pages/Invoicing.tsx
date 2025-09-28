import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FileText, DollarSign, TrendingUp, Users, Calendar, Search, Filter, Download, CreditCard as Edit, Trash2, Eye, CreditCard, Building, Calculator, BarChart3, PieChart, Receipt, Banknote, ArrowUpRight, ArrowDownRight, Send, Copy, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import InvoiceForm from '../components/InvoiceForm';
import ClientForm from '../components/ClientForm';
import TransactionForm from '../components/TransactionForm';
import InvoiceCalculationPanel from '../components/InvoiceCalculationPanel';
import { useInvoiceCalculations } from '../hooks/useInvoiceCalculations';
import PreviewManager from '../components/PreviewManager';
import { PreviewContent } from '../hooks/useLivePreview';
import StatusBadge from '../components/StatusBadge';
import InvoiceStatusIndicator from '../components/InvoiceStatusIndicator';
import { InvoiceStatus } from '../components/StatusIcon';
import StatusIcon, { getStatusLabel } from '../components/StatusIcon';

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  tax: number;
  totalAmount: number;
  status: InvoiceStatus;
  dueDate: string;
  createdDate: string;
  paidDate?: string;
  partialPaymentAmount?: number;
  remindersSent?: number;
  items: InvoiceItem[];
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  companyName?: string;
  taxId?: string;
  businessType?: string;
  paymentTerms?: string;
  preferredPaymentMethod?: string;
  billingAddress?: string;
  currency?: string;
  language?: string;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  createdDate?: string;
  totalInvoices: number;
  totalAmount: number;
}

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category: string;
  date: string;
  status: 'completed' | 'pending';
  notes?: string;
}

const Invoicing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'invoices' | 'clients' | 'transactions' | 'reports'>('dashboard');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [showCreateClient, setShowCreateClient] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCalculationPanel, setShowCalculationPanel] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [previewContent, setPreviewContent] = useState<PreviewContent | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Invoice calculations hook
  const { calculateTotals, isCalculating } = useInvoiceCalculations();

  // Initialize with sample data
  useEffect(() => {
    const sampleInvoices: Invoice[] = [
      {
        id: '1',
        invoiceNumber: 'INV-001',
        clientName: 'ঢাকা কনস্ট্রাকশন কোম্পানি',
        clientEmail: 'info@dhakaconst.com',
        amount: 250000,
        tax: 37500,
        totalAmount: 287500,
        status: 'paid',
        dueDate: '2024-01-15',
        createdDate: '2024-01-01',
        paidDate: '2024-01-10',
        items: [
          { id: '1', description: 'হাইড্রোলিক এক্সকাভেটর', quantity: 1, rate: 250000, amount: 250000 }
        ]
      },
      {
        id: '2',
        invoiceNumber: 'INV-002',
        clientName: 'গ্রিন এগ্রো ফার্ম',
        clientEmail: 'contact@greenagro.com',
        amount: 85000,
        tax: 12750,
        totalAmount: 97750,
        status: 'sent',
        dueDate: '2024-02-01',
        createdDate: '2024-01-15',
        remindersSent: 1,
        items: [
          { id: '1', description: 'এগ্রিকালচারাল পাম্প', quantity: 2, rate: 42500, amount: 85000 }
        ]
      },
      {
        id: '3',
        invoiceNumber: 'INV-003',
        clientName: 'টেক মেশিনারিজ',
        clientEmail: 'info@techmach.com',
        amount: 200000,
        tax: 30000,
        totalAmount: 230000,
        status: 'overdue',
        dueDate: '2024-01-20',
        createdDate: '2024-01-05',
        remindersSent: 3,
        items: [
          { id: '1', description: 'ইন্ডাস্ট্রিয়াল প্রিন্টার', quantity: 1, rate: 200000, amount: 200000 }
        ]
      },
      {
        id: '4',
        invoiceNumber: 'INV-004',
        clientName: 'এগ্রো সলিউশন',
        clientEmail: 'sales@agrosol.com',
        amount: 150000,
        tax: 22500,
        totalAmount: 172500,
        status: 'partially_paid',
        dueDate: '2024-02-15',
        createdDate: '2024-01-20',
        partialPaymentAmount: 100000,
        remindersSent: 1,
        items: [
          { id: '1', description: 'স্প্রে মেশিন', quantity: 2, rate: 75000, amount: 150000 }
        ]
      },
      {
        id: '5',
        invoiceNumber: 'INV-005',
        clientName: 'বিল্ডিং সাপ্লাই',
        clientEmail: 'order@buildsupply.com',
        amount: 75000,
        tax: 11250,
        totalAmount: 86250,
        status: 'cancelled',
        dueDate: '2024-02-10',
        createdDate: '2024-01-25',
        items: [
          { id: '1', description: 'কন্ক্রিট মিক্সার', quantity: 1, rate: 75000, amount: 75000 }
        ]
      }
    ];

    const sampleClients: Client[] = [
      {
        id: '1',
        name: 'ঢাকা কনস্ট্রাকশন কোম্পানি',
        email: 'info@dhakaconst.com',
        phone: '+880 1711-123456',
        address: 'ধানমন্ডি, ঢাকা',
        companyName: 'ঢাকা কনস্ট্রাকশন কোম্পানি লিমিটেড',
        businessType: 'company',
        paymentTerms: '30',
        preferredPaymentMethod: 'bank_transfer',
        currency: 'BDT',
        language: 'bn',
        emailNotifications: true,
        smsNotifications: false,
        createdDate: '2024-01-01',
        totalInvoices: 5,
        totalAmount: 1250000
      },
      {
        id: '2',
        name: 'গ্রিন এগ্রো ফার্ম',
        email: 'contact@greenagro.com',
        phone: '+880 1812-654321',
        address: 'সাভার, ঢাকা',
        companyName: 'গ্রিন এগ্রো ফার্ম',
        businessType: 'business',
        paymentTerms: '15',
        preferredPaymentMethod: 'bkash',
        currency: 'BDT',
        language: 'bn',
        emailNotifications: true,
        smsNotifications: true,
        createdDate: '2024-01-15',
        totalInvoices: 3,
        totalAmount: 450000
      }
    ];

    const sampleTransactions: Transaction[] = [
      {
        id: '1',
        type: 'income',
        description: 'Invoice Payment - INV-001',
        amount: 287500,
        category: 'Sales',
        date: '2024-01-15',
        status: 'completed',
        notes: 'Payment received via bank transfer'
      },
      {
        id: '2',
        type: 'expense',
        description: 'Office Rent',
        amount: 25000,
        category: 'Operating Expenses',
        date: '2024-01-01',
        status: 'completed',
        notes: 'Monthly office rent payment'
      }
    ];

    setInvoices(sampleInvoices);
    setClients(sampleClients);
    setTransactions(sampleTransactions);
  }, []);

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Handle new invoice creation
  const handleCreateInvoice = (invoiceData: any) => {
    const newInvoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: invoiceData.invoiceNumber,
      clientName: invoiceData.clientName,
      clientEmail: invoiceData.clientEmail,
      amount: invoiceData.subtotal,
      tax: invoiceData.taxAmount,
      totalAmount: invoiceData.totalAmount,
      status: invoiceData.status,
      dueDate: invoiceData.dueDate,
      createdDate: invoiceData.invoiceDate,
      items: invoiceData.items
    };

    setInvoices(prev => [newInvoice, ...prev]);
    
    // Update live preview with new invoice
    setPreviewContent({
      type: 'invoice',
      data: newInvoice,
      timestamp: new Date().toISOString(),
      version: 1
    });
    
    showNotification('success', `ইনভয়েস ${invoiceData.invoiceNumber} সফলভাবে তৈরি হয়েছে!`);
  };

  // Handle new client creation
  const handleCreateClient = (clientData: any) => {
    const newClient: Client = {
      id: clientData.id,
      name: clientData.name,
      email: clientData.email,
      phone: clientData.phone,
      address: clientData.address,
      companyName: clientData.companyName,
      taxId: clientData.taxId,
      businessType: clientData.businessType,
      paymentTerms: clientData.paymentTerms,
      preferredPaymentMethod: clientData.preferredPaymentMethod,
      billingAddress: clientData.billingAddress,
      currency: clientData.currency,
      language: clientData.language,
      emailNotifications: clientData.emailNotifications,
      smsNotifications: clientData.smsNotifications,
      createdDate: clientData.createdDate,
      totalInvoices: clientData.totalInvoices,
      totalAmount: clientData.totalAmount
    };

    if (editingClient) {
      setClients(prev => prev.map(client => client.id === editingClient.id ? newClient : client));
      showNotification('success', `ক্লায়েন্ট ${clientData.name} সফলভাবে আপডেট হয়েছে!`);
      setEditingClient(null);
    } else {
      setClients(prev => [newClient, ...prev]);
      showNotification('success', `নতুন ক্লায়েন্ট ${clientData.name} সফলভাবে যোগ করা হয়েছে!`);
    }

    // Update live preview with new client
    setPreviewContent({
      type: 'client',
      data: newClient,
      timestamp: new Date().toISOString(),
      version: 1
    });

    // Add invoices if any were created during client setup
    if (clientData.invoices && clientData.invoices.length > 0) {
      const newInvoices = clientData.invoices.map((invoice: any) => ({
        ...invoice,
        clientName: clientData.name,
        clientEmail: clientData.email,
        createdDate: new Date().toISOString().split('T')[0]
      }));
      setInvoices(prev => [...newInvoices, ...prev]);
      showNotification('success', `${clientData.invoices.length}টি ইনভয়েস যোগ করা হয়েছে!`);
    }
  };

  // Handle new transaction creation
  const handleCreateTransaction = (transactionData: any) => {
    const newTransaction: Transaction = {
      id: transactionData.id,
      type: transactionData.type,
      description: transactionData.description,
      amount: transactionData.amount,
      category: transactionData.category,
      date: transactionData.date,
      status: transactionData.status,
      notes: transactionData.notes
    };

    setTransactions(prev => [newTransaction, ...prev]);
    showNotification('success', `নতুন ${transactionData.type === 'income' ? 'আয়' : 'ব্যয়'} লেনদেন যোগ করা হয়েছে!`);
    
    // Update live preview with new transaction
    setPreviewContent({
      type: 'transaction',
      data: newTransaction,
      timestamp: new Date().toISOString(),
      version: 1
    });
  };

  // Handle client editing
  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setShowCreateClient(true);
  };

  // Handle client deletion
  const handleDeleteClient = (clientId: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই ক্লায়েন্টকে মুছে ফেলতে চান?')) {
      setClients(prev => prev.filter(client => client.id !== clientId));
      showNotification('success', 'ক্লায়েন্ট সফলভাবে মুছে ফেলা হয়েছে!');
    }
  };

  // Calculate dashboard statistics
  const dashboardStats = {
    totalRevenue: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.totalAmount, 0),
    pendingAmount: invoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.totalAmount, 0),
    totalInvoices: invoices.length,
    paidInvoices: invoices.filter(inv => inv.status === 'paid').length,
    overdueInvoices: invoices.filter(inv => inv.status === 'overdue').length,
    totalClients: clients.length,
    monthlyIncome: transactions.filter(t => t.type === 'income' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    monthlyExpenses: transactions.filter(t => t.type === 'expense' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0)
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const DashboardTab = () => (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">দ্রুত অ্যাকশন</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowCreateInvoice(true)}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>নতুন ইনভয়েস</span>
          </button>
          <button
            onClick={() => setShowCreateClient(true)}
            className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors"
          >
            <Users size={20} />
            <span>নতুন ক্লায়েন্ট</span>
          </button>
          <button
            onClick={() => setShowAddTransaction(true)}
            className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition-colors"
          >
            <DollarSign size={20} />
            <span>নতুন লেনদেন</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">মোট আয়</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(dashboardStats.totalRevenue)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">বকেয়া পরিমাণ</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(dashboardStats.pendingAmount)}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Clock className="text-orange-600" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">মোট ইনভয়েস</p>
              <p className="text-2xl font-bold text-blue-600">{dashboardStats.totalInvoices}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="text-blue-600" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">মোট ক্লায়েন্ট</p>
              <p className="text-2xl font-bold text-purple-600">{dashboardStats.totalClients}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">আয় বনাম খরচ</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ArrowUpRight className="text-green-500" size={20} />
                <span>মাসিক আয়</span>
              </div>
              <span className="font-semibold text-green-600">{formatCurrency(dashboardStats.monthlyIncome)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ArrowDownRight className="text-red-500" size={20} />
                <span>মাসিক খরচ</span>
              </div>
              <span className="font-semibold text-red-600">{formatCurrency(dashboardStats.monthlyExpenses)}</span>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="font-medium">নেট লাভ</span>
                <span className="font-bold text-blue-600">
                  {formatCurrency(dashboardStats.monthlyIncome - dashboardStats.monthlyExpenses)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">সাম্প্রতিক ইনভয়েস</h3>
          <div className="space-y-3">
            {invoices.slice(0, 5).map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium">{invoice.invoiceNumber}</p>
                  <p className="text-sm text-gray-600">{invoice.clientName}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(invoice.totalAmount)}</p>
                  <div className="flex items-center justify-end">
                    <StatusIcon status={invoice.status} size="sm" />
                    <span className="ml-1 text-xs">{getStatusLabel