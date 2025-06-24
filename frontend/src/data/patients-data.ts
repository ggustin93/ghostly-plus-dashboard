import { Patient } from '@/types/patient';

const generateChartData = (startDate: string, numPoints: number, startValue: number, trend: 'up' | 'down' | 'flat' | 'mixed' = 'up', scale: number = 5) => {
  const data: { date: string; value: number }[] = [];
  const currentDate = new Date(startDate);
  let currentValue = startValue;

  for (let i = 0; i < numPoints; i++) {
    data.push({
      date: currentDate.toISOString().split('T')[0],
      value: Math.round(currentValue),
    });

    let change = (Math.random() - 0.4) * scale; // Tendency to increase
    if (trend === 'down') {
      change = (Math.random() - 0.6) * scale; // Tendency to decrease
    } else if (trend === 'flat') {
      change = (Math.random() - 0.5) * scale;
    } else if (trend === 'mixed') {
       if (i % 4 < 2) {
         change = (Math.random() - 0.4) * scale;
       } else {
         change = (Math.random() - 0.6) * scale;
       }
    }
    
    currentValue += change;
    currentValue = Math.max(0, Math.min(100, currentValue)); // Clamp between 0 and 100

    currentDate.setDate(currentDate.getDate() + (Math.floor(Math.random() * 3) + 2)); // next session in 2-4 days
  }
  return data;
}

const getProgressStatus = (trend: 'up' | 'down' | 'flat' | 'mixed'): 'Improving' | 'Declining' | 'Steady' | 'Mixed' => {
  switch (trend) {
    case 'up': return 'Improving';
    case 'down': return 'Declining';
    case 'flat': return 'Steady';
    default: return 'Mixed';
  }
};

export const mockPatients: Patient[] = [
  // P001: Eleanor Thompson
  {
    id: 'P001',
    name: 'Eleanor Thompson',
    age: 78,
    gender: 'Female',
    admissionDate: '2025-05-15',
    room: '302',
    status: 'active',
    lastSession: '2025-06-15',
    diagnosis: 'Postoperative weakness',
    mobility: 'Limited with walker',
    cognitiveStatus: 'Alert and oriented',
    therapistId: 'T001',
    adherence: 92,
    progress: getProgressStatus('up'),
    adherenceHistory: generateChartData('2025-05-16', 7, 70, 'up', 5),
    gamePerformanceHistory: generateChartData('2025-05-16', 7, 60, 'up', 8),
    fatigueHistory: generateChartData('2025-05-16', 7, 40, 'down', 8),
    rpeHistory: generateChartData('2025-05-16', 7, 7, 'down', 2),
  },
  // P002: Robert Chen
  {
    id: 'P002',
    name: 'Robert Chen',
    age: 82,
    gender: 'Male',
    admissionDate: '2025-05-20',
    room: '310',
    status: 'active',
    lastSession: '2025-06-14',
    diagnosis: 'Deconditioning',
    mobility: 'Wheelchair dependent',
    cognitiveStatus: 'Mild cognitive impairment',
    therapistId: 'T001',
    adherence: 75,
    progress: getProgressStatus('mixed'),
    adherenceHistory: generateChartData('2025-05-21', 6, 65, 'flat', 4),
    gamePerformanceHistory: generateChartData('2025-05-21', 6, 50, 'mixed', 10),
    fatigueHistory: generateChartData('2025-05-21', 6, 50, 'mixed', 10),
    rpeHistory: generateChartData('2025-05-21', 6, 8, 'flat', 2),
  },
  // P003: Mildred Jackson
  {
    id: 'P003',
    name: 'Mildred Jackson',
    age: 75,
    gender: 'Female',
    admissionDate: '2025-05-28',
    room: '315',
    status: 'active',
    lastSession: '2025-06-13',
    diagnosis: 'Post-stroke',
    mobility: 'Requires assistance',
    cognitiveStatus: 'Alert and oriented',
    therapistId: 'T001',
    adherence: 95,
    progress: getProgressStatus('up'),
    adherenceHistory: generateChartData('2025-05-29', 5, 80, 'up', 6),
    gamePerformanceHistory: generateChartData('2025-05-29', 5, 70, 'up', 7),
    fatigueHistory: generateChartData('2025-05-29', 5, 30, 'down', 5),
    rpeHistory: generateChartData('2025-05-29', 5, 5, 'down', 1),
  },
  // P004: Thomas Rivera
  {
    id: 'P004',
    name: 'Thomas Rivera',
    age: 80,
    gender: 'Male',
    admissionDate: '2025-04-10',
    dischargeDate: '2025-05-30',
    room: '308',
    status: 'discharged',
    lastSession: '2025-05-30',
    diagnosis: 'Generalized weakness',
    mobility: 'Bed bound',
    cognitiveStatus: 'Periodic confusion',
    therapistId: 'T001',
    adherence: 35,
    progress: getProgressStatus('down'),
    adherenceHistory: generateChartData('2025-04-11', 8, 50, 'down', 7),
    gamePerformanceHistory: generateChartData('2025-04-11', 8, 40, 'down', 9),
    fatigueHistory: generateChartData('2025-04-11', 8, 60, 'up', 9),
    rpeHistory: generateChartData('2025-04-11', 8, 8, 'up', 1),
  },
  // P005: Sarah Wilson
  {
    id: 'P005',
    name: 'Sarah Wilson',
    age: 72,
    gender: 'Female',
    room: '321',
    status: 'active',
    admissionDate: '2025-06-05',
    diagnosis: 'Post-fall weakness',
    mobility: 'Ambulates with cane',
    therapistId: 'T001',
    adherence: 85,
    progress: getProgressStatus('mixed'),
    adherenceHistory: generateChartData('2025-06-06', 4, 75, 'up', 5),
    gamePerformanceHistory: generateChartData('2025-06-06', 4, 65, 'mixed', 12),
    fatigueHistory: generateChartData('2025-06-06', 4, 25, 'mixed', 10),
    rpeHistory: generateChartData('2025-06-06', 4, 4, 'up', 2),
  },
  // P006: George Miller
  {
    id: 'P006',
    name: 'George Miller',
    age: 79,
    gender: 'Male',
    room: '401',
    status: 'active',
    admissionDate: '2025-06-01',
    diagnosis: 'Sarcopenia',
    mobility: 'Needs assistance for transfers',
    cognitiveStatus: 'Alert',
    lastSession: '2025-05-18',
    therapistId: 'T002',
    adherence: 88,
    progress: getProgressStatus('up'),
    adherenceHistory: generateChartData('2025-06-02', 7, 70, 'up', 4),
    gamePerformanceHistory: generateChartData('2025-06-02', 7, 60, 'up', 6),
    fatigueHistory: generateChartData('2025-06-02', 7, 45, 'down', 7),
    rpeHistory: generateChartData('2025-06-02', 7, 6, 'down', 2),
  },
  // P007: Brenda Lee
  {
    id: 'P007',
    name: 'Brenda Lee',
    age: 85,
    gender: 'Female',
    room: '402',
    status: 'active',
    admissionDate: '2025-06-03',
    diagnosis: 'Frailty',
    mobility: 'Uses walker, unsteady',
    cognitiveStatus: 'Forgetful',
    lastSession: '2025-06-19',
    therapistId: 'T003',
    adherence: 65,
    progress: getProgressStatus('mixed'),
    adherenceHistory: generateChartData('2025-06-04', 6, 60, 'mixed', 8),
    gamePerformanceHistory: generateChartData('2025-06-04', 6, 55, 'mixed', 15),
    fatigueHistory: generateChartData('2025-06-04', 6, 55, 'up', 8),
    rpeHistory: generateChartData('2025-06-04', 6, 7, 'flat', 3),
  },
  // P008: Arthur Lewis
  {
    id: 'P008',
    name: 'Arthur Lewis',
    age: 76,
    gender: 'Male',
    room: '405',
    status: 'inactive',
    admissionDate: '2025-05-10',
    diagnosis: 'COPD Exacerbation',
    mobility: 'Bed rest',
    cognitiveStatus: 'Alert',
    lastSession: '2025-05-25',
    therapistId: 'T002',
    adherence: 25,
    progress: getProgressStatus('down'),
    adherenceHistory: generateChartData('2025-05-11', 3, 40, 'down', 10),
    gamePerformanceHistory: generateChartData('2025-05-11', 3, 30, 'down', 12),
    fatigueHistory: generateChartData('2025-05-11', 3, 70, 'up', 10),
    rpeHistory: generateChartData('2025-05-11', 3, 9, 'up', 1),
  },
  // P009: Nancy Young
  {
    id: 'P009',
    name: 'Nancy Young',
    age: 81,
    gender: 'Female',
    room: '408',
    status: 'active',
    admissionDate: '2025-06-10',
    diagnosis: 'Hip fracture recovery',
    mobility: 'Wheelchair, non-weight bearing',
    cognitiveStatus: 'Alert and motivated',
    lastSession: '2025-06-20',
    therapistId: 'T003',
    adherence: 94,
    progress: getProgressStatus('up'),
    adherenceHistory: generateChartData('2025-06-11', 5, 85, 'up', 3),
    gamePerformanceHistory: generateChartData('2025-06-11', 5, 75, 'up', 5),
    fatigueHistory: generateChartData('2025-06-11', 5, 20, 'down', 5),
    rpeHistory: generateChartData('2025-06-11', 5, 3, 'down', 1),
  },
  // P010: Kenneth Walker
  {
    id: 'P010',
    name: 'Kenneth Walker',
    age: 77,
    gender: 'Male',
    room: '410',
    status: 'active',
    admissionDate: '2025-06-12',
    diagnosis: 'Pneumonia recovery',
    mobility: 'Ambulates short distances with help',
    cognitiveStatus: 'Slightly confused at times',
    lastSession: '2025-06-19',
    therapistId: 'T002',
    adherence: 68,
    progress: getProgressStatus('mixed'),
    adherenceHistory: generateChartData('2025-06-13', 4, 60, 'mixed', 10),
    gamePerformanceHistory: generateChartData('2025-06-13', 4, 50, 'mixed', 15),
    fatigueHistory: generateChartData('2025-06-13', 4, 65, 'up', 7),
    rpeHistory: generateChartData('2025-06-13', 4, 7, 'mixed', 2),
  },
  // P011: Patricia Hall
  {
    id: 'P011',
    name: 'Patricia Hall',
    age: 88,
    gender: 'Female',
    room: '412',
    status: 'active',
    admissionDate: '2025-06-15',
    diagnosis: 'Generalized deconditioning',
    mobility: 'Requires 2-person assist',
    cognitiveStatus: 'Alert',
    lastSession: '2025-06-21',
    therapistId: 'T003',
    adherence: 85,
    progress: getProgressStatus('up'),
    adherenceHistory: generateChartData('2025-06-16', 3, 70, 'up', 6),
    gamePerformanceHistory: generateChartData('2025-06-16', 3, 65, 'up', 7),
    fatigueHistory: generateChartData('2025-06-16', 3, 50, 'down', 9),
    rpeHistory: generateChartData('2025-06-16', 3, 6, 'down', 2),
  }
];