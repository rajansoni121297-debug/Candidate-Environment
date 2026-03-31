
import React from 'react';
import { CheckCircle2, Download } from 'lucide-react';

export const ResultsView: React.FC = () => {
  return (
    <div className="bg-[#f8fafc] min-h-full py-12 px-4 md:px-0">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="px-10 py-8 border-b border-gray-50">
          <div className="flex flex-col mb-6">
            <div className="flex items-center">
              <svg viewBox="0 0 100 40" className="w-20 h-7 fill-[#4338ca]">
                <path d="M10 5L25 20L10 35V5Z" fill="#3b82f6"/>
                <path d="M15 10L25 20L15 30V10Z" fill="#6366f1"/>
              </svg>
              <div className="flex flex-col -ml-3">
                <span className="text-lg font-bold tracking-tight text-[#1e293b]">MYCPE <span className="text-[#3b82f6]">ONE</span></span>
                <span className="text-[8px] font-bold tracking-[0.2em] text-[#64748b] -mt-1 uppercase text-center border-t border-gray-300">Assessments</span>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[#1e293b]">Book-keeping Basics</h2>
        </div>

        {/* Content Section */}
        <div className="px-10 py-16 flex flex-col items-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-[#ebfcf3] rounded-full flex items-center justify-center text-[#22c55e] mb-8 ring-1 ring-[#22c55e]/20">
             <div className="w-12 h-12 bg-[#22c55e] rounded-full flex items-center justify-center text-white">
                <CheckCircle2 size={30} strokeWidth={2.5} />
             </div>
          </div>

          <h1 className="text-3xl font-bold text-[#1e293b] mb-3 text-center">Thank You for Completing the Assessment!</h1>
          <p className="text-[#64748b] text-base mb-10">Your results have been successfully submitted.</p>

          {/* Overall Score Banner */}
          <div className="w-full bg-[#f0fdf4] border border-[#dcfce7] rounded-xl py-6 px-8 text-center mb-12">
            <p className="text-[#15803d] font-bold text-lg">
              Overall Score: Congratulations! You have successfully passed the assessment.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
            <div className="bg-white border border-gray-100 rounded-xl p-8 flex flex-col items-center justify-center shadow-sm">
              <span className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest mb-4">CORRECT</span>
              <span className="text-5xl font-black text-[#22c55e]">20</span>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-8 flex flex-col items-center justify-center shadow-sm">
              <span className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest mb-4">INCORRECT</span>
              <span className="text-5xl font-black text-[#ef4444]">6</span>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-8 flex flex-col items-center justify-center shadow-sm">
              <span className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest mb-4">NOT ATTEMPTED</span>
              <span className="text-5xl font-black text-[#64748b]">9</span>
            </div>
          </div>

          {/* Test Summary Table */}
          <div className="w-full space-y-6">
            <h3 className="text-lg font-bold text-[#1e293b]">Test Summary:</h3>
            <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#f8fafc]">
                  <tr>
                    <th className="px-8 py-5 text-xs font-bold text-[#1e293b]">Sections</th>
                    <th className="px-8 py-5 text-xs font-bold text-[#1e293b] text-center">No. Of Questions</th>
                    <th className="px-8 py-5 text-xs font-bold text-[#1e293b] text-center">Correct</th>
                    <th className="px-8 py-5 text-xs font-bold text-[#1e293b] text-center">Incorrect</th>
                    <th className="px-8 py-5 text-xs font-bold text-[#1e293b] text-center">Not Attempted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr>
                    <td className="px-8 py-6 text-sm font-medium text-[#475569]">MCQ</td>
                    <td className="px-8 py-6 text-sm font-bold text-[#475569] text-center">20</td>
                    <td className="px-8 py-6 text-sm font-bold text-[#22c55e] text-center">12</td>
                    <td className="px-8 py-6 text-sm font-bold text-[#ef4444] text-center">2</td>
                    <td className="px-8 py-6 text-sm font-bold text-[#64748b] text-center">6</td>
                  </tr>
                  <tr>
                    <td className="px-8 py-6 text-sm font-medium text-[#475569]">Simulation</td>
                    <td className="px-8 py-6 text-sm font-bold text-[#475569] text-center">15</td>
                    <td className="px-8 py-6 text-sm font-bold text-[#22c55e] text-center">8</td>
                    <td className="px-8 py-6 text-sm font-bold text-[#ef4444] text-center">4</td>
                    <td className="px-8 py-6 text-sm font-bold text-[#64748b] text-center">3</td>
                  </tr>
                  <tr>
                    <td className="px-8 py-6 text-sm font-medium text-[#475569]">Subjective</td>
                    <td className="px-8 py-6 text-sm font-bold text-[#475569] text-center">20</td>
                    <td className="px-8 py-6 text-sm font-bold text-[#22c55e] text-center">15</td>
                    <td className="px-8 py-6 text-sm font-bold text-[#ef4444] text-center">0</td>
                    <td className="px-8 py-6 text-sm font-bold text-[#64748b] text-center">5</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Download Button */}
          <div className="mt-12">
            <button className="flex items-center space-x-2 px-10 py-3.5 bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]">
              <Download size={18} />
              <span>Download Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
