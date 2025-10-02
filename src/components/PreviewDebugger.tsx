import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bug, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  X,
  Code,
  Database,
  Wifi,
  Monitor
} from 'lucide-react';
import { validatePreviewContent, generateSampleContent } from '../utils/previewUtils';
import { PreviewContent } from '../hooks/useLivePreview';

interface PreviewDebuggerProps {
  isOpen: boolean;
  onClose: () => void;
  onTestContent: (content: PreviewContent) => void;
  currentContent?: PreviewContent | null;
}

const PreviewDebugger: React.FC<PreviewDebuggerProps> = ({
  isOpen,
  onClose,
  onTestContent,
  currentContent
}) => {
  const [activeTab, setActiveTab] = useState<'validation' | 'network' | 'performance' | 'logs'>('validation');
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const runDiagnostics = async () => {
    setIsRunningTests(true);
    setTestResults(null);

    // Simulate diagnostic tests
    await new Promise(resolve => setTimeout(resolve, 2000));

    const results = {
      validation: currentContent ? validatePreviewContent(currentContent) : { isValid: false, errors: ['No content to validate'], warnings: [] },
      network: {
        isOnline: navigator.onLine,
        latency: Math.random() * 100 + 50, // Simulated latency
        lastCheck: new Date().toISOString()
      },
      performance: {
        renderTime: Math.random() * 500 + 100, // Simulated render time
        memoryUsage: Math.random() * 50 + 20, // Simulated memory usage
        updateFrequency: Math.random() * 10 + 5 // Simulated update frequency
      },
      logs: [
        { level: 'info', message: 'Preview system initialized', timestamp: new Date().toISOString() },
        { level: 'success', message: 'Content validation passed', timestamp: new Date().toISOString() },
        { level: 'warning', message: 'Network latency detected', timestamp: new Date().toISOString() }
      ]
    };

    setTestResults(results);
    setIsRunningTests(false);
  };

  const handleTestSample = (type: 'invoice' | 'client' | 'transaction') => {
    const sampleContent = generateSampleContent(type);
    onTestContent(sampleContent);
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
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Bug className="text-orange-600" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Preview Debugger</h2>
                <p className="text-sm text-gray-600">Diagnose and fix preview issues</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={runDiagnostics}
                disabled={isRunningTests}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={isRunningTests ? 'animate-spin' : ''} size={16} />
                <span>Run Diagnostics</span>
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {[
              { id: 'validation', label: 'Validation', icon: CheckCircle },
              { id: 'network', label: 'Network', icon: Wifi },
              { id: 'performance', label: 'Performance', icon: Monitor },
              { id: 'logs', label: 'Logs', icon: Code }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-3 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Test Controls */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-3">Test Controls</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleTestSample('invoice')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                >
                  Test Invoice
                </button>
                <button
                  onClick={() => handleTestSample('client')}
                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                >
                  Test Client
                </button>
                <button
                  onClick={() => handleTestSample('transaction')}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded transition-colors"
                >
                  Test Transaction
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'validation' && (
              <div className="space-y-4">
                <h3 className="font-medium">Content Validation</h3>
                {testResults?.validation ? (
                  <div className="space-y-3">
                    <div className={`p-3 rounded-lg ${
                      testResults.validation.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-center space-x-2 mb-2">
                        {testResults.validation.isValid ? (
                          <CheckCircle className="text-green-600" size={16} />
                        ) : (
                          <AlertCircle className="text-red-600" size={16} />
                        )}
                        <span className={`font-medium ${
                          testResults.validation.isValid ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {testResults.validation.isValid ? 'Validation Passed' : 'Validation Failed'}
                        </span>
                      </div>
                      
                      {testResults.validation.errors.length > 0 && (
                        <div className="mb-2">
                          <h4 className="font-medium text-red-800 text-sm">Errors:</h4>
                          <ul className="text-sm text-red-700 ml-4">
                            {testResults.validation.errors.map((error: string, index: number) => (
                              <li key={index}>• {error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {testResults.validation.warnings.length > 0 && (
                        <div>
                          <h4 className="font-medium text-yellow-800 text-sm">Warnings:</h4>
                          <ul className="text-sm text-yellow-700 ml-4">
                            {testResults.validation.warnings.map((warning: string, index: number) => (
                              <li key={index}>• {warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">Run diagnostics to see validation results</p>
                )}
              </div>
            )}

            {activeTab === 'network' && (
              <div className="space-y-4">
                <h3 className="font-medium">Network Status</h3>
                {testResults?.network ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Connection Status</span>
                        <div className={`font-medium ${testResults.network.isOnline ? 'text-green-600' : 'text-red-600'}`}>
                          {testResults.network.isOnline ? 'Online' : 'Offline'}
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Latency</span>
                        <div className="font-medium">{Math.round(testResults.network.latency)}ms</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">Run diagnostics to see network status</p>
                )}
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-4">
                <h3 className="font-medium">Performance Metrics</h3>
                {testResults?.performance ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Render Time</span>
                      <div className="font-medium">{Math.round(testResults.performance.renderTime)}ms</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Memory Usage</span>
                      <div className="font-medium">{Math.round(testResults.performance.memoryUsage)}MB</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Update Frequency</span>
                      <div className="font-medium">{Math.round(testResults.performance.updateFrequency)}/min</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">Run diagnostics to see performance metrics</p>
                )}
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="space-y-4">
                <h3 className="font-medium">System Logs</h3>
                {testResults?.logs ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {testResults.logs.map((log: any, index: number) => (
                      <div key={index} className={`p-2 rounded text-sm ${
                        log.level === 'error' ? 'bg-red-50 text-red-700' :
                        log.level === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                        log.level === 'success' ? 'bg-green-50 text-green-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        <div className="flex items-start justify-between">
                          <span>{log.message}</span>
                          <span className="text-xs opacity-75">
                            {new Date(log.timestamp).toLocaleTimeString('bn-BD')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">Run diagnostics to see system logs</p>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              Preview Debugger v1.0 - Troubleshoot live preview issues
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PreviewDebugger;