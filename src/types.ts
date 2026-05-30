export type AppView = 'dashboard' | 'employees' | 'documents' | 'leave';

export type EmployeeRole = 'Admin' | 'Department Head' | 'Staff';

export interface Department {
  id: string;
  name: string;
}

export interface Employee {
  id: string;
  name: string;
  gender: 'ប្រុស' | 'ស្រី';
  departmentId: string;
  position: string;
  phone: string;
  joinDate: string;
  status: 'សកម្ម' | 'ឈប់សម្រាក' | 'ចប់កុងត្រា';
  role: EmployeeRole;
  contracts: { name: string; url: string; date: string }[];
  documents: { name: string; url: string; date: string }[];
  resume: string;
  leaveBalances: {
    annualAllowed: number;
    annualUsed: number;
    sickAllowed: number;
    sickUsed: number;
    shortAllowed: number;
    shortUsed: number;
    personalAllowed: number;
    personalUsed: number;
    maternityAllowed: number;
    maternityUsed: number;
  };
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  returnDate?: string;
  type: 'ឈប់ប្រចាំឆ្នាំ' | 'ឈប់សម្រាកព្យាបាលជម្ងឺ' | 'ឈប់រយៈពេលខ្លី' | 'ឈប់សម្រាកដោយមានកិច្ចការផ្ទាល់ខ្លួន' | 'ឈប់សម្រាកលំហែមាតុភាព';
  status: 'រង់ចាំ' | 'អនុម័ត' | 'បដិសេធ';
  reason: string;
  isNewNotification?: boolean;
  durationDays: number;
}

export interface RegDocument {
  id: string;
  refNumber: string; // លេខលិខិត
  title: string;
  type: 'លិខិតចូល' | 'លិខិតចេញ' | 'លិខិតផ្ទៃក្នុង' | 'លិខិតបេសកកម្ម' | 'កិច្ចសន្យា';
  date: string;
  expirationDate?: string; // Optional field for tracking expiration
  status: 'ព្រាង' | 'បានបញ្ជូន' | 'បានអនុម័ត';
  assigneeId?: string; // For mission assignee
}
