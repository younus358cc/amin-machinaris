/**
 * React hook for managing invoice status operations
 * Provides state management and business logic for status changes
 */

import { useState, useCallback } from 'react';
import { InvoiceStatus } from '../components/StatusIcon';
import { 
  validateStatusTransition, 
  getTransitionConfig, 
  autoUpdateStatus,
  StatusHistory 
} from '../utils/statusUtils';

export interface StatusChangeResult {
  success: boolean;
  newStatus?: InvoiceStatus;
  message: string;
  timestamp: string;
  errors: string[];
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
}

export interface UseStatusManagementReturn {
  // State
  isUpdating: boolean;
  lastResult: StatusChangeResult | null;
  error: string | null;
  statusHistory: StatusHistory[];
  
  // Actions
  changeStatus: (
    invoiceId: string, 
    fromStatus: InvoiceStatus, 
    toStatus: InvoiceStatus, 
    invoiceData?: any,
    changedBy?: string
  ) => Promise<StatusChangeResult>;
  autoUpdateStatuses: (invoices: any[]) => Promise<{ updated: any[], errors: any[] }>;
  getStatusHistory: (invoiceId: string) => Promise<StatusHistory[]>;
  clearError: () => void;
  clearResult: () => void;
}

export const useStatusManagement = (): UseStatusManagementReturn => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastResult, setLastResult] = useState<StatusChangeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);

  const changeStatus = useCallback(async (
    invoiceId: string,
    fromStatus: InvoiceStatus,
    toStatus: InvoiceStatus,
    invoiceData: any = {},
    changedBy: string = 'user'
  ): Promise<StatusChangeResult> => {
    setIsUpdating(true);
    setError(null);
    
    const timestamp = new Date().toISOString();

    try {
      // Validate the transition
      const validation = validateStatusTransition(fromStatus, toStatus, invoiceData);
      if (!validation.valid) {
        const result: StatusChangeResult = {
          success: false,
          message: `Status transition validation failed: ${validation.errors.join(', ')}`,
          timestamp,
          errors: validation.errors
        };
        setLastResult(result);
        return result;
      }

      // Get transition configuration
      const transitionConfig = getTransitionConfig(fromStatus, toStatus);
      if (!transitionConfig) {
        const result: StatusChangeResult = {
          success: false,
          message: `Invalid status transition from ${fromStatus} to ${toStatus}`,
          timestamp,
          errors: ['Invalid status transition']
        };
        setLastResult(result);
        return result;
      }

      // Check if confirmation is required
      if (transitionConfig.requiresConfirmation) {
        const result: StatusChangeResult = {
          success: false,
          message: 'Confirmation required for this status change',
          timestamp,
          errors: [],
          requiresConfirmation: true,
          confirmationMessage: transitionConfig.confirmationMessage
        };
        setLastResult(result);
        return result;
      }

      // Simulate API call to update status
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create status history entry
      const historyEntry: StatusHistory = {
        id: Date.now().toString(),
        invoiceId,
        fromStatus,
        toStatus,
        changedBy,
        changedAt: timestamp,
        reason: 'Manual status change'
      };

      setStatusHistory(prev => [historyEntry, ...prev]);

      const result: StatusChangeResult = {
        success: true,
        newStatus: toStatus,
        message: `Invoice status successfully changed from ${fromStatus} to ${toStatus}`,
        timestamp,
        errors: []
      };

      setLastResult(result);
      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      const result: StatusChangeResult = {
        success: false,
        message: `Status change failed: ${errorMessage}`,
        timestamp,
        errors: [errorMessage]
      };
      
      setLastResult(result);
      return result;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const autoUpdateStatuses = useCallback(async (invoices: any[]) => {
    const updated: any[] = [];
    const errors: any[] = [];

    for (const invoice of invoices) {
      try {
        const newStatus = autoUpdateStatus(
          invoice.status,
          invoice.dueDate,
          invoice.partialPaymentAmount,
          invoice.totalAmount
        );

        if (newStatus !== invoice.status) {
          const result = await changeStatus(
            invoice.id,
            invoice.status,
            newStatus,
            invoice,
            'system'
          );

          if (result.success) {
            updated.push({ ...invoice, status: newStatus });
          } else {
            errors.push({ invoice, error: result.message });
          }
        }
      } catch (error) {
        errors.push({ 
          invoice, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    return { updated, errors };
  }, [changeStatus]);

  const getStatusHistory = useCallback(async (invoiceId: string): Promise<StatusHistory[]> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return statusHistory.filter(entry => entry.invoiceId === invoiceId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return [];
    }
  }, [statusHistory]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearResult = useCallback(() => {
    setLastResult(null);
  }, []);

  return {
    isUpdating,
    lastResult,
    error,
    statusHistory,
    changeStatus,
    autoUpdateStatuses,
    getStatusHistory,
    clearError,
    clearResult
  };
};