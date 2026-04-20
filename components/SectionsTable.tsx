
import React from 'react';
import { Info } from 'lucide-react';

export const SectionsTable: React.FC = () => {
  return (
    <div className="w-full border border-[#e2e8f0] rounded-xl overflow-hidden bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-white border-b border-[#e2e8f0]">
          <tr>
            <th className="px-8 py-4 text-sm font-semibold text-[#1e293b] w-1/4">Sections</th>
            <th className="px-8 py-4 text-sm font-semibold text-[#1e293b] w-1/4">
              <div className="flex items-center space-x-1">
                <span>No. Of Questions</span>
                <Info size={14} className="text-[#64748b]" />
              </div>
            </th>
            <th className="px-8 py-4 text-sm font-semibold text-[#1e293b] w-1/4">Total Marks</th>
            <th className="px-8 py-4 text-sm font-semibold text-[#1e293b] w-1/4">Sample Questions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-8 py-5 text-[15px] text-[#475569]">MCQ</td>
            <td className="px-8 py-5 text-[15px] text-[#475569]">25</td>
            <td className="px-8 py-5 text-[15px] text-[#475569]">25</td>
            <td className="px-8 py-5">
              <button className="text-[#4f46e5] font-semibold text-sm hover:underline">
                View
              </button>
            </td>
          </tr>
          <tr className="hover:bg-gray-50 transition-colors border-t border-gray-100">
            <td className="px-8 py-5 text-[15px] text-[#475569]">Simulation</td>
            <td className="px-8 py-5 text-[15px] text-[#475569]">15</td>
            <td className="px-8 py-5 text-[15px] text-[#475569]">75</td>
            <td className="px-8 py-5">
              <button className="text-[#4f46e5] font-semibold text-sm hover:underline">
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
