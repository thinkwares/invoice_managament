export interface Company {
  id: string;
  user_id: string;
  name: string;
  logo_url: string | null;
  address: string;
  phone: string;
  email: string;
  tax_number: string;
  bank_info: string;
}

export interface Customer {
  id: string;
  user_id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  tax_number: string;
  is_active: boolean;
}

export interface InvoiceItem {
  id?: string;
  invoice_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  total: number;
  order_index: number;
}

export interface Invoice {
  id: string;
  user_id: string;
  invoice_number: string;
  customer_id: string;
  invoice_date: string;
  due_date: string;
  currency: string;
  notes: string;
  subtotal: number;
  tax_total: number;
  total: number;
  customer?: Customer;
  items?: InvoiceItem[];
}

export type Currency = 'TL' | 'USD' | 'EUR';
