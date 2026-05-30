import React from 'react';
import { useHR } from '../HRContext';
import { Users, Building2, Calendar, FileText } from 'lucide-react';

export default function Dashboard() {
  const { employees, departments, leaveRequests, regDocuments, currentUser } = useHR();
  
  const visibleEmployees = employees.filter(e => {
    if (currentUser?.role === 'Admin') return true;
    if (currentUser?.role === 'Department Head') return e.departmentId === currentUser.departmentId;
    return e.id === currentUser?.id;
  });

  const visibleDepartments = departments.filter(d => {
    if (currentUser?.role === 'Admin') return true;
    return d.id === currentUser?.departmentId;
  });

  const pendingLeaves = leaveRequests.filter(l => {
    if (l.status !== 'រង់ចាំ') return false;
    if (currentUser?.role === 'Admin') return true;
    if (currentUser?.role === 'Department Head') {
      const emp = employees.find(e => e.id === l.employeeId);
      return emp?.departmentId === currentUser.departmentId;
    }
    return l.employeeId === currentUser?.id;
  });

  const activeMissions = regDocuments.filter(d => d.type === 'លិខិតបេសកកម្ម').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={currentUser?.role === 'Admin' ? "បុគ្គលិកសរុប" : "បុគ្គលិកក្នុងផ្នែក"}
          value={visibleEmployees.length}
          icon={<Users className="w-6 h-6 text-emerald-600" />}
          bgColor="bg-emerald-100"
        />
        <StatCard
          title={currentUser?.role === 'Admin' ? "ផ្នែកសរុប" : "ផ្នែករបស់អ្នក"}
          value={visibleDepartments.length}
          icon={<Building2 className="w-6 h-6 text-blue-600" />}
          bgColor="bg-blue-100"
        />
        <StatCard
          title="ច្បាប់រង់ចាំអនុម័ត"
          value={pendingLeaves.length}
          icon={<Calendar className="w-6 h-6 text-orange-600" />}
          bgColor="bg-orange-100"
        />
        <StatCard
          title="លិខិតបេសកកម្ម"
          value={activeMissions}
          icon={<FileText className="w-6 h-6 text-purple-600" />}
          bgColor="bg-purple-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <span className="w-2 h-6 bg-emerald-500 rounded-full mr-3"></span>
              ចំណាត់ច្នាក់បុគ្គលិកតាមផ្នែក
            </h3>
            <div className="space-y-4">
              {visibleDepartments.map(dept => {
                const count = visibleEmployees.filter(e => e.departmentId === dept.id).length;
                return (
                  <div key={dept.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100">
                    <span className="text-slate-700 font-medium">{dept.name}</span>
                    <span className="bg-emerald-100 text-emerald-800 py-1 px-3 rounded-full text-sm font-bold min-w-[2.5rem] text-center">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <span className="w-2 h-6 bg-blue-500 rounded-full mr-3"></span>
              លិខិតចុះលេខថ្មីៗ
            </h3>
          </div>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {regDocuments.slice(0, 4).map(doc => (
              <div key={doc.id} className="flex items-start justify-between p-4 border border-slate-100 rounded-lg bg-slate-50/50">
                <div>
                  <p className="font-semibold text-slate-800">{doc.title}</p>
                  <div className="flex space-x-3 text-xs text-slate-500 mt-1">
                    <span>លេខ: {doc.refNumber}</span>
                    <span>ប្រភេទ: {doc.type}</span>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-mono">{doc.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, bgColor }: { title: string, value: number | string, icon: React.ReactNode, bgColor: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center">
      <div className={`p-4 rounded-full ${bgColor} mr-4`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
