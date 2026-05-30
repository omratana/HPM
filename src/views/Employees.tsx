import React, { useState } from 'react';
import { useHR } from '../HRContext';
import { Employee } from '../types';
import { Search, Filter, FileText, UserPlus, FileSignature, X, PieChart, ShieldAlert, BadgeInfo } from 'lucide-react';
import PrintIDCardModal from '../components/PrintIDCardModal';

export default function Employees() {
  const { employees, departments, addEmployee, currentUser } = useHR();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Filter based on role
  const visibleEmployees = employees.filter(e => {
    if (currentUser?.role === 'Admin') return true;
    if (currentUser?.role === 'Department Head') return e.departmentId === currentUser.departmentId;
    return e.id === currentUser?.id;
  });
  
  // Add Employee Form States
  const [showAddModal, setShowAddModal] = useState(false);
  const [printingIdCard, setPrintingIdCard] = useState<Employee | null>(null);
  const [newName, setNewName] = useState('');
  const [newGender, setNewGender] = useState<'ប្រុស' | 'ស្រី'>('ប្រុស');
  const [newDeptId, setNewDeptId] = useState(departments[0]?.id || '');
  const [newPosition, setNewPosition] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newJoinDate, setNewJoinDate] = useState(new Date().toISOString().split('T')[0]);
  const [newResume, setNewResume] = useState('Résumé.pdf');

  // Find currently updated version of selectedEmployee in list
  const currentEmp = visibleEmployees.find(e => e.id === selectedEmployee?.id) || selectedEmployee;

  const filtered = visibleEmployees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.departmentId === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPosition || !newPhone) {
      alert('សូមបំពេញព័ត៌មានដែលចាំបាច់ទាំងអស់!');
      return;
    }
    addEmployee({
      name: newName,
      gender: newGender,
      departmentId: currentUser?.role === 'Department Head' ? currentUser.departmentId : newDeptId,
      position: newPosition,
      phone: newPhone,
      joinDate: newJoinDate,
      status: 'សកម្ម',
      role: 'Staff',
      contracts: [{ name: 'កុងត្រាចូលការងារលើកដំបូង.pdf', url: '#', date: newJoinDate }],
      documents: [],
      resume: newResume,
    });
    // Reset form states
    setNewName('');
    setNewPosition('');
    setNewPhone('');
    setNewGender('ប្រុស');
    setShowAddModal(false);
  };

  return (
    <div className="flex h-full gap-6 animate-in fade-in duration-300 relative">
      {/* Employee List */}
      <div className={`flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm ${currentEmp ? 'w-2/3 hidden lg:flex' : 'w-full'}`}>
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="ស្វែងរកឈ្មោះ ឬតួនាទី..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Filter className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
              <select 
                className="pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
                value={selectedDept}
                disabled={currentUser?.role === 'Department Head' || currentUser?.role === 'Staff'}
                onChange={(e) => setSelectedDept(e.target.value)}
              >
                <option value="All">ផ្នែកទាំងអស់</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            {currentUser?.role !== 'Staff' && (
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors text-sm font-medium shadow-sm cursor-pointer"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                <span>បន្ថែមថ្មី</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-600 border-b border-slate-200 uppercase tracking-wider">ឈ្មោះបុគ្គលិក</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-600 border-b border-slate-200 uppercase tracking-wider">ភេទ</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-600 border-b border-slate-200 uppercase tracking-wider">តួនាទី & ផ្នែក</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-600 border-b border-slate-200 uppercase tracking-wider">លេខទូរស័ព្ទ</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-600 border-b border-slate-200 uppercase tracking-wider">ស្ថានភាព</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr 
                  key={emp.id} 
                  className={`border-b border-slate-100 hover:bg-emerald-50/20 cursor-pointer transition-colors ${currentEmp?.id === emp.id ? 'bg-emerald-50/55 border-r-4 border-r-emerald-600' : ''}`}
                  onClick={() => setSelectedEmployee(emp)}
                >
                  <td className="px-6 py-4 font-bold text-slate-800 text-sm">{emp.name}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{emp.gender}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-slate-800">{emp.position}</div>
                    <div className="text-xs text-slate-500 font-medium">{departments.find(d => d.id === emp.departmentId)?.name}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm font-medium">{emp.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      emp.status === 'សកម្ម' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    រកមិនឃើញទិន្នន័យ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Pane / Employee Info Folder & Leaves balances */}
      {currentEmp && (
        <div className="w-full lg:w-1/3 bg-white border border-slate-200 rounded-xl shadow-md flex flex-col animate-in slide-in-from-right-8 duration-300">
          <div className="p-4 border-b border-slate-100 flex justify-between items-start bg-slate-50 rounded-t-xl">
            <div>
              <h2 className="text-xl font-extrabold text-slate-800">{currentEmp.name}</h2>
              <p className="text-xs text-slate-500 mt-1 font-semibold">{currentEmp.position}</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setPrintingIdCard(currentEmp)}
                className="px-3 py-1.5 flex items-center bg-white rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 shadow-sm border border-emerald-200 transition-colors cursor-pointer text-xs font-bold"
                title="បោះពុម្ពកាតបុគ្គលិក"
              >
                <BadgeInfo className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">បោះពុម្ពកាត</span>
              </button>
              <button onClick={() => setSelectedEmployee(null)} className="p-2 bg-white rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200 shadow-sm border border-slate-200 transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="p-6 flex-1 overflow-auto space-y-6">
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">ព័ត៌មានទូទៅ</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 font-medium">លេខទូរស័ព្ទ:</span>
                  <span className="text-slate-800 font-bold">{currentEmp.phone}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 font-medium">ថ្ងៃចូលធ្វើការ:</span>
                  <span className="text-slate-800 font-bold font-mono">{currentEmp.joinDate}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-500 font-medium">ផ្នែក:</span>
                  <span className="text-slate-800 font-bold truncate max-w-[190px]">
                    {departments.find(d => d.id === currentEmp.departmentId)?.name}
                  </span>
                </div>
              </div>
            </section>

            {/* LEAVE BALANCE LEDGER */}
            {currentEmp.leaveBalances && (
              <section className="bg-emerald-50/50 p-4 border border-emerald-100 rounded-xl">
                <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>កំណត់ត្រាតុល្យភាពច្បាប់ឈប់សម្រាក</span>
                  <PieChart className="w-4 h-4 text-emerald-600" />
                </h3>
                <div className="space-y-3.5">
                  <div className="text-xs">
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>ច្បាប់ប្រចាំឆ្នាំ (Annual)</span>
                      <span className="font-mono text-emerald-700">{currentEmp.leaveBalances.annualAllowed - currentEmp.leaveBalances.annualUsed} / {currentEmp.leaveBalances.annualAllowed} ថ្ងៃ</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full" style={{ width: `${((currentEmp.leaveBalances.annualAllowed - currentEmp.leaveBalances.annualUsed) / currentEmp.leaveBalances.annualAllowed) * 100}%` }}></div>
                    </div>
                  </div>

                  <div className="text-xs">
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>ច្បាប់ឈឺ (Sick)</span>
                      <span className="font-mono text-blue-700">{currentEmp.leaveBalances.sickAllowed - currentEmp.leaveBalances.sickUsed} / {currentEmp.leaveBalances.sickAllowed} ថ្ងៃ</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full" style={{ width: `${((currentEmp.leaveBalances.sickAllowed - currentEmp.leaveBalances.sickUsed) / currentEmp.leaveBalances.sickAllowed) * 100}%` }}></div>
                    </div>
                  </div>

                  <div className="text-xs">
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>ច្បាប់អាជីវកម្ម (Business)</span>
                      <span className="font-mono text-orange-700">{currentEmp.leaveBalances.businessAllowed - currentEmp.leaveBalances.businessUsed} / {currentEmp.leaveBalances.businessAllowed} ថ្ងៃ</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-orange-500 h-full" style={{ width: `${((currentEmp.leaveBalances.businessAllowed - currentEmp.leaveBalances.businessUsed) / currentEmp.leaveBalances.businessAllowed) * 100}%` }}></div>
                    </div>
                  </div>

                  {currentEmp.gender === 'ស្រី' && currentEmp.leaveBalances.maternityAllowed > 0 && (
                    <div className="text-xs">
                      <div className="flex justify-between font-bold text-slate-700 mb-1">
                        <span>ច្បាប់សម្រាលកូន (Maternity)</span>
                        <span className="font-mono text-purple-700">{currentEmp.leaveBalances.maternityAllowed - currentEmp.leaveBalances.maternityUsed} / {currentEmp.leaveBalances.maternityAllowed} ថ្ងៃ</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-600 h-full" style={{ width: `${((currentEmp.leaveBalances.maternityAllowed - currentEmp.leaveBalances.maternityUsed) / currentEmp.leaveBalances.maternityAllowed) * 100}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>កុងត្រាការងារ</span>
              </h3>
              <div className="space-y-2">
                {currentEmp.contracts && currentEmp.contracts.length > 0 ? currentEmp.contracts.map((c, i) => (
                  <div key={i} className="flex items-center p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <FileSignature className="w-4 h-4 text-slate-400 mr-3" />
                    <div className="flex-1 min-w-0 font-sans">
                      <p className="text-xs font-bold text-slate-700 truncate">{c.name}</p>
                      <p className="text-[10px] text-slate-400 font-semibold font-mono">{c.date}</p>
                    </div>
                  </div>
                )) : <p className="text-xs text-slate-400 italic">មិនទាន់មានកុងត្រាបញ្ញូលមក</p>}
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>ឯកសារភ្ជាប់ (CV / ផ្សេងៗ)</span>
              </h3>
              <div className="space-y-2">
                {currentEmp.resume && (
                  <div className="flex items-center p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-emerald-300 transition-colors cursor-pointer">
                    <FileText className="w-4 h-4 text-emerald-600 mr-3" />
                    <p className="text-xs font-bold text-emerald-700 truncate">{currentEmp.resume}</p>
                  </div>
                )}
                {currentEmp.documents && currentEmp.documents.map((d, i) => (
                  <div key={i} className="flex items-center p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-emerald-350 cursor-pointer transition-colors">
                    <FileText className="w-4 h-4 text-slate-400 mr-3" />
                    <div className="flex-1 min-w-0 font-sans">
                      <p className="text-xs font-bold text-slate-700 truncate">{d.name}</p>
                      <p className="text-[10px] text-slate-400 font-semibold font-mono">{d.date}</p>
                    </div>
                  </div>
                ))}
                {!currentEmp.resume && (!currentEmp.documents || currentEmp.documents.length === 0) && (
                  <p className="text-xs text-slate-400 italic">គ្មានឯកសារ</p>
                )}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* ADD EMPLOYEE MODAL DIALOG */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                <UserPlus className="w-5 h-5 mr-2 text-emerald-600" />
                បន្ថែមព័ត៌មានបុគ្គលិកថ្មី
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEmployeeSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">ឈ្មោះពេញ (ឈ្មោះខ្មែរ/ឡាតាំង)</label>
                  <input 
                    type="text" 
                    required 
                    value={newName} 
                    onChange={e => setNewName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="ឧ. សុខសប្បាយ"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">ភេទ</label>
                  <select 
                    value={newGender} 
                    onChange={e => setNewGender(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                  >
                    <option value="ប្រុស">ប្រុស</option>
                    <option value="ស្រី">ស្រី</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">ផ្នែកមន្ទីរពេទ្យ</label>
                  <select 
                    value={newDeptId} 
                    disabled={currentUser?.role === 'Department Head'}
                    onChange={e => setNewDeptId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">តួនាទី</label>
                  <input 
                    type="text" 
                    required 
                    value={newPosition} 
                    onChange={e => setNewPosition(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="ឧ. គិលានុបដ្ឋាយិកា / វេជ្ជបណ្ឌិត"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">លេខទូរស័ព្ទ</label>
                  <input 
                    type="text" 
                    required 
                    value={newPhone} 
                    onChange={e => setNewPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                    placeholder="012 345 678"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">ថ្ងៃចូលបម្រើការងារ</label>
                  <input 
                    type="date" 
                    required 
                    value={newJoinDate} 
                    onChange={e => setNewJoinDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">ឈ្មោះឯកសារប្រវត្តិរូបសង្ខេប (CV / Résume)</label>
                <input 
                  type="text" 
                  value={newResume} 
                  onChange={e => setNewResume(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  placeholder="Resume_Full.pdf"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-lg cursor-pointer"
                >
                  បោះបង់
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm cursor-pointer"
                >
                  រក្សាទុកបុគ្គលិក
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT ID CARD MODAL */}
      {printingIdCard && (
        <PrintIDCardModal 
          employee={printingIdCard}
          department={departments.find(d => d.id === printingIdCard.departmentId)}
          onClose={() => setPrintingIdCard(null)}
        />
      )}
    </div>
  );
}
