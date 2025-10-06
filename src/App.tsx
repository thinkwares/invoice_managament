import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { Auth } from './components/Auth';
import { LandingPage } from './components/LandingPage';
import { CompanySettings } from './components/CompanySettings';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoiceList } from './components/InvoiceList';
import { InvoicePreview } from './components/InvoicePreview';
import { CustomerList } from './components/CustomerList';
import { supabase } from './lib/supabase';
import { Company, Invoice } from './types';
import { FileText, LogOut, Settings, Users, Languages } from 'lucide-react';

const MainApp: React.FC = () => {
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [showLanding, setShowLanding] = useState(true);
  const [company, setCompany] = useState<Company | null>(null);
  const [showCompanySettings, setShowCompanySettings] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [refreshInvoices, setRefreshInvoices] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'list' | 'customers'>('create');

  useEffect(() => {
    if (user) {
      setShowLanding(false);
      loadCompany();
    }
  }, [user]);

  const loadCompany = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setCompany(data);
    } else {
      setShowCompanySettings(true);
    }
  };

  const handleViewInvoice = async (invoice: Invoice) => {
    const { data: items } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', invoice.id)
      .order('order_index');

    setSelectedInvoice({ ...invoice, items: items || [] });
  };

  const handleInvoiceSuccess = () => {
    setRefreshInvoices(!refreshInvoices);
    setActiveTab('list');
  };

  const handleSignOut = async () => {
    await signOut();
    setCompany(null);
  };

  if (!user && showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{t.nav.invoiceManagement}</h1>
                {company && (
                  <p className="text-xs text-slate-600">{company.name}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative group">
                <button
                  className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium"
                >
                  <Languages className="w-4 h-4" />
                  <span className="hidden sm:inline">{language.toUpperCase()}</span>
                </button>
                <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`w-full px-4 py-2 text-left hover:bg-slate-50 rounded-t-lg transition-colors ${
                      language === 'en' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-slate-700'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('tr')}
                    className={`w-full px-4 py-2 text-left hover:bg-slate-50 rounded-b-lg transition-colors ${
                      language === 'tr' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-slate-700'
                    }`}
                  >
                    Türkçe
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowCompanySettings(true)}
                className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">{t.nav.settings}</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t.nav.signOut}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1 inline-flex gap-1">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'create'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              {t.tabs.newInvoice}
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'list'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              {t.tabs.invoiceList}
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'customers'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              {t.tabs.customers}
            </button>
          </div>
        </div>

        {activeTab === 'create' && (
          <InvoiceForm company={company} onSuccess={handleInvoiceSuccess} />
        )}
        {activeTab === 'list' && (
          <InvoiceList onViewInvoice={handleViewInvoice} refresh={refreshInvoices} />
        )}
        {activeTab === 'customers' && (
          <CustomerList />
        )}
      </main>

      {showCompanySettings && (
        <CompanySettings
          onClose={() => setShowCompanySettings(false)}
          onSave={(savedCompany) => {
            setCompany(savedCompany);
            setShowCompanySettings(false);
          }}
        />
      )}

      {selectedInvoice && company && (
        <InvoicePreview
          invoice={selectedInvoice}
          company={company}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
