import React, { useState, useEffect } from 'react';
import { 
  getBillingSummary, 
  getInvoices, 
  getPayments, 
  getClaims,
  insuranceProviders 
} from '../utils/billingData';
import InvoiceList from '../components/billing/InvoiceList';
import PaymentList from '../components/billing/PaymentList';
import ClaimsList from '../components/billing/ClaimsList';
import BillingReports from '../components/billing/BillingReports';
import CreateInvoice from '../components/billing/CreateInvoice';

const Billing = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [summary, setSummary] = useState(null);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);

  useEffect(() => {
    setSummary(getBillingSummary());
  }, []);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'invoices', name: 'Invoices', icon: '🧾' },
    { id: 'payments', name: 'Payments', icon: '💳' },
    { id: 'claims', name: 'Insurance Claims', icon: '🏥' },
    { id: 'reports', name: 'Reports', icon: '📈' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'overdue': return 'text-red-600 bg-red-50';
      case 'partial': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (!summary) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading billing data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
          <p className="text-gray-600 mt-1">Manage invoices, payments, and insurance claims</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowCreateInvoice(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <span>➕</span>
            <span>Create Invoice</span>
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <span>💳</span>
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="medical-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${summary.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">
                {summary.collectionRate}% collection rate
              </span>
            </div>
          </div>

          <div className="medical-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Outstanding Balance</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${summary.totalOutstanding.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <span className="text-2xl">⏰</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-red-600 font-medium">
                {summary.overdueInvoices} overdue invoices
              </span>
            </div>
          </div>

          <div className="medical-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Recent Payments</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${summary.recentPayments.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">Last 30 days</span>
            </div>
          </div>

          <div className="medical-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Claims</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {summary.pendingClaims}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <span className="text-2xl">🏥</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">
                Avg. {summary.averagePaymentTime} days to process
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="medical-card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {getInvoices().slice(0, 5).map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <span className="text-blue-600">🧾</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{invoice.id}</p>
                        <p className="text-sm text-gray-600">{invoice.patientName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${invoice.total}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                        {invoice.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="medical-card p-6 text-center">
                <div className="p-4 bg-blue-100 rounded-lg inline-block mb-4">
                  <span className="text-3xl">🧾</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Invoice</h3>
                <p className="text-gray-600 mb-4">Generate new invoices for patient services</p>
                <button 
                  onClick={() => setShowCreateInvoice(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Get Started
                </button>
              </div>

              <div className="medical-card p-6 text-center">
                <div className="p-4 bg-green-100 rounded-lg inline-block mb-4">
                  <span className="text-3xl">💳</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Record Payment</h3>
                <p className="text-gray-600 mb-4">Process and track patient payments</p>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Record Now
                </button>
              </div>

              <div className="medical-card p-6 text-center">
                <div className="p-4 bg-purple-100 rounded-lg inline-block mb-4">
                  <span className="text-3xl">📈</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">View Reports</h3>
                <p className="text-gray-600 mb-4">Analyze revenue and payment trends</p>
                <button 
                  onClick={() => setActiveTab('reports')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  View Reports
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'invoices' && <InvoiceList />}
        {activeTab === 'payments' && <PaymentList />}
        {activeTab === 'claims' && <ClaimsList />}
        {activeTab === 'reports' && <BillingReports />}
      </div>

      {/* Create Invoice Modal */}
      {showCreateInvoice && (
        <CreateInvoice onClose={() => setShowCreateInvoice(false)} />
      )}
    </div>
  );
};

export default Billing;