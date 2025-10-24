import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  getBillingSummary, 
  getInvoices, 
  getPayments, 
  getClaims,
  getPatientBillingSummary,
  insuranceProviders 
} from '../utils/billingData';
import InvoiceList from '../components/billing/InvoiceList';
import PaymentList from '../components/billing/PaymentList';
import ClaimsList from '../components/billing/ClaimsList';
import BillingReports from '../components/billing/BillingReports';
import CreateInvoice from '../components/billing/CreateInvoice';

const Billing = () => {
  const { user, isPatient } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [summary, setSummary] = useState(null);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);

  useEffect(() => {
    // Load different billing data based on user role
    if (isPatient && user?.id) {
      // For patients, load only their billing data
      const patientSummary = getPatientBillingSummary(user.id);
      setSummary(patientSummary);
    } else {
      // For doctors/admin, load full billing summary
      setSummary(getBillingSummary());
    }
  }, [isPatient, user]);

  // Different tabs for patients vs doctors/admin
  const tabs = isPatient ? [
    { id: 'overview', name: 'My Bills', icon: '📊' },
    { id: 'invoices', name: 'My Invoices', icon: '🧾' },
    { id: 'payments', name: 'Payment History', icon: '💳' },
  ] : [
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
          <h1 className="text-3xl font-bold text-gray-900">
            {isPatient ? 'My Bills & Payments' : 'Billing & Payments'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isPatient 
              ? 'View your bills, payment history, and make payments' 
              : 'Manage invoices, payments, and insurance claims'
            }
          </p>
        </div>
        {!isPatient && (
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
        )}
      </div>

      {/* Summary Cards */}
      {activeTab === 'overview' && (
        <div className={`grid grid-cols-1 md:grid-cols-2 ${isPatient ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6 mb-6`}>
          <div className="medical-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  {isPatient ? 'Total Billed' : 'Total Revenue'}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${isPatient ? summary.totalBilled?.toLocaleString() || '0' : summary.totalRevenue?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">
                {isPatient 
                  ? `${summary.invoiceCount || 0} invoices` 
                  : `${summary.collectionRate || 0}% collection rate`
                }
              </span>
            </div>
          </div>

          <div className="medical-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  {isPatient ? 'Current Balance' : 'Outstanding Balance'}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${isPatient ? summary.currentBalance?.toLocaleString() || '0' : summary.totalOutstanding?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <span className="text-2xl">⏰</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-red-600 font-medium">
                {isPatient 
                  ? 'Amount due'
                  : `${summary.overdueInvoices || 0} overdue invoices`
                }
              </span>
            </div>
          </div>

          <div className="medical-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  {isPatient ? 'Total Paid' : 'Recent Payments'}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${isPatient ? summary.totalPaid?.toLocaleString() || '0' : summary.recentPayments?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">
                {isPatient 
                  ? (summary.lastPayment ? `Last payment: ${summary.lastPayment.paymentDate.toLocaleDateString()}` : 'No payments yet')
                  : 'Last 30 days'
                }
              </span>
            </div>
          </div>

          {!isPatient && (
            <div className="medical-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Pending Claims</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {summary.pendingClaims || 0}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <span className="text-2xl">🏥</span>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-600">
                  Avg. {summary.averagePaymentTime || 0} days to process
                </span>
              </div>
            </div>
          )}
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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {isPatient ? 'My Recent Bills' : 'Recent Activity'}
              </h2>
              <div className="space-y-4">
                {(isPatient 
                  ? getInvoices({ patientId: user?.id }).slice(0, 5)
                  : getInvoices().slice(0, 5)
                ).map((invoice) => (
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
              {isPatient ? (
                <>
                  <div className="medical-card p-6 text-center">
                    <div className="p-4 bg-green-100 rounded-lg inline-block mb-4">
                      <span className="text-3xl">💳</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Make Payment</h3>
                    <p className="text-gray-600 mb-4">Pay your outstanding bills online</p>
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                      Pay Now
                    </button>
                  </div>

                  <div className="medical-card p-6 text-center">
                    <div className="p-4 bg-blue-100 rounded-lg inline-block mb-4">
                      <span className="text-3xl">🧾</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">View Statements</h3>
                    <p className="text-gray-600 mb-4">Download and view your billing statements</p>
                    <button 
                      onClick={() => setActiveTab('invoices')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      View Statements
                    </button>
                  </div>

                  <div className="medical-card p-6 text-center">
                    <div className="p-4 bg-purple-100 rounded-lg inline-block mb-4">
                      <span className="text-3xl">📋</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment History</h3>
                    <p className="text-gray-600 mb-4">View your payment history and receipts</p>
                    <button 
                      onClick={() => setActiveTab('payments')}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      View History
                    </button>
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'invoices' && <InvoiceList isPatient={isPatient} patientId={user?.id} />}
        {activeTab === 'payments' && <PaymentList isPatient={isPatient} patientId={user?.id} />}
        {!isPatient && activeTab === 'claims' && <ClaimsList />}
        {!isPatient && activeTab === 'reports' && <BillingReports />}
      </div>

      {/* Create Invoice Modal - Only for doctors/admin */}
      {!isPatient && showCreateInvoice && (
        <CreateInvoice onClose={() => setShowCreateInvoice(false)} />
      )}
    </div>
  );
};

export default Billing;