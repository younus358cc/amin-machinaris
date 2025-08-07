/**
 * React hook for invoice calculations and updates
 * Provides state management and API integration for invoice operations
 */

import { useState, useCallback } from 'react';
import { 
  calculateAndUpdateInvoiceTotals, 
  createInvoiceWithTotals,
  getInvoiceById,
  batchUpdateInvoiceTotals,
  InvoiceUpdateResult,
  Invoice 
} from '../services/invoiceService';

export interface UseInvoiceCalculationsReturn {
  // State
  isCalculating: boolean;
  isUpdating: boolean;
  lastResult: InvoiceUpdateResult | null;
  error: string | null;
  
  // Actions
  calculateTotals: (invoiceId: string, updatedBy?: string) => Promise<InvoiceUpdateResult>;
  createInvoice: (invoiceData: any, createdBy?: string) => Promise<InvoiceUpdateResult>;
  batchUpdate: (invoiceIds: string[], updatedBy?: string) => Promise<{ successful: InvoiceUpdateResult[], failed: InvoiceUpdateResult[] }>;
  getInvoice: (invoiceId: string) => Promise<Invoice | null>;
  clearError: () => void;
  clearResult: () => void;
}

export const useInvoiceCalculations = (): UseInvoiceCalculationsReturn => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastResult, setLastResult] = useState<InvoiceUpdateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateTotals = useCallback(async (invoiceId: string, updatedBy: string = 'user'): Promise<InvoiceUpdateResult> => {
    setIsCalculating(true);
    setError(null);
    
    try {
      const result = await calculateAndUpdateInvoiceTotals(invoiceId, updatedBy);
      setLastResult(result);
      
      if (!result.success) {
        setError(result.message);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      const failureResult: InvoiceUpdateResult = {
        success: false,
        message: errorMessage,
        timestamp: new Date().toISOString(),
        errors: [errorMessage]
      };
      
      setLastResult(failureResult);
      return failureResult;
    } finally {
      setIsCalculating(false);
    }
  }, []);

  const createInvoice = useCallback(async (invoiceData: any, createdBy: string = 'user'): Promise<InvoiceUpdateResult> => {
    setIsUpdating(true);
    setError(null);
    
    try {
      const result = await createInvoiceWithTotals(invoiceData, createdBy);
      setLastResult(result);
      
      if (!result.success) {
        setError(result.message);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      const failureResult: InvoiceUpdateResult = {
        success: false,
        message: errorMessage,
        timestamp: new Date().toISOString(),
        errors: [errorMessage]
      };
      
      setLastResult(failureResult);
      return failureResult;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const batchUpdate = useCallback(async (invoiceIds: string[], updatedBy: string = 'user') => {
    setIsUpdating(true);
    setError(null);
    
    try {
      const result = await batchUpdateInvoiceTotals(invoiceIds, updatedBy);
      
      if (result.failed.length > 0) {
        setError(`${result.failed.length} invoices failed to update`);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      return {
        successful: [],
        failed: [{
          success: false,
          message: errorMessage,
          timestamp: new Date().toISOString(),
          errors: [errorMessage]
        }]
      };
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const getInvoice = useCallback(async (invoiceId: string): Promise<Invoice | null> => {
    try {
      return await getInvoiceById(invoiceId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return null;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearResult = useCallback(() => {
    setLastResult(null);
  }, []);

  return {
    isCalculating,
    isUpdating,
    lastResult,
    error,
    calculateTotals,
    createInvoice,
    batchUpdate,
    getInvoice,
    clearError,
    clearResult
  };
};