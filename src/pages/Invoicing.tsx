import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  CreditCard,
  Building,
  Calculator,
  BarChart3,
  PieChart,
  Receipt,
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
  Send,
  Copy
} from 'lucide-react';
import InvoiceForm from '../components/InvoiceForm';

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  tax: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  createdDate: string;
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
}

const Invoicing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'invoices' | 'clients' | 'transactions' | 'reports'>('dashboard');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [showCreateClient, setShowCreateClient] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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
        items: [
          { id: '1', description: 'এগ্রিকালচারাল পাম্প', quantity: 2, rate: 42500, amount: 85000 }
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
        totalInvoices: 5,
        totalAmount: 1250000
      },
      {
        id: '2',
        name: 'গ্রিন এগ্রো ফার্ম',
        email: 'contact@greenagro.com',
        phone: '+880 1812-654321',
        address: 'সাভার, ঢাকা',
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
        status: 'completed'
      },
      {
        id: '2',
        type: 'expense',
        description: 'Office Rent',
        amount: 25000,
        category: 'Operating Expenses',
        date: '2024-01-01',
        status: 'completed'
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
    showNotification('success', `ইনভয়েস ${invoiceData.invoiceNumber} সফলভাবে তৈরি হয়েছে!`);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle size={16} />;
      case 'sent': return <Clock size={16} />;
      case 'overdue': return <AlertCircle size={16} />;
      case 'draft': return <FileText size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'পরিশোধিত';
      case 'sent': return 'প্রেরিত';
      case 'overdue': return 'বকেয়া';
      case 'draft': return 'খসড়া';
      default: return 'অজানা';
    }
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
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                    {getStatusIcon(invoice.status)}
                    <span className="ml-1">{getStatusText(invoice.status)}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const InvoicesTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">ইনভয়েস ম্যানেজমেন্ট</h2>
        <button
          onClick={() => setShowCreateInvoice(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>নতুন ইনভয়েস</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="ইনভয়েস বা ক্লায়েন্ট খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="all">সকল স্ট্যাটাস</option>
          <option value="draft">খসড়া</option>
          <option value="sent">প্রেরিত</option>
          <option value="paid">পরিশোধিত</option>
          <option value="overdue">বকেয়া</option>
        </select>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ইনভয়েস</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ক্লায়েন্ট</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">পরিমাণ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">স্ট্যাটাস</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">নির্ধারিত তারিখ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                      <div className="text-sm text-gray-500">{invoice.createdDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{invoice.clientName}</div>
                      <div className="text-sm text-gray-500">{invoice.clientEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(invoice.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      <span className="ml-1">{getStatusText(invoice.status)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.dueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900" title="দেখুন">
                        <Eye size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-900" title="সম্পাদনা">
                        <Edit size={16} />
                      </button>
                      <button className="text-purple-600 hover:text-purple-900" title="কপি">
                        <Copy size={16} />
                      </button>
                      <button className="text-orange-600 hover:text-orange-900" title="পাঠান">
                        <Send size={16} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900" title="ডাউনলোড">
                        <Download size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-900" title="মুছুন">
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

  const ClientsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">ক্লায়েন্ট ম্যানেজমেন্ট</h2>
        <button
          onClick={() => setShowCreateClient(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>নতুন ক্লায়েন্ট</span>
        </button>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Building className="text-blue-600" size={24} />
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-blue-600 hover:text-blue-900">
                  <Edit size={16} />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">{client.name}</h3>
            <p className="text-sm text-gray-600 mb-1">{client.email}</p>
            <p className="text-sm text-gray-600 mb-4">{client.phone}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">মোট ইনভয়েস</p>
                <p className="font-semibold">{client.totalInvoices}</p>
              </div>
              <div>
                <p className="text-gray-500">মোট পরিমাণ</p>
                <p className="font-semibold">{formatCurrency(client.totalAmount)}</p>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">লেনদেন ট্র্যাকিং</h2>
        <button
          onClick={() => setShowAddTransaction(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>নতুন লেনদেন</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">মোট আয়</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(dashboardStats.monthlyIncome)}</p>
            </div>
            <ArrowUpRight className="text-green-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">মোট খরচ</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(dashboardStats.monthlyExpenses)}</p>
            </div>
            <ArrowDownRight className="text-red-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">নেট লাভ</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(dashboardStats.monthlyIncome - dashboardStats.monthlyExpenses)}
              </p>
            </div>
            <Calculator className="text-blue-600" size={24} />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">তারিখ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">বিবরণ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ক্যাটেগরি</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">টাইপ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">পরিমাণ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type === 'income' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      <span className="ml-1">{transaction.type === 'income' ? 'আয়' : 'খরচ'}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status === 'completed' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      <span className="ml-1">{transaction.status === 'completed' ? 'সম্পন্ন' : 'অপেক্ষমাণ'}</span>
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
      <h2 className="text-2xl font-bold">আর্থিক রিপোর্ট</h2>
      
      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">আয়-ব্যয় রিপোর্ট</h3>
            <BarChart3 className="text-blue-600" size={24} />
          </div>
          <p className="text-gray-600 mb-4">মাসিক আয় এবং ব্যয়ের বিস্তারিত বিশ্লেষণ</p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
            রিপোর্ট দেখুন
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">ট্যাক্স রিপোর্ট</h3>
            <Receipt className="text-green-600" size={24} />
          </div>
          <p className="text-gray-600 mb-4">ভ্যাট এবং ট্যাক্স গণনার বিস্তারিত</p>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
            রিপোর্ট দেখুন
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">ক্লায়েন্ট রিপোর্ট</h3>
            <PieChart className="text-purple-600" size={24} />
          </div>
          <p className="text-gray-600 mb-4">ক্লায়েন্ট-ভিত্তিক বিক্রয় বিশ্লেষণ</p>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors">
            রিপোর্ট দেখুন
          </button>
        </div>
      </div>

      {/* Integration Options */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">ইন্টিগ্রেশন অপশন</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <CreditCard className="mx-auto mb-2 text-blue-600" size={32} />
            <h4 className="font-medium">পেমেন্ট গেটওয়ে</h4>
            <p className="text-sm text-gray-600">bKash, Nagad, DBBL</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Building className="mx-auto mb-2 text-green-600" size={32} />
            <h4 className="font-medium">ব্যাংকিং</h4>
            <p className="text-sm text-gray-600">সকল প্রধান ব্যাংক</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Calculator className="mx-auto mb-2 text-purple-600" size={32} />
            <h4 className="font-medium">অ্যাকাউন্টিং</h4>
            <p className="text-sm text-gray-600">QuickBooks, Tally</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <FileText className="mx-auto mb-2 text-orange-600" size={32} />
            <h4 className="font-medium">ডকুমেন্ট</h4>
            <p className="text-sm text-gray-600">Google Drive, Dropbox</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ইনভয়েসিং ও অ্যাকাউন্টিং সিস্টেম</h1>
          <p className="text-gray-600">আপনার ব্যবসার সম্পূর্ণ আর্থিক ব্যবস্থাপনা</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
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
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'dashboard' && <DashboardTab />}
            {activeTab === 'invoices' && <InvoicesTab />}
            {activeTab === 'clients' && <ClientsTab />}
            {activeTab === 'transactions' && <TransactionsTab />}
            {activeTab === 'reports' && <ReportsTab />}
          </motion.div>
        </AnimatePresence>

        {/* Invoice Form Modal */}
        <InvoiceForm
          isOpen={showCreateInvoice}
          onClose={() => setShowCreateInvoice(false)}
          onSave={handleCreateInvoice}
          clients={clients}
        />

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-24 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm"
            >
              <div className={`flex items-center space-x-2 ${
                notification.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
                {notification.type === 'success' ? (
                  <CheckCircle size={20} />
                ) : (
                  <AlertCircle size={20} />
                )}
                <span className="font-medium">{notification.message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Invoicing;