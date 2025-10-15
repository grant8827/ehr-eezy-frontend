// Medical Records Data Utility
// Comprehensive patient medical records with history, lab results, prescriptions, and documents

import { patients } from './dashboardData';

// Medical conditions database
export const medicalConditions = [
  {
    id: 'COND001',
    name: 'Hypertension',
    icdCode: 'I10',
    category: 'Cardiovascular',
    severity: 'moderate',
    chronic: true,
    description: 'High blood pressure'
  },
  {
    id: 'COND002',
    name: 'Type 2 Diabetes',
    icdCode: 'E11',
    category: 'Endocrine',
    severity: 'moderate',
    chronic: true,
    description: 'Non-insulin-dependent diabetes mellitus'
  },
  {
    id: 'COND003',
    name: 'Asthma',
    icdCode: 'J45',
    category: 'Respiratory',
    severity: 'mild',
    chronic: true,
    description: 'Chronic respiratory condition'
  },
  {
    id: 'COND004',
    name: 'Anxiety Disorder',
    icdCode: 'F41',
    category: 'Mental Health',
    severity: 'mild',
    chronic: true,
    description: 'Generalized anxiety disorder'
  },
  {
    id: 'COND005',
    name: 'Migraine',
    icdCode: 'G43',
    category: 'Neurological',
    severity: 'moderate',
    chronic: true,
    description: 'Recurring severe headaches'
  }
];

// Medications database
export const medications = [
  {
    id: 'MED001',
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    category: 'ACE Inhibitor',
    indication: 'Hypertension',
    sideEffects: ['Dry cough', 'Dizziness', 'Headache']
  },
  {
    id: 'MED002',
    name: 'Metformin',
    genericName: 'Metformin HCl',
    dosage: '500mg',
    frequency: 'Twice daily with meals',
    category: 'Antidiabetic',
    indication: 'Type 2 Diabetes',
    sideEffects: ['Nausea', 'Diarrhea', 'Stomach upset']
  },
  {
    id: 'MED003',
    name: 'Albuterol',
    genericName: 'Albuterol Sulfate',
    dosage: '90mcg',
    frequency: 'As needed',
    category: 'Bronchodilator',
    indication: 'Asthma',
    sideEffects: ['Tremor', 'Nervousness', 'Headache']
  },
  {
    id: 'MED004',
    name: 'Sertraline',
    genericName: 'Sertraline HCl',
    dosage: '50mg',
    frequency: 'Once daily',
    category: 'SSRI',
    indication: 'Anxiety/Depression',
    sideEffects: ['Nausea', 'Insomnia', 'Dizziness']
  },
  {
    id: 'MED005',
    name: 'Sumatriptan',
    genericName: 'Sumatriptan Succinate',
    dosage: '50mg',
    frequency: 'As needed for migraine',
    category: 'Triptan',
    indication: 'Migraine',
    sideEffects: ['Drowsiness', 'Dizziness', 'Nausea']
  }
];

// Lab test types
export const labTestTypes = [
  {
    id: 'LAB001',
    name: 'Complete Blood Count',
    code: 'CBC',
    category: 'Hematology',
    normalRanges: {
      hemoglobin: { min: 12.0, max: 16.0, unit: 'g/dL' },
      hematocrit: { min: 36, max: 46, unit: '%' },
      platelets: { min: 150, max: 450, unit: 'K/uL' },
      wbc: { min: 4.0, max: 11.0, unit: 'K/uL' }
    }
  },
  {
    id: 'LAB002',
    name: 'Basic Metabolic Panel',
    code: 'BMP',
    category: 'Chemistry',
    normalRanges: {
      glucose: { min: 70, max: 100, unit: 'mg/dL' },
      sodium: { min: 135, max: 145, unit: 'mEq/L' },
      potassium: { min: 3.5, max: 5.0, unit: 'mEq/L' },
      creatinine: { min: 0.6, max: 1.2, unit: 'mg/dL' }
    }
  },
  {
    id: 'LAB003',
    name: 'Lipid Panel',
    code: 'LIPID',
    category: 'Chemistry',
    normalRanges: {
      totalCholesterol: { min: 0, max: 200, unit: 'mg/dL' },
      ldl: { min: 0, max: 100, unit: 'mg/dL' },
      hdl: { min: 40, max: 200, unit: 'mg/dL' },
      triglycerides: { min: 0, max: 150, unit: 'mg/dL' }
    }
  },
  {
    id: 'LAB004',
    name: 'Hemoglobin A1C',
    code: 'HbA1C',
    category: 'Chemistry',
    normalRanges: {
      hba1c: { min: 4.0, max: 5.6, unit: '%' }
    }
  }
];

// Generate patient medical history
export const generatePatientMedicalHistory = (patientId) => {
  const patient = patients.find(p => p.id === patientId);
  if (!patient) return [];

  const history = [];
  const today = new Date();
  
  // Generate historical visits (last 2 years)
  for (let i = 0; i < 12; i++) {
    const visitDate = new Date(today.getTime() - (i * 60 * 24 * 60 * 60 * 1000)); // Every 2 months
    
    const visitTypes = ['Annual Physical', 'Follow-up Visit', 'Sick Visit', 'Preventive Care', 'Consultation'];
    const providers = ['Dr. Michael Chen', 'Dr. Emily Rodriguez', 'Dr. Sarah Wilson'];
    
    history.push({
      id: `VISIT_${patientId}_${i}`,
      date: visitDate,
      type: visitTypes[i % visitTypes.length],
      provider: providers[i % providers.length],
      chiefComplaint: getChiefComplaintForVisit(i),
      diagnosis: getDiagnosisForPatient(patient, i),
      treatment: getTreatmentForVisit(i),
      notes: `${visitTypes[i % visitTypes.length]} - Patient doing well overall. Continue current treatment plan.`,
      vitalSigns: generateVitalSigns(visitDate),
      status: 'completed'
    });
  }

  return history.sort((a, b) => b.date - a.date);
};

// Generate vital signs for a specific date
export const generateVitalSigns = (date = new Date()) => {
  return {
    bloodPressure: {
      systolic: 110 + Math.floor(Math.random() * 40),
      diastolic: 70 + Math.floor(Math.random() * 20),
      unit: 'mmHg'
    },
    heartRate: 60 + Math.floor(Math.random() * 40),
    temperature: 98.0 + Math.random() * 2,
    respiratoryRate: 12 + Math.floor(Math.random() * 8),
    oxygenSaturation: 95 + Math.floor(Math.random() * 5),
    weight: 140 + Math.floor(Math.random() * 60),
    height: 64 + Math.floor(Math.random() * 12),
    bmi: null, // Will be calculated
    date: date
  };
};

// Generate lab results for a patient
export const generateLabResults = (patientId) => {
  const results = [];
  const today = new Date();
  
  // Generate lab results for the past year
  for (let i = 0; i < 4; i++) {
    const labDate = new Date(today.getTime() - (i * 90 * 24 * 60 * 60 * 1000)); // Quarterly
    
    // CBC Results
    results.push({
      id: `LAB_${patientId}_CBC_${i}`,
      patientId: patientId,
      testType: labTestTypes[0],
      orderDate: new Date(labDate.getTime() - 2 * 24 * 60 * 60 * 1000),
      collectionDate: new Date(labDate.getTime() - 1 * 24 * 60 * 60 * 1000),
      resultDate: labDate,
      status: 'completed',
      provider: 'Dr. Michael Chen',
      results: {
        hemoglobin: (12.0 + Math.random() * 4).toFixed(1),
        hematocrit: (36 + Math.random() * 10).toFixed(1),
        platelets: (150 + Math.random() * 300).toFixed(0),
        wbc: (4.0 + Math.random() * 7).toFixed(1)
      },
      abnormalFlags: []
    });

    // Basic Metabolic Panel
    results.push({
      id: `LAB_${patientId}_BMP_${i}`,
      patientId: patientId,
      testType: labTestTypes[1],
      orderDate: new Date(labDate.getTime() - 2 * 24 * 60 * 60 * 1000),
      collectionDate: new Date(labDate.getTime() - 1 * 24 * 60 * 60 * 1000),
      resultDate: labDate,
      status: 'completed',
      provider: 'Dr. Michael Chen',
      results: {
        glucose: (70 + Math.random() * 50).toFixed(0),
        sodium: (135 + Math.random() * 10).toFixed(1),
        potassium: (3.5 + Math.random() * 1.5).toFixed(1),
        creatinine: (0.6 + Math.random() * 0.6).toFixed(1)
      },
      abnormalFlags: []
    });
  }

  return results.sort((a, b) => b.resultDate - a.resultDate);
};

// Generate prescriptions for a patient
export const generatePrescriptions = (patientId) => {
  const patient = patients.find(p => p.id === patientId);
  const prescriptions = [];
  const today = new Date();
  
  // Current active prescriptions
  const activeCount = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < activeCount; i++) {
    const medication = medications[i % medications.length];
    const startDate = new Date(today.getTime() - (Math.random() * 365 * 24 * 60 * 60 * 1000));
    
    prescriptions.push({
      id: `RX_${patientId}_${i}`,
      patientId: patientId,
      medication: medication,
      prescribedDate: startDate,
      startDate: startDate,
      endDate: null,
      status: 'active',
      prescribedBy: 'Dr. Michael Chen',
      instructions: `Take ${medication.frequency.toLowerCase()}`,
      refillsRemaining: Math.floor(Math.random() * 5),
      quantity: 30 + Math.floor(Math.random() * 60),
      daysSupply: 30,
      pharmacy: 'Central Pharmacy',
      notes: `Prescribed for ${medication.indication}`
    });
  }

  // Historical prescriptions
  for (let i = 0; i < 5; i++) {
    const medication = medications[(activeCount + i) % medications.length];
    const startDate = new Date(today.getTime() - ((i + 1) * 180 * 24 * 60 * 60 * 1000));
    const endDate = new Date(startDate.getTime() + (90 * 24 * 60 * 60 * 1000));
    
    prescriptions.push({
      id: `RX_${patientId}_HIST_${i}`,
      patientId: patientId,
      medication: medication,
      prescribedDate: startDate,
      startDate: startDate,
      endDate: endDate,
      status: 'completed',
      prescribedBy: 'Dr. Emily Rodriguez',
      instructions: `Take ${medication.frequency.toLowerCase()}`,
      refillsRemaining: 0,
      quantity: 30,
      daysSupply: 30,
      pharmacy: 'Central Pharmacy',
      notes: `Course completed successfully`
    });
  }

  return prescriptions.sort((a, b) => b.prescribedDate - a.prescribedDate);
};

// Generate allergies for a patient
export const generateAllergies = (patientId) => {
  const commonAllergies = [
    { allergen: 'Penicillin', type: 'Medication', severity: 'severe', reaction: 'Rash, difficulty breathing' },
    { allergen: 'Shellfish', type: 'Food', severity: 'moderate', reaction: 'Hives, swelling' },
    { allergen: 'Pollen', type: 'Environmental', severity: 'mild', reaction: 'Sneezing, congestion' },
    { allergen: 'Latex', type: 'Environmental', severity: 'moderate', reaction: 'Contact dermatitis' },
    { allergen: 'Aspirin', type: 'Medication', severity: 'mild', reaction: 'Stomach upset' }
  ];

  const allergyCount = Math.floor(Math.random() * 3) + 1;
  const patientAllergies = [];
  
  for (let i = 0; i < allergyCount; i++) {
    const allergy = commonAllergies[i % commonAllergies.length];
    patientAllergies.push({
      id: `ALLERGY_${patientId}_${i}`,
      patientId: patientId,
      ...allergy,
      dateIdentified: new Date(Date.now() - Math.random() * 5 * 365 * 24 * 60 * 60 * 1000),
      status: 'active'
    });
  }

  return patientAllergies;
};

// Generate medical documents for a patient
export const generateMedicalDocuments = (patientId) => {
  const documentTypes = [
    { type: 'Lab Report', category: 'Laboratory' },
    { type: 'Imaging Study', category: 'Radiology' },
    { type: 'Consultation Note', category: 'Clinical Notes' },
    { type: 'Discharge Summary', category: 'Clinical Notes' },
    { type: 'Insurance Card', category: 'Administrative' },
    { type: 'Consent Form', category: 'Administrative' }
  ];

  const documents = [];
  const today = new Date();

  for (let i = 0; i < 8; i++) {
    const docType = documentTypes[i % documentTypes.length];
    const uploadDate = new Date(today.getTime() - (Math.random() * 365 * 24 * 60 * 60 * 1000));
    
    documents.push({
      id: `DOC_${patientId}_${i}`,
      patientId: patientId,
      title: `${docType.type} - ${uploadDate.toLocaleDateString()}`,
      type: docType.type,
      category: docType.category,
      uploadDate: uploadDate,
      fileSize: `${Math.floor(Math.random() * 500) + 100} KB`,
      fileType: i % 2 === 0 ? 'PDF' : 'Image',
      uploadedBy: 'Dr. Michael Chen',
      description: `${docType.type} for patient ${patientId}`,
      url: `/documents/${patientId}/${docType.type.toLowerCase().replace(' ', '_')}_${i}.pdf`,
      status: 'active'
    });
  }

  return documents.sort((a, b) => b.uploadDate - a.uploadDate);
};

// Helper functions
const getChiefComplaintForVisit = (visitIndex) => {
  const complaints = [
    'Annual wellness check',
    'Follow-up for chronic conditions',
    'Fatigue and weakness',
    'Headache and dizziness',
    'Chest pain evaluation',
    'Shortness of breath',
    'Medication review',
    'Blood pressure check',
    'Joint pain and stiffness',
    'Preventive care visit'
  ];
  return complaints[visitIndex % complaints.length];
};

const getDiagnosisForPatient = (patient, visitIndex) => {
  const diagnoses = [
    'Essential hypertension',
    'Type 2 diabetes mellitus',
    'Asthma, well controlled',
    'Anxiety disorder, stable',
    'Migraine without aura',
    'Hyperlipidemia',
    'Osteoarthritis',
    'GERD',
    'Allergic rhinitis',
    'Healthy adult'
  ];
  return diagnoses[visitIndex % diagnoses.length];
};

const getTreatmentForVisit = (visitIndex) => {
  const treatments = [
    'Continue current medications',
    'Lifestyle modifications discussed',
    'New prescription provided',
    'Follow-up in 3 months',
    'Referral to specialist',
    'Lab work ordered',
    'Imaging study recommended',
    'Physical therapy referral',
    'Medication adjustment',
    'Patient education provided'
  ];
  return treatments[visitIndex % treatments.length];
};

// Main medical records getter
export const getPatientMedicalRecords = (patientId) => {
  return {
    patient: patients.find(p => p.id === patientId),
    medicalHistory: generatePatientMedicalHistory(patientId),
    labResults: generateLabResults(patientId),
    prescriptions: generatePrescriptions(patientId),
    allergies: generateAllergies(patientId),
    documents: generateMedicalDocuments(patientId),
    vitalSigns: generateVitalSigns()
  };
};

// Get summary statistics for medical records
export const getMedicalRecordsSummary = () => {
  const totalPatients = patients.length;
  const activeRecords = patients.length;
  const pendingResults = Math.floor(Math.random() * 15) + 5;
  const recentUploads = Math.floor(Math.random() * 10) + 3;
  
  return {
    totalPatients,
    activeRecords,
    pendingResults,
    recentUploads,
    recordsThisMonth: Math.floor(Math.random() * 50) + 25,
    avgRecordsPerPatient: 15.3
  };
};

// Export all utilities
export default {
  medicalConditions,
  medications,
  labTestTypes,
  generatePatientMedicalHistory,
  generateVitalSigns,
  generateLabResults,
  generatePrescriptions,
  generateAllergies,
  generateMedicalDocuments,
  getPatientMedicalRecords,
  getMedicalRecordsSummary
};