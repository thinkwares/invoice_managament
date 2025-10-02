import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Customer, InvoiceItem, Currency, Company } from '../types';
import { Plus, Trash2, Save } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface InvoiceFormProps {
  company: Company | null;
  onSuccess: () => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ company, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showNewCustomer, setShowNewCustomer] = useState(false);

  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: '',
    address: '',
    phone: '',
    email: '',
    tax_number: '',
  });

  const [invoice, setInvoice] = useState({
    customer_id: '',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: new Date().toISOString().split('T')[0],
    currency: 'TL' as Currency,
    notes: '',
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 1, unit_price: 0, tax_rate: 18, total: 0, order_index: 0 },
  ]);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('name');

    if (data) {
      setCustomers(data);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      { description: '', quantity: 1, unit_price: 0, tax_rate: 18, total: 0, order_index: items.length },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    const quantity = newItems[index].quantity;
    const unitPrice = newItems[index].unit_price;
    const taxRate = newItems[index].tax_rate;

    const subtotal = quantity * unitPrice;
    const tax = subtotal * (taxRate / 100);
    newItems[index].total = subtotal + tax;

    setItems(newItems);
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let taxTotal = 0;

    items.forEach(item => {
      const itemSubtotal = item.quantity * item.unit_price;
      const itemTax = itemSubtotal * (item.tax_rate / 100);
      subtotal += itemSubtotal;
      taxTotal += itemTax;
    });

    return { subtotal, taxTotal, total: subtotal + taxTotal };
  };

  const handleAddCustomer = async () => {
    if (!user || !newCustomer.name) return;

    const { data, error } = await supabase
      .from('customers')
      .insert({ ...newCustomer, user_id: user.id })
      .select()
      .single();

    if (error) {
      console.error('Error adding customer:', error);
      return;
    }

    setCustomers([...customers, data]);
    setInvoice({ ...invoice, customer_id: data.id });
    setShowNewCustomer(false);
    setNewCustomer({ name: '', address: '', phone: '', email: '', tax_number: '' });
  };

  const getNextInvoiceNumber = async (): Promise<string> => {
    if (!user) return 'INV-0001';

    const { data } = await supabase
      .from('invoices')
      .select('invoice_number')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (data && data.length > 0) {
      const lastNumber = parseInt(data[0].invoice_number.split('-')[1]) || 0;
      return `INV-${String(lastNumber + 1).padStart(4, '0')}`;
    }

    return 'INV-0001';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !invoice.customer_id) return;

    setLoading(true);

    try {
      const totals = calculateTotals();
      const invoiceNumber = await getNextInvoiceNumber();

      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          user_id: user.id,
          invoice_number: invoiceNumber,
          customer_id: invoice.customer_id,
          invoice_date: invoice.invoice_date,
          due_date: invoice.due_date,
          currency: invoice.currency,
          notes: invoice.notes,
          subtotal: totals.subtotal,
          tax_total: totals.taxTotal,
          total: totals.total,
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      const itemsToInsert = items.map((item, index) => ({
        invoice_id: invoiceData.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_rate: item.tax_rate,
        total: item.total,
        order_index: index,
      }));

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      setInvoice({
        customer_id: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date().toISOString().split('T')[0],
        currency: 'TL',
        notes: '',
      });

      setItems([
        { description: '', quantity: 1, unit_price: 0, tax_rate: 18, total: 0, order_index: 0 },
      ]);

      onSuccess();
    } catch (error) {
      console.error('Error creating invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotals();

  if (!company) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800 font-medium">
          Fatura oluşturmadan önce lütfen firma bilgilerinizi ekleyin.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Müşteri Bilgileri</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Müşteri Seç
            </label>
            <div className="flex gap-2">
              <select
                value={invoice.customer_id}
                onChange={(e) => setInvoice({ ...invoice, customer_id: e.target.value })}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              >
                <option value="">Müşteri seçin...</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewCustomer(!showNewCustomer)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
              >
                Yeni Müşteri
              </button>
            </div>
          </div>

          {showNewCustomer && (
            <div className="bg-slate-50 rounded-lg p-4 space-y-3 border border-slate-200">
              <input
                type="text"
                placeholder="Müşteri Adı *"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <textarea
                placeholder="Adres"
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="tel"
                  placeholder="Telefon"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <input
                  type="email"
                  placeholder="E-posta"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <input
                type="text"
                placeholder="Vergi/TC No"
                value={newCustomer.tax_number}
                onChange={(e) => setNewCustomer({ ...newCustomer, tax_number: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomer}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Müşteri Ekle
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Fatura Detayları</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Fatura Tarihi
            </label>
            <input
              type="date"
              value={invoice.invoice_date}
              onChange={(e) => setInvoice({ ...invoice, invoice_date: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Vade Tarihi
            </label>
            <input
              type="date"
              value={invoice.due_date}
              onChange={(e) => setInvoice({ ...invoice, due_date: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Para Birimi
            </label>
            <select
              value={invoice.currency}
              onChange={(e) => setInvoice({ ...invoice, currency: e.target.value as Currency })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="TL">TL</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Ürün/Hizmetler</h3>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Satır Ekle
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">Açıklama</th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-slate-700 w-24">Miktar</th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-slate-700 w-32">Birim Fiyat</th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-slate-700 w-24">KDV %</th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-slate-700 w-32">Toplam</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b border-slate-100">
                  <td className="py-3 px-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                      required
                    />
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-right"
                      min="0"
                      step="0.01"
                      required
                    />
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="number"
                      value={item.unit_price}
                      onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-right"
                      min="0"
                      step="0.01"
                      required
                    />
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="number"
                      value={item.tax_rate}
                      onChange={(e) => updateItem(index, 'tax_rate', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-right"
                      min="0"
                      step="0.01"
                      required
                    />
                  </td>
                  <td className="py-3 px-2 text-right font-semibold text-slate-900 text-sm">
                    {formatCurrency(item.total)}
                  </td>
                  <td className="py-3 px-2">
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <div className="w-80 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Ara Toplam:</span>
              <span className="font-semibold text-slate-900">
                {formatCurrency(totals.subtotal)} {invoice.currency}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">KDV:</span>
              <span className="font-semibold text-slate-900">
                {formatCurrency(totals.taxTotal)} {invoice.currency}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-slate-200 pt-2">
              <span className="text-slate-900">Genel Toplam:</span>
              <span className="text-blue-600">
                {formatCurrency(totals.total)} {invoice.currency}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Notlar</h3>
        <textarea
          value={invoice.notes}
          onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
          rows={4}
          placeholder="Ödeme şartları, ek notlar vb..."
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg shadow-lg shadow-blue-500/30"
      >
        <Save className="w-5 h-5" />
        {loading ? 'Kaydediliyor...' : 'Faturayı Kaydet'}
      </button>
    </form>
  );
};
