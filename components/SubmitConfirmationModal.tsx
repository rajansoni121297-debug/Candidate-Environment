
import React from 'react';
import { Check, Flag } from 'lucide-react';

interface SubmitConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onReviewSkipped: () => void;
  onReviewFlagged: () => void;
  skippedCount: number;
  flaggedCount: number;
  skippedQuestions?: number[];
  onJumpToQuestion?: (idx: number) => void;
  sectionType: 'MCQ' | 'SIM' | 'VIDEO' | 'SUBJECTIVE';
}

export const SubmitConfirmationModal: React.FC<SubmitConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  onReviewSkipped,
  onReviewFlagged,
  skippedCount,
  flaggedCount,
  skippedQuestions = [],
  onJumpToQuestion,
  sectionType
}) => {
  if (!isOpen) return null;

  const isSimpleSection = sectionType === 'MCQ' || sectionType === 'SUBJECTIVE';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#1e293b]/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-[640px] rounded-2xl shadow-2xl flex flex-col items-center p-10 text-center animate-in fade-in zoom-in duration-300">
        
        {/* Success Icon */}
        <div className="w-20 h-20 bg-[#ebfcf3] rounded-full flex items-center justify-center text-[#22c55e] mb-8 ring-4 ring-white shadow-sm">
          <div className="w-16 h-16 bg-[#22c55e] rounded-full flex items-center justify-center text-white">
            <Check size={36} strokeWidth={3} />
          </div>
        </div>

        {/* Text Content */}
        <h2 className="text-3xl font-bold text-[#1e293b] mb-4">Want To Submit Your Assessment?</h2>
        <p className="text-[#64748b] text-lg max-w-[480px] leading-relaxed mb-6 font-medium">
          {skippedCount > 0 || flaggedCount > 0 
            ? "You still have questions that are not answered or are flagged for review. Are you sure you want to submit your Assessment?" 
            : "Are you sure you want to finalize and submit your Assessment?"
          }
        </p>

        {/* Status Badges */}
        <div className="w-full space-y-3 mb-10">
          {skippedCount > 0 && (
            <div 
              onClick={isSimpleSection ? onReviewSkipped : undefined}
              className={`w-full bg-[#f0f7ff] border border-[#2563eb]/40 rounded-xl py-4 px-6 text-center transition-all ${
                isSimpleSection ? 'hover:bg-blue-100/80 cursor-pointer' : 'cursor-default'
              }`}
            >
              <p className="text-[#334155] text-base font-medium">
                {isSimpleSection 
                  ? (
                    <>
                      You have skipped <span className="font-bold text-[#2563eb] underline underline-offset-4 decoration-dashed">{String(skippedCount).padStart(2, '0')}</span> questions.
                    </>
                  )
                  : "You have skipped entries in:"
                }
              </p>
              {!isSimpleSection && (
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {skippedQuestions.map((qNum) => (
                    <button 
                      key={qNum}
                      onClick={(e) => {
                        e.stopPropagation();
                        onJumpToQuestion?.(qNum - 1);
                      }}
                      className="px-3 py-1 bg-white border border-blue-200 rounded-md text-[#2563eb] font-bold text-sm hover:bg-blue-50 transition-all"
                    >
                      Q{qNum}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {flaggedCount > 0 && (
            <button 
              onClick={onReviewFlagged}
              className="w-full bg-[#fffbeb] border border-[#d97706]/40 rounded-xl py-4 px-6 cursor-pointer hover:bg-amber-100/80 transition-all group flex items-center justify-center"
            >
              <p className="text-[#92400e] text-base font-medium flex items-center">
                <Flag size={16} className="mr-2 text-amber-600" fill="currentColor" />
                You have flagged <span className="font-bold text-[#d97706] mx-1 underline underline-offset-4 decoration-dashed group-hover:decoration-solid">{String(flaggedCount).padStart(2, '0')}</span> questions.
              </p>
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end w-full space-x-4">
          <button 
            onClick={onClose}
            className="px-10 py-3 rounded-lg border-2 border-[#2563eb] text-[#2563eb] font-bold text-sm hover:bg-blue-50 transition-all active:scale-[0.98]"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-12 py-3.5 rounded-lg bg-[#2563eb] text-white font-bold text-sm hover:bg-[#1d4ed8] transition-all shadow-md shadow-blue-600/20 active:scale-[0.98]"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
