import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Invoice } from '../types';
import { FileText, Eye } from 'lucide-react';
import { formatCurrency as formatCurrencyUtil, formatDate as formatDateUtil } from '../utils/formatters';

interface InvoiceListProps {
  onViewInvoice: (invoice: Invoice) => void;
  refresh: boolean;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({ onViewInvoice, refresh }) => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, [refresh]);

  const loadInvoices = async () => {
    if (!user) return;

    setLoading(true);

    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        customer:customers(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading invoices:', error);
    } else {
      setInvoices(data || []);
    }

    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return formatDateUtil(dateString);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${formatCurrencyUtil(amount)} ${currency}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-12 text-center">
        <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Henüz fatura yok</h3>
        <p className="text-slate-600">İlk faturanızı oluşturmak için yukarıdaki formu kullanın.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Faturalar</h2>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">
                  Fatura No
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">
                  Müşteri
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">
                  Tarih
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">
                  Vade
                </th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-slate-700">
                  Tutar
                </th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-slate-700">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <span className="font-semibold text-slate-900">
                      {invoice.invoice_number}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-slate-700">
                      {invoice.customer?.name || 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {formatDate(invoice.invoice_date)}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {formatDate(invoice.due_date)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="font-semibold text-blue-600">
                      {formatCurrency(invoice.total, invoice.currency)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewInvoice(invoice)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Görüntüle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
