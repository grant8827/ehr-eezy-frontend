// Billing and payment data management
import { patients } from './dashboardData';

// Insurance providers data
export const insuranceProviders = [
  { id: 'aetna', name: 'Aetna', code: 'AET' },
  { id: 'blue-cross', name: 'Blue Cross Blue Shield', code: 'BCBS' },
  { id: 'cigna', name: 'Cigna', code: 'CIG' },
  { id: 'humana', name: 'Humana', code: 'HUM' },
  { id: 'united', name: 'United Healthcare', code: 'UNH' },
  { id: 'medicare', name: 'Medicare', code: 'MED' },
  { id: 'medicaid', name: 'Medicaid', code: 'MCAID' },
  { id: 'self-pay', name: 'Self Pay', code: 'SELF' }
];

// CPT codes for common medical services
export const cptCodes = [
  { code: '99213', description: 'Office visit, established patient, moderate complexity', fee: 150.00 },
  { code: '99214', description: 'Office visit, established patient, high complexity', fee: 200.00 },
  { code: '99203', description: 'Office visit, new patient, moderate complexity', fee: 250.00 },
  { code: '99204', description: 'Office visit, new patient, high complexity', fee: 300.00 },
  { code: '36415', description: 'Venipuncture for collection of specimen', fee: 25.00 },
  { code: '80053', description: 'Comprehensive metabolic panel', fee: 85.00 },
  { code: '85025', description: 'Complete blood count with differential', fee: 45.00 },
  { code: '93000', description: 'Electrocardiogram, routine ECG', fee: 75.00 },
  { code: '71020', description: 'Chest X-ray, two views', fee: 120.00 },
  { code: '99000', description: 'Specimen handling and transport', fee: 15.00 }
];

// Generate invoices data
const generateInvoices = () => {
  const invoices = [];
  const statuses = ['paid', 'pending', 'overdue', 'partial', 'insurance-pending'];
  const paymentMethods = ['cash', 'check', 'credit-card', 'insurance', 'bank-transfer'];

  patients.forEach((patient, index) => {
    // Generate 2-5 invoices per patient
    const invoiceCount = Math.floor(Math.random() * 4) + 2;
    
    for (let i = 0; i < invoiceCount; i++) {
      const invoiceDate = new Date();
      invoiceDate.setDate(invoiceDate.getDate() - Math.floor(Math.random() * 365));
      
      const dueDate = new Date(invoiceDate);
      dueDate.setDate(dueDate.getDate() + 30);
      
      const services = [];
      const serviceCount = Math.floor(Math.random() * 3) + 1;
      let totalAmount = 0;
      
      // Add random services
      for (let j = 0; j < serviceCount; j++) {
        const service = cptCodes[Math.floor(Math.random() * cptCodes.length)];
        const quantity = 1;
        const amount = service.fee * quantity;
        totalAmount += amount;
        
        services.push({
          id: `svc-${index}-${i}-${j}`,
          cptCode: service.code,
          description: service.description,
          quantity: quantity,
          unitPrice: service.fee,
          amount: amount,
          dateOfService: invoiceDate
        });
      }
      
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const insuranceProvider = insuranceProviders[Math.floor(Math.random() * insuranceProviders.length)];
      
      let paidAmount = 0;
      let balance = totalAmount;
      
      if (status === 'paid') {
        paidAmount = totalAmount;
        balance = 0;
      } else if (status === 'partial') {
        paidAmount = Math.floor(totalAmount * 0.3);
        balance = totalAmount - paidAmount;
      }
      
      const invoice = {
        id: `INV-${(index + 1).toString().padStart(3, '0')}-${(i + 1).toString().padStart(3, '0')}`,
        patientId: patient.id,
        patientName: patient.name,
        invoiceDate: invoiceDate,
        dueDate: dueDate,
        services: services,
        subtotal: totalAmount,
        tax: Math.round(totalAmount * 0.05 * 100) / 100, // 5% tax
        total: Math.round((totalAmount * 1.05) * 100) / 100,
        paidAmount: paidAmount,
        balance: Math.round((totalAmount * 1.05 - paidAmount) * 100) / 100,
        status: status,
        insuranceProvider: insuranceProvider,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        notes: i === 0 ? 'Annual physical exam with lab work' : 
               i === 1 ? 'Follow-up visit for chronic condition management' : 
               'Routine check-up and consultation'
      };
      
      invoices.push(invoice);
    }
  });
  
  return invoices.sort((a, b) => b.invoiceDate - a.invoiceDate);
};

// Generate payments data
const generatePayments = (invoices) => {
  const payments = [];
  
  invoices.forEach((invoice, index) => {
    if (invoice.paidAmount > 0) {
      const payment = {
        id: `PAY-${(index + 1).toString().padStart(4, '0')}`,
        invoiceId: invoice.id,
        patientId: invoice.patientId,
        patientName: invoice.patientName,
        amount: invoice.paidAmount,
        paymentDate: new Date(invoice.invoiceDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        paymentMethod: invoice.paymentMethod,
        referenceNumber: `REF${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        status: 'completed',
        processedBy: 'System',
        notes: invoice.paymentMethod === 'insurance' ? 'Insurance claim processed' : 'Patient payment received'
      };
      payments.push(payment);
    }
  });
  
  return payments.sort((a, b) => b.paymentDate - a.paymentDate);
};

// Generate insurance claims data
const generateClaims = (invoices) => {
  const claims = [];
  
  invoices.filter(invoice => invoice.insuranceProvider.id !== 'self-pay').forEach((invoice, index) => {
    const claimDate = new Date(invoice.invoiceDate);
    claimDate.setDate(claimDate.getDate() + Math.floor(Math.random() * 7));
    
    const statuses = ['submitted', 'processed', 'approved', 'denied', 'pending'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const claim = {
      id: `CLM-${(index + 1).toString().padStart(4, '0')}`,
      invoiceId: invoice.id,
      patientId: invoice.patientId,
      patientName: invoice.patientName,
      insuranceProvider: invoice.insuranceProvider,
      claimDate: claimDate,
      amount: invoice.total,
      status: status,
      approvedAmount: status === 'approved' ? invoice.total * 0.8 : 0,
      patientResponsibility: status === 'approved' ? invoice.total * 0.2 : invoice.total,
      diagnosisCodes: ['Z00.00', 'M79.9', 'R50.9'],
      procedureCodes: invoice.services.map(service => service.cptCode),
      notes: status === 'denied' ? 'Prior authorization required' : 
             status === 'pending' ? 'Under review by insurance' : 
             'Claim processed successfully'
    };
    
    claims.push(claim);
  });
  
  return claims.sort((a, b) => b.claimDate - a.claimDate);
};

// Initialize data
const invoices = generateInvoices();
const payments = generatePayments(invoices);
const claims = generateClaims(invoices);

// Summary statistics
export const getBillingSummary = () => {
  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalOutstanding = invoices.reduce((sum, invoice) => sum + invoice.balance, 0);
  const overdueInvoices = invoices.filter(invoice => 
    invoice.balance > 0 && invoice.dueDate < new Date()
  ).length;
  
  const recentPayments = payments.filter(payment => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return payment.paymentDate >= thirtyDaysAgo;
  }).reduce((sum, payment) => sum + payment.amount, 0);
  
  const pendingClaims = claims.filter(claim => 
    claim.status === 'submitted' || claim.status === 'pending'
  ).length;
  
  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalPaid: Math.round(totalPaid * 100) / 100,
    totalOutstanding: Math.round(totalOutstanding * 100) / 100,
    overdueInvoices,
    recentPayments: Math.round(recentPayments * 100) / 100,
    pendingClaims,
    collectionRate: Math.round((totalPaid / totalRevenue) * 100),
    averagePaymentTime: 18 // days
  };
};

// Get invoices with filters
export const getInvoices = (filters = {}) => {
  let filteredInvoices = [...invoices];
  
  if (filters.patientId) {
    filteredInvoices = filteredInvoices.filter(invoice => 
      invoice.patientId === filters.patientId
    );
  }
  
  if (filters.status) {
    filteredInvoices = filteredInvoices.filter(invoice => 
      invoice.status === filters.status
    );
  }
  
  if (filters.dateFrom) {
    filteredInvoices = filteredInvoices.filter(invoice => 
      invoice.invoiceDate >= new Date(filters.dateFrom)
    );
  }
  
  if (filters.dateTo) {
    filteredInvoices = filteredInvoices.filter(invoice => 
      invoice.invoiceDate <= new Date(filters.dateTo)
    );
  }
  
  return filteredInvoices;
};

// Get payments with filters
export const getPayments = (filters = {}) => {
  let filteredPayments = [...payments];
  
  if (filters.patientId) {
    filteredPayments = filteredPayments.filter(payment => 
      payment.patientId === filters.patientId
    );
  }
  
  if (filters.invoiceId) {
    filteredPayments = filteredPayments.filter(payment => 
      payment.invoiceId === filters.invoiceId
    );
  }
  
  return filteredPayments;
};

// Get claims with filters
export const getClaims = (filters = {}) => {
  let filteredClaims = [...claims];
  
  if (filters.patientId) {
    filteredClaims = filteredClaims.filter(claim => 
      claim.patientId === filters.patientId
    );
  }
  
  if (filters.status) {
    filteredClaims = filteredClaims.filter(claim => 
      claim.status === filters.status
    );
  }
  
  return filteredClaims;
};

// Get patient billing summary
export const getPatientBillingSummary = (patientId) => {
  const patientInvoices = invoices.filter(invoice => invoice.patientId === patientId);
  const patientPayments = payments.filter(payment => payment.patientId === patientId);
  
  const totalBilled = patientInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const totalPaid = patientPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const currentBalance = patientInvoices.reduce((sum, invoice) => sum + invoice.balance, 0);
  
  const lastPayment = patientPayments.length > 0 ? 
    patientPayments.sort((a, b) => b.paymentDate - a.paymentDate)[0] : null;
  
  return {
    totalBilled: Math.round(totalBilled * 100) / 100,
    totalPaid: Math.round(totalPaid * 100) / 100,
    currentBalance: Math.round(currentBalance * 100) / 100,
    lastPayment,
    invoiceCount: patientInvoices.length,
    paymentCount: patientPayments.length
  };
};

export { invoices, payments, claims };