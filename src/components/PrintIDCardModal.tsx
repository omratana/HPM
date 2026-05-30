import React from 'react';
import { Employee, Department } from '../types';
import { X, Printer, User } from 'lucide-react';

interface PrintIDCardModalProps {
  employee: Employee;
  department: Department | undefined;
  onClose: () => void;
}

export default function PrintIDCardModal({ employee, department, onClose }: PrintIDCardModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:p-0 print:bg-white print:block shadow-sm">
      <div className="absolute top-4 right-4 flex space-x-2 print:hidden z-50">
        <button 
          onClick={handlePrint}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold flex items-center shadow-lg transition-colors cursor-pointer"
        >
          <Printer className="w-5 h-5 mr-2" />
          បោះពុម្ពកាត
        </button>
        <button 
          onClick={onClose}
          className="bg-white hover:bg-slate-100 text-slate-800 p-2 rounded-lg shadow-lg transition-colors border border-slate-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-2xl relative mx-auto print:shadow-none overflow-hidden flex flex-col" style={{ width: '54mm', height: '86mm' }}>
        {/* Card Header */}
        <div className="bg-emerald-700 text-white text-center py-4">
          <p className="text-[10px] font-bold tracking-widest opacity-90">ក្រសួងសុខាភិបាល</p>
          <p className="text-[12px] font-black mt-0.5">មន្ទីរពេទ្យបង្អែកសៀមរាប</p>
        </div>
        
        {/* Photo Placeholder */}
        <div className="flex justify-center -mt-6 z-10">
          <div className="w-20 h-24 bg-white border-4 border-white flex items-center justify-center overflow-hidden shadow-md rounded-md bg-slate-100">
             <User className="w-12 h-12 text-slate-300" />
          </div>
        </div>

        {/* Employee Info */}
        <div className="text-center mt-3 px-3 flex-1">
          <h2 className="font-extrabold text-emerald-800 text-sm tracking-wide">{employee.name}</h2>
          <p className="text-slate-600 text-[10px] font-black mt-1 uppercase bg-slate-100 inline-block px-2 py-0.5 rounded text-emerald-700 border border-slate-200">{employee.position}</p>
          <p className="text-slate-500 text-[9px] mt-1.5 font-medium leading-tight">{department?.name}</p>
        </div>

        {/* Card Footer / Barcode */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center flex flex-col items-center">
           <div className="flex justify-center w-full mb-1">
             <div className="h-6 w-3/4 flex justify-between space-x-[1px]">
               {Array.from({length: 35}).map((_, i) => (
                 <div key={i} className="bg-slate-800 h-full" style={{ width: Math.random() > 0.5 ? '2px' : '1px' }}></div>
               ))}
             </div>
           </div>
           <p className="font-mono text-[8px] font-bold text-slate-400 tracking-widest">EMP-{employee.id.padStart(4, '0')}</p>
        </div>
      </div>

      <style>{`
        @media print {
          @page { size: auto; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          html, body {
            background-color: white !important;
          }
        }
      `}</style>
    </div>
  );
}
