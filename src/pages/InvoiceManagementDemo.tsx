import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InvoiceManagement from '../components/InvoiceManagement';
import InvoiceForm from '../components/InvoiceForm';
import StatusBadge from '../components/StatusBadge';
import InvoiceStatusIndicator from '../components/InvoiceStatusIndicator';
import StatusSelector from '../components/StatusSelector';
import { InvoiceStatus } from '../components/StatusIcon';
import PreviewManager from '../components/PreviewManager';
import PreviewDebugger from '../components/PreviewDebugger';
import { PreviewContent } from '../hooks/useLivePreview';
import { Shield, User, Settings, Eye, CreditCard as Edit, Send, Download, CreditCard, ToggleLeft, ToggleRight, CheckCircle, Bug } from 'lucide-react';

interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  description: string;
}

const InvoiceManagementDemo: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('admin');
  const [showPreviewDemo, setShowPreviewDemo] = useState(false);
  const [showDebugger, setShowDebugger] = useState(false);
  const [previewContent, setPreviewContent] = useState<PreviewContent | null>(null);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Define user roles and permissions
  const userRoles: UserRole[] = [
    {
      id: 'admin',
      name: 'অ্যাডমিনিস্ট্রেটর',
      permissions: [
        'view_invoices', 'edit_invoices', 'create_invoices', 'delete_invoices',
        'send_invoices', 'send_sms', 'manage_payments', 'manage_refunds',
        'export_invoices', 'print_invoices', 'archive_invoices', 'cancel_invoices',
        'manage_invoice_status', 'admin'
      ],
      description: 'সম্পূর্ণ অ্যাক্সেস এবং নিয়ন্ত্রণ'
    },
    {
      id: 'manager',
      name: 'ম্যানেজার',
      permissions: [
        'view_invoices', 'edit_invoices', 'create_invoices',
        'send_invoices', 'manage_payments', 'export_invoices',
        'print_invoices', 'archive_invoices', 'manage_invoice_status'
      ],
      description: 'ইনভয়েস ব্যবস্থাপনা এবং পেমেন্ট নিয়ন্ত্রণ'
    },
    {
      id: 'accountant',
      name: 'হিসাবরক্ষক',
      permissions: [
        'view_invoices', 'edit_invoices', 'create_invoices',
        'manage_payments', 'view_payments', 'export_invoices', 'print_invoices'
      ],
      description: 'আর্থিক লেনদেন এবং রিপোর্টিং'
    },
    {
      id: 'sales',
      name: 'সেলস রিপ্রেজেন্টেটিভ',
      permissions: [
        'view_invoices', 'create_invoices', 'send_invoices',
        'export_invoices', 'print_invoices'
      ],
      description: 'ইনভয়েস তৈরি এবং প্রেরণ'
    },
    {
      id: 'viewer',
      name: 'ভিউয়ার',
      permissions: ['view_invoices', 'export_invoices'],
      description: 'শুধুমাত্র দেখার অনুমতি'
    }
  ];

  const getCurrentRole = () => {
    return userRoles.find(role => role.id === selectedRole) || userRoles[0];
  };

  const getUserPermissions = () => {
    const role = getCurrentRole();
    return {
      canView: role.permissions.includes('view_invoices'),
      canEdit: role.permissions.includes('edit_invoices'),
      canDelete: role.permissions.includes('delete_invoices'),
      canSend: role.permissions.includes('send_invoices'),
      canExport: role.permissions.includes('export_invoices'),
      canManagePayments: role.permissions.includes('manage_payments'),
      isAdmin: role.permissions.includes('admin')
    };
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSaveInvoice = (invoiceData: any) => {
    const newInvoice = {
      id: Date.now().toString(),
      invoiceNumber: invoiceData.invoiceNumber,
      clientName: invoiceData.clientName,
      clientEmail: invoiceData.clientEmail,
      clientPhone: invoiceData.clientPhone,
      issueDate: invoiceData.invoiceDate,
      dueDate: invoiceData.dueDate,
      status: 'draft' as InvoiceStatus,
      subtotal: invoiceData.subtotal,
      tax: invoiceData.taxAmount,
      discount: invoiceData.discount,
      totalAmount: invoiceData.totalAmount,
      currency: 'BDT',
      notes: invoiceData.notes,
      lineItems: invoiceData.items,
      paymentHistory: [],
      remindersSent: 0,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setInvoices(prev => [newInvoice, ...prev]);
    setShowInvoiceForm(false);
    showNotification('success', `ইনভয়েস ${invoiceData.invoiceNumber} সফলভাবে তৈরি হয়েছে!`);
  };

  const handleInvoiceAction = (action: string, invoice: any) => {
    console.log('Invoice Action:', action, invoice);

    // Handle specific actions
    switch (action) {
      case 'create':
        setShowInvoiceForm(true);
        break;
      case 'view':
        alert(`বিস্তারিত দেখুন: ${invoice.invoiceNumber}`);
        break;
      case 'edit':
        alert(`সম্পাদনা: ${invoice.invoiceNumber}`);
        break;
      case 'send':
        alert(`পাঠানো হচ্ছে: ${invoice.invoiceNumber}`);
        break;
      case 'download-pdf':
        alert(`PDF ডাউনলোড: ${invoice.invoiceNumber}`);
        break;
      case 'mark-paid':
        alert(`পরিশোধিত চিহ্নিত: ${invoice.invoiceNumber}`);
        break;
      case 'delete':
        alert(`মুছে ফেলা: ${invoice.invoiceNumber}`);
        break;
      default:
        alert(`অ্যাকশন: ${action} - ${invoice.invoiceNumber || 'Multiple invoices'}`);
    }
  };

  const handleTestPreview = (content: PreviewContent) => {
    setPreviewContent(content);
    setShowPreviewDemo(true);
  };

  React.useEffect(() => {
    setClients([
      {
        id: '1',
        name: 'ঢাকা কনস্ট্রাকশন কোম্পানি',
        email: 'info@dhakaconst.com',
        phone: '+880 1711-123456',
        address: 'ধানমন্ডি, ঢাকা'
      },
      {
        id: '2',
        name: 'গ্রিন এগ্রো ফার্ম',
        email: 'contact@greenagro.com',
        phone: '+880 1812-654321',
        address: 'সাভার, ঢাকা'
      }
    ]);
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ইনভয়েস ম্যানেজমেন্ট সিস্টেম ডেমো
          </h1>
          <p className="text-gray-600">
            সম্পূর্ণ ইনভয়েস নিয়ন্ত্রণ ও ব্যবস্থাপনা সিস্টেমের বিস্তারিত প্রদর্শনী
          </p>
        </div>

        {/* Status Icons Demo */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold mb-4">স্ট্যাটাস আইকন ডেমো</h3>
          
          <div className="space-y-6">
            {/* Status Badges */}
            <div>
              <h4 className="font-medium mb-3">স্ট্যাটাস ব্যাজ:</h4>
              <div className="flex flex-wrap gap-3">
                <StatusBadge status="draft" size="md" />
                <StatusBadge status="sent" size="md" />
                <StatusBadge status="paid" size="md" />
                <StatusBadge status="overdue" size="md" />
                <StatusBadge status="partially_paid" size="md" />
                <StatusBadge status="cancelled" size="md" />
                <StatusBadge status="processing" size="md" animate={true} />
              </div>
            </div>

            {/* Status Indicators with Details */}
            <div>
              <h4 className="font-medium mb-3">বিস্তারিত স্ট্যাটাস ইন্ডিকেটর:</h4>
              <div className="space-y-3">
                <InvoiceStatusIndicator
                  status="sent"
                  dueDate="2024-02-15"
                  remindersSent={1}
                  totalAmount={287500}
                  size="md"
                  showDetails={true}
                />
                <InvoiceStatusIndicator
                  status="paid"
                  paidDate="2024-01-20"
                  totalAmount={150000}
                  size="md"
                  showDetails={true}
                />
                <InvoiceStatusIndicator
                  status="overdue"
                  dueDate="2024-01-10"
                  remindersSent={3}
                  totalAmount={200000}
                  size="md"
                  showDetails={true}
                />
                <InvoiceStatusIndicator
                  status="partially_paid"
                  partialPaymentAmount={75000}
                  totalAmount={150000}
                  size="md"
                  showDetails={true}
                />
              </div>
            </div>

            {/* Status Selector */}
            <div>
              <h4 className="font-medium mb-3">স্ট্যাটাস সিলেক্টর:</h4>
              <div className="max-w-xs">
                <StatusSelector
                  currentStatus="sent"
                  onStatusChange={(newStatus) => {
                    console.log('Status changed to:', newStatus);
                    alert(`স্ট্যাটাস পরিবর্তন: ${newStatus}`);
                  }}
                  disabled={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Role Selector */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
          <div className="flex items-center mb-4">
            <Shield className="mr-2 text-blue-600" size={20} />
            <h3 className="text-lg font-semibold">ব্যবহারকারীর ভূমিকা নির্বাচন করুন</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {userRoles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedRole === role.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <User size={24} />
                </div>
                <h4 className="font-medium text-sm mb-1">{role.name}</h4>
                <p className="text-xs opacity-75">{role.description}</p>
              </button>
            ))}
          </div>

          {/* Current Role Permissions */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-3">
              বর্তমান ভূমিকার অনুমতিসমূহ: {getCurrentRole().name}
            </h4>
            <div className="flex flex-wrap gap-2">
              {getCurrentRole().permissions.map((permission) => (
                <span
                  key={permission}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {permission}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview Demo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">লাইভ প্রিভিউ ডেমো</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowDebugger(true)}
                  className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded text-sm transition-colors"
                >
                  <Bug size={14} />
                  <span>Debug</span>
                </button>
                <button
                  onClick={() => setShowPreviewDemo(!showPreviewDemo)}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm transition-colors"
                >
                  <Eye size={14} />
                  <span>{showPreviewDemo ? 'লুকান' : 'দেখান'}</span>
                </button>
              </div>
            </div>

            {showPreviewDemo ? (
              <PreviewManager
                initialContent={previewContent}
                autoRefresh={true}
                refreshInterval={5000}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Eye className="mx-auto mb-2" size={32} />
                <p>প্রিভিউ দেখতে "দেখান" বাটনে ক্লিক করুন</p>
              </div>
            )}
          </div>
        </div>

        {/* Feature Overview */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
            <h3 className="text-lg font-semibold mb-4">সিস্টেম বৈশিষ্ট্য</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Eye className="text-blue-600 flex-shrink-0 mt-1" size={16} />
                <div>
                  <h4 className="font-medium">ভিউ অ্যাকশন</h4>
                  <p className="text-sm text-gray-600">বিস্তারিত দেখুন, প্রিভিউ, পেমেন্ট হিস্টরি</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Edit className="text-green-600 flex-shrink-0 mt-1" size={16} />
                <div>
                  <h4 className="font-medium">এডিট অ্যাকশন</h4>
                  <p className="text-sm text-gray-600">সম্পাদনা, কপি তৈরি, নোট যোগ</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Send className="text-teal-600 flex-shrink-0 mt-1" size={16} />
                <div>
                  <h4 className="font-medium">সেন্ড অ্যাকশন</h4>
                  <p className="text-sm text-gray-600">ইমেইল, SMS, রিমাইন্ডার পাঠান</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CreditCard className="text-orange-600 flex-shrink-0 mt-1" size={16} />
                <div>
                  <h4 className="font-medium">পেমেন্ট অ্যাকশন</h4>
                  <p className="text-sm text-gray-600">পরিশোধিত চিহ্নিত, পেমেন্ট রেকর্ড, রিফান্ড</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Download className="text-blue-600 flex-shrink-0 mt-1" size={16} />
                <div>
                  <h4 className="font-medium">এক্সপোর্ট অ্যাকশন</h4>
                  <p className="text-sm text-gray-600">PDF, Excel ডাউনলোড, প্রিন্ট</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Settings className="text-gray-600 flex-shrink-0 mt-1" size={16} />
                <div>
                  <h4 className="font-medium">ম্যানেজমেন্ট অ্যাকশন</h4>
                  <p className="text-sm text-gray-600">স্ট্যাটাস পরিবর্তন, আর্কাইভ, বাতিল, মুছে ফেলা</p>
                </div>
              </div>
            </div>
          </div>

        {/* Main Invoice Management System */}
        <InvoiceManagement
          userPermissions={getUserPermissions()}
          onInvoiceAction={handleInvoiceAction}
        />

        {/* Technical Specifications */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">টেকনিক্যাল স্পেসিফিকেশন</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-gray-700 mb-3">ইউজার ইন্টারফেস</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• রেসপন্সিভ ডিজাইন (মোবাইল, ট্যাবলেট, ডেস্কটপ)</li>
                <li>• ২-৩ ক্লিকের মধ্যে সকল অ্যাকশন অ্যাক্সেসযোগ্য</li>
                <li>• ইনটুইটিভ আইকন এবং লেবেল</li>
                <li>• কনফার্মেশন ডায়ালগ ডেস্ট্রাক্টিভ অ্যাকশনের জন্য</li>
                <li>• বাল্ক অ্যাকশন সাপোর্ট</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-3">অ্যাক্সেস কন্ট্রোল</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• রোল-বেসড পারমিশন সিস্টেম</li>
                <li>• গ্র্যানুলার অ্যাক্সেস কন্ট্রোল</li>
                <li>• অ্যাকশন-স্পেসিফিক পারমিশন</li>
                <li>• ইনভয়েস স্ট্যাটাস-বেসড অ্যাক্সেস</li>
                <li>• অডিট ট্রেইল এবং লগিং</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-3">পারফরমেন্স</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• লেজি লোডিং এবং পেজিনেশন</li>
                <li>• অপ্টিমাইজড ডাটাবেস কোয়েরি</li>
                <li>• ক্লায়েন্ট-সাইড ক্যাশিং</li>
                <li>• রিয়েল-টাইম আপডেট</li>
                <li>• ব্যাকগ্রাউন্ড প্রসেসিং</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-3">ইন্টিগ্রেশন</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• ইমেইল সার্ভিস ইন্টিগ্রেশন</li>
                <li>• SMS গেটওয়ে সাপোর্ট</li>
                <li>• পেমেন্ট গেটওয়ে কানেকশন</li>
                <li>• অ্যাকাউন্টিং সফটওয়্যার সিঙ্ক</li>
                <li>• API এবং ওয়েবহুক সাপোর্ট</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Invoice Form Modal */}
      <InvoiceForm
        isOpen={showInvoiceForm}
        onClose={() => setShowInvoiceForm(false)}
        onSave={handleSaveInvoice}
        clients={clients}
      />

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
                <CheckCircle size={20} />
                <span>{notification.message}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Debugger */}
      <PreviewDebugger
        isOpen={showDebugger}
        onClose={() => setShowDebugger(false)}
        onTestContent={handleTestPreview}
        currentContent={previewContent}
      />
    </div>
  );
};

export default InvoiceManagementDemo;