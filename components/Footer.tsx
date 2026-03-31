
import React from 'react';

interface FooterProps {
  step: number;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  isLastQuestion?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ step, onNext, onPrevious, onSubmit, isLastQuestion }) => {
  if (step === 2) {
    return (
      <div className="px-8 py-5 border-t border-[#e2e8f0] flex items-center justify-between bg-white w-full">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onPrevious}
            className="px-8 py-2.5 rounded-lg bg-white border border-[#e2e8f0] text-[#64748b] font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm"
          >
            Previous
          </button>
          {!isLastQuestion && (
            <button 
              onClick={onNext}
              className="px-10 py-2.5 rounded-lg bg-[#3A58EF] text-white font-bold text-sm hover:bg-[#2d46c7] transition-all shadow-md active:scale-[0.98]"
            >
              Next
            </button>
          )}
        </div>
        
        <button 
          onClick={onSubmit}
          className="px-8 py-2.5 rounded-lg bg-[#3A58EF] text-white font-bold text-sm hover:bg-[#2d46c7] transition-all shadow-md active:scale-[0.98]"
        >
          Submit Test
        </button>
      </div>
    );
  }

  return (
    <div className="px-10 py-6 border-t border-[#e2e8f0] flex flex-col md:flex-row items-center justify-between gap-4 bg-white mt-auto">
      <p className="text-[#64748b] text-sm">
        By clicking on start assessment, you agree to our Terms & Conditions,{' '}
        <a href="#" className="text-[#4f46e5] font-semibold hover:underline" onClick={(e) => e.preventDefault()}>click here</a> to read more about it.
      </p>
      
      <div className="flex items-center space-x-3 w-full md:w-auto">
        <button 
          onClick={onPrevious}
          disabled={step === 0}
          className={`px-8 py-2.5 rounded-lg border border-[#e2e8f0] font-semibold text-sm transition-colors w-full md:w-auto ${
            step === 0 ? 'bg-[#f8fafc] text-[#cbd5e1] cursor-not-allowed' : 'bg-white text-[#4f46e5] hover:bg-gray-50 shadow-sm'
          }`}
        >
          Previous
        </button>
        <button 
          onClick={onNext}
          className="px-10 py-2.5 rounded-lg bg-[#2563eb] text-white font-bold text-sm hover:bg-[#1d4ed8] transition-all shadow-md active:scale-[0.98] w-full md:w-auto whitespace-nowrap"
        >
          {step === 0 ? 'Next' : 'Start Assessment'}
        </button>
      </div>
    </div>
  );
};
