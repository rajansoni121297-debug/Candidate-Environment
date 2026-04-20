import React from 'react';
import { Layout, LayoutPanelLeft, X } from 'lucide-react';

interface DesignSelectionModalProps {
  isOpen: boolean;
  onSelect: (design: 'Design1' | 'Design2') => void;
}

export const DesignSelectionModal: React.FC<DesignSelectionModalProps> = ({ isOpen, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1e293b]/60 backdrop-blur-md" />
      <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="px-8 py-10 text-center space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-[#1e293b] tracking-tight">Choose Your Experience</h2>
            <p className="text-[#64748b] text-lg font-medium">Select the interface layout that works best for you.</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <button 
              onClick={() => onSelect('Design1')}
              className="group relative flex flex-col items-center p-8 rounded-2xl border-2 border-gray-100 hover:border-[#3A58EF] hover:bg-blue-50/50 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gray-100 group-hover:bg-[#3A58EF] rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300">
                <Layout className="text-gray-500 group-hover:text-white" size={32} />
              </div>
              <span className="text-xl font-bold text-[#1e293b]">Design 1</span>
              <span className="text-sm text-[#64748b] mt-1">Classic Layout</span>
            </button>

            <button 
              onClick={() => onSelect('Design2')}
              className="group relative flex flex-col items-center p-8 rounded-2xl border-2 border-gray-100 hover:border-[#3A58EF] hover:bg-blue-50/50 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gray-100 group-hover:bg-[#3A58EF] rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300">
                <LayoutPanelLeft className="text-gray-500 group-hover:text-white" size={32} />
              </div>
              <span className="text-xl font-bold text-[#1e293b]">Design 2</span>
              <span className="text-sm text-[#64748b] mt-1">Modern Layout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
