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
import { InvoiceDatabase } from '../services/invoiceDatabase';

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

  // Load data from database
  useEffect(() => {
    loadInvoices();
    loadClients();
    loadTransactions();
  }, []);

  const loadInvoices = async () => {
    const { data, error } = await InvoiceDatabase.getInvoices();
    if (error) {
      console.error('Error loading invoices:', error);
      showNotification('error', 'ইনভয়েস লোড করতে ব্যর্থ হয়েছে');
      return;
    }
    if (data && data.length > 0) {
      const formattedInvoices = data.map((inv: any) => ({
        id: inv.id,
        invoiceNumber: inv.invoice_number,
        clientName: inv.client_name,
        clientEmail: inv.client_email,
        amount: Number(inv.subtotal),
        tax: Number(inv.tax_amount),
        totalAmount: Number(inv.total_amount),
        status: inv.status as InvoiceStatus,
        dueDate: inv.due_date,
        createdDate: inv.invoice_date,
        paidDate: inv.paid_date,
        partialPaymentAmount: inv.paid_amount ? Number(inv.paid_amount) : undefined,
        remindersSent: inv.reminders_sent || 0,
        items: inv.items || []
      }));
      setInvoices(formattedInvoices);
    }
  };

  const loadClients = async () => {
    const { data, error } = await InvoiceDatabase.getClients();
    if (error) {
      console.error('Error loading clients:', error);
      return;
    }
    if (data && data.length > 0) {
      const formattedClients = data.map((client: any) => ({
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone || '',
        address: client.address || '',
        companyName: client.company_name,
        taxId: client.tax_id,
        businessType: client.business_type,
        paymentTerms: client.payment_terms,
        preferredPaymentMethod: client.preferred_payment_method,
        billingAddress: client.billing_address,
        currency: client.currency,
        language: client.language,
        emailNotifications: client.email_notifications,
        smsNotifications: client.sms_notifications,
        createdDate: client.created_at,
        totalInvoices: 0,
        totalAmount: 0
      }));
      setClients(formattedClients);
    }
  };

  const loadTransactions = async () => {
    const { data, error } = await InvoiceDatabase.getTransactions();
    if (error) {
      console.error('Error loading transactions:', error);
      return;
    }
    if (data && data.length > 0) {
      setTransactions(data);
    }
  };

  // Initialize with sample data for demo if database is empty
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
  const handleCreateInvoice = async (invoiceData: any) => {
    const invoiceToCreate = {
      invoice_number: invoiceData.invoiceNumber,
      client_name: invoiceData.clientName,
      client_email: invoiceData.clientEmail,
      client_phone: invoiceData.clientPhone,
      client_address: invoiceData.clientAddress,
      invoice_date: invoiceData.invoiceDate,
      due_date: invoiceData.dueDate,
      status: invoiceData.status as InvoiceStatus,
      subtotal: invoiceData.subtotal,
      tax_rate: invoiceData.taxRate || 15,
      tax_amount: invoiceData.taxAmount,
      discount: invoiceData.discount || 0,
      total_amount: invoiceData.totalAmount,
      currency: 'BDT',
      notes: invoiceData.notes,
      terms: invoiceData.terms,
      items: invoiceData.items
    };

    const { data, error } = await InvoiceDatabase.createInvoice(invoiceToCreate);

    if (error) {
      console.error('Error creating invoice:', error);
      showNotification('error', 'ইনভয়েস তৈরি করতে ব্যর্থ হয়েছে!');
      return;
    }

    if (data) {
      // Reload invoices from database
      await loadInvoices();

      // Update live preview with new invoice
      setPreviewContent({
        type: 'invoice',
        data: data,
        timestamp: new Date().toISOString(),
        version: 1
      });

      showNotification('success', `ইনভয়েস ${invoiceData.invoiceNumber} সফলভাবে তৈরি হয়েছে!`);
    }
  };

  // Handle new client creation
  const handleCreateClient = async (clientData: any) => {
    const clientToSave = {
      name: clientData.name,
      email: clientData.email,
      phone: clientData.phone,
      address: clientData.address,
      company_name: clientData.companyName,
      tax_id: clientData.taxId,
      business_type: clientData.businessType,
      payment_terms: clientData.paymentTerms,
      preferred_payment_method: clientData.preferredPaymentMethod,
      billing_address: clientData.billingAddress,
      currency: clientData.currency,
      language: clientData.language,
      email_notifications: clientData.emailNotifications,
      sms_notifications: clientData.smsNotifications
    };

    if (editingClient) {
      const { data, error } = await InvoiceDatabase.updateClient(editingClient.id, clientToSave);
      if (error) {
        showNotification('error', 'ক্লায়েন্ট আপডেট করতে ব্যর্থ হয়েছে!');
        return;
      }
      showNotification('success', `ক্লায়েন্ট ${clientData.name} সফলভাবে আপডেট হয়েছে!`);
      setEditingClient(null);
    } else {
      const { data, error } = await InvoiceDatabase.createClient(clientToSave);
      if (error) {
        showNotification('error', 'ক্লায়েন্ট তৈরি করতে ব্যর্থ হয়েছে!');
        return;
      }
      showNotification('success', `নতুন ক্লায়েন্ট ${clientData.name} সফলভাবে যোগ করা হয়েছে!`);
    }

    // Reload clients
    await loadClients();
  };

  // Handle new transaction creation
  const handleCreateTransaction = async (transactionData: any) => {
    const { data, error } = await InvoiceDatabase.createTransaction(transactionData);

    if (error) {
      showNotification('error', 'লেনদেন তৈরি করতে ব্যর্থ হয়েছে!');
      return;
    }

    await loadTransactions();
    showNotification('success', `নতুন ${transactionData.type === 'income' ? 'আয়' : 'ব্যয়'} লেনদেন যোগ করা হয়েছে!`);

    // Update live preview with new transaction
    setPreviewContent({
      type: 'transaction',
      data: data,
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
  const handleDeleteClient = async (clientId: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই ক্লায়েন্টকে মুছে ফেলতে চান?')) {
      const { error } = await InvoiceDatabase.deleteClient(clientId);
      if (error) {
        showNotification('error', 'ক্লায়েন্ট মুছতে ব্যর্থ হয়েছে!');
        return;
      }
      await loadClients();
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
            className="flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-lg transition-colors"
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
              <p className="text-2xl font-bold text-teal-600">{dashboardStats.totalClients}</p>
            </div>
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
              <Users className="text-teal-600" size={24} />
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
                    <span className="ml-1 text-xs">{getStatusLabel(invoice.status)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const InvoicesTab = () => {
    const filteredInvoices = invoices.filter(invoice => {
      const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    return (
      <div className="space-y-6">
        {/* Search and Filter */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="ইনভয়েস বা ক্লায়েন্ট খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">সব স্ট্যাটাস</option>
                  <option value="draft">খসড়া</option>
                  <option value="sent">পাঠানো</option>
                  <option value="paid">পরিশোধিত</option>
                  <option value="overdue">বকেয়া</option>
                  <option value="cancelled">বাতিল</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => setShowCreateInvoice(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
              <span>নতুন ইনভয়েস</span>
            </button>
          </div>
        </div>

        {/* Invoices List */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
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
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="text-gray-400 mr-2" size={16} />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                          <div className="text-sm text-gray-500">{invoice.createdDate}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{invoice.clientName}</div>
                      <div className="text-sm text-gray-500">{invoice.clientEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(invoice.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.dueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye size={16} />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Edit size={16} />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const ClientsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h2 className="text-xl font-semibold">ক্লায়েন্ট ম্যানেজমেন্ট</h2>
          <button
            onClick={() => setShowCreateClient(true)}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>নতুন ক্লায়েন্ট</span>
          </button>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{client.name}</h3>
                  <p className="text-sm text-gray-600">{client.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditClient(client)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteClient(client.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">মোট ইনভয়েস:</span>
                <span className="font-medium">{client.totalInvoices}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">মোট পরিমাণ:</span>
                <span className="font-medium">{formatCurrency(client.totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">ফোন:</span>
                <span className="font-medium">{client.phone}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const TransactionsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h2 className="text-xl font-semibold">লেনদেন ইতিহাস</h2>
          <button
            onClick={() => setShowAddTransaction(true)}
            className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>নতুন লেনদেন</span>
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  তারিখ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  বিবরণ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ধরন
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  পরিমাণ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  স্ট্যাটাস
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                    <div className="text-sm text-gray-500">{transaction.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type === 'income' ? 'আয়' : 'ব্যয়'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status === 'completed' ? 'সম্পন্ন' : 'অপেক্ষমান'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ReportsTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">রিপোর্ট ও বিশ্লেষণ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center p-6 border border-gray-200 rounded-lg">
            <BarChart3 className="mx-auto mb-4 text-blue-600" size={48} />
            <h3 className="font-semibold mb-2">বিক্রয় রিপোর্ট</h3>
            <p className="text-sm text-gray-600">মাসিক এবং বার্ষিক বিক্রয় বিশ্লেষণ</p>
          </div>
          <div className="text-center p-6 border border-gray-200 rounded-lg">
            <PieChart className="mx-auto mb-4 text-green-600" size={48} />
            <h3 className="font-semibold mb-2">ক্লায়েন্ট বিশ্লেষণ</h3>
            <p className="text-sm text-gray-600">শীর্ষ ক্লায়েন্ট এবং পেমেন্ট প্যাটার্ন</p>
          </div>
          <div className="text-center p-6 border border-gray-200 rounded-lg">
            <Receipt className="mx-auto mb-4 text-teal-600" size={48} />
            <h3 className="font-semibold mb-2">ট্যাক্স রিপোর্ট</h3>
            <p className="text-sm text-gray-600">ট্যাক্স গণনা এবং সারসংক্ষেপ</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Calculator className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-900">ইনভয়েস ম্যানেজমেন্ট</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCalculationPanel(true)}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors"
              >
                <Calculator size={16} />
                <span>ক্যালকুলেটর</span>
              </button>
              <button
                onClick={() => setShowPreview(true)}
                className="flex items-center space-x-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg transition-colors"
              >
                <Eye size={16} />
                <span>প্রিভিউ</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: BarChart3 },
              { id: 'invoices', label: 'ইনভয়েস', icon: FileText },
              { id: 'clients', label: 'ক্লায়েন্ট', icon: Users },
              { id: 'transactions', label: 'লেনদেন', icon: DollarSign },
              { id: 'reports', label: 'রিপোর্ট', icon: TrendingUp }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && <DashboardTab />}
            {activeTab === 'invoices' && <InvoicesTab />}
            {activeTab === 'clients' && <ClientsTab />}
            {activeTab === 'transactions' && <TransactionsTab />}
            {activeTab === 'reports' && <ReportsTab />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCreateInvoice && (
          <InvoiceForm
            isOpen={showCreateInvoice}
            onClose={() => setShowCreateInvoice(false)}
            onSubmit={handleCreateInvoice}
            clients={clients}
          />
        )}
        
        {showCreateClient && (
          <ClientForm
            onClose={() => {
              setShowCreateClient(false);
              setEditingClient(null);
            }}
            onSubmit={handleCreateClient}
            editingClient={editingClient}
          />
        )}
        
        {showAddTransaction && (
          <TransactionForm
            onClose={() => setShowAddTransaction(false)}
            onSubmit={handleCreateTransaction}
          />
        )}
        
        {showCalculationPanel && (
          <InvoiceCalculationPanel
            onClose={() => setShowCalculationPanel(false)}
          />
        )}
        
        {showPreview && previewContent && (
          <PreviewManager
            content={previewContent}
            onClose={() => setShowPreview(false)}
          />
        )}
      </AnimatePresence>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className={`p-4 rounded-lg shadow-lg ${
              notification.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              <div className="flex items-center space-x-2">
                {notification.type === 'success' ? (
                  <CheckCircle size={20} />
                ) : (
                  <AlertCircle size={20} />
                )}
                <span>{notification.message}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Invoicing;