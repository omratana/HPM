import React, { useState } from 'react';
import { useHR } from '../HRContext';
import { LeaveRequest } from '../types';
import { Check, X, Clock, CalendarDays, Plus, Info, HelpCircle, UserCheck, ShieldAlert, FileText, Printer } from 'lucide-react';
import PrintFormModal from '../components/PrintFormModal';

export default function Leave() {
  const { 
    leaveRequests, 
    employees, 
    departments, 
    submitLeaveRequest, 
    approveLeaveRequest, 
    denyLeaveRequest,
    getEmployeeRemainingBalance,
    currentUser
  } = useHR();

  const [filter, setFilter] = useState<'All' | 'រង់ចាំ' | 'អនុម័ត' | 'បដិសេធ'>('All');
  
  // Computed available employees for the form
  const availableEmployees = employees.filter(e => {
    if (currentUser?.role === 'Admin') return true;
    if (currentUser?.role === 'Department Head') return e.departmentId === currentUser.departmentId;
    return e.id === currentUser?.id;
  });

  // New Leave Form States
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState(availableEmployees[0]?.id || '');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveType, setLeaveType] = useState<LeaveRequest['type']>('ឈប់ប្រចាំឆ្នាំ');
  const [reason, setReason] = useState('');
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [printingRequest, setPrintingRequest] = useState<LeaveRequest | null>(null);

  const selectedEmployee = employees.find(e => e.id === selectedEmpId);
  const remainingDays = selectedEmployee ? getEmployeeRemainingBalance(selectedEmployee, leaveType) : 0;

  // Calculate estimated days in real-time
  const getDurationDays = (startStr: string, endStr: string): number => {
    if (!startStr || !endStr) return 0;
    const start = new Date(startStr);
    const end = new Date(endStr);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diffDays) ? 0 : diffDays;
  };

  const estimatedDuration = getDurationDays(startDate, endDate);

  const activeRequests = leaveRequests.filter(l => {
    const matchesFilter = filter === 'All' || l.status === filter;
    if (!matchesFilter) return false;
    
    if (currentUser?.role === 'Admin') return true;
    
    if (currentUser?.role === 'Department Head') {
      const emp = employees.find(e => e.id === l.employeeId);
      return emp?.departmentId === currentUser.departmentId || l.employeeId === currentUser.id;
    }
    
    return l.employeeId === currentUser?.id;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);

    if (!selectedEmpId || !startDate || !endDate || !reason) {
      setFormFeedback({ type: 'error', message: 'សូមបំពេញព័ត៌មានដែលចាំបាច់ទាំងអស់!' });
      return;
    }

    const result = submitLeaveRequest(selectedEmpId, startDate, endDate, leaveType, reason);
    if (result.success) {
      setFormFeedback({ type: 'success', message: result.message });
      // Reset state
      setStartDate('');
      setEndDate('');
      setReason('');
      // Delay closing form slightly for UX
      setTimeout(() => {
        setShowSubmitForm(false);
        setFormFeedback(null);
      }, 1800);
    } else {
      setFormFeedback({ type: 'error', message: result.message });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Upper stats row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Statistics card */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 bg-orange-100 rounded-lg text-orange-600">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">ច្បាប់ដែលកំពុងរង់ចាំការសម្រេច</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">
                {activeRequests.filter(l => l.status === 'រង់ចាំ').length} សំណើ
              </h3>
            </div>
          </div>
        </div>

        {/* Action Button to launch Submit Request Form */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex items-center justify-between lg:col-span-2">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">សំណើសុំច្បាប់ឈប់សម្រាកបុគ្គលិក</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">ចុចលើប៊ូតុងខាងស្តាំដើម្បីបំពេញនិងបញ្ជូនសំណើច្បាប់ឈប់សម្រាកថ្មីសម្រាប់បុគ្គលិកម្នាក់ៗ។</p>
          </div>
          <button 
            onClick={() => { setShowSubmitForm(!showSubmitForm); setFormFeedback(null); }}
            className={`px-5 py-3 rounded-lg text-sm font-bold flex items-center shadow-md cursor-pointer transition-all ${
              showSubmitForm 
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-800' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {showSubmitForm ? (
              <>
                <X className="w-4 h-4 mr-2" />
                <span>បិទសន្លឹកបំពេញ</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                <span>បង្កើតសំណើច្បាប់ថ្មី</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* RENDER FORM SLIDE-OUT / COLLAPSIBLE */}
      {showSubmitForm && (
        <div className="bg-white border border-emerald-200 rounded-xl shadow-md p-6 animate-in slide-in-from-top-6 duration-350">
          <h3 className="text-base font-extrabold text-slate-800 flex items-center border-b pb-3 mb-4">
            <CalendarDays className="w-5 h-5 mr-2 text-emerald-600" />
            សន្លឹកបំពេញសំណើច្បាប់ឈប់សម្រាកបុគ្គលិក
          </h3>

          <form onSubmit={handleFormSubmit} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Employee selector */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">ជ្រើសរើសបុគ្គលិក</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  value={selectedEmpId}
                  disabled={currentUser?.role === 'Staff'}
                  onChange={e => setSelectedEmpId(e.target.value)}
                >
                  {availableEmployees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.position})</option>
                  ))}
                </select>
              </div>

              {/* Leave category selector */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">ប្រភេទច្បាប់ឈប់សម្រាក</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  value={leaveType}
                  onChange={e => setLeaveType(e.target.value as any)}
                >
                  <option value="ឈប់ប្រចាំឆ្នាំ">ឈប់ប្រចាំឆ្នាំ (Annual leave)</option>
                  <option value="ឈប់សម្រាកព្យាបាលជម្ងឺ">ឈប់សម្រាកព្យាបាលជម្ងឺ (Sick leave)</option>
                  <option value="ឈប់រយៈពេលខ្លី">ឈប់រយៈពេលខ្លី (Short-term leave)</option>
                  <option value="ឈប់សម្រាកដោយមានកិច្ចការផ្ទាល់ខ្លួន">ឈប់សម្រាកដោយមានកិច្ចការផ្ទាល់ខ្លួន (Personal leave)</option>
                  <option value="ឈប់សម្រាកលំហែមាតុភាព">ឈប់សម្រាកលំហែមាតុភាព (Maternity leave)</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">ចាប់ពីថ្ងៃបរិច្ឆេទ</label>
                <input 
                  type="date"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5 font-sans">ដល់ថ្ងៃបរិច្ឆេទ</label>
                <input 
                  type="date"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* REAL-TIME LEDGER OVERVIEW UNDER THE FORM INPUT */}
            {selectedEmployee && (
              <div className="bg-slate-50 p-4 border rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                <div className="flex items-center space-x-2">
                  <Info className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-slate-700">ចំនួនច្បាប់ដែលបុគ្គលិកប្រើប្រាស់បាន:</span>
                    <span className="ml-2 font-black text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full font-mono">
                      {remainingDays} ថ្ងៃដែលនៅសល់
                    </span>
                    <span className="text-slate-400 font-medium ml-2">({leaveType})</span>
                  </div>
                </div>

                {estimatedDuration > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-700">រយៈពេលស្នើសុំ:</span>
                    <span className={`px-3 py-1 rounded-full font-black font-mono ${
                      estimatedDuration > remainingDays ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {estimatedDuration} ថ្ងៃ
                    </span>
                    {estimatedDuration > remainingDays && (
                      <span className="text-red-500 font-bold flex items-center ml-2">
                        <ShieldAlert className="w-4 h-4 mr-1" /> ថ្ងៃសុំច្បាប់ច្រើនជាងថ្ងៃនៅសល់!
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">មូលហេតុនៃការសុំច្បាប់</label>
              <textarea 
                required
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="សូមបញ្ជាក់ទីកន្លែង ឬកិច្ចការងារចំបាច់..."
                value={reason}
                onChange={e => setReason(e.target.value)}
              />
            </div>

            {formFeedback && (
              <div className={`p-4 rounded-lg font-bold text-center ${
                formFeedback.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                {formFeedback.message}
              </div>
            )}

            <div className="flex gap-3 justify-end pt-2 border-t">
              <button 
                type="button" 
                onClick={() => { setShowSubmitForm(false); setFormFeedback(null); }}
                className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                បោះបង់
              </button>
              <button 
                type="submit" 
                disabled={estimatedDuration > remainingDays}
                className={`px-5 py-2 rounded-lg font-extrabold shadow-sm ${
                  estimatedDuration > remainingDays 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                }`}
              >
                បញ្ជូនសំណើ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MAIN LIST & SIDEBAR BALANCES TAB */}
      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* LEAVE ENTRIES SECTION */}
        <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="p-4 md:p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50 rounded-t-xl">
            <div>
              <h2 className="text-base font-black text-slate-800 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-emerald-600" />
                បញ្ជីសំណើច្បាប់ឈប់សម្រាកទាំងអស់
              </h2>
            </div>
            
            <div className="flex bg-slate-200/50 p-1 rounded-lg">
              {['All', 'រង់ចាំ', 'អនុម័ត', 'បដិសេធ'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    filter === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {f === 'All' ? 'ទាំងអស់' : f}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 md:p-6 overflow-y-auto max-h-[600px] space-y-4">
            {activeRequests.map(req => {
              const emp = employees.find(e => e.id === req.employeeId);
              const dept = emp ? departments.find(d => d.id === emp.departmentId) : null;
              const remaining = emp ? getEmployeeRemainingBalance(emp, req.type) : 0;
              
              return (
                <div key={req.id} className="border border-slate-200 rounded-xl p-5 hover:bg-slate-50/40 flex flex-col md:flex-row justify-between relative transition-colors bg-white">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-lg flex-shrink-0 ${
                      req.status === 'រង់ចាំ' ? 'bg-orange-100 text-orange-600' :
                      req.status === 'អនុម័ត' ? 'bg-emerald-100 text-emerald-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {emp?.name.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-base">{emp?.name || 'បុគ្គលិកថ្មី'}</h3>
                      <p className="text-xs text-slate-400 mt-0.5 font-semibold">{emp?.position} • {dept?.name}</p>
                      
                      <div className="mt-3 inline-block bg-slate-50 rounded-lg p-3 w-full border border-slate-200">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-700">
                          <div className="flex items-center">
                            <span className="font-extrabold w-24">ប្រភេទច្បាប់:</span>
                            <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full text-[10px] font-black">{req.type}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-extrabold w-20">រយៈពេលស្នើសុំ:</span>
                            <span className="font-black text-slate-850 bg-slate-200/60 px-2 py-0.5 rounded-full font-mono">{req.durationDays} ថ្ងៃ</span>
                          </div>
                          <div className="flex items-center col-span-2">
                            <span className="font-extrabold w-24">ថ្ងៃឈប់សម្រាក:</span>
                            <span className="font-bold text-slate-700 font-mono">{req.startDate} ដល់ {req.endDate}</span>
                          </div>
                          <div className="flex items-start col-span-2 mt-1">
                            <span className="font-extrabold w-24 pt-0.5 flex-shrink-0">មូលហេតុ:</span>
                            <p className="flex-1 text-slate-650 bg-white p-2 border border-slate-100 rounded text-[11px] leading-relaxed">
                              “{req.reason}”
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 flex flex-row md:flex-col justify-end gap-2 md:w-36 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4">
                    {req.status === 'រង់ចាំ' ? (
                      <>
                        <div className="hidden md:block text-[10px] text-center font-bold text-slate-450 bg-slate-100 py-1 rounded p-1 mb-2">
                          ច្បាប់សល់: <span className="text-emerald-700 font-extrabold font-mono">{remaining} ថ្ងៃ</span>
                        </div>
                        {currentUser?.role !== 'Staff' && (
                          <>
                            <button 
                              onClick={() => approveLeaveRequest(req.id)}
                              className="flex-1 md:flex-none flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-lg text-xs font-bold transition-colors shadow-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                            >
                              <Check className="w-4 h-4 mr-1.5" /> អនុម័ត
                            </button>
                            <button 
                              onClick={() => denyLeaveRequest(req.id)}
                              className="flex-1 md:flex-none flex items-center justify-center bg-white border border-red-200 text-red-600 hover:bg-red-50 py-2 px-3 rounded-lg text-xs font-bold transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none cursor-pointer"
                            >
                              <X className="w-4 h-4 mr-1.5" /> បដិសេធ
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setPrintingRequest(req); }}
                              className="md:hidden lg:flex flex-1 md:flex-none items-center justify-center bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 py-2 px-3 rounded-lg text-xs font-bold transition-colors focus:ring-2 focus:ring-slate-500 focus:outline-none cursor-pointer mt-1"
                            >
                              <Printer className="w-4 h-4 mr-1.5" /> ពុម្ព
                            </button>
                          </>
                        )}
                        {currentUser?.role === 'Staff' && (
                          <div className="flex flex-col items-center justify-center flex-1 h-full rounded-xl border border-orange-200 bg-orange-50 text-orange-600 p-3">
                            <Clock className="w-5 h-5 mb-1" />
                            <span className="font-extrabold text-xs">កំពុងរង់ចាំ</span>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setPrintingRequest(req); }}
                              className="mt-2 flex items-center px-3 py-1 rounded bg-white border border-orange-200 text-orange-700 cursor-pointer hover:bg-orange-100 transition-colors shadow-sm"
                            >
                              <Printer className="w-3 h-3 mr-1" /> <span className="text-[10px] font-bold">បោះពុម្ពទម្រង់</span>
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className={`flex flex-col items-center justify-center flex-1 h-full rounded-xl border p-3 ${
                        req.status === 'អនុម័ត' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'
                      }`}>
                        {req.status === 'អនុម័ត' ? <Check className="w-5 h-5 mb-1" /> : <X className="w-5 h-5 mb-1" />}
                        <span className="font-extrabold text-xs">{req.status}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setPrintingRequest(req); }}
                          className={`mt-2 flex items-center px-3 py-1 rounded bg-white border cursor-pointer hover:bg-slate-50 transition-colors shadow-sm ${req.status === 'អនុម័ត' ? 'text-emerald-700 border-emerald-200' : 'text-red-700 border-red-200'}`}
                        >
                          <Printer className="w-3 h-3 mr-1" /> <span className="text-[10px] font-bold">បោះពុម្ពទម្រង់</span>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {req.status === 'រង់ចាំ' && (
                    <div className="absolute top-4 right-4 md:hidden text-orange-500">
                      <Clock className="w-5 h-5 animate-spin" />
                    </div>
                  )}
                </div>
              );
            })}
            
            {activeRequests.length === 0 && (
              <div className="text-center py-20 text-slate-400 border border-slate-200 border-dashed rounded-xl bg-slate-50/10">
                រកមិនឃើញសំណើច្បាប់ឈប់សម្រាកក្នុងក្រុមនេះទេ
              </div>
            )}
          </div>
        </div>

        {/* SIDE LEDGER BALANCE TABLE SHEET */}
        <div className="w-full xl:w-96 bg-white border border-slate-200 rounded-xl p-6 shadow-sm self-start">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
            <span>តារាងតុល្យភាពច្បាប់ឈប់សម្រាករួម</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </h3>
          <div className="space-y-4">
            {availableEmployees.map(emp => (
              <div key={emp.id} className="p-3.5 border rounded-xl hover:border-emerald-300 transition-colors">
                <div className="flex justify-between items-center bg-slate-50 p-1.5 rounded-lg mb-2">
                  <span className="font-extrabold text-slate-800 text-xs">{emp.name}</span>
                  <span className="text-[10px] text-slate-400 font-bold">{emp.position}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                  <div className="bg-emerald-50/50 p-2 rounded border border-emerald-100/50 flex flex-col">
                    <span className="text-emerald-800 text-[9px]">ឈប់ប្រចាំឆ្នាំ</span>
                    <span className="font-mono text-slate-800 mt-1">{emp.leaveBalances.annualAllowed - emp.leaveBalances.annualUsed} ថ្ងៃសល់</span>
                  </div>
                  <div className="bg-blue-50/50 p-2 rounded border border-blue-100/50 flex flex-col">
                    <span className="text-blue-800 text-[9px]">ឈឺព្យាបាល</span>
                    <span className="font-mono text-slate-800 mt-1">{emp.leaveBalances.sickAllowed - emp.leaveBalances.sickUsed} ថ្ងៃសល់</span>
                  </div>
                  <div className="bg-orange-50/50 p-2 rounded border border-orange-100/50 flex flex-col">
                    <span className="text-orange-850 text-[9px]">កិច្ចការផ្ទាល់ខ្លួន</span>
                    <span className="font-mono text-slate-800 mt-1">{emp.leaveBalances.personalAllowed - emp.leaveBalances.personalUsed} ថ្ងៃសល់</span>
                  </div>
                  <div className="bg-yellow-50/50 p-2 rounded border border-yellow-100/50 flex flex-col">
                    <span className="text-yellow-800 text-[9px]">រយៈពេលខ្លី</span>
                    <span className="font-mono text-slate-800 mt-1">{emp.leaveBalances.shortAllowed - emp.leaveBalances.shortUsed} ថ្ងៃសល់</span>
                  </div>
                  {emp.gender === 'ស្រី' && emp.leaveBalances.maternityAllowed > 0 && (
                    <div className="bg-purple-50/50 p-2 rounded border border-purple-100/50 flex flex-col col-span-2">
                      <span className="text-purple-800 text-[9px]">លំហែមាតុភាព</span>
                      <span className="font-mono text-slate-800 mt-1">{emp.leaveBalances.maternityAllowed - emp.leaveBalances.maternityUsed} ថ្ងៃសល់</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {printingRequest && (
        <PrintFormModal 
          request={printingRequest}
          employee={employees.find(e => e.id === printingRequest.employeeId)!}
          department={departments.find(d => d.id === employees.find(e => e.id === printingRequest.employeeId)?.departmentId)}
          onClose={() => setPrintingRequest(null)}
        />
      )}
    </div>
  );
}
