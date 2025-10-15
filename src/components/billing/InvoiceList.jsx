import React, { useState, useEffect } from 'react';
import { getInvoices } from '../../utils/billingData';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    patientId: '',
    dateFrom: '',
    dateTo: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const data = getInvoices();
    setInvoices(data);
    setFilteredInvoices(data);
  }, []);

  useEffect(() => {
    let filtered = getInvoices(filters);
    
    if (searchTerm) {
      filtered = filtered.filter(invoice => 
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredInvoices(filtered);
  }, [filters, searchTerm]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-50 border-green-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'overdue': return 'text-red-600 bg-red-50 border-red-200';
      case 'partial': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'insurance-pending': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="medical-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="partial">Partial</option>
              <option value="insurance-pending">Insurance Pending</option>
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

      {/* Invoice Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredInvoices.length} of {invoices.length} invoices
        </p>
      </div>

      {/* Invoice List */}
      <div className="medical-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <span className="text-blue-600 text-sm">🧾</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{invoice.id}</div>
                        <div className="text-sm text-gray-500">Due: {formatDate(invoice.dueDate)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{invoice.patientName}</div>
                    <div className="text-sm text-gray-500">{invoice.insuranceProvider.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(invoice.invoiceDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${invoice.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${invoice.paidAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={invoice.balance > 0 ? 'text-red-600' : 'text-green-600'}>
                      ${invoice.balance.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(invoice.status)}`}>
                      {invoice.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewInvoice(invoice)}
                      className="text-blue-600 hover:text-blue-900 mr-3 transition-colors"
                    >
                      View
                    </button>
                    <button className="text-green-600 hover:text-green-900 mr-3 transition-colors">
                      Payment
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
        
        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Invoice {selectedInvoice.id}
                </h2>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Invoice Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
                  <p className="text-gray-900 font-medium">{selectedInvoice.patientName}</p>
                  <p className="text-gray-600">{selectedInvoice.insuranceProvider.name}</p>
                </div>
                <div className="text-right">
                  <div className="space-y-2">
                    <div><span className="text-gray-600">Invoice Date:</span> <span className="font-medium">{formatDate(selectedInvoice.invoiceDate)}</span></div>
                    <div><span className="text-gray-600">Due Date:</span> <span className="font-medium">{formatDate(selectedInvoice.dueDate)}</span></div>
                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedInvoice.status)}`}>
                        {selectedInvoice.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Services</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">CPT Code</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Description</th>
                        <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">Qty</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Unit Price</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedInvoice.services.map((service) => (
                        <tr key={service.id}>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">{service.cptCode}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{service.description}</td>
                          <td className="px-4 py-2 text-sm text-center text-gray-900">{service.quantity}</td>
                          <td className="px-4 py-2 text-sm text-right text-gray-900">${service.unitPrice.toFixed(2)}</td>
                          <td className="px-4 py-2 text-sm text-right font-medium text-gray-900">${service.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">${selectedInvoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-medium">${selectedInvoice.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <span className="font-semibold">Total:</span>
                      <span className="font-semibold text-lg">${selectedInvoice.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paid:</span>
                      <span className="text-green-600 font-medium">${selectedInvoice.paidAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <span className="font-semibold">Balance:</span>
                      <span className={`font-semibold ${selectedInvoice.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ${selectedInvoice.balance.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedInvoice.notes && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedInvoice.notes}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                Print
              </button>
              <button className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors">
                Email
              </button>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                Record Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;