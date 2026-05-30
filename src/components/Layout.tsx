import React, { useState } from 'react';
import { AppView } from '../types';
import { Activity, Users, FileText, CalendarDays, Hospital, Bell, Check, X } from 'lucide-react';
import { useHR } from '../HRContext';

interface LayoutProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  children: React.ReactNode;
}

export default function Layout({ currentView, onViewChange, children }: LayoutProps) {
  const { leaveRequests, employees, approveLeaveRequest, denyLeaveRequest, clearNotification, currentUser, switchUser } = useHR();
  const [showNotifications, setShowNotifications] = useState(false);

  const visibleMenuItems = [
    { id: 'dashboard' as AppView, label: 'ផ្ទាំងគ្រប់គ្រង', icon: <Activity className="w-5 h-5" /> },
    ...(currentUser?.role !== 'Staff' ? [{ id: 'employees' as AppView, label: 'គ្រប់គ្រងបុគ្គលិក', icon: <Users className="w-5 h-5" /> }] : []),
    { id: 'documents' as AppView, label: 'លិខិតបេសកកម្ម និងចុះលេខ', icon: <FileText className="w-5 h-5" /> },
    { id: 'leave' as AppView, label: 'ច្បាប់ឈប់សម្រាក', icon: <CalendarDays className="w-5 h-5" /> },
  ];

  // Filter alerts for the current user (only admins or department heads see relevant pending requests)
  const alertLeaves = leaveRequests.filter(l => {
    if (!l.isNewNotification) return false;
    if (currentUser?.role === 'Admin') return true;
    if (currentUser?.role === 'Department Head') {
      const emp = employees.find(e => e.id === l.employeeId);
      return emp?.departmentId === currentUser.departmentId;
    }
    return false;
  });

  const menuItems = visibleMenuItems.map(item => {
    if (item.id === 'leave') {
      return { ...item, badgeCount: leaveRequests.filter(l => l.status === 'រង់ចាំ' && (
        currentUser?.role === 'Admin' ||
        (currentUser?.role === 'Department Head' && employees.find(e => e.id === l.employeeId)?.departmentId === currentUser.departmentId) ||
        (currentUser?.role === 'Staff' && l.employeeId === currentUser.id)
      )).length };
    }
    return item;
  });

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-900 text-slate-100 flex flex-col shadow-xl z-10">
        <div className="p-6 flex items-center space-x-3 bg-emerald-950">
          <Hospital className="w-8 h-8 text-emerald-400" />
          <h1 className="text-lg font-bold leading-tight">ប្រព័ន្ធធនធានមនុស្ស<br/><span className="text-emerald-400 text-sm font-normal">មន្ទីរពេទ្យកម្រិតខ្ពស់</span></h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                currentView === item.id
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'text-emerald-100 hover:bg-emerald-800 hover:text-white text-opacity-80'
              }`}
            >
              <div className="flex items-center space-x-3">
                {item.icon}
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              {item.badgeCount && item.badgeCount > 0 ? (
                <span className="bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full animate-pulse shadow-sm">
                  {item.badgeCount}
                </span>
              ) : null}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-emerald-800 text-xs text-emerald-400 text-center">
          ជំនាន់ 1.0.0
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white px-8 py-4 flex items-center justify-between border-b border-slate-200 z-20">
          <h2 className="text-xl font-bold text-slate-800">
            {menuItems.find(m => m.id === currentView)?.label || 'មន្ទីរពេទ្យ'}
          </h2>
          <div className="flex items-center space-x-6">
            
            {/* Manager Notifications Panel */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {alertLeaves.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-ping" />
                )}
                {alertLeaves.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                    <h4 className="font-bold text-slate-800 text-sm">សេចក្តីជូនដំណឹងសម្រាប់អ្នកគ្រប់គ្រង ({alertLeaves.length})</h4>
                    {alertLeaves.length > 0 && (
                      <button 
                        onClick={() => alertLeaves.forEach(a => clearNotification(a.id))}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        សម្អាតទាំងអស់
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto space-y-2">
                    {alertLeaves.length === 0 ? (
                      <p className="text-slate-400 italic text-xs py-4 text-center">គ្មានសេចក្តីជូនដំណឹងថ្មីៗទេ</p>
                    ) : (
                      alertLeaves.map(req => {
                        const emp = employees.find(e => e.id === req.employeeId);
                        return (
                          <div key={req.id} className="p-3 bg-amber-50/70 hover:bg-amber-50 border border-amber-100 rounded-lg text-xs space-y-2 relative">
                            <button 
                              onClick={() => clearNotification(req.id)}
                              className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 font-bold"
                            >
                              ✕
                            </button>
                            <div>
                              <p className="text-slate-800 font-bold">
                                {emp?.name} <span className="font-normal text-slate-500">បានផ្ញើសំណើសុំ</span> {req.type}
                              </p>
                              <p className="text-slate-500 mt-0.5">រយៈពេល: {req.durationDays} ថ្ងៃ ({req.startDate} ដល់ {req.endDate})</p>
                              <p className="text-slate-600 italic bg-white p-1 rounded mt-1 border border-slate-100">“{req.reason}”</p>
                            </div>
                            <div className="flex gap-2 justify-end pt-1">
                              <button 
                                onClick={() => { approveLeaveRequest(req.id); }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded text-[10px] font-bold flex items-center shadow-sm"
                              >
                                <Check className="w-3 h-3 mr-1" /> អនុម័ត
                              </button>
                              <button 
                                onClick={() => { denyLeaveRequest(req.id); }}
                                className="bg-white border border-red-200 text-red-600 hover:bg-red-50 px-2.5 py-1 rounded text-[10px] font-bold flex items-center"
                              >
                                <X className="w-3 h-3 mr-1" /> បដិសេធ
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <select 
                className="bg-slate-100 border-none text-xs font-bold rounded-lg px-2 py-1 outline-none cursor-pointer text-slate-600"
                value={currentUser?.id}
                onChange={(e) => switchUser(e.target.value)}
              >
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
                ))}
              </select>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800">{currentUser?.name || 'អ្នកគ្រប់គ្រងប្រព័ន្ធ'}</p>
                <p className="text-xs text-slate-500">{currentUser?.role || 'គណនីរដ្ឋបាល'}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
                {currentUser?.name.charAt(0) || 'រត្ថ'}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic View */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
