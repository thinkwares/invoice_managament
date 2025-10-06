import React from 'react';
import { FileText, Users, DollarSign, TrendingUp, CheckCircle, ArrowRight, Zap, Shield, Globe } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">InvoicePro</span>
            </div>
            <button
              onClick={onGetStarted}
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-50 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Professional Invoicing
              <span className="block text-blue-600 mt-2">Made Simple</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              Create, manage, and track invoices with ease. Built for businesses that value efficiency and professionalism.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onGetStarted}
                className="group px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all shadow-md border border-slate-200">
                Watch Demo
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-6">No credit card required • Free 14-day trial</p>
          </div>

          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none"></div>
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
              <div className="bg-slate-100 px-4 py-3 flex items-center gap-2 border-b border-slate-200">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="p-8 bg-gradient-to-br from-slate-50 to-white">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <div className="text-2xl font-bold text-slate-900">2,547</div>
                    <div className="text-sm text-slate-600">Total Invoices</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">$124,890</div>
                    <div className="text-sm text-slate-600">Revenue</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <div className="text-2xl font-bold text-green-600">98%</div>
                    <div className="text-sm text-slate-600">Paid Rate</div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">Invoice #INV-2024-001</div>
                        <div className="text-sm text-slate-600">Acme Corporation</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-slate-900">$5,250.00</div>
                      <div className="text-xs text-green-600 font-medium">Paid</div>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything You Need</h2>
            <p className="text-xl text-slate-600">Powerful features to streamline your invoicing workflow</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all bg-gradient-to-br from-white to-slate-50">
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Lightning Fast</h3>
              <p className="text-slate-600 leading-relaxed">
                Create professional invoices in seconds with our intuitive interface and smart templates.
              </p>
            </div>

            <div className="group p-8 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all bg-gradient-to-br from-white to-slate-50">
              <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Customer Management</h3>
              <p className="text-slate-600 leading-relaxed">
                Keep track of all your customers in one place. Easy access to contact details and history.
              </p>
            </div>

            <div className="group p-8 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all bg-gradient-to-br from-white to-slate-50">
              <div className="bg-orange-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <DollarSign className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Multi-Currency</h3>
              <p className="text-slate-600 leading-relaxed">
                Support for multiple currencies including USD, EUR, and TRY. Perfect for international business.
              </p>
            </div>

            <div className="group p-8 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all bg-gradient-to-br from-white to-slate-50">
              <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Analytics</h3>
              <p className="text-slate-600 leading-relaxed">
                Track your revenue, outstanding payments, and business growth with detailed insights.
              </p>
            </div>

            <div className="group p-8 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all bg-gradient-to-br from-white to-slate-50">
              <div className="bg-red-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Secure & Private</h3>
              <p className="text-slate-600 leading-relaxed">
                Enterprise-grade security with encrypted data storage. Your business data stays protected.
              </p>
            </div>

            <div className="group p-8 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all bg-gradient-to-br from-white to-slate-50">
              <div className="bg-cyan-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Multi-Language</h3>
              <p className="text-slate-600 leading-relaxed">
                Full support for English and Turkish languages. Switch seamlessly between languages.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Simple Workflow</h2>
            <p className="text-xl text-slate-600">Get started in minutes, not hours</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Create Your Profile</h3>
                <p className="text-slate-600 leading-relaxed">
                  Sign up and add your company details, logo, and bank information in minutes.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <ArrowRight className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="relative">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Add Customers</h3>
                <p className="text-slate-600 leading-relaxed">
                  Import or manually add customer information to build your client database.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <ArrowRight className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div>
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Create Invoices</h3>
                <p className="text-slate-600 leading-relaxed">
                  Generate professional invoices with automatic calculations and export as PDF.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Trusted by Businesses Worldwide</h2>
          <p className="text-xl text-slate-600 mb-12">
            Join thousands of companies that have simplified their invoicing process
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-slate-600">Active Users</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">500K+</div>
              <div className="text-slate-600">Invoices Created</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-slate-600">Uptime</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-12 shadow-2xl">
            <h3 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h3>
            <p className="text-blue-100 text-lg mb-8">
              Start creating professional invoices today. No credit card required.
            </p>
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">InvoicePro</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Professional invoicing software for modern businesses.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Licenses</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2025 InvoicePro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
