import React, { useState, useEffect } from 'react';
import { getPayments } from '../../utils/billingData';

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    paymentMethod: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    const data = getPayments();
    setPayments(data);
    setFilteredPayments(data);
  }, []);

  useEffect(() => {
    let filtered = [...payments];
    
    if (filters.paymentMethod) {
      filtered = filtered.filter(payment => payment.paymentMethod === filters.paymentMethod);
    }
    
    if (filters.dateFrom) {
      filtered = filtered.filter(payment => 
        new Date(payment.paymentDate) >= new Date(filters.dateFrom)
      );
    }
    
    if (filters.dateTo) {
      filtered = filtered.filter(payment => 
        new Date(payment.paymentDate) <= new Date(filters.dateTo)
      );
    }
    
    if (searchTerm) {
      filtered = filtered.filter(payment => 
        payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredPayments(filtered);
  }, [filters, searchTerm, payments]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'cash': return '💵';
      case 'check': return '📝';
      case 'credit-card': return '💳';
      case 'insurance': return '🏥';
      case 'bank-transfer': return '🏦';
      default: return '💰';
    }
  };

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case 'cash': return 'text-green-600 bg-green-50 border-green-200';
      case 'check': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'credit-card': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'insurance': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'bank-transfer': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const totalPayments = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="medical-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Payment Summary</h2>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <span>💳</span>
            <span>Record Payment</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-green-600 text-2xl font-bold">${totalPayments.toLocaleString()}</p>
            <p className="text-green-600 text-sm font-medium">Total Payments</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-600 text-2xl font-bold">{filteredPayments.length}</p>
            <p className="text-blue-600 text-sm font-medium">Transactions</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-purple-600 text-2xl font-bold">
              ${filteredPayments.length > 0 ? (totalPayments / filteredPayments.length).toFixed(0) : '0'}
            </p>
            <p className="text-purple-600 text-sm font-medium">Avg. Payment</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="medical-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            
            <select
              value={filters.paymentMethod}
              onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Methods</option>
              <option value="cash">Cash</option>
              <option value="check">Check</option>
              <option value="credit-card">Credit Card</option>
              <option value="insurance">Insurance</option>
              <option value="bank-transfer">Bank Transfer</option>
            </select>
          </div>
          
          <div className="flex space-x-2">
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <span className="flex items-center text-gray-500">to</span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Payment Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredPayments.length} of {payments.length} payments
        </p>
      </div>

      {/* Payment List */}
      <div className="medical-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg mr-3">
                        <span className="text-green-600 text-sm">✅</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{payment.id}</div>
                        <div className="text-sm text-gray-500">
                          {payment.status === 'completed' ? 'Completed' : 'Processing'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payment.patientName}</div>
                    <div className="text-sm text-gray-500">Patient ID: {payment.patientId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                      {payment.invoiceId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDateTime(payment.paymentDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getPaymentMethodIcon(payment.paymentMethod)}</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPaymentMethodColor(payment.paymentMethod)}`}>
                        {payment.paymentMethod.replace('-', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-900">{payment.referenceNumber}</div>
                    <div className="text-xs text-gray-500">Ref. Number</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3 transition-colors">
                      View
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 mr-3 transition-colors">
                      Receipt
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 transition-colors">
                      ⋯
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">💳</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>

      {/* Payment Methods Breakdown */}
      <div className="medical-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {['cash', 'check', 'credit-card', 'insurance', 'bank-transfer'].map(method => {
            const methodPayments = filteredPayments.filter(p => p.paymentMethod === method);
            const methodTotal = methodPayments.reduce((sum, p) => sum + p.amount, 0);
            const percentage = totalPayments > 0 ? ((methodTotal / totalPayments) * 100).toFixed(1) : 0;
            
            return (
              <div key={method} className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">{getPaymentMethodIcon(method)}</div>
                <div className="text-sm font-medium text-gray-900 capitalize mb-1">
                  {method.replace('-', ' ')}
                </div>
                <div className="text-lg font-bold text-gray-900">${methodTotal.toFixed(0)}</div>
                <div className="text-xs text-gray-500">{percentage}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PaymentList;