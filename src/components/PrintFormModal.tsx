import React from 'react';
import { LeaveRequest, Employee, Department } from '../types';
import { X, Printer } from 'lucide-react';

interface PrintFormModalProps {
  request: LeaveRequest;
  employee: Employee;
  department: Department | undefined;
  onClose: () => void;
}

export default function PrintFormModal({ request, employee, department, onClose }: PrintFormModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 min-h-screen bg-slate-900/60 backdrop-blur-sm z-50 flex py-10 justify-center overflow-y-auto print:bg-white print:p-0 print:block">
      
      {/* Modal Actions */}
      <div className="absolute top-4 right-4 flex space-x-2 print:hidden z-50">
        <button 
          onClick={handlePrint}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold flex items-center shadow-lg transition-colors cursor-pointer"
        >
          <Printer className="w-5 h-5 mr-2" />
          បោះពុម្ព
        </button>
        <button 
          onClick={onClose}
          className="bg-white hover:bg-slate-100 text-slate-800 p-2 rounded-lg shadow-lg transition-colors border border-slate-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* A4 Paper styling */}
      <div className="bg-white w-[210mm] min-h-[297mm] shadow-2xl relative mx-auto print:shadow-none print:w-full print:mx-0 font-sans text-sm p-12">
        {/* Header section */}
        <div className="flex justify-between items-start mb-8 text-center text-[15px] font-bold mt-4 font-serif">
           <div className="text-left leading-relaxed">
              <p>ក្រសួងសុខាភិបាល</p>
              <p>មន្ទីរសុខាភិបាលខេត្តព្រះសីហនុ</p>
              <p>លេខ៖ ..................... មព.ខពស</p>
           </div>
           <div className="flex flex-col items-center leading-relaxed">
              <p>ព្រះរាជាណាចក្រកម្ពុជា</p>
              <p>ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
              <p className="mt-1">❧☙</p>
           </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
           <h1 className="font-black text-lg underline underline-offset-4 mb-2">
             សំណើសុំច្បាប់និងការអនុញ្ញាតច្បាប់ឈប់សម្រាកគ្រប់ប្រភេទ
           </h1>
           <h2 className="font-bold text-base">
             របស់មន្ត្រីរាជការស៊ីវិល នៃព្រះរាជាណាចក្រកម្ពុជា
           </h2>
        </div>

        {/* Body Form Areas */}
        <div className="space-y-6 leading-[2rem]">
          
          {/* Section 1 */}
          <div>
            <p>
              ១- គោត្តនាមនិងនាម <span className="font-bold border-b border-dotted border-black inline-block min-w-48 text-center">{employee.name}</span>
              អត្តលេខ <span className="font-bold border-b border-dotted border-black inline-block min-w-32 text-center">{employee.id}</span>
              មុខតំណែង <span className="font-bold border-b border-dotted border-black inline-block min-w-48 text-center">{employee.position}</span>
            </p>
            <p>
              អង្គភាព <span className="font-bold border-b border-dotted border-black inline-block min-w-64 text-center">{department?.name}</span>
              ទូរស័ព្ទ <span className="font-bold border-b border-dotted border-black inline-block min-w-48 text-center">{employee.phone}</span>
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <p>២- ប្រភេទនៃច្បាប់ឈប់សម្រាកដែលត្រូវស្នើសុំ ៖</p>
            <div className="grid grid-cols-2 gap-y-3 px-8 mt-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={request.type === 'ឈប់ប្រចាំឆ្នាំ'} readOnly className="w-4 h-4" />
                <span>ឈប់ប្រចាំឆ្នាំ</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={request.type === 'ឈប់រយៈពេលខ្លី'} readOnly className="w-4 h-4" />
                <span>ឈប់រយៈពេលខ្លី</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={request.type === 'ឈប់សម្រាកលំហែមាតុភាព'} readOnly className="w-4 h-4" />
                <span>ឈប់សម្រាកលំហែមាតុភាព</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={request.type === 'ឈប់សម្រាកព្យាបាលជម្ងឺ'} readOnly className="w-4 h-4" />
                <span>ឈប់សម្រាកព្យាបាលជម្ងឺ</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={request.type === 'ឈប់សម្រាកដោយមានកិច្ចការផ្ទាល់ខ្លួន'} readOnly className="w-4 h-4" />
                <span>ឈប់សម្រាកដោយមានកិច្ចការផ្ទាល់ខ្លួន</span>
              </label>
            </div>
          </div>

          {/* Section 3 */}
          <div>
             <p>៣- ចំនួនថ្ងៃស្នើសុំច្បាប់ កាលបរិច្ឆេទនៃការចាប់ផ្តើមឈប់ និងកាលបរិច្ឆេទនៃការចូលបម្រើការងារវិញ</p>
             <div className="pl-8 space-y-1">
               <p>- ចំនួនថ្ងៃស្នើសុំឈប់ ៖ <span className="font-bold border-b border-dotted border-black text-center inline-block min-w-24">{request.durationDays} ថ្ងៃ</span></p>
               <p>- ថ្ងៃ ខែ ឆ្នាំ ចាប់ផ្តើមឈប់ ៖ <span className="font-bold border-b border-dotted border-black inline-block min-w-40 text-center">{new Date(request.startDate).toLocaleDateString('en-GB')}</span></p>
               <p>- ថ្ងៃ ខែ ឆ្នាំ ចូលបម្រើការងារវិញ ៖ <span className="font-bold border-b border-dotted border-black inline-block min-w-40 text-center">{new Date(request.endDate).toLocaleDateString('en-GB')}</span></p>
             </div>
          </div>

          {/* Section 4 */}
          <div>
            <p className="flex w-full">
              ៤- គោលបំណង 
              <span className="flex-1 font-bold border-b border-dotted border-black ml-2 text-center">{request.reason}</span>
            </p>
            <p className="border-b border-dotted border-black w-full h-8 block"></p>
          </div>

        </div>

        {/* Section 5 - Signatures Row 1 */}
        <div className="flex justify-between mt-8 text-center px-4 leading-relaxed font-bold">
           <div>
              <div className="border border-black p-4 mb-4 text-left w-56 mx-auto">
                 <label className="flex items-center"><input type="checkbox" checked={request.status === 'អនុម័ត'} readOnly className="mr-2" /> អនុញ្ញាត</label>
                 <label className="flex items-center"><input type="checkbox" checked={request.status === 'បដិសេធ'} readOnly className="mr-2" /> មិនអនុញ្ញាត</label>
                 <p className="mt-2 border-t border-black pt-1">ហត្ថលេខាប្រធានអង្គភាពសាមី</p>
              </div>
           </div>
           <div>
              <div className="flex items-start text-left mb-4">
                 <div className="w-32 mr-2">
                   <label className="flex items-center text-xs"><input type="checkbox" className="mr-1" /> អនុញ្ញាត</label>
                   <label className="flex items-center text-xs"><input type="checkbox" className="mr-1" /> មិនអនុញ្ញាត</label>
                 </div>
                 <div className="text-sm">
                   ហត្ថលេខាប្រធានការិយាល័យ
                 </div>
              </div>
           </div>
           <div className="w-56 text-center pt-2">
              <p>...........ថ្ងៃទី..........ខែ...........ឆ្នាំ២០២...</p>
              <p>ហត្ថលេខារបស់មន្ត្រីស្នើសុំ</p>
           </div>
        </div>

        {/* Section 6 - HR Box */}
        <div className="mt-8 mb-8">
           <p className="mb-2">៥- នាយកដ្ឋានគ្រប់គ្រងបុគ្គលិកដើម្បីជ្រាបជាព័ត៌មាន និងផ្ទៀងផ្ទាត់</p>
           <table className="w-full border-collapse border border-black text-center text-xs">
              <thead>
                <tr>
                  <th className="border border-black py-2 w-1/5">ឈប់ប្រចាំឆ្នាំ</th>
                  <th className="border border-black py-2 w-1/5">ឈប់រយៈពេលខ្លី</th>
                  <th className="border border-black py-2 w-1/5">ឈប់សម្រាក<br/>លំហែមាតុភាព</th>
                  <th className="border border-black py-2 w-1/5">ឈប់សម្រាក<br/>ព្យាបាលជម្ងឺ</th>
                  <th className="border border-black py-2 w-1/5">ឈប់សម្រាកដោយមាន<br/>កិច្ចការផ្ទាល់ខ្លួន</th>
                </tr>
              </thead>
              <tbody>
                 <tr className="h-10">
                   <td className="border border-black font-bold"></td>
                   <td className="border border-black font-bold"></td>
                   <td className="border border-black font-bold"></td>
                   <td className="border border-black font-bold"></td>
                   <td className="border border-black font-bold"></td>
                 </tr>
                 <tr className="h-10 bg-gray-50">
                   <td className="border border-black"></td>
                   <td className="border border-black"></td>
                   <td className="border border-black"></td>
                   <td className="border border-black"></td>
                   <td className="border border-black"></td>
                 </tr>
              </tbody>
           </table>
           <p className="mt-2">- ហត្ថលេខា និងកាលបរិច្ឆេទរបស់មន្ត្រីទទួលបន្ទុកគ្រប់គ្រងបុគ្គលិក .......................................................................</p>
        </div>

        {/* Section 7 - Final approval */}
        <div className="mt-8 mb-4 border-t-2 border-black pt-4">
           <p className="font-bold">៦- ការអនុញ្ញាតរបស់ប្រធានស្ថាប័ន/អង្គភាព</p>
           <div className="flex space-x-12 ml-12 mt-2 mb-4">
             <label className="flex items-center"><input type="checkbox" className="mr-2" /> អនុញ្ញាត</label>
             <label className="flex items-center"><input type="checkbox" className="mr-2" /> មិនអនុញ្ញាត</label>
           </div>
           <p>យោបល់ ៖ ...............................................................................................................................................................................</p>
           <p className="mt-4">- ហត្ថលេខា និងកាលបរិច្ឆេទរបស់ប្រធានស្ថាប័ន/អង្គភាព ...............................................................................................</p>
        </div>
      </div>
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}
