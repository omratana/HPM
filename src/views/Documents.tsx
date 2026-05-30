import React, { useState } from 'react';
import { useHR } from '../HRContext';
import { Search, Plus, Send, AlertTriangle } from 'lucide-react';

export default function Documents() {
  const { regDocuments, employees } = useHR();
  const [activeTab, setActiveTab] = useState<'All' | 'Mission' | 'Contract'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const docs = regDocuments.filter(d => {
    if (activeTab === 'Mission' && d.type !== 'លិខិតបេសកកម្ម') return false;
    if (activeTab === 'Contract' && d.type !== 'កិច្ចសន្យា') return false;
    if (activeTab === 'All' && (d.type === 'លិខិតបេសកកម្ម' || d.type === 'កិច្ចសន្យា')) return false; // separate tabs
    return d.title.toLowerCase().includes(searchTerm.toLowerCase()) || d.refNumber.includes(searchTerm);
  });

  const getExpirationStatus = (expirationDate?: string) => {
    if (!expirationDate) return null;
    const today = new Date();
    // Reset time for accurate day difference
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(expirationDate);
    expDate.setHours(0, 0, 0, 0);
    
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'expired', label: 'ផុតកំណត់', daysLeft: Math.abs(diffDays) };
    } else if (diffDays <= 30) {
      return { status: 'expiring_soon', label: 'ជិតផុតកំណត់', daysLeft: diffDays };
    }
    return null;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm h-full flex flex-col animate-in fade-in duration-500">
      <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        {/* Tabs */}
        <div className="flex space-x-1 p-1 bg-slate-100 rounded-lg overflow-x-auto max-w-full">
          <button 
            onClick={() => setActiveTab('All')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'All' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            លិខិតចុះលេខ / លិខិតរដ្ឋបាល
          </button>
          <button 
            onClick={() => setActiveTab('Mission')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'Mission' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            លិខិតបេសកកម្ម
          </button>
          <button 
            onClick={() => setActiveTab('Contract')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'Contract' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            កិច្ចសន្យា
          </button>
        </div>

        {/* Filters & Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="ស្វែងរកលេខ ឬចំណងជើង..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">ចុះលេខថ្មី</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-3">
          {docs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 border border-slate-200 border-dashed rounded-xl">
              រកមិនឃើញលិខិត
            </div>
          ) : (
            docs.map(doc => {
              const expiration = getExpirationStatus(doc.expirationDate);
              
              return (
              <div key={doc.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-emerald-400 transition-colors bg-white">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <span className="text-sm font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {doc.refNumber}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                      doc.type === 'លិខិតចូល' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      doc.type === 'លិខិតបេសកកម្ម' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      doc.type === 'កិច្ចសន្យា' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-orange-50 text-orange-700 border-orange-200'
                    }`}>
                      {doc.type}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      doc.status === 'បានអនុម័ត' ? 'text-emerald-700 bg-emerald-100' :
                      doc.status === 'បានបញ្ជូន' ? 'text-blue-700 bg-blue-100' :
                      'text-slate-500 bg-slate-100'
                    }`}>
                      {doc.status}
                    </span>
                    {expiration && (
                      <span className={`flex items-center text-xs px-2 py-0.5 rounded-full font-bold border ${
                        expiration.status === 'expired' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-orange-50 text-orange-700 border-orange-200'
                      }`}>
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {expiration.status === 'expired' ? 'ផុតកំណត់' : `ជិតផុតកំណត់ក្នុងរយៈពេល ${expiration.daysLeft} ថ្ងៃ`}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-slate-800 text-lg">{doc.title}</h3>
                  <div className="flex flex-wrap items-center text-sm text-slate-500 mt-2 gap-4">
                    <span>កាលបរិច្ឆេទ: <strong className="text-slate-600">{doc.date}</strong></span>
                    {doc.expirationDate && (
                      <span>ថ្ងៃផុតកំណត់: <strong className="text-slate-600">{doc.expirationDate}</strong></span>
                    )}
                    {doc.assigneeId && (
                      <span className="flex items-center">
                        <Send className="w-3 h-3 mr-1" />
                        ប្រគល់ជូន: <strong className="text-slate-600 ml-1">{employees.find(e => e.id === doc.assigneeId)?.name}</strong>
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex gap-2">
                  <button className="px-4 py-2 border border-slate-200 bg-slate-50 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-100 transition-colors">
                    មើលព័ត៌មាន
                  </button>
                  <button className="px-4 py-2 border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-100 hover:border-emerald-300 transition-colors">
                    ទាញយក
                  </button>
                </div>
              </div>
            )})
          )}
        </div>
      </div>
    </div>
  );
}
