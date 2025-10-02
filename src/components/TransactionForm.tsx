import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Save, 
  DollarSign, 
  Calendar, 
  FileText, 
  Tag, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';

interface TransactionFormData {
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category: string;
  date: string;
  status: 'completed' | 'pending';
  notes: string;
}

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transactionData: TransactionFormData) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ isOpen, onClose, onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<TransactionFormData>({
    type: 'income',
    description: '',
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0],
    status: 'completed',
    notes: ''
  });

  const incomeCategories = [
    'Sales',
    'Service Revenue',
    'Consulting',
    'Interest Income',
    'Other Income'
  ];

  const expenseCategories = [
    'Operating Expenses',
    'Office Rent',
    'Utilities',
    'Marketing',
    'Travel',
    'Equipment',
    'Supplies',
    'Professional Services',
    'Insurance',
    'Other Expenses'
  ];

  const handleInputChange = (field: keyof TransactionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.description.trim()) {
      errors.description = 'বিবরণ প্রয়োজন';
    }
    if (formData.amount <= 0) {
      errors.amount = 'পরিমাণ ০ এর চেয়ে বেশি হতে হবে';
    }
    if (!formData.category.trim()) {
      errors.category = 'ক্যাটেগরি নির্বাচন করুন';
    }
    if (!formData.date) {
      errors.date = 'তারিখ প্রয়োজন';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const transactionData = {
        ...formData,
        id: Date.now().toString()
      };
      
      onSave(transactionData);
      onClose();
      
      // Reset form
      setFormData({
        type: 'income',
        description: '',
        amount: 0,
        category: '',
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
        notes: ''
      });
      setValidationErrors({});
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
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
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <DollarSign className="text-teal-600" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">নতুন লেনদেন যোগ করুন</h2>
                <p className="text-sm text-gray-600">আয় বা ব্যয়ের তথ্য যোগ করুন</p>
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
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                লেনদেনের ধরন *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleInputChange('type', 'income')}
                  className={`flex items-center justify-center space-x-2 p-4 border-2 rounded-lg transition-colors ${
                    formData.type === 'income'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <ArrowUpRight size={20} />
                  <span className="font-medium">আয়</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('type', 'expense')}
                  className={`flex items-center justify-center space-x-2 p-4 border-2 rounded-lg transition-colors ${
                    formData.type === 'expense'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <ArrowDownRight size={20} />
                  <span className="font-medium">ব্যয়</span>
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                বিবরণ *
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  validationErrors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="লেনদেনের বিবরণ লিখুন"
              />
              {validationErrors.description && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.description}</p>
              )}
            </div>

            {/* Amount and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  পরিমাণ (টাকা) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    validationErrors.amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {validationErrors.amount && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.amount}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  তারিখ *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    validationErrors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.date && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.date}</p>
                )}
              </div>
            </div>

            {/* Category and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ক্যাটেগরি *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    validationErrors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">ক্যাটেগরি নির্বাচন করুন</option>
                  {(formData.type === 'income' ? incomeCategories : expenseCategories).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {validationErrors.category && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.category}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  স্ট্যাটাস
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="completed">সম্পন্ন</option>
                  <option value="pending">অপেক্ষমাণ</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                অতিরিক্ত নোট
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="অতিরিক্ত তথ্য বা মন্তব্য..."
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                * চিহ্নিত ক্ষেত্রগুলি আবশ্যক
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors disabled:opacity-50"
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
                      <span>লেনদেন সংরক্ষণ</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TransactionForm;