import { supabase } from '../lib/supabase';
import { InvoiceStatus } from '../components/StatusIcon';

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id?: string;
  invoice_number: string;
  client_id?: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  client_address?: string;
  invoice_date: string;
  due_date: string;
  status: InvoiceStatus;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount: number;
  total_amount: number;
  paid_amount?: number;
  currency: string;
  notes?: string;
  terms?: string;
  paid_date?: string;
  reminders_sent?: number;
  created_by?: string;
  items: InvoiceItem[];
}

export interface Client {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company_name?: string;
  tax_id?: string;
  business_type?: string;
  payment_terms?: string;
  preferred_payment_method?: string;
  billing_address?: string;
  currency?: string;
  language?: string;
  email_notifications?: boolean;
  sms_notifications?: boolean;
}

export interface Transaction {
  id?: string;
  invoice_id?: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category: string;
  date: string;
  status: 'completed' | 'pending';
  payment_method?: string;
  reference?: string;
  notes?: string;
}

export class InvoiceDatabase {
  // Create a new invoice with items
  static async createInvoice(invoice: Invoice): Promise<{ data: Invoice | null; error: any }> {
    try {
      // Insert invoice
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoice.invoice_number,
          client_id: invoice.client_id,
          client_name: invoice.client_name,
          client_email: invoice.client_email,
          client_phone: invoice.client_phone,
          client_address: invoice.client_address,
          invoice_date: invoice.invoice_date,
          due_date: invoice.due_date,
          status: invoice.status,
          subtotal: invoice.subtotal,
          tax_rate: invoice.tax_rate,
          tax_amount: invoice.tax_amount,
          discount: invoice.discount,
          total_amount: invoice.total_amount,
          paid_amount: invoice.paid_amount || 0,
          currency: invoice.currency,
          notes: invoice.notes,
          terms: invoice.terms,
          reminders_sent: invoice.reminders_sent || 0,
          created_by: invoice.created_by || 'user'
        })
        .select()
        .single();

      if (invoiceError) {
        console.error('Error creating invoice:', invoiceError);
        return { data: null, error: invoiceError };
      }

      // Insert invoice items
      if (invoice.items && invoice.items.length > 0) {
        const itemsToInsert = invoice.items.map(item => ({
          invoice_id: invoiceData.id,
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount
        }));

        const { error: itemsError } = await supabase
          .from('invoice_items')
          .insert(itemsToInsert);

        if (itemsError) {
          console.error('Error creating invoice items:', itemsError);
          return { data: null, error: itemsError };
        }
      }

      // Fetch complete invoice with items
      return await this.getInvoiceById(invoiceData.id);
    } catch (error) {
      console.error('Unexpected error creating invoice:', error);
      return { data: null, error };
    }
  }

  // Get all invoices with items
  static async getInvoices(): Promise<{ data: Invoice[] | null; error: any }> {
    try {
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (invoicesError) {
        return { data: null, error: invoicesError };
      }

      // Fetch items for all invoices
      const invoiceIds = invoicesData.map(inv => inv.id);
      const { data: itemsData, error: itemsError } = await supabase
        .from('invoice_items')
        .select('*')
        .in('invoice_id', invoiceIds);

      if (itemsError) {
        return { data: null, error: itemsError };
      }

      // Combine invoices with their items
      const invoices = invoicesData.map(invoice => ({
        ...invoice,
        items: itemsData.filter(item => item.invoice_id === invoice.id)
      }));

      return { data: invoices, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get invoice by ID
  static async getInvoiceById(id: string): Promise<{ data: Invoice | null; error: any }> {
    try {
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single();

      if (invoiceError) {
        return { data: null, error: invoiceError };
      }

      const { data: itemsData, error: itemsError } = await supabase
        .from('invoice_items')
        .select('*')
        .eq('invoice_id', id);

      if (itemsError) {
        return { data: null, error: itemsError };
      }

      return {
        data: {
          ...invoiceData,
          items: itemsData || []
        },
        error: null
      };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Update invoice
  static async updateInvoice(id: string, updates: Partial<Invoice>): Promise<{ data: Invoice | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error };
      }

      return await this.getInvoiceById(id);
    } catch (error) {
      return { data: null, error };
    }
  }

  // Delete invoice
  static async deleteInvoice(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);

      return { error };
    } catch (error) {
      return { error };
    }
  }

  // Client operations
  static async createClient(client: Client): Promise<{ data: Client | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert(client)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async getClients(): Promise<{ data: Client[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async updateClient(id: string, updates: Partial<Client>): Promise<{ data: Client | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async deleteClient(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      return { error };
    } catch (error) {
      return { error };
    }
  }

  // Transaction operations
  static async createTransaction(transaction: Transaction): Promise<{ data: Transaction | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert(transaction)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async getTransactions(): Promise<{ data: Transaction[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }
}
