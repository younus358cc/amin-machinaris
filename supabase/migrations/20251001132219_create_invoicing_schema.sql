/*
  # Invoice Management System Schema

  ## Overview
  This migration creates the complete database schema for an invoice management system
  with support for clients, invoices, line items, and transactions.

  ## New Tables

  ### 1. `clients`
  - `id` (uuid, primary key) - Unique client identifier
  - `name` (text) - Client full name
  - `email` (text, unique) - Client email address
  - `phone` (text) - Contact phone number
  - `address` (text) - Physical address
  - `company_name` (text) - Company name if applicable
  - `tax_id` (text) - Tax identification number
  - `business_type` (text) - Type of business (company/business/individual)
  - `payment_terms` (text) - Default payment terms in days
  - `preferred_payment_method` (text) - Preferred payment method
  - `billing_address` (text) - Billing address if different
  - `currency` (text) - Preferred currency
  - `language` (text) - Preferred language
  - `email_notifications` (boolean) - Email notification preference
  - `sms_notifications` (boolean) - SMS notification preference
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `invoices`
  - `id` (uuid, primary key) - Unique invoice identifier
  - `invoice_number` (text, unique) - Human-readable invoice number
  - `client_id` (uuid, foreign key) - Reference to clients table
  - `client_name` (text) - Client name snapshot
  - `client_email` (text) - Client email snapshot
  - `client_phone` (text) - Client phone snapshot
  - `client_address` (text) - Client address snapshot
  - `invoice_date` (date) - Invoice issue date
  - `due_date` (date) - Payment due date
  - `status` (text) - Invoice status (draft/sent/paid/overdue/partially_paid/cancelled)
  - `subtotal` (decimal) - Subtotal amount
  - `tax_rate` (decimal) - Tax rate percentage
  - `tax_amount` (decimal) - Tax amount
  - `discount` (decimal) - Discount amount
  - `total_amount` (decimal) - Total amount
  - `paid_amount` (decimal) - Amount paid
  - `currency` (text) - Currency code
  - `notes` (text) - Additional notes
  - `terms` (text) - Payment terms
  - `paid_date` (date) - Date when fully paid
  - `reminders_sent` (integer) - Number of reminders sent
  - `created_by` (text) - User who created the invoice
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `invoice_items`
  - `id` (uuid, primary key) - Unique item identifier
  - `invoice_id` (uuid, foreign key) - Reference to invoices table
  - `description` (text) - Item description
  - `quantity` (decimal) - Quantity
  - `rate` (decimal) - Rate per unit
  - `amount` (decimal) - Total amount for this item
  - `created_at` (timestamptz) - Creation timestamp

  ### 4. `transactions`
  - `id` (uuid, primary key) - Unique transaction identifier
  - `invoice_id` (uuid, foreign key, nullable) - Reference to invoices table
  - `type` (text) - Transaction type (income/expense)
  - `description` (text) - Transaction description
  - `amount` (decimal) - Transaction amount
  - `category` (text) - Category
  - `date` (date) - Transaction date
  - `status` (text) - Status (completed/pending)
  - `payment_method` (text) - Payment method used
  - `reference` (text) - Payment reference number
  - `notes` (text) - Additional notes
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Public access policies for demonstration purposes
  - In production, these should be restricted to authenticated users

  ## Indexes
  - Created indexes on foreign keys and frequently queried columns
  - Invoice number unique index for fast lookups
  - Client email unique index

  ## Notes
  - All monetary amounts use DECIMAL type for precision
  - Timestamps use timestamptz for timezone awareness
  - Default values set for boolean and timestamp fields
*/

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  company_name TEXT,
  tax_id TEXT,
  business_type TEXT DEFAULT 'individual',
  payment_terms TEXT DEFAULT '30',
  preferred_payment_method TEXT,
  billing_address TEXT,
  currency TEXT DEFAULT 'BDT',
  language TEXT DEFAULT 'bn',
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  client_address TEXT,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'partially_paid', 'cancelled', 'processing')),
  subtotal DECIMAL(15, 2) DEFAULT 0,
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  tax_amount DECIMAL(15, 2) DEFAULT 0,
  discount DECIMAL(15, 2) DEFAULT 0,
  total_amount DECIMAL(15, 2) DEFAULT 0,
  paid_amount DECIMAL(15, 2) DEFAULT 0,
  currency TEXT DEFAULT 'BDT',
  notes TEXT,
  terms TEXT,
  paid_date DATE,
  reminders_sent INTEGER DEFAULT 0,
  created_by TEXT DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  quantity DECIMAL(10, 2) DEFAULT 1,
  rate DECIMAL(15, 2) DEFAULT 0,
  amount DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  description TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  category TEXT,
  date DATE NOT NULL,
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'pending')),
  payment_method TEXT,
  reference TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_transactions_invoice_id ON transactions(invoice_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demo purposes)
-- In production, restrict these to authenticated users only

CREATE POLICY "Allow public read access to clients"
  ON clients FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to clients"
  ON clients FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to clients"
  ON clients FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to clients"
  ON clients FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access to invoices"
  ON invoices FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to invoices"
  ON invoices FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to invoices"
  ON invoices FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to invoices"
  ON invoices FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access to invoice_items"
  ON invoice_items FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to invoice_items"
  ON invoice_items FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to invoice_items"
  ON invoice_items FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to invoice_items"
  ON invoice_items FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access to transactions"
  ON transactions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to transactions"
  ON transactions FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to transactions"
  ON transactions FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to transactions"
  ON transactions FOR DELETE
  TO public
  USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to update updated_at automatically
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
