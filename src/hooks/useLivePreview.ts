/**
 * React hook for managing live preview functionality
 * Handles real-time updates, error states, and preview synchronization
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export interface PreviewContent {
  type: 'invoice' | 'client' | 'transaction' | 'report' | 'custom';
  data: any;
  timestamp: string;
  version: number;
}

export interface PreviewState {
  content: PreviewContent | null;
  isVisible: boolean;
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  isConnected: boolean;
}

export interface UseLivePreviewReturn {
  // State
  previewState: PreviewState;
  
  // Actions
  updatePreview: (content: PreviewContent) => void;
  toggleVisibility: () => void;
  refreshPreview: () => void;
  clearPreview: () => void;
  setError: (error: string | null) => void;
  
  // Utilities
  isPreviewReady: boolean;
  hasContent: boolean;
}

export const useLivePreview = (
  initialContent?: PreviewContent,
  autoRefreshInterval?: number
): UseLivePreviewReturn => {
  const [previewState, setPreviewState] = useState<PreviewState>({
    content: initialContent || null,
    isVisible: true,
    isLoading: false,
    error: null,
    lastUpdate: initialContent ? new Date() : null,
    isConnected: navigator.onLine
  });

  const refreshTimeoutRef = useRef<NodeJS.Timeout>();
  const autoRefreshIntervalRef = useRef<NodeJS.Timeout>();

  // Monitor network connectivity
  useEffect(() => {
    const handleOnline = () => {
      setPreviewState(prev => ({ ...prev, isConnected: true, error: null }));
    };

    const handleOffline = () => {
      setPreviewState(prev => ({ 
        ...prev, 
        isConnected: false, 
        error: 'Network connection lost. Preview may not update.' 
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefreshInterval && autoRefreshInterval > 0) {
      autoRefreshIntervalRef.current = setInterval(() => {
        if (previewState.content && previewState.isConnected) {
          refreshPreview();
        }
      }, autoRefreshInterval);

      return () => {
        if (autoRefreshIntervalRef.current) {
          clearInterval(autoRefreshIntervalRef.current);
        }
      };
    }
  }, [autoRefreshInterval, previewState.content, previewState.isConnected]);

  // Update preview content
  const updatePreview = useCallback((content: PreviewContent) => {
    setPreviewState(prev => ({ ...prev, isLoading: true, error: null }));

    // Clear any existing timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    // Simulate processing delay and validation
    refreshTimeoutRef.current = setTimeout(() => {
      try {
        // Validate content structure
        if (!content || typeof content !== 'object') {
          throw new Error('Invalid content format');
        }

        if (!content.type || !content.data) {
          throw new Error('Content must have type and data properties');
        }

        // Validate specific content types
        switch (content.type) {
          case 'invoice':
            if (!content.data.invoiceNumber) {
              throw new Error('Invoice must have an invoice number');
            }
            break;
          case 'client':
            if (!content.data.name || !content.data.email) {
              throw new Error('Client must have name and email');
            }
            break;
          case 'transaction':
            if (!content.data.amount || !content.data.type) {
              throw new Error('Transaction must have amount and type');
            }
            break;
        }

        // Update state with new content
        setPreviewState(prev => ({
          ...prev,
          content: {
            ...content,
            timestamp: new Date().toISOString(),
            version: (prev.content?.version || 0) + 1
          },
          isLoading: false,
          error: null,
          lastUpdate: new Date()
        }));

      } catch (err) {
        setPreviewState(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Unknown error occurred'
        }));
      }
    }, 300); // Debounce updates
  }, []);

  // Toggle preview visibility
  const toggleVisibility = useCallback(() => {
    setPreviewState(prev => ({ ...prev, isVisible: !prev.isVisible }));
  }, []);

  // Refresh current preview
  const refreshPreview = useCallback(() => {
    if (previewState.content) {
      setPreviewState(prev => ({ ...prev, isLoading: true, error: null }));
      
      setTimeout(() => {
        setPreviewState(prev => ({
          ...prev,
          isLoading: false,
          lastUpdate: new Date(),
          error: prev.isConnected ? null : 'Cannot refresh while offline'
        }));
      }, 500);
    }
  }, [previewState.content, previewState.isConnected]);

  // Clear preview content
  const clearPreview = useCallback(() => {
    setPreviewState(prev => ({
      ...prev,
      content: null,
      error: null,
      lastUpdate: null
    }));
  }, []);

  // Set error state
  const setError = useCallback((error: string | null) => {
    setPreviewState(prev => ({ ...prev, error }));
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      if (autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current);
      }
    };
  }, []);

  // Computed values
  const isPreviewReady = !previewState.isLoading && !previewState.error && previewState.isConnected;
  const hasContent = previewState.content !== null;

  return {
    previewState,
    updatePreview,
    toggleVisibility,
    refreshPreview,
    clearPreview,
    setError,
    isPreviewReady,
    hasContent
  };
};

export default useLivePreview;