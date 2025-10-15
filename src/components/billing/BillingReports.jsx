import React, { useState, useEffect } from 'react';
import { 
  getBillingSummary, 
  getInvoices, 
  getPayments, 
  getClaims,
  insuranceProviders 
} from '../../utils/billingData';

const BillingReports = () => {
  const [reportType, setReportType] = useState('revenue');
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    generateReport();
  }, [reportType, dateRange]);

  const generateReport = () => {
    const invoices = getInvoices({
      dateFrom: dateRange.from,
      dateTo: dateRange.to
    });
    const payments = getPayments();
    const claims = getClaims();
    const summary = getBillingSummary();

    switch (reportType) {
      case 'revenue':
        generateRevenueReport(invoices, payments);
        break;
      case 'aging':
        generateAgingReport(invoices);
        break;
      case 'insurance':
        generateInsuranceReport(claims);
        break;
      case 'payments':
        generatePaymentReport(payments);
        break;
      default:
        setReportData(null);
    }
  };

  const generateRevenueReport = (invoices, payments) => {
    // Monthly revenue breakdown
    const monthlyData = {};
    const now = new Date();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = date.toISOString().slice(0, 7); // YYYY-MM format
      monthlyData[key] = {
        month: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        billed: 0,
        collected: 0,
        outstanding: 0
      };
    }

    // Calculate billed amounts
    invoices.forEach(invoice => {
      const month = invoice.invoiceDate.toISOString().slice(0, 7);
      if (monthlyData[month]) {
        monthlyData[month].billed += invoice.total;
        monthlyData[month].outstanding += invoice.balance;
      }
    });

    // Calculate collected amounts
    payments.forEach(payment => {
      const month = payment.paymentDate.toISOString().slice(0, 7);
      if (monthlyData[month]) {
        monthlyData[month].collected += payment.amount;
      }
    });

    const totalBilled = Object.values(monthlyData).reduce((sum, month) => sum + month.billed, 0);
    const totalCollected = Object.values(monthlyData).reduce((sum, month) => sum + month.collected, 0);
    const totalOutstanding = Object.values(monthlyData).reduce((sum, month) => sum + month.outstanding, 0);

    setReportData({
      type: 'revenue',
      monthlyData: Object.values(monthlyData),
      summary: {
        totalBilled,
        totalCollected,
        totalOutstanding,
        collectionRate: totalBilled > 0 ? (totalCollected / totalBilled) * 100 : 0
      }
    });
  };

  const generateAgingReport = (invoices) => {
    const today = new Date();
    const aging = {
      current: { count: 0, amount: 0 },
      days30: { count: 0, amount: 0 },
      days60: { count: 0, amount: 0 },
      days90: { count: 0, amount: 0 },
      days120: { count: 0, amount: 0 }
    };

    invoices.filter(invoice => invoice.balance > 0).forEach(invoice => {
      const daysPastDue = Math.floor((today - invoice.dueDate) / (1000 * 60 * 60 * 24));
      
      if (daysPastDue <= 0) {
        aging.current.count++;
        aging.current.amount += invoice.balance;
      } else if (daysPastDue <= 30) {
        aging.days30.count++;
        aging.days30.amount += invoice.balance;
      } else if (daysPastDue <= 60) {
        aging.days60.count++;
        aging.days60.amount += invoice.balance;
      } else if (daysPastDue <= 90) {
        aging.days90.count++;
        aging.days90.amount += invoice.balance;
      } else {
        aging.days120.count++;
        aging.days120.amount += invoice.balance;
      }
    });

    setReportData({
      type: 'aging',
      aging
    });
  };

  const generateInsuranceReport = (claims) => {
    const insuranceStats = {};
    
    insuranceProviders.forEach(provider => {
      insuranceStats[provider.id] = {
        name: provider.name,
        code: provider.code,
        submitted: 0,
        approved: 0,
        denied: 0,
        pending: 0,
        totalAmount: 0,
        approvedAmount: 0
      };
    });

    claims.forEach(claim => {
      const providerId = claim.insuranceProvider.id;
      if (insuranceStats[providerId]) {
        insuranceStats[providerId].submitted++;
        insuranceStats[providerId].totalAmount += claim.amount;
        insuranceStats[providerId].approvedAmount += claim.approvedAmount;
        
        if (claim.status === 'approved') {
          insuranceStats[providerId].approved++;
        } else if (claim.status === 'denied') {
          insuranceStats[providerId].denied++;
        } else if (claim.status === 'pending' || claim.status === 'submitted') {
          insuranceStats[providerId].pending++;
        }
      }
    });

    setReportData({
      type: 'insurance',
      insuranceStats: Object.values(insuranceStats).filter(stat => stat.submitted > 0)
    });
  };

  const generatePaymentReport = (payments) => {
    const paymentMethods = {};
    const monthlyPayments = {};
    
    // Initialize payment methods
    ['cash', 'check', 'credit-card', 'insurance', 'bank-transfer'].forEach(method => {
      paymentMethods[method] = { count: 0, amount: 0 };
    });

    // Calculate payment method breakdown
    payments.forEach(payment => {
      if (paymentMethods[payment.paymentMethod]) {
        paymentMethods[payment.paymentMethod].count++;
        paymentMethods[payment.paymentMethod].amount += payment.amount;
      }

      // Monthly breakdown
      const month = payment.paymentDate.toISOString().slice(0, 7);
      if (!monthlyPayments[month]) {
        monthlyPayments[month] = { amount: 0, count: 0 };
      }
      monthlyPayments[month].amount += payment.amount;
      monthlyPayments[month].count++;
    });

    const totalPayments = Object.values(paymentMethods).reduce((sum, method) => sum + method.amount, 0);

    setReportData({
      type: 'payments',
      paymentMethods,
      monthlyPayments,
      totalPayments
    });
  };

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${Math.round(value)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <div className="medical-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex space-x-4">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="revenue">Revenue Report</option>
              <option value="aging">Aging Report</option>
              <option value="insurance">Insurance Analysis</option>
              <option value="payments">Payment Analysis</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700">Date Range:</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => handleDateRangeChange('from', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => handleDateRangeChange('to', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      {reportData && (
        <div className="space-y-6">
          {/* Revenue Report */}
          {reportData.type === 'revenue' && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="medical-card p-6 text-center">
                  <p className="text-gray-600 text-sm font-medium">Total Billed</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(reportData.summary.totalBilled)}
                  </p>
                </div>
                <div className="medical-card p-6 text-center">
                  <p className="text-gray-600 text-sm font-medium">Total Collected</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {formatCurrency(reportData.summary.totalCollected)}
                  </p>
                </div>
                <div className="medical-card p-6 text-center">
                  <p className="text-gray-600 text-sm font-medium">Outstanding</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">
                    {formatCurrency(reportData.summary.totalOutstanding)}
                  </p>
                </div>
                <div className="medical-card p-6 text-center">
                  <p className="text-gray-600 text-sm font-medium">Collection Rate</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {formatPercentage(reportData.summary.collectionRate)}
                  </p>
                </div>
              </div>

              {/* Monthly Breakdown */}
              <div className="medical-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Breakdown</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Month</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Billed</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Collected</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Outstanding</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Collection %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {reportData.monthlyData.map((month, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{month.month}</td>
                          <td className="py-3 px-4 text-right">{formatCurrency(month.billed)}</td>
                          <td className="py-3 px-4 text-right text-green-600">{formatCurrency(month.collected)}</td>
                          <td className="py-3 px-4 text-right text-orange-600">{formatCurrency(month.outstanding)}</td>
                          <td className="py-3 px-4 text-right">
                            {month.billed > 0 ? formatPercentage((month.collected / month.billed) * 100) : '0%'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Aging Report */}
          {reportData.type === 'aging' && (
            <div className="medical-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Accounts Receivable Aging</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {[
                  { key: 'current', label: 'Current', color: 'green' },
                  { key: 'days30', label: '1-30 Days', color: 'yellow' },
                  { key: 'days60', label: '31-60 Days', color: 'orange' },
                  { key: 'days90', label: '61-90 Days', color: 'red' },
                  { key: 'days120', label: '90+ Days', color: 'red' }
                ].map(period => (
                  <div key={period.key} className="text-center p-4 border rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-2">{period.label}</div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {formatCurrency(reportData.aging[period.key].amount)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {reportData.aging[period.key].count} invoices
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insurance Analysis */}
          {reportData.type === 'insurance' && (
            <div className="medical-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance Provider Analysis</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Provider</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Claims</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Total Amount</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Approved</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Denied</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Approval Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportData.insuranceStats.map((provider, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium">{provider.name}</div>
                          <div className="text-sm text-gray-500">{provider.code}</div>
                        </td>
                        <td className="py-3 px-4 text-right">{provider.submitted}</td>
                        <td className="py-3 px-4 text-right">{formatCurrency(provider.totalAmount)}</td>
                        <td className="py-3 px-4 text-right text-green-600">{provider.approved}</td>
                        <td className="py-3 px-4 text-right text-red-600">{provider.denied}</td>
                        <td className="py-3 px-4 text-right">
                          {provider.submitted > 0 
                            ? formatPercentage((provider.approved / provider.submitted) * 100)
                            : '0%'
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payment Analysis */}
          {reportData.type === 'payments' && (
            <div className="space-y-6">
              {/* Payment Methods */}
              <div className="medical-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods Breakdown</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {Object.entries(reportData.paymentMethods).map(([method, data]) => (
                    <div key={method} className="text-center p-4 border rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-2 capitalize">
                        {method.replace('-', ' ')}
                      </div>
                      <div className="text-xl font-bold text-gray-900 mb-1">
                        {formatCurrency(data.amount)}
                      </div>
                      <div className="text-sm text-gray-600">{data.count} payments</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {reportData.totalPayments > 0 
                          ? formatPercentage((data.amount / reportData.totalPayments) * 100)
                          : '0%'
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!reportData && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Generating Report</h3>
          <p className="text-gray-600">Please wait while we compile your billing data...</p>
        </div>
      )}
    </div>
  );
};

export default BillingReports;