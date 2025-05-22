import { Patient } from '@/types/patient';

export const mockPatients: Patient[] = [
  // P001: Eleanor Thompson (merged with details from former ID '1' John Doe)
  {
    id: 'P001',
    name: 'Eleanor Thompson', // From mock-data
    age: 78, // From mock-data
    gender: 'Female', // From mock-data
    dateOfBirth: '1950-05-15', // From patients-data (John Doe)
    studyArm: 'Intervention', // Consistent
    admissionDate: '2025-05-15', // From mock-data (Eleanor)
    room: '302', // From mock-data
    status: 'active', // Consistent
    lastSession: '2025-06-15', // From mock-data (Eleanor)
    diagnosis: 'Postoperative weakness', // From mock-data
    mobility: 'Limited with walker', // From mock-data
    cognitiveStatus: 'Alert and oriented', // From mock-data
    compliance: 'Good', // From mock-data
    progress: 'Improving', // From mock-data
    mmseScore: 26, // From patients-data (John Doe)
    assignedTherapist: '1', // From patients-data (John Doe)
    assessments: [
      { id: 'a1', type: 'MicroFET', value: 65, date: '2025-01-12', assessmentPoint: 'T0', notes: 'Initial assessment' },
      { id: 'a2', type: 'Ultrasound', value: 2.3, date: '2025-01-12', assessmentPoint: 'T0' },
      { id: 'a3', type: 'SitToStand', value: 7, date: '2025-01-12', assessmentPoint: 'T0', notes: 'Needed assistance' }
    ], // From patients-data (John Doe)
    notes: [
      { id: 'n1', content: 'Patient shows good motivation for therapy', createdAt: '2025-01-15T10:20:00Z', createdBy: 'Dr. Sarah Johnson' }
    ], // From patients-data (John Doe)
    alerts: ['Assessment T1 due', 'Declining EMG metrics'] // From patients-data (John Doe)
  },
  // P002: Robert Chen (merged with details from former ID '2' Maria Garcia)
  {
    id: 'P002',
    name: 'Robert Chen', // From mock-data
    age: 82, // From mock-data
    gender: 'Male', // From mock-data
    dateOfBirth: '1947-11-23', // From patients-data (Maria Garcia)
    studyArm: 'Control', // From mock-data (Robert Chen) vs Intervention (Maria Garcia) - taking Robert's
    admissionDate: '2025-05-20', // From mock-data (Robert)
    room: '310', // From mock-data
    status: 'active', // Consistent
    lastSession: '2025-06-14', // From mock-data (Robert)
    diagnosis: 'Deconditioning', // From mock-data
    mobility: 'Wheelchair dependent', // From mock-data
    cognitiveStatus: 'Mild cognitive impairment', // From mock-data
    compliance: 'Excellent', // From mock-data
    progress: 'Steady', // From mock-data
    mmseScore: 28, // From patients-data (Maria Garcia)
    assignedTherapist: '1', // From patients-data (Maria Garcia)
    assessments: [
      { id: 'a4', type: 'MicroFET', value: 58, date: '2025-02-07', assessmentPoint: 'T0' },
      { id: 'a5', type: 'Ultrasound', value: 2.1, date: '2025-02-07', assessmentPoint: 'T0' },
      { id: 'a6', type: 'SitToStand', value: 8, date: '2025-02-07', assessmentPoint: 'T0' }
    ], // From patients-data (Maria Garcia)
    notes: [
      { id: 'n2', content: 'Patient expressed concern about leg weakness', createdAt: '2025-02-10T14:30:00Z', createdBy: 'Dr. Sarah Johnson' }
    ] // From patients-data (Maria Garcia)
  },
  // P003: Mildred Jackson (merged with details from former ID '3' Robert Chen)
  {
    id: 'P003',
    name: 'Mildred Jackson', // From mock-data
    age: 75, // From mock-data
    gender: 'Female', // From mock-data
    dateOfBirth: '1955-08-30', // From patients-data (Robert Chen ID 3)
    studyArm: 'Intervention', // From mock-data (Mildred) vs Control (Robert Chen ID 3) - taking Mildred's
    admissionDate: '2025-05-28', // From mock-data (Mildred)
    room: '315', // From mock-data
    status: 'active', // Consistent
    lastSession: '2025-06-13', // From mock-data (Mildred)
    diagnosis: 'Post-stroke', // From mock-data
    mobility: 'Requires assistance', // From mock-data
    cognitiveStatus: 'Alert and oriented', // From mock-data
    compliance: 'Good', // From mock-data
    progress: 'Improving', // From mock-data
    mmseScore: 25, // From patients-data (Robert Chen ID 3)
    assignedTherapist: '1', // From patients-data (Robert Chen ID 3)
    assessments: [
      { id: 'a7', type: 'MicroFET', value: 70, date: '2025-01-22', assessmentPoint: 'T0' },
      { id: 'a8', type: 'Ultrasound', value: 2.5, date: '2025-01-22', assessmentPoint: 'T0' },
      { id: 'a9', type: 'SitToStand', value: 10, date: '2025-01-22', assessmentPoint: 'T0' },
      { id: 'a10', type: 'MicroFET', value: 72, date: '2025-03-22', assessmentPoint: 'T1', notes: 'Showing improvement' }
    ], // From patients-data (Robert Chen ID 3)
    notes: [
      { id: 'n3', content: 'Patient adapting well to therapy regimen', createdAt: '2025-02-01T11:20:00Z', createdBy: 'Dr. Sarah Johnson' }
    ] // From patients-data (Robert Chen ID 3)
  },
  // P004: Thomas Rivera (merged with details from former ID '4' Emily Wilson)
  {
    id: 'P004',
    name: 'Thomas Rivera', // From mock-data
    age: 80, // From mock-data
    gender: 'Male', // From mock-data
    dateOfBirth: '1960-03-12', // From patients-data (Emily Wilson)
    studyArm: 'Control', // Consistent
    admissionDate: '2025-04-10', // From mock-data (Thomas)
    room: '308', // From mock-data
    status: 'inactive', // From mock-data Thomas (vs active for Emily) - using Thomas's status
    lastSession: '2025-05-30', // From mock-data (Thomas)
    diagnosis: 'Generalized weakness', // From mock-data
    mobility: 'Bed bound', // From mock-data
    cognitiveStatus: 'Periodic confusion', // From mock-data
    compliance: 'Fair', // From mock-data
    progress: 'Slow', // From mock-data
    mmseScore: 27, // From patients-data (Emily Wilson)
    assignedTherapist: '1', // From patients-data (Emily Wilson)
    assessments: [
      { id: 'a11', type: 'MicroFET', value: 62, date: '2025-02-17', assessmentPoint: 'T0' },
      { id: 'a12', type: 'Ultrasound', value: 2.2, date: '2025-02-17', assessmentPoint: 'T0' },
      { id: 'a13', type: 'SitToStand', value: 9, date: '2025-02-17', assessmentPoint: 'T0' }
    ], // From patients-data (Emily Wilson)
    notes: [
      { id: 'n4', content: 'Patient reports feeling stronger after recent sessions', createdAt: '2025-03-01T09:15:00Z', createdBy: 'Dr. Sarah Johnson' }
    ] // From patients-data (Emily Wilson)
  },
  // P005 onwards from mock-data.ts (no previous detailed data to merge)
  {
    id: 'P005',
    name: 'Sarah Wilson',
    age: 72,
    gender: 'Female',
    room: '321',
    status: 'active',
    studyArm: 'Intervention',
    admissionDate: '2025-06-05',
    diagnosis: 'Post-fall weakness',
    mobility: 'Ambulates with cane',
    cognitiveStatus: 'Alert and oriented',
    lastSession: '2025-06-12',
    compliance: 'Excellent',
    progress: 'Rapid improvement'
    // Optional fields like dateOfBirth, mmseScore, assignedTherapist, assessments, notes, alerts will be undefined
  },
  {
    id: 'P006',
    name: 'George Miller',
    age: 79,
    gender: 'Male',
    room: '401',
    status: 'active',
    studyArm: 'Control',
    admissionDate: '2025-06-01',
    diagnosis: 'Sarcopenia',
    mobility: 'Needs assistance for transfers',
    cognitiveStatus: 'Alert',
    lastSession: '2025-06-18',
    compliance: 'Good',
    progress: 'Steady'
  },
  {
    id: 'P007',
    name: 'Brenda Lee',
    age: 85,
    gender: 'Female',
    room: '402',
    status: 'active',
    studyArm: 'Intervention',
    admissionDate: '2025-06-03',
    diagnosis: 'Frailty',
    mobility: 'Uses walker, unsteady',
    cognitiveStatus: 'Forgetful',
    lastSession: '2025-06-19',
    compliance: 'Fair',
    progress: 'Slow improvement'
  },
  {
    id: 'P008',
    name: 'Arthur Lewis',
    age: 76,
    gender: 'Male',
    room: '405',
    status: 'inactive', // This was 'inactive' in mock-data
    studyArm: 'Control',
    admissionDate: '2025-05-10',
    diagnosis: 'COPD Exacerbation',
    mobility: 'Bed rest',
    cognitiveStatus: 'Alert',
    lastSession: '2025-05-25',
    compliance: 'Poor',
    progress: 'Declined'
  },
  {
    id: 'P009',
    name: 'Nancy Young',
    age: 81,
    gender: 'Female',
    room: '408',
    status: 'active',
    studyArm: 'Intervention',
    admissionDate: '2025-06-10',
    diagnosis: 'Hip fracture recovery',
    mobility: 'Wheelchair, non-weight bearing',
    cognitiveStatus: 'Alert and motivated',
    lastSession: '2025-06-20',
    compliance: 'Excellent',
    progress: 'Good'
  },
  {
    id: 'P010',
    name: 'Kenneth Walker',
    age: 77,
    gender: 'Male',
    room: '410',
    status: 'active',
    studyArm: 'Control',
    admissionDate: '2025-06-12',
    diagnosis: 'Pneumonia recovery',
    mobility: 'Ambulates short distances with help',
    cognitiveStatus: 'Slightly confused at times',
    lastSession: '2025-06-19',
    compliance: 'Fair',
    progress: 'Steady'
  },
  {
    id: 'P011',
    name: 'Patricia Hall',
    age: 88,
    gender: 'Female',
    room: '412',
    status: 'active',
    studyArm: 'Intervention',
    admissionDate: '2025-06-15',
    diagnosis: 'Generalized deconditioning',
    mobility: 'Requires 2-person assist',
    cognitiveStatus: 'Alert',
    lastSession: '2025-06-21',
    compliance: 'Good',
    progress: 'Improving slowly'
  }
];