import React, { useRef } from 'react';
import { Invoice, Company } from '../types';
import { X, Printer, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatCurrency as formatCurrencyUtil, formatDate as formatDateUtil } from '../utils/formatters';
import { useLanguage } from '../contexts/LanguageContext';

interface InvoicePreviewProps {
  invoice: Invoice;
  company: Company;
  onClose: () => void;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, company, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const formatDate = (dateString: string) => {
    return formatDateUtil(dateString);
  };

  const formatCurrency = (amount: number) => {
    return formatCurrencyUtil(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;

    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${invoice.invoice_number}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between print:hidden">
          <h2 className="text-xl font-semibold text-slate-900">{t.preview.title}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
            >
              <Printer className="w-4 h-4" />
              {t.preview.print}
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Download className="w-4 h-4" />
              {t.preview.download}
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors p-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div ref={printRef} className="p-12 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-start mb-12">
              <div className="flex-1">
                {company.logo_url && (
                  <img
                    src={company.logo_url}
                    alt={company.name}
                    className="h-20 w-auto object-contain mb-4"
                  />
                )}
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{company.name}</h1>
                <div className="text-slate-600 space-y-1">
                  {company.address && <p>{company.address}</p>}
                  {company.phone && <p>Tel: {company.phone}</p>}
                  {company.email && <p>Email: {company.email}</p>}
                  {company.tax_number && <p>Tax ID: {company.tax_number}</p>}
                </div>
              </div>
              <div className="text-right">
                <div className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg mb-4">
                  <h2 className="text-2xl font-bold">{t.preview.invoice}</h2>
                </div>
                <div className="text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-900">{invoice.invoice_number}</p>
                  <p>Date: {formatDate(invoice.invoice_date)}</p>
                  <p>Due: {formatDate(invoice.due_date)}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-slate-900 mb-3">{t.invoice.invoiceTo}:</h3>
              <div className="text-slate-700 space-y-1">
                <p className="font-semibold text-lg">{invoice.customer?.name}</p>
                {invoice.customer?.address && <p>{invoice.customer.address}</p>}
                {invoice.customer?.phone && <p>Tel: {invoice.customer.phone}</p>}
                {invoice.customer?.email && <p>Email: {invoice.customer.email}</p>}
                {invoice.customer?.tax_number && <p>Tax ID: {invoice.customer.tax_number}</p>}
              </div>
            </div>

            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-300">
                    <th className="text-left py-3 px-2 font-semibold text-slate-900">{t.invoice.description}</th>
                    <th className="text-right py-3 px-2 font-semibold text-slate-900 w-20">{t.invoice.quantity}</th>
                    <th className="text-right py-3 px-2 font-semibold text-slate-900 w-28">{t.invoice.unitPrice}</th>
                    <th className="text-right py-3 px-2 font-semibold text-slate-900 w-20">{t.invoice.taxRate}</th>
                    <th className="text-right py-3 px-2 font-semibold text-slate-900 w-28">{t.invoice.total}</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items?.map((item, index) => (
                    <tr key={index} className="border-b border-slate-200">
                      <td className="py-3 px-2 text-slate-700">{item.description}</td>
                      <td className="py-3 px-2 text-right text-slate-700">{formatCurrency(item.quantity)}</td>
                      <td className="py-3 px-2 text-right text-slate-700">{formatCurrency(item.unit_price)}</td>
                      <td className="py-3 px-2 text-right text-slate-700">{formatCurrency(item.tax_rate)}</td>
                      <td className="py-3 px-2 text-right font-semibold text-slate-900">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mb-8">
              <div className="w-80">
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-slate-700">
                    <span>{t.invoice.subtotal}:</span>
                    <span>{formatCurrency(invoice.subtotal)} {invoice.currency}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>{t.invoice.taxTotal}:</span>
                    <span>{formatCurrency(invoice.tax_total)} {invoice.currency}</span>
                  </div>
                </div>
                <div className="flex justify-between text-xl font-bold text-slate-900 border-t-2 border-slate-300 pt-3">
                  <span>{t.invoice.total}:</span>
                  <span className="text-blue-600">{formatCurrency(invoice.total)} {invoice.currency}</span>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="bg-slate-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-slate-900 mb-2">{t.invoice.notes}:</h3>
                <p className="text-slate-700 whitespace-pre-wrap">{invoice.notes}</p>
              </div>
            )}

            {company.bank_info && (
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="font-semibold text-slate-900 mb-2">{t.invoice.paymentInfo}:</h3>
                <p className="text-slate-700 whitespace-pre-wrap">{company.bank_info}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
