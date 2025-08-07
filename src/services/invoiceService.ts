/**
 * Invoice service for database operations and business logic
 * Handles CRUD operations, total updates, and data persistence
 */

import { 
  calculateInvoiceTotals, 
  validateInvoiceData, 
  InvoiceLineItem, 
  InvoiceFee, 
  InvoiceDiscount,
  InvoiceCalculationResult 
} from '../utils/invoiceCalculations';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  lineItems: InvoiceLineItem[];
  fees: InvoiceFee[];
  discounts: InvoiceDiscount[];
  subtotal: number;
  totalTax: number;
  totalFees: number;
  totalDiscounts: number;
  totalAmount: number;
  currency: string;
  notes?: string;
  terms?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface InvoiceUpdateResult {
  success: boolean;
  invoice?: Invoice;
  message: string;
  timestamp: string;
  errors: string[];
}

export interface InvoiceUpdateLog {
  invoiceId: string;
  invoiceNumber: string;
  previousTotal: number;
  newTotal: number;
  updatedBy: string;
  timestamp: string;
  operation: string;
}

// Simulated database storage
let invoicesDB: Invoice[] = [];
let updateLogsDB: InvoiceUpdateLog[] = [];

/**
 * Simulate database connection check
 */
const checkDatabaseConnection = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Simulate 95% success rate
      resolve(Math.random() > 0.05);
    }, 100);
  });
};

/**
 * Get invoice by ID
 */
export const getInvoiceById = async (invoiceId: string): Promise<Invoice | null> => {
  const isConnected = await checkDatabaseConnection();
  if (!isConnected) {
    throw new Error('Database connection failed');
  }

  return invoicesDB.find(invoice => invoice.id === invoiceId) || null;
};

/**
 * Save invoice to database
 */
const saveInvoiceToDatabase = async (invoice: Invoice): Promise<boolean> => {
  const isConnected = await checkDatabaseConnection();
  if (!isConnected) {
    throw new Error('Database connection failed');
  }

  // Simulate save operation
  const existingIndex = invoicesDB.findIndex(inv => inv.id === invoice.id);
  if (existingIndex >= 0) {
    invoicesDB[existingIndex] = { ...invoice, updatedAt: new Date().toISOString() };
  } else {
    invoicesDB.push({ ...invoice, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }

  return true;
};

/**
 * Log invoice update operation
 */
const logInvoiceUpdate = async (log: InvoiceUpdateLog): Promise<void> => {
  updateLogsDB.push(log);
};

/**
 * Calculate and update invoice totals
 */
export const calculateAndUpdateInvoiceTotals = async (
  invoiceId: string,
  updatedBy: string = 'system'
): Promise<InvoiceUpdateResult> => {
  const timestamp = new Date().toISOString();
  const errors: string[] = [];

  try {
    // Step 1: Retrieve invoice
    const invoice = await getInvoiceById(invoiceId);
    if (!invoice) {
      return {
        success: false,
        message: `Invoice #${invoiceId} not found`,
        timestamp,
        errors: ['Invoice not found']
      };
    }

    // Step 2: Validate invoice data
    const validationErrors = validateInvoiceData(invoice.lineItems);
    if (validationErrors.length > 0) {
      return {
        success: false,
        message: `Invoice #${invoice.invoiceNumber} validation failed`,
        timestamp,
        errors: validationErrors
      };
    }

    // Step 3: Calculate totals
    const calculationResult: InvoiceCalculationResult = calculateInvoiceTotals(
      invoice.lineItems,
      invoice.fees,
      invoice.discounts
    );

    if (!calculationResult.success) {
      return {
        success: false,
        message: `Invoice #${invoice.invoiceNumber} calculation failed`,
        timestamp,
        errors: calculationResult.errors
      };
    }

    // Step 4: Store previous total for logging
    const previousTotal = invoice.totalAmount;

    // Step 5: Update invoice with new totals
    const updatedInvoice: Invoice = {
      ...invoice,
      subtotal: calculationResult.totals.subtotal,
      totalTax: calculationResult.totals.totalTax,
      totalFees: calculationResult.totals.totalFees,
      totalDiscounts: calculationResult.totals.totalDiscounts,
      totalAmount: calculationResult.totals.finalTotal,
      updatedAt: timestamp,
      updatedBy
    };

    // Step 6: Save to database
    const saveSuccess = await saveInvoiceToDatabase(updatedInvoice);
    if (!saveSuccess) {
      return {
        success: false,
        message: `Invoice #${invoice.invoiceNumber} save operation failed`,
        timestamp,
        errors: ['Database save operation failed']
      };
    }

    // Step 7: Log the update
    const updateLog: InvoiceUpdateLog = {
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      previousTotal,
      newTotal: calculationResult.totals.finalTotal,
      updatedBy,
      timestamp,
      operation: 'total_calculation_update'
    };

    await logInvoiceUpdate(updateLog);

    // Step 8: Verify the update was successful
    const verificationInvoice = await getInvoiceById(invoiceId);
    if (!verificationInvoice || verificationInvoice.totalAmount !== calculationResult.totals.finalTotal) {
      return {
        success: false,
        message: `Invoice #${invoice.invoiceNumber} verification failed`,
        timestamp,
        errors: ['Update verification failed - data may not have been saved correctly']
      };
    }

    return {
      success: true,
      invoice: updatedInvoice,
      message: `Invoice #${invoice.invoiceNumber} total updated successfully: ${new Intl.NumberFormat('bn-BD', {
        style: 'currency',
        currency: invoice.currency || 'BDT',
        minimumFractionDigits: 2
      }).format(calculationResult.totals.finalTotal)} (saved to database at ${new Date(timestamp).toLocaleString('bn-BD')})`,
      timestamp,
      errors: []
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    errors.push(errorMessage);

    return {
      success: false,
      message: `Invoice total update failed: ${errorMessage}`,
      timestamp,
      errors
    };
  }
};

/**
 * Batch update multiple invoices
 */
export const batchUpdateInvoiceTotals = async (
  invoiceIds: string[],
  updatedBy: string = 'system'
): Promise<{ successful: InvoiceUpdateResult[], failed: InvoiceUpdateResult[] }> => {
  const successful: InvoiceUpdateResult[] = [];
  const failed: InvoiceUpdateResult[] = [];

  for (const invoiceId of invoiceIds) {
    try {
      const result = await calculateAndUpdateInvoiceTotals(invoiceId, updatedBy);
      if (result.success) {
        successful.push(result);
      } else {
        failed.push(result);
      }
    } catch (error) {
      failed.push({
        success: false,
        message: `Batch update failed for invoice ${invoiceId}: ${error.message}`,
        timestamp: new Date().toISOString(),
        errors: [error.message]
      });
    }
  }

  return { successful, failed };
};

/**
 * Get invoice update logs
 */
export const getInvoiceUpdateLogs = async (invoiceId?: string): Promise<InvoiceUpdateLog[]> => {
  const isConnected = await checkDatabaseConnection();
  if (!isConnected) {
    throw new Error('Database connection failed');
  }

  if (invoiceId) {
    return updateLogsDB.filter(log => log.invoiceId === invoiceId);
  }

  return updateLogsDB;
};

/**
 * Create a new invoice with calculated totals
 */
export const createInvoiceWithTotals = async (
  invoiceData: Omit<Invoice, 'id' | 'subtotal' | 'totalTax' | 'totalFees' | 'totalDiscounts' | 'totalAmount' | 'createdAt' | 'updatedAt'>,
  createdBy: string = 'system'
): Promise<InvoiceUpdateResult> => {
  const timestamp = new Date().toISOString();
  const invoiceId = `INV-${Date.now()}`;

  try {
    // Calculate totals for new invoice
    const calculationResult = calculateInvoiceTotals(
      invoiceData.lineItems,
      invoiceData.fees,
      invoiceData.discounts
    );

    if (!calculationResult.success) {
      return {
        success: false,
        message: `Invoice creation failed: calculation errors`,
        timestamp,
        errors: calculationResult.errors
      };
    }

    // Create complete invoice object
    const newInvoice: Invoice = {
      ...invoiceData,
      id: invoiceId,
      subtotal: calculationResult.totals.subtotal,
      totalTax: calculationResult.totals.totalTax,
      totalFees: calculationResult.totals.totalFees,
      totalDiscounts: calculationResult.totals.totalDiscounts,
      totalAmount: calculationResult.totals.finalTotal,
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy,
      updatedBy: createdBy
    };

    // Save to database
    const saveSuccess = await saveInvoiceToDatabase(newInvoice);
    if (!saveSuccess) {
      return {
        success: false,
        message: `Invoice creation failed: database save error`,
        timestamp,
        errors: ['Database save operation failed']
      };
    }

    // Log the creation
    const createLog: InvoiceUpdateLog = {
      invoiceId: newInvoice.id,
      invoiceNumber: newInvoice.invoiceNumber,
      previousTotal: 0,
      newTotal: calculationResult.totals.finalTotal,
      updatedBy: createdBy,
      timestamp,
      operation: 'invoice_creation'
    };

    await logInvoiceUpdate(createLog);

    return {
      success: true,
      invoice: newInvoice,
      message: `Invoice #${newInvoice.invoiceNumber} created successfully: ${new Intl.NumberFormat('bn-BD', {
        style: 'currency',
        currency: newInvoice.currency || 'BDT',
        minimumFractionDigits: 2
      }).format(calculationResult.totals.finalTotal)} (saved to database at ${new Date(timestamp).toLocaleString('bn-BD')})`,
      timestamp,
      errors: []
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return {
      success: false,
      message: `Invoice creation failed: ${errorMessage}`,
      timestamp,
      errors: [errorMessage]
    };
  }
};

/**
 * Get all invoices with pagination
 */
export const getAllInvoices = async (
  page: number = 1,
  limit: number = 10
): Promise<{ invoices: Invoice[], total: number, page: number, totalPages: number }> => {
  const isConnected = await checkDatabaseConnection();
  if (!isConnected) {
    throw new Error('Database connection failed');
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedInvoices = invoicesDB.slice(startIndex, endIndex);
  const totalPages = Math.ceil(invoicesDB.length / limit);

  return {
    invoices: paginatedInvoices,
    total: invoicesDB.length,
    page,
    totalPages
  };
};