import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Plus, 
  Trash2, 
  Calculator, 
  Save, 
  Send, 
  FileText,
  User,
  Calendar,
  Hash,
  DollarSign
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import { InvoiceStatus } from './StatusIcon';
import PreviewManager from './PreviewManager';
import { PreviewContent } from '../hooks/useLivePreview';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceFormData {
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  invoiceDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  totalAmount: number;
  notes: string;
  terms: string;
  status?: InvoiceStatus;
}

interface InvoiceFormProps {
  isOpen?: boolean;
  onClose: () => void;
  onSave?: (invoice: InvoiceFormData) => void;
  onSubmit?: (invoice: InvoiceFormData) => void;
  clients: Array<{ id: string; name: string; email: string; phone: string; address: string }>;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ isOpen = true, onClose, onSave, onSubmit, clients }) => {
  const [formData, setFormData] = useState<InvoiceFormData>({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }],
    subtotal: 0,
    taxRate: 15, // 15% VAT
    taxAmount: 0,
    discount: 0,
    totalAmount: 0,
    notes: '',
    terms: 'Payment is due within 30 days of invoice date.'
  });

  const [selectedClient, setSelectedClient] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [previewContent, setPreviewContent] = useState<PreviewContent | null>(null);

  // Calculate totals whenever items, tax rate, or discount changes
  React.useEffect(() => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal - formData.discount) * (formData.taxRate / 100);
    const totalAmount = subtotal - formData.discount + taxAmount;

    setFormData(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      totalAmount
    }));
  }, [formData.items, formData.taxRate, formData.discount]);
  
  // Update live preview when form data changes
  React.useEffect(() => {
    if (formData.clientName || formData.items.some(item => item.description)) {
      setPreviewContent({
        type: 'invoice',
        data: {
          invoiceNumber: formData.invoiceNumber,
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          clientPhone: formData.clientPhone,
          issueDate: formData.invoiceDate,
          dueDate: formData.dueDate,
          items: formData.items,
          subtotal: formData.subtotal,
          tax: formData.taxAmount,
          totalAmount: formData.totalAmount,
          notes: formData.notes,
          terms: formData.terms
        },
        timestamp: new Date().toISOString(),
        version: 1
      });
    }
  }, [formData]);

  const handleClientSelect = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setSelectedClient(clientId);
      setFormData(prev => ({
        ...prev,
        clientName: client.name,
        clientEmail: client.email,
        clientPhone: client.phone,
        clientAddress: client.address
      }));
    }
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (itemId: string) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== itemId)
      }));
    }
  };

  const updateItem = (itemId: string, field: keyof InvoiceItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate;
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.clientName.trim()) {
      errors.clientName = 'ক্লায়েন্টের নাম প্রয়োজন';
    }
    if (!formData.clientEmail.trim()) {
      errors.clientEmail = 'ক্লায়েন্টের ইমেইল প্রয়োজন';
    }
    if (!formData.invoiceDate) {
      errors.invoiceDate = 'ইনভয়েস তারিখ প্রয়োজন';
    }
    if (!formData.dueDate) {
      errors.dueDate = 'নির্ধারিত তারিখ প্রয়োজন';
    }

    // Validate items
    formData.items.forEach((item, index) => {
      if (!item.description.trim()) {
        errors[`item_${index}_description`] = 'পণ্যের বিবরণ প্রয়োজন';
      }
      if (item.quantity <= 0) {
        errors[`item_${index}_quantity`] = 'পরিমাণ ০ এর চেয়ে বেশি হতে হবে';
      }
      if (item.rate <= 0) {
        errors[`item_${index}_rate`] = 'দর ০ এর চেয়ে বেশি হতে হবে';
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (action: 'save' | 'send') => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const invoiceData = {
        ...formData,
        status: (action === 'send' ? 'sent' : 'draft') as InvoiceStatus,
        createdDate: new Date().toISOString().split('T')[0]
      };

      // Support both onSave and onSubmit callbacks for compatibility
      if (onSave) {
        onSave(invoiceData);
      }
      if (onSubmit) {
        onSubmit(invoiceData);
      }
      onClose();
      
      // Reset form
      setFormData({
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        clientAddress: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }],
        subtotal: 0,
        taxRate: 15,
        taxAmount: 0,
        discount: 0,
        totalAmount: 0,
        notes: '',
        terms: 'Payment is due within 30 days of invoice date.'
      });
      setSelectedClient('');
      setValidationErrors({});
    } catch (error) {
      console.error('Error saving invoice:', error);
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
          className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="text-blue-600" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">নতুন ইনভয়েস তৈরি করুন</h2>
                <p className="text-sm text-gray-600">ইনভয়েস নম্বর: {formData.invoiceNumber}</p>
                <div className="mt-1">
                  <StatusBadge status="draft" size="sm" />
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              {/* Form Fields */}
              <div className="space-y-8">
              {/* Client Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="mr-2 text-blue-600" size={20} />
                  ক্লায়েন্ট তথ্য
                </h3>
                
                {/* Client Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    বিদ্যমান ক্লায়েন্ট নির্বাচন করুন (ঐচ্ছিক)
                  </label>
                  <select
                    value={selectedClient}
                    onChange={(e) => handleClientSelect(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="">নতুন ক্লায়েন্ট</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ক্লায়েন্টের নাম *
                    </label>
                    <input
                      type="text"
                      value={formData.clientName}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                        validationErrors.clientName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="ক্লায়েন্টের নাম লিখুন"
                    />
                    {validationErrors.clientName && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.clientName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ইমেইল *
                    </label>
                    <input
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                        validationErrors.clientEmail ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="client@example.com"
                    />
                    {validationErrors.clientEmail && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.clientEmail}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ফোন নম্বর
                    </label>
                    <input
                      type="tel"
                      value={formData.clientPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="+880 1XXX-XXXXXX"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ঠিকানা
                    </label>
                    <input
                      type="text"
                      value={formData.clientAddress}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientAddress: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="ক্লায়েন্টের ঠিকানা"
                    />
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="mr-2 text-blue-600" size={20} />
                  ইনভয়েস বিবরণ
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ইনভয়েস নম্বর *
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        value={formData.invoiceNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ইনভয়েস তারিখ *
                    </label>
                    <input
                      type="date"
                      value={formData.invoiceDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, invoiceDate: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                        validationErrors.invoiceDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {validationErrors.invoiceDate && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.invoiceDate}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      নির্ধারিত তারিখ *
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                        validationErrors.dueDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {validationErrors.dueDate && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.dueDate}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Calculator className="mr-2 text-blue-600" size={20} />
                    পণ্য/সেবার তালিকা
                  </h3>
                  <button
                    onClick={addItem}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                  >
                    <Plus size={16} />
                    <span>আইটেম যোগ করুন</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          পণ্য/সেবার বিবরণ *
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          পরিমাণ *
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          দর (টাকা) *
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          মোট
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          অ্যাকশন
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {formData.items.map((item, index) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                              className={`w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm ${
                                validationErrors[`item_${index}_description`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="পণ্যের বিবরণ লিখুন"
                            />
                            {validationErrors[`item_${index}_description`] && (
                              <p className="text-red-500 text-xs mt-1">{validationErrors[`item_${index}_description`]}</p>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                              className={`w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm ${
                                validationErrors[`item_${index}_quantity`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {validationErrors[`item_${index}_quantity`] && (
                              <p className="text-red-500 text-xs mt-1">{validationErrors[`item_${index}_quantity`]}</p>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.rate}
                              onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                              className={`w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm ${
                                validationErrors[`item_${index}_rate`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {validationErrors[`item_${index}_rate`] && (
                              <p className="text-red-500 text-xs mt-1">{validationErrors[`item_${index}_rate`]}</p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium">
                            {formatCurrency(item.amount)}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => removeItem(item.id)}
                              disabled={formData.items.length === 1}
                              className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Calculations */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <DollarSign className="mr-2 text-blue-600" size={20} />
                  হিসাব-নিকাশ
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ছাড় (টাকা)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.discount}
                        onChange={(e) => setFormData(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ভ্যাট/ট্যাক্স (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={formData.taxRate}
                        onChange={(e) => setFormData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">সাবটোটাল:</span>
                      <span className="font-medium">{formatCurrency(formData.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ছাড়:</span>
                      <span className="font-medium">-{formatCurrency(formData.discount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ভ্যাট/ট্যাক্স ({formData.taxRate}%):</span>
                      <span className="font-medium">{formatCurrency(formData.taxAmount)}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold">মোট পরিমাণ:</span>
                        <span className="text-lg font-bold text-blue-600">{formatCurrency(formData.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes and Terms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    অতিরিক্ত নোট
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="অতিরিক্ত তথ্য বা নির্দেশনা..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    শর্তাবলী
                  </label>
                  <textarea
                    value={formData.terms}
                    onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="পেমেন্ট শর্তাবলী..."
                  />
                </div>
              </div>
            </div>
            
            {/* Live Preview Panel */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">লাইভ প্রিভিউ</h3>
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
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                বাতিল
              </button>
              <button
                onClick={() => handleSubmit('save')}
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                <span>খসড়া সংরক্ষণ</span>
              </button>
              <button
                onClick={() => handleSubmit('send')}
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>প্রক্রিয়াকরণ...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>ইনভয়েস পাঠান</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InvoiceForm;