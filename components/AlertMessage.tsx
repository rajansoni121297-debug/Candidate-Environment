
import React from 'react';
import { Info } from 'lucide-react';

export const AlertMessage: React.FC = () => {
  return (
    <div className="bg-[#fffbeb] border-l-4 border-[#f59e0b] p-5 rounded-r-lg flex items-start space-x-4">
      <div className="flex-shrink-0 mt-0.5">
        <div className="w-5 h-5 rounded-full border border-[#d97706] flex items-center justify-center">
          <span className="text-[#d97706] text-xs font-bold font-serif">i</span>
        </div>
      </div>
      <p className="text-[#b45309] text-[14px] leading-relaxed font-medium">
        In the event of a system failure, you may resume the assessment; however, please be aware that the timer will continue running and will not pause during the interruption.
      </p>
    </div>
  );
};
