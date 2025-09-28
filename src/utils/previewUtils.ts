/**
 * Preview utility functions for live preview functionality
 * Handles content validation, formatting, and error handling
 */

import { PreviewContent } from '../hooks/useLivePreview';

export interface PreviewValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate preview content structure and data
 */
export const validatePreviewContent = (content: PreviewContent): PreviewValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic structure validation
  if (!content) {
    errors.push('Content is required');
    return { isValid: false, errors, warnings };
  }

  if (!content.type) {
    errors.push('Content type is required');
  }

  if (!content.data) {
    errors.push('Content data is required');
  }

  if (!content.timestamp) {
    warnings.push('Content timestamp is missing');
  }

  // Type-specific validation
  switch (content.type) {
    case 'invoice':
      validateInvoiceContent(content.data, errors, warnings);
      break;
    case 'client':
      validateClientContent(content.data, errors, warnings);
      break;
    case 'transaction':
      validateTransactionContent(content.data, errors, warnings);
      break;
    default:
      warnings.push(`Unknown content type: ${content.type}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Validate invoice content for preview
 */
const validateInvoiceContent = (data: any, errors: string[], warnings: string[]) => {
  if (!data.invoiceNumber) {
    errors.push('Invoice number is required');
  }

  if (!data.clientName) {
    warnings.push('Client name is missing');
  }

  if (!data.clientEmail) {
    warnings.push('Client email is missing');
  }

  if (!data.items || !Array.isArray(data.items)) {
    warnings.push('Invoice items are missing or invalid');
  } else if (data.items.length === 0) {
    warnings.push('Invoice has no items');
  }

  if (typeof data.totalAmount !== 'number' || data.totalAmount < 0) {
    errors.push('Invalid total amount');
  }
};

/**
 * Validate client content for preview
 */
const validateClientContent = (data: any, errors: string[], warnings: string[]) => {
  if (!data.name) {
    errors.push('Client name is required');
  }

  if (!data.email) {
    errors.push('Client email is required');
  }

  if (!data.phone) {
    warnings.push('Client phone is missing');
  }

  if (!data.address) {
    warnings.push('Client address is missing');
  }
};

/**
 * Validate transaction content for preview
 */
const validateTransactionContent = (data: any, errors: string[], warnings: string[]) => {
  if (!data.type || !['income', 'expense'].includes(data.type)) {
    errors.push('Transaction type must be income or expense');
  }

  if (!data.description) {
    errors.push('Transaction description is required');
  }

  if (typeof data.amount !== 'number' || data.amount <= 0) {
    errors.push('Transaction amount must be a positive number');
  }

  if (!data.date) {
    errors.push('Transaction date is required');
  }

  if (!data.category) {
    warnings.push('Transaction category is missing');
  }
};

/**
 * Format content for preview display
 */
export const formatPreviewContent = (content: PreviewContent): any => {
  if (!content || !content.data) {
    return null;
  }

  const baseFormatting = {
    ...content.data,
    _previewMeta: {
      type: content.type,
      timestamp: content.timestamp,
      version: content.version,
      formattedAt: new Date().toISOString()
    }
  };

  switch (content.type) {
    case 'invoice':
      return formatInvoiceForPreview(baseFormatting);
    case 'client':
      return formatClientForPreview(baseFormatting);
    case 'transaction':
      return formatTransactionForPreview(baseFormatting);
    default:
      return baseFormatting;
  }
};

/**
 * Format invoice data for preview
 */
const formatInvoiceForPreview = (data: any) => {
  return {
    ...data,
    formattedTotalAmount: new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: data.currency || 'BDT',
      minimumFractionDigits: 0
    }).format(data.totalAmount || 0),
    formattedIssueDate: data.issueDate ? 
      new Date(data.issueDate).toLocaleDateString('bn-BD') : 
      new Date().toLocaleDateString('bn-BD'),
    formattedDueDate: data.dueDate ? 
      new Date(data.dueDate).toLocaleDateString('bn-BD') : 
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('bn-BD'),
    itemCount: data.items?.length || 0
  };
};

/**
 * Format client data for preview
 */
const formatClientForPreview = (data: any) => {
  return {
    ...data,
    displayName: data.companyName || data.name,
    businessTypeLabel: getBusinessTypeLabel(data.businessType),
    paymentTermsLabel: `${data.paymentTerms || 30} দিন`,
    formattedCreatedDate: data.createdDate ? 
      new Date(data.createdDate).toLocaleDateString('bn-BD') : 
      new Date().toLocaleDateString('bn-BD')
  };
};

/**
 * Format transaction data for preview
 */
const formatTransactionForPreview = (data: any) => {
  return {
    ...data,
    formattedAmount: new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(data.amount || 0),
    typeLabel: data.type === 'income' ? 'আয়' : 'ব্যয়',
    statusLabel: data.status === 'completed' ? 'সম্পন্ন' : 'অপেক্ষমাণ',
    formattedDate: data.date ? 
      new Date(data.date).toLocaleDateString('bn-BD') : 
      new Date().toLocaleDateString('bn-BD')
  };
};

/**
 * Get business type label in Bengali
 */
const getBusinessTypeLabel = (type: string): string => {
  switch (type) {
    case 'individual':
      return 'ব্যক্তিগত';
    case 'business':
      return 'ব্যবসায়িক';
    case 'company':
      return 'কোম্পানি';
    case 'organization':
      return 'সংস্থা';
    default:
      return 'অজানা';
  }
};

/**
 * Generate sample content for testing
 */
export const generateSampleContent = (type: 'invoice' | 'client' | 'transaction'): PreviewContent => {
  const timestamp = new Date().toISOString();

  switch (type) {
    case 'invoice':
      return {
        type: 'invoice',
        data: {
          invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
          clientName: 'নমুনা ক্লায়েন্ট',
          clientEmail: 'sample@example.com',
          clientPhone: '+880 1XXX-XXXXXX',
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          items: [
            { id: '1', description: 'নমুনা পণ্য ১', quantity: 2, rate: 5000, amount: 10000 },
            { id: '2', description: 'নমুনা পণ্য ২', quantity: 1, rate: 15000, amount: 15000 }
          ],
          subtotal: 25000,
          tax: 3750,
          totalAmount: 28750,
          currency: 'BDT'
        },
        timestamp,
        version: 1
      };

    case 'client':
      return {
        type: 'client',
        data: {
          name: 'নমুনা ক্লায়েন্ট',
          email: 'sample@example.com',
          phone: '+880 1XXX-XXXXXX',
          address: 'ঢাকা, বাংলাদেশ',
          companyName: 'নমুনা কোম্পানি লিমিটেড',
          businessType: 'company',
          paymentTerms: '30',
          currency: 'BDT'
        },
        timestamp,
        version: 1
      };

    case 'transaction':
      return {
        type: 'transaction',
        data: {
          type: 'income',
          description: 'নমুনা আয় লেনদেন',
          amount: 50000,
          category: 'Sales',
          date: new Date().toISOString().split('T')[0],
          status: 'completed'
        },
        timestamp,
        version: 1
      };

    default:
      throw new Error(`Unknown content type: ${type}`);
  }
};