/**
 * Invoice Calculation Panel Component
 * Provides UI for invoice total calculations and updates
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  DollarSign,
  FileText,
  Clock,
  Database,
  User,
  Calendar
} from 'lucide-react';
import { useInvoiceCalculations } from '../hooks/useInvoiceCalculations';
import { formatCurrency } from '../utils/invoiceCalculations';

interface InvoiceCalculationPanelProps {
  invoiceId?: string;
  onCalculationComplete?: (result: any) => void;
  className?: string;
}

const InvoiceCalculationPanel: React.FC<InvoiceCalculationPanelProps> = ({
  invoiceId,
  onCalculationComplete,
  className = ''
}) => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(invoiceId || '');
  const [batchInvoiceIds, setBatchInvoiceIds] = useState<string>('');
  const [updatedBy, setUpdatedBy] = useState('admin');
  
  const {
    isCalculating,
    isUpdating,
    lastResult,
    error,
    calculateTotals,
    batchUpdate,
    clearError,
    clearResult
  } = useInvoiceCalculations();

  const handleSingleCalculation = async () => {
    if (!selectedInvoiceId.trim()) {
      return;
    }

    const result = await calculateTotals(selectedInvoiceId.trim(), updatedBy);
    
    if (onCalculationComplete) {
      onCalculationComplete(result);
    }
  };

  const handleBatchCalculation = async () => {
    const invoiceIds = batchInvoiceIds
      .split(',')
      .map(id => id.trim())
      .filter(id => id.length > 0);

    if (invoiceIds.length === 0) {
      return;
    }

    const result = await batchUpdate(invoiceIds, updatedBy);
    
    if (onCalculationComplete) {
      onCalculationComplete(result);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('bn-BD', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <Calculator className="mr-2 text-blue-600" size={20} />
          ইনভয়েস টোটাল ক্যালকুলেশন
        </h3>
        {(lastResult || error) && (
          <button
            onClick={() => {
              clearResult();
              clearError();
            }}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Clear Results
          </button>
        )}
      </div>

      {/* Single Invoice Calculation */}
      <div className="mb-8">
        <h4 className="font-medium mb-4 flex items-center">
          <FileText className="mr-2 text-green-600" size={16} />
          একক ইনভয়েস আপডেট
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ইনভয়েস আইডি
            </label>
            <input
              type="text"
              value={selectedInvoiceId}
              onChange={(e) => setSelectedInvoiceId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="INV-123456"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              আপডেট করেছেন
            </label>
            <input
              type="text"
              value={updatedBy}
              onChange={(e) => setUpdatedBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="admin"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleSingleCalculation}
              disabled={isCalculating || !selectedInvoiceId.trim()}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCalculating ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  <span>গণনা করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Calculator size={16} />
                  <span>টোটাল আপডেট করুন</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Batch Invoice Calculation */}
      <div className="mb-8">
        <h4 className="font-medium mb-4 flex items-center">
          <Database className="mr-2 text-blue-600" size={16} />
          ব্যাচ আপডেট (একাধিক ইনভয়েস)
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ইনভয়েস আইডি সমূহ (কমা দিয়ে আলাদা করুন)
            </label>
            <textarea
              value={batchInvoiceIds}
              onChange={(e) => setBatchInvoiceIds(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="INV-123, INV-124, INV-125"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleBatchCalculation}
              disabled={isUpdating || !batchInvoiceIds.trim()}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  <span>আপডেট করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Database size={16} />
                  <span>ব্যাচ আপডেট</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-start space-x-2">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
              <div>
                <h5 className="font-medium text-red-800">Error</h5>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {lastResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-lg border ${
              lastResult.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-start space-x-2 mb-3">
              {lastResult.success ? (
                <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
              ) : (
                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
              )}
              <div className="flex-1">
                <h5 className={`font-medium ${
                  lastResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {lastResult.success ? 'সফল!' : 'ব্যর্থ!'}
                </h5>
                <p className={`text-sm ${
                  lastResult.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {lastResult.message}
                </p>
              </div>
            </div>

            {/* Invoice Details */}
            {lastResult.success && lastResult.invoice && (
              <div className="mt-4 p-3 bg-white rounded border">
                <h6 className="font-medium mb-2 flex items-center">
                  <DollarSign className="mr-1 text-blue-600" size={14} />
                  ইনভয়েস বিবরণ
                </h6>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">সাবটোটাল:</span>
                    <div className="font-medium">{formatCurrency(lastResult.invoice.subtotal)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">ট্যাক্স:</span>
                    <div className="font-medium">{formatCurrency(lastResult.invoice.totalTax)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">ফি:</span>
                    <div className="font-medium">{formatCurrency(lastResult.invoice.totalFees)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">ছাড়:</span>
                    <div className="font-medium">-{formatCurrency(lastResult.invoice.totalDiscounts)}</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">মোট পরিমাণ:</span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatCurrency(lastResult.invoice.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Clock size={12} className="mr-1" />
                  <span>{formatTimestamp(lastResult.timestamp)}</span>
                </div>
                {lastResult.invoice && (
                  <div className="flex items-center">
                    <User size={12} className="mr-1" />
                    <span>{lastResult.invoice.updatedBy}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Errors */}
            {lastResult.errors.length > 0 && (
              <div className="mt-3 pt-3 border-t border-red-200">
                <h6 className="font-medium text-red-800 mb-2">Errors:</h6>
                <ul className="text-sm text-red-700 space-y-1">
                  {lastResult.errors.map((error, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Usage Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h5 className="font-medium text-blue-800 mb-2">ব্যবহারের নির্দেশনা:</h5>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• একক ইনভয়েস আপডেট করতে ইনভয়েস আইডি দিন এবং "টোটাল আপডেট করুন" বাটনে ক্লিক করুন</li>
          <li>• একাধিক ইনভয়েস আপডেট করতে কমা দিয়ে আলাদা করে আইডি দিন</li>
          <li>• সিস্টেম স্বয়ংক্রিয়ভাবে সকল লাইন আইটেম, ট্যাক্স, ফি এবং ছাড় গণনা করবে</li>
          <li>• আপডেট সফল হলে ডাটাবেসে সংরক্ষিত হবে এবং লগ রাখা হবে</li>
        </ul>
      </div>
    </div>
  );
};

export default InvoiceCalculationPanel;