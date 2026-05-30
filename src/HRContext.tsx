import React, { createContext, useContext, useState, useEffect } from 'react';
import { Employee, LeaveRequest, Department, RegDocument } from './types';
import { employees as initialEmployees, leaveRequests as initialLeaveRequests, departments as initialDepartments, regDocuments as initialRegDocuments } from './data';

interface HRContextType {
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  departments: Department[];
  regDocuments: RegDocument[];
  currentUser: Employee | null;
  switchUser: (id: string) => void;
  addEmployee: (emp: Omit<Employee, 'id' | 'leaveBalances'>) => void;
  submitLeaveRequest: (employeeId: string, startDate: string, endDate: string, type: LeaveRequest['type'], reason: string) => { success: boolean; message: string };
  approveLeaveRequest: (id: string) => void;
  denyLeaveRequest: (id: string) => void;
  clearNotification: (id: string) => void;
  getEmployeeRemainingBalance: (employee: Employee, type: LeaveRequest['type']) => number;
}

const HRContext = createContext<HRContextType | undefined>(undefined);

export function HRProvider({ children }: { children: React.ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('hospital_hr_employees');
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('hospital_hr_leaves');
    return saved ? JSON.parse(saved) : initialLeaveRequests;
  });

  const [regDocuments, setRegDocuments] = useState<RegDocument[]>(() => {
    const saved = localStorage.getItem('hospital_hr_documents');
    return saved ? JSON.parse(saved) : initialRegDocuments;
  });

  const [currentUserId, setCurrentUserId] = useState<string>('e3'); // default to Admin
  const currentUser = employees.find(e => e.id === currentUserId) || null;

  const switchUser = (id: string) => {
    setCurrentUserId(id);
  };

  useEffect(() => {
    localStorage.setItem('hospital_hr_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('hospital_hr_leaves', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem('hospital_hr_documents', JSON.stringify(regDocuments));
  }, [regDocuments]);

  const addEmployee = (newEmp: Omit<Employee, 'id' | 'leaveBalances'>) => {
    const id = 'e' + (employees.length + 1);
    const employeeWithBalances: Employee = {
      ...newEmp,
      id,
      leaveBalances: {
        annualAllowed: 18,
        annualUsed: 0,
        sickAllowed: 15,
        sickUsed: 0,
        shortAllowed: 7,
        shortUsed: 0,
        personalAllowed: 7,
        personalUsed: 0,
        maternityAllowed: newEmp.gender === 'ស្រី' ? 90 : 0,
        maternityUsed: 0,
      }
    };
    setEmployees(prev => [...prev, employeeWithBalances]);
  };

  const getDurationDays = (startStr: string, endStr: string): number => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diffDays) ? 0 : diffDays;
  };

  const getEmployeeRemainingBalance = (emp: Employee, type: LeaveRequest['type']): number => {
    const balances = emp.leaveBalances;
    if (!balances) return 0;
    switch (type) {
      case 'ឈប់ប្រចាំឆ្នាំ':
        return balances.annualAllowed - balances.annualUsed;
      case 'ឈប់សម្រាកព្យាបាលជម្ងឺ':
        return balances.sickAllowed - balances.sickUsed;
      case 'ឈប់រយៈពេលខ្លី':
        return balances.shortAllowed - balances.shortUsed;
      case 'ឈប់សម្រាកដោយមានកិច្ចការផ្ទាល់ខ្លួន':
        return balances.personalAllowed - balances.personalUsed;
      case 'ឈប់សម្រាកលំហែមាតុភាព':
        return balances.maternityAllowed - balances.maternityUsed;
      default:
        return 0;
    }
  };

  const submitLeaveRequest = (
    employeeId: string,
    startDate: string,
    endDate: string,
    type: LeaveRequest['type'],
    reason: string
  ) => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) {
      return { success: false, message: 'រកមិនឃើញប្រវត្តិរូបបុគ្គលិកនេះទេ' };
    }

    const duration = getDurationDays(startDate, endDate);
    if (duration <= 0) {
      return { success: false, message: 'កាលបរិច្ឆេទមិនត្រឹមត្រូវទេ' };
    }

    const remaining = getEmployeeRemainingBalance(emp, type);
    if (remaining < duration) {
      return {
        success: false,
        message: `បុគ្គលិកមានចំនួនច្បាប់ដែលនៅសល់ ${remaining} ថ្ងៃ មិនគ្រប់គ្រាន់សម្រាប់ការសុំចំនួន ${duration} ថ្ងៃឡើយ។`
      };
    }

    const id = 'l' + (leaveRequests.length + 1);
    const newRequest: LeaveRequest = {
      id,
      employeeId,
      startDate,
      endDate,
      type,
      status: 'រង់ចាំ',
      reason,
      durationDays: duration,
      isNewNotification: true,
    };

    setLeaveRequests(prev => [newRequest, ...prev]);
    return { success: true, message: 'សំណើរសុំច្បាប់ត្រូវបានបញ្ជូនជោគជ័យ' };
  };

  const approveLeaveRequest = (id: string) => {
    const req = leaveRequests.find(l => l.id === id);
    if (!req) return;

    // Update Request status
    setLeaveRequests(prev =>
      prev.map(l => (l.id === id ? { ...l, status: 'អនុម័ត' as const, isNewNotification: false } : l))
    );

    // Subtract from employee leave balances
    setEmployees(prevEmps =>
      prevEmps.map(emp => {
        if (emp.id !== req.employeeId) return emp;
        const b = { ...emp.leaveBalances };
        switch (req.type) {
          case 'ឈប់ប្រចាំឆ្នាំ':
            b.annualUsed += req.durationDays;
            break;
          case 'ឈប់សម្រាកព្យាបាលជម្ងឺ':
            b.sickUsed += req.durationDays;
            break;
          case 'ឈប់រយៈពេលខ្លី':
            b.shortUsed += req.durationDays;
            break;
          case 'ឈប់សម្រាកដោយមានកិច្ចការផ្ទាល់ខ្លួន':
            b.personalUsed += req.durationDays;
            break;
          case 'ឈប់សម្រាកលំហែមាតុភាព':
            b.maternityUsed += req.durationDays;
            break;
        }
        return { ...emp, leaveBalances: b };
      })
    );
  };

  const denyLeaveRequest = (id: string) => {
    setLeaveRequests(prev =>
      prev.map(l => (l.id === id ? { ...l, status: 'បដិសេធ' as const, isNewNotification: false } : l))
    );
  };

  const clearNotification = (id: string) => {
    setLeaveRequests(prev =>
      prev.map(l => (l.id === id ? { ...l, isNewNotification: false } : l))
    );
  };

  return (
    <HRContext.Provider
      value={{
        employees,
        leaveRequests,
        departments: initialDepartments,
        regDocuments,
        currentUser,
        switchUser,
        addEmployee,
        submitLeaveRequest,
        approveLeaveRequest,
        denyLeaveRequest,
        clearNotification,
        getEmployeeRemainingBalance,
      }}
    >
      {children}
    </HRContext.Provider>
  );
}

export function useHR() {
  const context = useContext(HRContext);
  if (!context) {
    throw new Error('useHR must be used within an HRProvider');
  }
  return context;
}
