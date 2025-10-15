import React, { useState, useEffect } from 'react';
import { getClaims } from '../../utils/billingData';

const ClaimsList = () => {
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    insuranceProvider: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    const data = getClaims();
    setClaims(data);
    setFilteredClaims(data);
  }, []);

  useEffect(() => {
    let filtered = [...claims];
    
    if (filters.status) {
      filtered = filtered.filter(claim => claim.status === filters.status);
    }
    
    if (filters.insuranceProvider) {
      filtered = filtered.filter(claim => 
        claim.insuranceProvider.id === filters.insuranceProvider
      );
    }
    
    if (filters.dateFrom) {
      filtered = filtered.filter(claim => 
        new Date(claim.claimDate) >= new Date(filters.dateFrom)
      );
    }
    
    if (filters.dateTo) {
      filtered = filtered.filter(claim => 
        new Date(claim.claimDate) <= new Date(filters.dateTo)
      );
    }
    
    if (searchTerm) {
      filtered = filtered.filter(claim => 
        claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.invoiceId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredClaims(filtered);
  }, [filters, searchTerm, claims]);

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'processed': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'approved': return 'text-green-600 bg-green-50 border-green-200';
      case 'denied': return 'text-red-600 bg-red-50 border-red-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted': return '📤';
      case 'processed': return '⚙️';
      case 'approved': return '✅';
      case 'denied': return '❌';
      case 'pending': return '⏳';
      default: return '📄';
    }
  };

  // Calculate summary stats
  const totalClaimsValue = filteredClaims.reduce((sum, claim) => sum + claim.amount, 0);
  const approvedAmount = filteredClaims
    .filter(claim => claim.status === 'approved')
    .reduce((sum, claim) => sum + claim.approvedAmount, 0);
  const pendingClaims = filteredClaims.filter(claim => 
    claim.status === 'submitted' || claim.status === 'pending'
  ).length;
  const deniedClaims = filteredClaims.filter(claim => claim.status === 'denied').length;

  // Get unique insurance providers from claims
  const insuranceProviders = [...new Set(claims.map(claim => claim.insuranceProvider))];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="medical-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Claims</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${totalClaimsValue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">🏥</span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">{filteredClaims.length} claims</span>
          </div>
        </div>

        <div className="medical-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Approved Amount</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${approvedAmount.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">
              {totalClaimsValue > 0 ? Math.round((approvedAmount / totalClaimsValue) * 100) : 0}% approval rate
            </span>
          </div>
        </div>

        <div className="medical-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Claims</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {pendingClaims}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-yellow-600">Awaiting review</span>
          </div>
        </div>

        <div className="medical-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Denied Claims</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {deniedClaims}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <span className="text-2xl">❌</span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-red-600">Require attention</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="medical-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              placeholder="Search claims..."
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
              <option value="submitted">Submitted</option>
              <option value="processed">Processed</option>
              <option value="approved">Approved</option>
              <option value="denied">Denied</option>
              <option value="pending">Pending</option>
            </select>

            <select
              value={filters.insuranceProvider}
              onChange={(e) => handleFilterChange('insuranceProvider', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Insurers</option>
              {insuranceProviders.map(provider => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
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

      {/* Claims Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredClaims.length} of {claims.length} claims
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <span>📤</span>
          <span>Submit New Claim</span>
        </button>
      </div>

      {/* Claims List */}
      <div className="medical-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Claim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Insurance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Claim Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approved
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
              {filteredClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <span className="text-blue-600 text-sm">{getStatusIcon(claim.status)}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{claim.id}</div>
                        <div className="text-sm text-gray-500">Invoice: {claim.invoiceId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{claim.patientName}</div>
                    <div className="text-sm text-gray-500">ID: {claim.patientId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{claim.insuranceProvider.name}</div>
                    <div className="text-sm text-gray-500">Code: {claim.insuranceProvider.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(claim.claimDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${claim.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      ${claim.approvedAmount.toFixed(2)}
                    </div>
                    {claim.patientResponsibility > 0 && (
                      <div className="text-xs text-gray-500">
                        Patient: ${claim.patientResponsibility.toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(claim.status)}`}>
                      {claim.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3 transition-colors">
                      View
                    </button>
                    {claim.status === 'denied' && (
                      <button className="text-orange-600 hover:text-orange-900 mr-3 transition-colors">
                        Resubmit
                      </button>
                    )}
                    <button className="text-gray-600 hover:text-gray-900 transition-colors">
                      ⋯
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredClaims.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No claims found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>

      {/* Status Distribution */}
      <div className="medical-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Claims Status Distribution</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {['submitted', 'pending', 'processed', 'approved', 'denied'].map(status => {
            const statusClaims = filteredClaims.filter(c => c.status === status);
            const statusTotal = statusClaims.reduce((sum, c) => sum + c.amount, 0);
            const percentage = filteredClaims.length > 0 ? ((statusClaims.length / filteredClaims.length) * 100).toFixed(1) : 0;
            
            return (
              <div key={status} className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">{getStatusIcon(status)}</div>
                <div className="text-sm font-medium text-gray-900 capitalize mb-1">
                  {status}
                </div>
                <div className="text-lg font-bold text-gray-900">{statusClaims.length}</div>
                <div className="text-xs text-gray-500">{percentage}%</div>
                <div className="text-xs text-gray-500 mt-1">${statusTotal.toFixed(0)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="medical-card p-6 text-center">
          <div className="p-4 bg-blue-100 rounded-lg inline-block mb-4">
            <span className="text-3xl">📤</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Submit New Claim</h3>
          <p className="text-gray-600 mb-4">Create and submit insurance claims</p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            Submit Claim
          </button>
        </div>

        <div className="medical-card p-6 text-center">
          <div className="p-4 bg-yellow-100 rounded-lg inline-block mb-4">
            <span className="text-3xl">⏳</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Claims</h3>
          <p className="text-gray-600 mb-4">Review claims awaiting response</p>
          <button 
            onClick={() => handleFilterChange('status', 'pending')}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            View Pending
          </button>
        </div>

        <div className="medical-card p-6 text-center">
          <div className="p-4 bg-red-100 rounded-lg inline-block mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Denied Claims</h3>
          <p className="text-gray-600 mb-4">Address and resubmit denied claims</p>
          <button 
            onClick={() => handleFilterChange('status', 'denied')}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Review Denied
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClaimsList;