import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Plus, 
  Trash2, 
  Save, 
  User, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  FileText, 
  Calendar, 
  DollarSign, 
  Hash, 
  AlertCircle, 
  CheckCircle 
} from 'lucide-react';
import PreviewManager from './PreviewManager';
import { PreviewContent } from '../hooks/useLivePreview';

interface ClientFormData {
  // Personal Information
  name: string;
  email: string;
  phone: string;
  address: string;
  
  // Business Information
  companyName: string;
  taxId: string;
  businessType: string;
  
  // Billing Preferences
  paymentTerms: string;
  preferredPaymentMethod: string;
  billingAddress: string;
  
  // Account Settings
  currency: string;
  language: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  
  // Initial Invoices
  invoices: InvoiceData[];
}

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  description: string;
  amount: number;
  tax: number;
  totalAmount: number;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  items: InvoiceItem[];
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientData: ClientFormData) => void;
  editingClient?: any;
}

const ClientForm: React.FC<ClientFormProps> = ({ isOpen, onClose, onSave, editingClient }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [previewContent, setPreviewContent] = useState<PreviewContent | null>(null);
  
  const [formData, setFormData] = useState<ClientFormData>({
    // Personal Information
    name: editingClient?.name || '',
    email: editingClient?.email || '',
    phone: editingClient?.phone || '',
    address: editingClient?.address || '',
    
    // Business Information
    companyName: editingClient?.companyName || '',
    taxId: editingClient?.taxId || '',
    businessType: editingClient?.businessType || 'individual',
    
    // Billing Preferences
    paymentTerms: editingClient?.paymentTerms || '30',
    preferredPaymentMethod: editingClient?.preferredPaymentMethod || 'bank_transfer',
    billingAddress: editingClient?.billingAddress || '',
    
    // Account Settings
    currency: editingClient?.currency || 'BDT',
    language: editingClient?.language || 'bn',
    emailNotifications: editingClient?.emailNotifications ?? true,
    smsNotifications: editingClient?.smsNotifications ?? false,
    
    // Initial Invoices
    invoices: editingClient?.invoices || []
  });

  // Update live preview when form data changes
  React.useEffect(() => {
    if (formData.name || formData.email) {
      setPreviewContent({
        type: 'client',
        data: formData,
        timestamp: new Date().toISOString(),
        version: 1
      });
    }
  }, [formData]);
  const steps = [
    { id: 1, title: 'ব্যক্তিগত তথ্য', icon: User },
    { id: 2, title: 'ব্যবসায়িক তথ্য', icon: Building },
    { id: 3, title: 'বিলিং সেটিংস', icon: CreditCard },
    { id: 4, title: 'অ্যাকাউন্ট সেটিংস', icon: FileText },
    { id: 5, title: 'প্রাথমিক ইনভয়েস', icon: DollarSign }
  ];

  const handleInputChange = (field: keyof ClientFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addInvoice = () => {
    const newInvoice: InvoiceData = {
      id: Date.now().toString(),
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      description: '',
      amount: 0,
      tax: 0,
      totalAmount: 0,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft',
      items: [{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }]
    };
    
    setFormData(prev => ({
      ...prev,
      invoices: [...prev.invoices, newInvoice]
    }));
  };

  const removeInvoice = (invoiceId: string) => {
    setFormData(prev => ({
      ...prev,
      invoices: prev.invoices.filter(inv => inv.id !== invoiceId)
    }));
  };

  const updateInvoice = (invoiceId: string, field: keyof InvoiceData, value: any) => {
    setFormData(prev => ({
      ...prev,
      invoices: prev.invoices.map(inv => {
        if (inv.id === invoiceId) {
          const updatedInvoice = { ...inv, [field]: value };
          // Recalculate totals if amount or tax changes
          if (field === 'amount' || field === 'tax') {
            updatedInvoice.totalAmount = updatedInvoice.amount + updatedInvoice.tax;
          }
          return updatedInvoice;
        }
        return inv;
      })
    }));
  };

  const addInvoiceItem = (invoiceId: string) => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    
    setFormData(prev => ({
      ...prev,
      invoices: prev.invoices.map(inv => 
        inv.id === invoiceId 
          ? { ...inv, items: [...inv.items, newItem] }
          : inv
      )
    }));
  };

  const removeInvoiceItem = (invoiceId: string, itemId: string) => {
    setFormData(prev => ({
      ...prev,
      invoices: prev.invoices.map(inv => 
        inv.id === invoiceId 
          ? { ...inv, items: inv.items.filter(item => item.id !== itemId) }
          : inv
      )
    }));
  };

  const updateInvoiceItem = (invoiceId: string, itemId: string, field: keyof InvoiceItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      invoices: prev.invoices.map(inv => 
        inv.id === invoiceId 
          ? {
              ...inv,
              items: inv.items.map(item => {
                if (item.id === itemId) {
                  const updatedItem = { ...item, [field]: value };
                  if (field === 'quantity' || field === 'rate') {
                    updatedItem.amount = updatedItem.quantity * updatedItem.rate;
                  }
                  return updatedItem;
                }
                return item;
              })
            }
          : inv
      )
    }));
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) errors.name = 'নাম প্রয়োজন';
        if (!formData.email.trim()) errors.email = 'ইমেইল প্রয়োজন';
        if (!formData.phone.trim()) errors.phone = 'ফোন নম্বর প্রয়োজন';
        break;
      case 2:
        if (formData.businessType === 'business' && !formData.companyName.trim()) {
          errors.companyName = 'কোম্পানির নাম প্রয়োজন';
        }
        break;
      case 5:
        formData.invoices.forEach((invoice, index) => {
          if (!invoice.description.trim()) {
            errors[`invoice_${index}_description`] = 'ইনভয়েস বিবরণ প্রয়োজন';
          }
          if (invoice.amount <= 0) {
            errors[`invoice_${index}_amount`] = 'পরিমাণ ০ এর চেয়ে বেশি হতে হবে';
          }
        });
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handlePrevious = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Calculate invoice totals
      const processedInvoices = formData.invoices.map(invoice => ({
        ...invoice,
        amount: invoice.items.reduce((sum, item) => sum + item.amount, 0),
        totalAmount: invoice.items.reduce((sum, item) => sum + item.amount, 0) + invoice.tax
      }));

      const clientData = {
        ...formData,
        invoices: processedInvoices,
        id: editingClient?.id || Date.now().toString(),
        createdDate: editingClient?.createdDate || new Date().toISOString().split('T')[0],
        totalInvoices: processedInvoices.length,
        totalAmount: processedInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
      };
      
      onSave(clientData);
      onClose();
      
      // Reset form
      setFormData({
        name: '', email: '', phone: '', address: '',
        companyName: '', taxId: '', businessType: 'individual',
        paymentTerms: '30', preferredPaymentMethod: 'bank_transfer', billingAddress: '',
        currency: 'BDT', language: 'bn', emailNotifications: true, smsNotifications: false,
        invoices: []
      });
      setActiveStep(1);
      setValidationErrors({});
    } catch (error) {
      console.error('Error saving client:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (!isOpen) return null;

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <User className="mr-2 text-blue-600" size={20} />
              ব্যক্তিগত তথ্য
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  পূর্ণ নাম *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    validationErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ক্লায়েন্টের পূর্ণ নাম"
                />
                {validationErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ইমেইল ঠিকানা *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    validationErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="client@example.com"
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ফোন নম্বর *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+880 1XXX-XXXXXX"
                />
                {validationErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ঠিকানা
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="সম্পূর্ণ ঠিকানা"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Building className="mr-2 text-blue-600" size={20} />
              ব্যবসায়িক তথ্য
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ব্যবসার ধরন
              </label>
              <select
                value={formData.businessType}
                onChange={(e) => handleInputChange('businessType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="individual">ব্যক্তিগত</option>
                <option value="business">ব্যবসায়িক</option>
                <option value="company">কোম্পানি</option>
                <option value="organization">সংস্থা</option>
              </select>
            </div>
            
            {formData.businessType !== 'individual' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    কোম্পানির নাম *
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      validationErrors.companyName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="কোম্পানির নাম"
                  />
                  {validationErrors.companyName && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.companyName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ট্যাক্স আইডি / TIN
                  </label>
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => handleInputChange('taxId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="ট্যাক্স আইডেন্টিফিকেশন নম্বর"
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CreditCard className="mr-2 text-blue-600" size={20} />
              বিলিং সেটিংস
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  পেমেন্ট টার্মস (দিন)
                </label>
                <select
                  value={formData.paymentTerms}
                  onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="0">তাৎক্ষণিক</option>
                  <option value="7">৭ দিন</option>
                  <option value="15">১৫ দিন</option>
                  <option value="30">৩০ দিন</option>
                  <option value="45">৪৫ দিন</option>
                  <option value="60">৬০ দিন</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  পছন্দের পেমেন্ট পদ্ধতি
                </label>
                <select
                  value={formData.preferredPaymentMethod}
                  onChange={(e) => handleInputChange('preferredPaymentMethod', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="bank_transfer">ব্যাংক ট্রান্সফার</option>
                  <option value="cash">নগদ</option>
                  <option value="check">চেক</option>
                  <option value="bkash">বিকাশ</option>
                  <option value="nagad">নগদ</option>
                  <option value="rocket">রকেট</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                বিলিং ঠিকানা
              </label>
              <textarea
                value={formData.billingAddress}
                onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="বিলিং এর জন্য ঠিকানা (যদি আলাদা হয়)"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FileText className="mr-2 text-blue-600" size={20} />
              অ্যাকাউন্ট সেটিংস
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  মুদ্রা
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="BDT">বাংলাদেশী টাকা (BDT)</option>
                  <option value="USD">ইউএস ডলার (USD)</option>
                  <option value="EUR">ইউরো (EUR)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ভাষা
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="bn">বাংলা</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">নোটিফিকেশন সেটিংস</h4>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                  ইমেইল নোটিফিকেশন
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="smsNotifications"
                  checked={formData.smsNotifications}
                  onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="smsNotifications" className="ml-2 block text-sm text-gray-700">
                  SMS নোটিফিকেশন
                </label>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center">
                <DollarSign className="mr-2 text-blue-600" size={20} />
                প্রাথমিক ইনভয়েস (ঐচ্ছিক)
              </h3>
              <button
                onClick={addInvoice}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
              >
                <Plus size={16} />
                <span>ইনভয়েস যোগ করুন</span>
              </button>
            </div>
            
            {formData.invoices.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <FileText className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-600">কোন ইনভয়েস যোগ করা হয়নি</p>
                <p className="text-sm text-gray-500 mt-2">
                  আপনি চাইলে পরে ইনভয়েস যোগ করতে পারেন
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {formData.invoices.map((invoice, index) => (
                  <div key={invoice.id} className="bg-gray-50 p-6 rounded-lg border">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">ইনভয়েস #{index + 1}</h4>
                      <button
                        onClick={() => removeInvoice(invoice.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ইনভয়েস নম্বর
                        </label>
                        <input
                          type="text"
                          value={invoice.invoiceNumber}
                          onChange={(e) => updateInvoice(invoice.id, 'invoiceNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          নির্ধারিত তারিখ
                        </label>
                        <input
                          type="date"
                          value={invoice.dueDate}
                          onChange={(e) => updateInvoice(invoice.id, 'dueDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          স্ট্যাটাস
                        </label>
                        <select
                          value={invoice.status}
                          onChange={(e) => updateInvoice(invoice.id, 'status', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        >
                          <option value="draft">খসড়া</option>
                          <option value="sent">প্রেরিত</option>
                          <option value="paid">পরিশোধিত</option>
                          <option value="overdue">বকেয়া</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        বিবরণ *
                      </label>
                      <input
                        type="text"
                        value={invoice.description}
                        onChange={(e) => updateInvoice(invoice.id, 'description', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                          validationErrors[`invoice_${index}_description`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="ইনভয়েসের বিবরণ"
                      />
                      {validationErrors[`invoice_${index}_description`] && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors[`invoice_${index}_description`]}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          পরিমাণ *
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={invoice.amount}
                          onChange={(e) => updateInvoice(invoice.id, 'amount', parseFloat(e.target.value) || 0)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                            validationErrors[`invoice_${index}_amount`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {validationErrors[`invoice_${index}_amount`] && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors[`invoice_${index}_amount`]}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ট্যাক্স
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={invoice.tax}
                          onChange={(e) => updateInvoice(invoice.id, 'tax', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          মোট পরিমাণ
                        </label>
                        <input
                          type="text"
                          value={formatCurrency(invoice.amount + invoice.tax)}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {editingClient ? 'ক্লায়েন্ট সম্পাদনা' : 'নতুন ক্লায়েন্ট অ্যাকাউন্ট তৈরি'}
              </h2>
              <p className="text-sm text-gray-600">
                ধাপ {activeStep} এর {steps.length}: {steps.find(s => s.id === activeStep)?.title}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = step.id === activeStep;
                const isCompleted = step.id < activeStep;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isCompleted 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : isActive 
                          ? 'bg-blue-500 border-blue-500 text-white' 
                          : 'border-gray-300 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle size={20} />
                      ) : (
                        <Icon size={20} />
                      )}
                    </div>
                    <div className="ml-3 hidden md:block">
                      <p className={`text-sm font-medium ${
                        isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`hidden md:block w-12 h-0.5 ml-4 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              {/* Form Content */}
              <div>
              {renderStepContent()}
            </div>
            
            {/* Live Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">ক্লায়েন্ট প্রিভিউ</h3>
                <button
                  onClick={() => setShowLivePreview(!showLivePreview)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  {showLivePreview ? 'লুকান' : 'দেখান'}
                </button>
              </div>
              
              {showLivePreview && (
                <PreviewManager
                  initialContent={previewContent}
                  autoRefresh={false}
                  className="h-96"
                />
              )}
            </div>
          </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              * চিহ্নিত ক্ষেত্রগুলি আবশ্যক
            </div>
            <div className="flex items-center space-x-3">
              {activeStep > 1 && (
                <button
                  onClick={handlePrevious}
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  পূর্ববর্তী
                </button>
              )}
              
              {activeStep < 5 ? (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  পরবর্তী
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>সংরক্ষণ করা হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>অ্যাকাউন্ট তৈরি করুন</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ClientForm;