import { billingAPI } from './apiService';
import toast from 'react-hot-toast';
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns';

// Billing service to handle all billing-related operations
export const billingService = {
  // Get all bills with optional filters
  async getAllBills(filters = {}) {
    try {
      const params = {};
      
      if (filters.patient_id) {
        params.patient_id = filters.patient_id;
      }
      if (filters.status) {
        params.status = filters.status;
      }
      if (filters.start_date && filters.end_date) {
        params.start_date = filters.start_date;
        params.end_date = filters.end_date;
      }
      if (filters.perPage) {
        params.per_page = filters.perPage;
      }

      const response = await billingAPI.getAll(params);
      return response.data;
    } catch (error) {
      console.error('Error fetching bills:', error);
      toast.error('Failed to load bills');
      throw error;
    }
  },

  // Get a single bill by ID
  async getBillById(id) {
    try {
      const response = await billingAPI.getById(id);
      return response.data;
    } catch (error) {
      console.error('Error fetching bill:', error);
      toast.error('Failed to load bill details');
      throw error;
    }
  },

  // Get bills for a specific patient
  async getBillsByPatient(patientId, filters = {}) {
    try {
      const response = await billingAPI.getByPatient(patientId, filters);
      return response.data;
    } catch (error) {
      console.error('Error fetching patient bills:', error);
      toast.error('Failed to load patient bills');
      throw error;
    }
  },

  // Create a new bill/invoice
  async createBill(billData) {
    try {
      const response = await billingAPI.create(billData);
      toast.success('Invoice created successfully');
      return response.data;
    } catch (error) {
      console.error('Error creating bill:', error);
      
      if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        errorMessages.forEach(message => toast.error(message));
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to create invoice');
      }
      throw error;
    }
  },

  // Update an existing bill
  async updateBill(id, billData) {
    try {
      const response = await billingAPI.update(id, billData);
      toast.success('Invoice updated successfully');
      return response.data;
    } catch (error) {
      console.error('Error updating bill:', error);
      
      if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        errorMessages.forEach(message => toast.error(message));
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to update invoice');
      }
      throw error;
    }
  },

  // Delete a bill
  async deleteBill(id) {
    try {
      await billingAPI.delete(id);
      toast.success('Invoice deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting bill:', error);
      toast.error('Failed to delete invoice');
      throw error;
    }
  },

  // Mark bill as paid
  async markBillAsPaid(id, paymentData) {
    try {
      const response = await billingAPI.markAsPaid(id, paymentData);
      toast.success('Payment recorded successfully');
      return response.data;
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error('Failed to record payment');
      throw error;
    }
  },

  // Get billing statistics
  async getBillingStats() {
    try {
      const currentMonth = format(new Date(), 'yyyy-MM');
      const startDate = format(startOfMonth(new Date()), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(new Date()), 'yyyy-MM-dd');

      // Get this month's bills
      const response = await this.getAllBills({
        start_date: startDate,
        end_date: endDate
      });
      
      const bills = response.data || [];
      
      // Calculate statistics
      const totalRevenue = bills
        .filter(bill => bill.status === 'paid')
        .reduce((sum, bill) => sum + parseFloat(bill.total_amount || 0), 0);

      const pendingAmount = bills
        .filter(bill => bill.status === 'pending')
        .reduce((sum, bill) => sum + parseFloat(bill.total_amount || 0), 0);

      const overdueAmount = bills
        .filter(bill => bill.status === 'overdue')
        .reduce((sum, bill) => sum + parseFloat(bill.total_amount || 0), 0);

      return {
        thisMonth: {
          totalRevenue: totalRevenue,
          pendingAmount: pendingAmount,
          overdueAmount: overdueAmount,
          totalBills: bills.length,
          paidBills: bills.filter(bill => bill.status === 'paid').length,
          pendingBills: bills.filter(bill => bill.status === 'pending').length,
          overdueBills: bills.filter(bill => bill.status === 'overdue').length,
        },
        recentTransactions: bills
          .filter(bill => bill.status === 'paid')
          .slice(0, 5)
          .map(bill => ({
            id: bill.id,
            patient_name: bill.patient?.name || 'Unknown Patient',
            amount: parseFloat(bill.total_amount || 0),
            date: bill.payment_date || bill.updated_at,
            invoice_number: bill.invoice_number
          }))
      };
    } catch (error) {
      console.error('Error getting billing stats:', error);
      return {
        thisMonth: {
          totalRevenue: 0,
          pendingAmount: 0,
          overdueAmount: 0,
          totalBills: 0,
          paidBills: 0,
          pendingBills: 0,
          overdueBills: 0,
        },
        recentTransactions: []
      };
    }
  },

  // Get payment methods
  getPaymentMethods() {
    return [
      { value: 'cash', label: 'Cash' },
      { value: 'credit_card', label: 'Credit Card' },
      { value: 'debit_card', label: 'Debit Card' },
      { value: 'check', label: 'Check' },
      { value: 'bank_transfer', label: 'Bank Transfer' },
      { value: 'insurance', label: 'Insurance' },
      { value: 'other', label: 'Other' }
    ];
  },

  // Get CPT codes (sample data - would typically come from API)
  getCPTCodes() {
    return [
      { code: '99213', description: 'Office visit - Established patient, Level 3', fee: 150.00 },
      { code: '99214', description: 'Office visit - Established patient, Level 4', fee: 200.00 },
      { code: '99215', description: 'Office visit - Established patient, Level 5', fee: 250.00 },
      { code: '99203', description: 'Office visit - New patient, Level 3', fee: 200.00 },
      { code: '99204', description: 'Office visit - New patient, Level 4', fee: 275.00 },
      { code: '99205', description: 'Office visit - New patient, Level 5', fee: 350.00 },
      { code: '90834', description: 'Psychotherapy, 45 minutes', fee: 120.00 },
      { code: '90837', description: 'Psychotherapy, 60 minutes', fee: 150.00 },
      { code: '96116', description: 'Neurobehavioral status exam', fee: 180.00 },
      { code: '96118', description: 'Neuropsychological testing', fee: 220.00 },
    ];
  },

  // Get insurance providers
  getInsuranceProviders() {
    return [
      'Aetna',
      'Anthem',
      'Blue Cross Blue Shield',
      'Cigna',
      'Humana',
      'Kaiser Permanente',
      'Medicaid',
      'Medicare',
      'UnitedHealth',
      'Self Pay',
      'Other'
    ];
  },

  // Calculate bill total
  calculateBillTotal(items = [], taxRate = 0) {
    const subtotal = items.reduce((sum, item) => {
      return sum + (parseFloat(item.quantity || 1) * parseFloat(item.unit_price || 0));
    }, 0);
    
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;
    
    return {
      subtotal: subtotal,
      taxAmount: taxAmount,
      total: total
    };
  },

  // Format currency for display
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  },

  // Get bill status color
  getStatusColor(status) {
    const colors = {
      'draft': 'gray',
      'pending': 'yellow',
      'paid': 'green',
      'overdue': 'red',
      'cancelled': 'gray',
      'refunded': 'blue'
    };
    
    return colors[status] || 'gray';
  },

  // Get bill status display text
  getStatusText(status) {
    const texts = {
      'draft': 'Draft',
      'pending': 'Pending',
      'paid': 'Paid',
      'overdue': 'Overdue',
      'cancelled': 'Cancelled',
      'refunded': 'Refunded'
    };
    
    return texts[status] || status;
  },

  // Validate bill data before submission
  validateBillData(billData) {
    const errors = {};

    // Required fields
    if (!billData.patient_id) {
      errors.patient_id = 'Patient is required';
    }
    if (!billData.service_date) {
      errors.service_date = 'Service date is required';
    }
    if (!billData.items || billData.items.length === 0) {
      errors.items = 'At least one service item is required';
    }

    // Validate items
    if (billData.items) {
      billData.items.forEach((item, index) => {
        if (!item.cpt_code && !item.description) {
          errors[`item_${index}_description`] = 'Service description is required';
        }
        if (!item.unit_price || parseFloat(item.unit_price) <= 0) {
          errors[`item_${index}_price`] = 'Valid price is required';
        }
        if (!item.quantity || parseInt(item.quantity) <= 0) {
          errors[`item_${index}_quantity`] = 'Valid quantity is required';
        }
      });
    }

    // Date validations
    if (billData.service_date) {
      const serviceDate = new Date(billData.service_date);
      const today = new Date();
      
      if (serviceDate > today) {
        errors.service_date = 'Service date cannot be in the future';
      }
    }

    if (billData.due_date && billData.service_date) {
      const dueDate = new Date(billData.due_date);
      const serviceDate = new Date(billData.service_date);
      
      if (dueDate < serviceDate) {
        errors.due_date = 'Due date cannot be before service date';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Generate invoice number
  generateInvoiceNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `INV-${timestamp}-${random}`;
  },

  // Create bill from appointment
  createBillFromAppointment(appointment) {
    const serviceDate = appointment.appointment_date;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30); // 30 days from now

    return {
      patient_id: appointment.patient_id,
      appointment_id: appointment.id,
      service_date: serviceDate,
      due_date: format(dueDate, 'yyyy-MM-dd'),
      items: [
        {
          cpt_code: appointment.type === 'telehealth' ? '99213' : '99214',
          description: appointment.reason_for_visit || 'Medical Consultation',
          quantity: 1,
          unit_price: appointment.fee || 150.00
        }
      ],
      notes: `Appointment on ${format(parseISO(serviceDate), 'MMM d, yyyy')}`,
      status: 'pending'
    };
  },
};

export default billingService;