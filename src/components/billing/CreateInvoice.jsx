import React, { useState } from 'react';
import { patients } from '../../utils/dashboardData';
import { insuranceProviders, cptCodes } from '../../utils/billingData';

const CreateInvoice = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    patientId: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    services: [],
    notes: '',
    insuranceProvider: '',
    paymentTerms: '30'
  });

  const [currentService, setCurrentService] = useState({
    cptCode: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    dateOfService: new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceChange = (field, value) => {
    setCurrentService(prev => ({ ...prev, [field]: value }));
  };

  const handleCptCodeSelect = (cptCode) => {
    const selectedCpt = cptCodes.find(cpt => cpt.code === cptCode);
    if (selectedCpt) {
      setCurrentService(prev => ({
        ...prev,
        cptCode: selectedCpt.code,
        description: selectedCpt.description,
        unitPrice: selectedCpt.fee
      }));
    }
  };

  const addService = () => {
    if (currentService.cptCode && currentService.quantity > 0) {
      const service = {
        ...currentService,
        id: `service-${Date.now()}`,
        amount: currentService.quantity * currentService.unitPrice
      };
      
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, service]
      }));

      // Reset current service
      setCurrentService({
        cptCode: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        dateOfService: new Date().toISOString().split('T')[0]
      });
    }
  };

  const removeService = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(service => service.id !== serviceId)
    }));
  };

  const calculateTotals = () => {
    const subtotal = formData.services.reduce((sum, service) => sum + service.amount, 0);
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  };

  const handleSubmit = () => {
    const { subtotal, tax, total } = calculateTotals();
    const selectedPatient = patients.find(p => p.id === formData.patientId);
    const selectedInsurance = insuranceProviders.find(ip => ip.id === formData.insuranceProvider);
    
    const invoice = {
      id: `INV-${Date.now()}`,
      patientId: formData.patientId,
      patientName: selectedPatient?.name || '',
      invoiceDate: new Date(formData.invoiceDate),
      dueDate: new Date(formData.dueDate),
      services: formData.services,
      subtotal,
      tax,
      total,
      paidAmount: 0,
      balance: total,
      status: 'pending',
      insuranceProvider: selectedInsurance || { id: 'self-pay', name: 'Self Pay', code: 'SELF' },
      paymentMethod: '',
      notes: formData.notes
    };

    console.log('New invoice created:', invoice);
    // Here you would typically save the invoice to your backend
    
    onClose();
  };

  const selectedPatient = patients.find(p => p.id === formData.patientId);
  const { subtotal, tax, total } = calculateTotals();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create New Invoice</h2>
              <p className="text-gray-600 mt-1">Step {step} of 3</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
            >
              ×
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${step >= stepNum 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}>
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`
                      w-12 h-1 mx-2
                      ${step > stepNum ? 'bg-blue-600' : 'bg-gray-200'}
                    `} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Patient Info</span>
              <span>Services</span>
              <span>Review</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {/* Step 1: Patient Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Patient Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Patient *
                  </label>
                  <select
                    value={formData.patientId}
                    onChange={(e) => handleInputChange('patientId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a patient...</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} - {patient.id}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Insurance Provider
                  </label>
                  <select
                    value={formData.insuranceProvider}
                    onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select insurance...</option>
                    {insuranceProviders.map(provider => (
                      <option key={provider.id} value={provider.id}>
                        {provider.name} ({provider.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Date *
                  </label>
                  <input
                    type="date"
                    value={formData.invoiceDate}
                    onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {selectedPatient && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Patient Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <span className="ml-2 font-medium">{selectedPatient.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Age:</span>
                      <span className="ml-2 font-medium">{selectedPatient.age}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2 font-medium">{selectedPatient.phone}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Gender:</span>
                      <span className="ml-2 font-medium">{selectedPatient.gender}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Services */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Add Services</h3>
              
              {/* Add Service Form */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Add New Service</h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CPT Code</label>
                    <select
                      value={currentService.cptCode}
                      onChange={(e) => handleCptCodeSelect(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">Select CPT...</option>
                      {cptCodes.map(cpt => (
                        <option key={cpt.code} value={cpt.code}>
                          {cpt.code}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={currentService.description}
                      onChange={(e) => handleServiceChange('description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Service description..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={currentService.quantity}
                      onChange={(e) => handleServiceChange('quantity', parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={currentService.unitPrice}
                      onChange={(e) => handleServiceChange('unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={addService}
                    disabled={!currentService.cptCode || !currentService.description || currentService.quantity < 1}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Add Service
                  </button>
                </div>
              </div>

              {/* Services List */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Added Services ({formData.services.length})</h4>
                {formData.services.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">CPT Code</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Description</th>
                          <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">Qty</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Unit Price</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Amount</th>
                          <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {formData.services.map((service) => (
                          <tr key={service.id}>
                            <td className="px-4 py-2 text-sm font-medium">{service.cptCode}</td>
                            <td className="px-4 py-2 text-sm">{service.description}</td>
                            <td className="px-4 py-2 text-sm text-center">{service.quantity}</td>
                            <td className="px-4 py-2 text-sm text-right">${service.unitPrice.toFixed(2)}</td>
                            <td className="px-4 py-2 text-sm text-right font-medium">${service.amount.toFixed(2)}</td>
                            <td className="px-4 py-2 text-center">
                              <button
                                onClick={() => removeService(service.id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No services added yet. Use the form above to add services.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Review Invoice</h3>
              
              {/* Patient Info */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Patient Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-600">Patient:</span> <span className="ml-2 font-medium">{selectedPatient?.name}</span></div>
                  <div><span className="text-gray-600">Invoice Date:</span> <span className="ml-2">{new Date(formData.invoiceDate).toLocaleDateString()}</span></div>
                  <div><span className="text-gray-600">Due Date:</span> <span className="ml-2">{new Date(formData.dueDate).toLocaleDateString()}</span></div>
                  <div><span className="text-gray-600">Insurance:</span> <span className="ml-2">{insuranceProviders.find(ip => ip.id === formData.insuranceProvider)?.name || 'Self Pay'}</span></div>
                </div>
              </div>

              {/* Services Review */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Services</h4>
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
                      {formData.services.map((service) => (
                        <tr key={service.id}>
                          <td className="px-4 py-2 text-sm font-medium">{service.cptCode}</td>
                          <td className="px-4 py-2 text-sm">{service.description}</td>
                          <td className="px-4 py-2 text-sm text-center">{service.quantity}</td>
                          <td className="px-4 py-2 text-sm text-right">${service.unitPrice.toFixed(2)}</td>
                          <td className="px-4 py-2 text-sm text-right font-medium">${service.amount.toFixed(2)}</td>
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
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (5%):</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <span className="font-semibold">Total:</span>
                      <span className="font-semibold text-lg">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add any additional notes for this invoice..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <div>
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Previous
              </button>
            )}
          </div>
          <div className="space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && !formData.patientId) ||
                  (step === 2 && formData.services.length === 0)
                }
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Create Invoice
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;