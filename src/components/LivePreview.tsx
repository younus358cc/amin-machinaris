import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Maximize2, 
  Minimize2, 
  Monitor, 
  Smartphone, 
  Tablet,
  AlertCircle,
  CheckCircle,
  Wifi,
  WifiOff
} from 'lucide-react';

interface LivePreviewProps {
  content: any;
  isVisible?: boolean;
  onToggle?: () => void;
  className?: string;
}

const LivePreview: React.FC<LivePreviewProps> = ({
  content,
  isVisible = true,
  onToggle,
  className = ''
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const previewRef = useRef<HTMLDivElement>(null);
  const refreshTimeoutRef = useRef<NodeJS.Timeout>();

  // Simulate network connectivity check
  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(navigator.onLine);
    };

    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);
    
    return () => {
      window.removeEventListener('online', checkConnection);
      window.removeEventListener('offline', checkConnection);
    };
  }, []);

  // Auto-refresh content when it changes
  useEffect(() => {
    if (content) {
      setIsLoading(true);
      setError(null);
      
      // Clear any existing timeout
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      // Simulate processing delay
      refreshTimeoutRef.current = setTimeout(() => {
        try {
          // Validate content structure
          if (typeof content === 'object' && content !== null) {
            setLastUpdate(new Date());
            setError(null);
          } else {
            throw new Error('Invalid content format');
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unknown error occurred');
        } finally {
          setIsLoading(false);
        }
      }, 500);
    }

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [content]);

  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    
    // Simulate refresh operation
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsLoading(false);
    }, 1000);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getViewportClasses = () => {
    switch (viewportMode) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      default:
        return 'w-full';
    }
  };

  const renderPreviewContent = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <AlertCircle className="text-red-500 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-red-600 mb-2">Preview Error</h3>
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw size={16} />
            <span>Retry</span>
          </button>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <RefreshCw className="animate-spin text-blue-500 mb-4" size={48} />
          <p className="text-gray-600">Loading preview...</p>
        </div>
      );
    }

    // Render actual content based on type
    if (content?.type === 'invoice') {
      return <InvoicePreview invoice={content.data} />;
    }

    if (content?.type === 'client') {
      return <ClientPreview client={content.data} />;
    }

    if (content?.type === 'transaction') {
      return <TransactionPreview transaction={content.data} />;
    }

    // Default content preview
    return (
      <div className="p-6">
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h3 className="font-semibold mb-2">Live Preview</h3>
          <p className="text-gray-600 text-sm">
            Content will appear here when available
          </p>
        </div>
        <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
          {JSON.stringify(content, null, 2)}
        </pre>
      </div>
    );
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative'} ${className}`}>
      {/* Preview Header */}
      <div className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          <div className="text-sm text-gray-600">
            Last updated: {lastUpdate.toLocaleTimeString('bn-BD')}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Viewport Mode Selector */}
          <div className="flex items-center space-x-1 bg-white rounded-lg p-1 border border-gray-300">
            <button
              onClick={() => setViewportMode('desktop')}
              className={`p-1.5 rounded ${viewportMode === 'desktop' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Desktop View"
            >
              <Monitor size={16} />
            </button>
            <button
              onClick={() => setViewportMode('tablet')}
              className={`p-1.5 rounded ${viewportMode === 'tablet' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Tablet View"
            >
              <Tablet size={16} />
            </button>
            <button
              onClick={() => setViewportMode('mobile')}
              className={`p-1.5 rounded ${viewportMode === 'mobile' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Mobile View"
            >
              <Smartphone size={16} />
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh Preview"
          >
            <RefreshCw className={isLoading ? 'animate-spin' : ''} size={16} />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          {/* Visibility Toggle */}
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
              title="Toggle Preview"
            >
              {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* Preview Content */}
      <div 
        ref={previewRef}
        className={`${isFullscreen ? 'h-[calc(100vh-60px)]' : 'h-96'} overflow-auto bg-white`}
      >
        <div className={`transition-all duration-300 ${getViewportClasses()}`}>
          {renderPreviewContent()}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between p-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
        <div className="flex items-center space-x-4">
          <span>Mode: {viewportMode}</span>
          <span>Status: {error ? 'Error' : isLoading ? 'Loading' : 'Ready'}</span>
        </div>
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <Wifi className="text-green-500" size={12} />
          ) : (
            <WifiOff className="text-red-500" size={12} />
          )}
          <span>{isConnected ? 'Online' : 'Offline'}</span>
        </div>
      </div>
    </div>
  );
};

// Preview Components for different content types
const InvoicePreview: React.FC<{ invoice: any }> = ({ invoice }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        {/* Invoice Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ইনভয়েস</h1>
            <p className="text-gray-600">#{invoice?.invoiceNumber || 'INV-XXXX'}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">ইস্যু তারিখ</p>
            <p className="font-semibold">{invoice?.issueDate || new Date().toLocaleDateString('bn-BD')}</p>
          </div>
        </div>

        {/* Client Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
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
              <p className="font-semibold">{invoice?.clientName || 'ক্লায়েন্টের নাম'}</p>
              <p>{invoice?.clientEmail || 'client@example.com'}</p>
              <p>{invoice?.clientPhone || '+880 1XXX-XXXXXX'}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">বিবরণ</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">পরিমাণ</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">দর</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">মোট</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoice?.items?.map((item: any, index: number) => (
                <tr key={index}>
                  <td className="px-4 py-3">{item.description || 'পণ্যের বিবরণ'}</td>
                  <td className="px-4 py-3 text-right">{item.quantity || 1}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(item.rate || 0)}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.amount || 0)}</td>
                </tr>
              )) || (
                <tr>
                  <td className="px-4 py-3 text-gray-500" colSpan={4}>
                    কোন আইটেম যোগ করা হয়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>সাবটোটাল:</span>
                <span>{formatCurrency(invoice?.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>ট্যাক্স:</span>
                <span>{formatCurrency(invoice?.tax || 0)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold text-lg">
                <span>মোট পরিমাণ:</span>
                <span className="text-blue-600">{formatCurrency(invoice?.totalAmount || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ClientPreview: React.FC<{ client: any }> = ({ client }) => {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">ক্লায়েন্ট প্রোফাইল</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">ব্যক্তিগত তথ্য</h3>
            <div className="space-y-2">
              <p><span className="font-medium">নাম:</span> {client?.name || 'ক্লায়েন্টের নাম'}</p>
              <p><span className="font-medium">ইমেইল:</span> {client?.email || 'email@example.com'}</p>
              <p><span className="font-medium">ফোন:</span> {client?.phone || '+880 1XXX-XXXXXX'}</p>
              <p><span className="font-medium">ঠিকানা:</span> {client?.address || 'ঠিকানা'}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">ব্যবসায়িক তথ্য</h3>
            <div className="space-y-2">
              <p><span className="font-medium">কোম্পানি:</span> {client?.companyName || 'কোম্পানির নাম'}</p>
              <p><span className="font-medium">ব্যবসার ধরন:</span> {client?.businessType || 'ব্যক্তিগত'}</p>
              <p><span className="font-medium">পেমেন্ট টার্মস:</span> {client?.paymentTerms || '30'} দিন</p>
              <p><span className="font-medium">মুদ্রা:</span> {client?.currency || 'BDT'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TransactionPreview: React.FC<{ transaction: any }> = ({ transaction }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">লেনদেন বিবরণ</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium">ধরন:</span>
            <span className={`px-2 py-1 rounded text-sm ${
              transaction?.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {transaction?.type === 'income' ? 'আয়' : 'ব্যয়'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">বিবরণ:</span>
            <span>{transaction?.description || 'লেনদেনের বিবরণ'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">পরিমাণ:</span>
            <span className="font-bold text-lg">
              {formatCurrency(transaction?.amount || 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">তারিখ:</span>
            <span>{transaction?.date || new Date().toLocaleDateString('bn-BD')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">ক্যাটেগরি:</span>
            <span>{transaction?.category || 'সাধারণ'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePreview;