/**
 * Invoice calculation utilities for billing system
 * Handles total calculations, tax computations, and validation
 */

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
}

export interface InvoiceFee {
  id: string;
  description: string;
  amount: number;
  type: 'fixed' | 'percentage';
}

export interface InvoiceDiscount {
  id: string;
  description: string;
  amount: number;
  type: 'fixed' | 'percentage';
}

export interface InvoiceTotals {
  subtotal: number;
  totalTax: number;
  totalFees: number;
  totalDiscounts: number;
  finalTotal: number;
}

export interface InvoiceCalculationResult {
  success: boolean;
  totals: InvoiceTotals;
  errors: string[];
  timestamp: string;
}

/**
 * Calculate line item subtotal
 */
export const calculateLineItemSubtotal = (quantity: number, unitPrice: number): number => {
  if (quantity < 0 || unitPrice < 0) {
    throw new Error('Quantity and unit price must be non-negative');
  }
  return Math.round((quantity * unitPrice) * 100) / 100; // Round to 2 decimal places
};

/**
 * Calculate tax amount for a line item
 */
export const calculateLineItemTax = (subtotal: number, taxRate: number): number => {
  if (taxRate < 0 || taxRate > 100) {
    throw new Error('Tax rate must be between 0 and 100');
  }
  return Math.round((subtotal * (taxRate / 100)) * 100) / 100;
};

/**
 * Calculate total fees
 */
export const calculateTotalFees = (fees: InvoiceFee[], subtotal: number): number => {
  return fees.reduce((total, fee) => {
    if (fee.type === 'fixed') {
      return total + fee.amount;
    } else if (fee.type === 'percentage') {
      return total + Math.round((subtotal * (fee.amount / 100)) * 100) / 100;
    }
    return total;
  }, 0);
};

/**
 * Calculate total discounts
 */
export const calculateTotalDiscounts = (discounts: InvoiceDiscount[], subtotal: number): number => {
  return discounts.reduce((total, discount) => {
    if (discount.type === 'fixed') {
      return total + discount.amount;
    } else if (discount.type === 'percentage') {
      return total + Math.round((subtotal * (discount.amount / 100)) * 100) / 100;
    }
    return total;
  }, 0);
};

/**
 * Calculate complete invoice totals
 */
export const calculateInvoiceTotals = (
  lineItems: InvoiceLineItem[],
  fees: InvoiceFee[] = [],
  discounts: InvoiceDiscount[] = []
): InvoiceCalculationResult => {
  const errors: string[] = [];
  const timestamp = new Date().toISOString();

  try {
    // Validate input
    if (!Array.isArray(lineItems) || lineItems.length === 0) {
      errors.push('Invoice must contain at least one line item');
    }

    // Calculate subtotal from line items
    let subtotal = 0;
    let totalTax = 0;

    for (const item of lineItems) {
      try {
        const itemSubtotal = calculateLineItemSubtotal(item.quantity, item.unitPrice);
        subtotal += itemSubtotal;

        if (item.taxRate && item.taxRate > 0) {
          const itemTax = calculateLineItemTax(itemSubtotal, item.taxRate);
          totalTax += itemTax;
        }
      } catch (error) {
        errors.push(`Error calculating line item ${item.id}: ${error.message}`);
      }
    }

    // Calculate fees
    let totalFees = 0;
    try {
      totalFees = calculateTotalFees(fees, subtotal);
    } catch (error) {
      errors.push(`Error calculating fees: ${error.message}`);
    }

    // Calculate discounts
    let totalDiscounts = 0;
    try {
      totalDiscounts = calculateTotalDiscounts(discounts, subtotal);
    } catch (error) {
      errors.push(`Error calculating discounts: ${error.message}`);
    }

    // Calculate final total
    const finalTotal = Math.max(0, subtotal + totalTax + totalFees - totalDiscounts);

    const totals: InvoiceTotals = {
      subtotal: Math.round(subtotal * 100) / 100,
      totalTax: Math.round(totalTax * 100) / 100,
      totalFees: Math.round(totalFees * 100) / 100,
      totalDiscounts: Math.round(totalDiscounts * 100) / 100,
      finalTotal: Math.round(finalTotal * 100) / 100
    };

    return {
      success: errors.length === 0,
      totals,
      errors,
      timestamp
    };

  } catch (error) {
    errors.push(`Unexpected error during calculation: ${error.message}`);
    
    return {
      success: false,
      totals: {
        subtotal: 0,
        totalTax: 0,
        totalFees: 0,
        totalDiscounts: 0,
        finalTotal: 0
      },
      errors,
      timestamp
    };
  }
};

/**
 * Format currency amount for display
 */
export const formatCurrency = (amount: number, currency: string = 'BDT'): string => {
  return new Intl.NumberFormat('bn-BD', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Validate invoice data before calculation
 */
export const validateInvoiceData = (lineItems: InvoiceLineItem[]): string[] => {
  const errors: string[] = [];

  if (!Array.isArray(lineItems)) {
    errors.push('Line items must be an array');
    return errors;
  }

  if (lineItems.length === 0) {
    errors.push('Invoice must contain at least one line item');
    return errors;
  }

  lineItems.forEach((item, index) => {
    if (!item.id || typeof item.id !== 'string') {
      errors.push(`Line item ${index + 1}: ID is required and must be a string`);
    }

    if (!item.description || typeof item.description !== 'string') {
      errors.push(`Line item ${index + 1}: Description is required and must be a string`);
    }

    if (typeof item.quantity !== 'number' || item.quantity <= 0) {
      errors.push(`Line item ${index + 1}: Quantity must be a positive number`);
    }

    if (typeof item.unitPrice !== 'number' || item.unitPrice < 0) {
      errors.push(`Line item ${index + 1}: Unit price must be a non-negative number`);
    }

    if (item.taxRate !== undefined && (typeof item.taxRate !== 'number' || item.taxRate < 0 || item.taxRate > 100)) {
      errors.push(`Line item ${index + 1}: Tax rate must be a number between 0 and 100`);
    }
  });

  return errors;
};