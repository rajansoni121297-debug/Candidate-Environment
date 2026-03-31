
import React from 'react';
import { Clock, Calculator as CalcIcon, Table as TableIcon } from 'lucide-react';

interface HeaderProps {
  isAssessment?: boolean;
  title?: string;
  hideTools?: boolean;
  timeLeft?: number;
  onToggleCalculator?: () => void;
  onToggleSpreadsheet?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  isAssessment, 
  title, 
  hideTools, 
  timeLeft = 600, 
  onToggleCalculator,
  onToggleSpreadsheet 
}) => {
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (isAssessment) {
    return (
      <div className="flex flex-col px-8 py-4 border-b border-gray-100 bg-white relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex flex-col">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-[#3A58EF] flex items-center justify-center mr-2">
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
                </div>
                <span className="text-xl font-black text-[#1e293b] tracking-tight">MYCPE <span className="text-[#3A58EF]">ONE</span></span>
              </div>
              <div className="text-[8px] font-bold tracking-[0.3em] text-[#64748b] border-t border-gray-200 pt-0.5 mt-0.5 uppercase">
                Assessments
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {!hideTools && (
              <>
                <button 
                  onClick={onToggleSpreadsheet}
                  title="Spreadsheet"
                  className="p-2 bg-[#217346] text-white rounded-md hover:bg-[#1a5c38] transition-colors shadow-sm active:scale-95"
                >
                  <TableIcon size={18} />
                </button>
                <button 
                  onClick={onToggleCalculator}
                  title="Calculator"
                  className="p-2 bg-[#4338ca] text-white rounded-md hover:bg-[#3730a3] transition-colors shadow-sm active:scale-95"
                >
                  <CalcIcon size={18} />
                </button>
                <div className="flex items-center space-x-2 bg-[#eff6ff] px-3 py-1.5 rounded-md border border-[#dbeafe] shadow-sm ml-2">
                  <Clock className="w-4 h-4 text-[#3b82f6]" />
                  <span className="text-sm font-bold text-[#3b82f6] tabular-nums">{formatTime(timeLeft)}</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-[#1e293b]">{title || 'Book-keeping Basics'}</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-8 py-6 border-b border-gray-100 bg-white">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-sm rotate-45 transform origin-center" />
        </div>
        <h1 className="text-2xl font-bold text-[#1e293b]">Tax Concepts</h1>
      </div>

      <div className="flex items-center space-x-8 mt-4 md:mt-0">
        <button className="text-[#4f46e5] font-semibold text-sm hover:underline">
          Evaluation Criteria
        </button>
        <div className="flex items-center space-x-2 bg-[#f1f5f9] px-4 py-2 rounded-full border border-gray-200">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            Assessment Duration : <span className="font-bold text-gray-900">1 hr 50 min</span>
          </span>
        </div>
      </div>
    </div>
  );
};
