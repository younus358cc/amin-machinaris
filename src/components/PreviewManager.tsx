import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Settings, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import LivePreview from './LivePreview';
import useLivePreview, { PreviewContent } from '../hooks/useLivePreview';

interface PreviewManagerProps {
  initialContent?: PreviewContent;
  autoRefresh?: boolean;
  refreshInterval?: number;
  className?: string;
}

const PreviewManager: React.FC<PreviewManagerProps> = ({
  initialContent,
  autoRefresh = false,
  refreshInterval = 5000,
  className = ''
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  
  const {
    previewState,
    updatePreview,
    toggleVisibility,
    refreshPreview,
    clearPreview,
    setError,
    isPreviewReady,
    hasContent
  } = useLivePreview(initialContent, autoRefresh ? refreshInterval : undefined);

  // Debug information
  const debugInfo = {
    contentType: previewState.content?.type || 'none',
    version: previewState.content?.version || 0,
    lastUpdate: previewState.lastUpdate?.toLocaleString('bn-BD') || 'never',
    isConnected: previewState.isConnected,
    hasError: !!previewState.error,
    isLoading: previewState.isLoading
  };

  // Test content for debugging
  const testContents: PreviewContent[] = [
    {
      type: 'invoice',
      data: {
        invoiceNumber: 'INV-TEST-001',
        clientName: 'টেস্ট ক্লায়েন্ট',
        clientEmail: 'test@example.com',
        clientPhone: '+880 1XXX-XXXXXX',
        issueDate: new Date().toLocaleDateString('bn-BD'),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('bn-BD'),
        items: [
          { description: 'টেস্ট পণ্য ১', quantity: 2, rate: 5000, amount: 10000 },
          { description: 'টেস্ট পণ্য ২', quantity: 1, rate: 15000, amount: 15000 }
        ],
        subtotal: 25000,
        tax: 3750,
        totalAmount: 28750
      },
      timestamp: new Date().toISOString(),
      version: 1
    },
    {
      type: 'client',
      data: {
        name: 'টেস্ট ক্লায়েন্ট কোম্পানি',
        email: 'test@testcompany.com',
        phone: '+880 1712-345678',
        address: 'ঢাকা, বাংলাদেশ',
        companyName: 'টেস্ট কোম্পানি লিমিটেড',
        businessType: 'company',
        paymentTerms: '30',
        currency: 'BDT'
      },
      timestamp: new Date().toISOString(),
      version: 1
    },
    {
      type: 'transaction',
      data: {
        type: 'income',
        description: 'টেস্ট আয় লেনদেন',
        amount: 50000,
        category: 'Sales',
        date: new Date().toLocaleDateString('bn-BD'),
        status: 'completed'
      },
      timestamp: new Date().toISOString(),
      version: 1
    }
  ];

  const handleTestContent = (content: PreviewContent) => {
    updatePreview(content);
    setShowSettings(false);
  };

  const handleClearError = () => {
    setError(null);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Preview Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold">Live Preview</h3>
          
          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            {previewState.error ? (
              <div className="flex items-center space-x-1 text-red-600">
                <AlertTriangle size={16} />
                <span className="text-sm">Error</span>
              </div>
            ) : isPreviewReady ? (
              <div className="flex items-center space-x-1 text-green-600">
                <CheckCircle size={16} />
                <span className="text-sm">Ready</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-yellow-600">
                <RefreshCw className="animate-spin" size={16} />
                <span className="text-sm">Loading</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Debug Toggle */}
          <button
            onClick={() => setDebugMode(!debugMode)}
            className={`p-2 rounded-lg transition-colors ${
              debugMode ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Toggle Debug Mode"
          >
            <Info size={16} />
          </button>

          {/* Settings */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title="Preview Settings"
          >
            <Settings size={16} />
          </button>

          {/* Visibility Toggle */}
          <button
            onClick={toggleVisibility}
            className={`p-2 rounded-lg transition-colors ${
              previewState.isVisible 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title={previewState.isVisible ? 'Hide Preview' : 'Show Preview'}
          >
            {previewState.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {previewState.error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                <div>
                  <h4 className="font-medium text-red-800">Preview Error</h4>
                  <p className="text-red-700 text-sm">{previewState.error}</p>
                </div>
              </div>
              <button
                onClick={handleClearError}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Debug Panel */}
      <AnimatePresence>
        {debugMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <h4 className="font-medium text-blue-800 mb-3">Debug Information</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-blue-600 font-medium">Content Type:</span>
                <div className="text-blue-800">{debugInfo.contentType}</div>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Version:</span>
                <div className="text-blue-800">{debugInfo.version}</div>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Last Update:</span>
                <div className="text-blue-800">{debugInfo.lastUpdate}</div>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Connected:</span>
                <div className={debugInfo.isConnected ? 'text-green-600' : 'text-red-600'}>
                  {debugInfo.isConnected ? 'Yes' : 'No'}
                </div>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Has Error:</span>
                <div className={debugInfo.hasError ? 'text-red-600' : 'text-green-600'}>
                  {debugInfo.hasError ? 'Yes' : 'No'}
                </div>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Loading:</span>
                <div className={debugInfo.isLoading ? 'text-yellow-600' : 'text-green-600'}>
                  {debugInfo.isLoading ? 'Yes' : 'No'}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg"
          >
            <h4 className="font-medium text-gray-800 mb-4">Preview Settings</h4>
            
            <div className="space-y-4">
              {/* Test Content Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Content
                </label>
                <div className="flex flex-wrap gap-2">
                  {testContents.map((content, index) => (
                    <button
                      key={index}
                      onClick={() => handleTestContent(content)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                    >
                      Test {content.type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actions
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={refreshPreview}
                    disabled={!hasContent}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors disabled:opacity-50"
                  >
                    Refresh
                  </button>
                  <button
                    onClick={clearPreview}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setError('Test error message')}
                    className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded transition-colors"
                  >
                    Test Error
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Preview Component */}
      <LivePreview
        content={previewState.content}
        isVisible={previewState.isVisible}
        onToggle={toggleVisibility}
        className="border border-gray-200 rounded-lg"
      />

      {/* Status Summary */}
      {previewState.isVisible && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {hasContent ? (
              <>
                Preview showing {previewState.content?.type} content
                {previewState.lastUpdate && (
                  <span className="ml-2">
                    (updated {previewState.lastUpdate.toLocaleTimeString('bn-BD')})
                  </span>
                )}
              </>
            ) : (
              'No content to preview'
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default PreviewManager;