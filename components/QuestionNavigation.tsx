
import React from 'react';
import { Flag } from 'lucide-react';
import { ReviewMode } from '../App';

interface QuestionNavigationProps {
  questions: any[];
  currentIdx: number;
  answers: Record<number, any>;
  flaggedQuestions: Set<number>;
  skippedQuestions?: Set<number>;
  onJumpToQuestion: (idx: number) => void;
  reviewMode: ReviewMode;
  sectionType: 'MCQ' | 'SIM';
}

export const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  questions,
  currentIdx,
  answers,
  flaggedQuestions,
  skippedQuestions,
  onJumpToQuestion,
  reviewMode,
  sectionType
}) => {
  const isSimAnswered = (ans: any) => {
    if (!ans || typeof ans !== 'object') return false;
    return Object.values(ans).some(taskAns => 
      Object.values(taskAns as Record<string, string>).some(val => val.trim() !== '')
    );
  };

  const answeredCount = questions.filter(q => {
    const ans = answers[q.id];
    if (!ans) return false;
    if (typeof ans === 'string') return ans.trim() !== '';
    return isSimAnswered(ans);
  }).length;

  const pendingCount = questions.length - answeredCount;

  const getStatus = (qId: number) => {
    const ans = answers[qId];
    if (!ans) return 'pending';
    if (typeof ans === 'string') return ans.trim() !== '' ? 'answered' : 'pending';
    return isSimAnswered(ans) ? 'answered' : 'pending';
  };

  return (
    <div className="px-8 py-5 flex items-center justify-between z-10 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center space-x-2.5 overflow-x-auto custom-scrollbar pb-2 max-w-[70%]">
        {questions.map((q, i) => (
          <QuestionBadge 
            key={q.id} 
            number={String(i + 1).padStart(2, '0')} 
            status={getStatus(q.id)} 
            isCurrent={i === currentIdx}
            isFlagged={flaggedQuestions.has(q.id)}
            isSkipped={skippedQuestions?.has(q.id)}
            reviewMode={reviewMode}
            onClick={() => onJumpToQuestion(i)} 
          />
        ))}
      </div>
      
      <div className="flex items-center space-x-6 pl-6 border-l border-gray-100">
        <div className="flex flex-col items-end">
          <span className="text-[9px] font-black text-[#3A58EF] uppercase tracking-widest opacity-70">Answered</span>
          <span className="text-lg font-black text-[#3A58EF] tabular-nums">{String(answeredCount).padStart(2, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[9px] font-black text-[#ca8a04] uppercase tracking-widest opacity-70">Flagged</span>
          <span className="text-lg font-black text-[#ca8a04] tabular-nums">{String(flaggedQuestions.size).padStart(2, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[9px] font-black text-[#64748b] uppercase tracking-widest opacity-70">Pending</span>
          <span className="text-lg font-black text-[#64748b] tabular-nums">{String(pendingCount).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
};

const QuestionBadge: React.FC<{ 
  number: string; 
  status: 'answered' | 'pending';
  isCurrent: boolean;
  isFlagged: boolean;
  isSkipped?: boolean;
  reviewMode: ReviewMode;
  onClick: () => void;
}> = ({ number, status, isCurrent, isFlagged, isSkipped, reviewMode, onClick }) => {
  const baseClasses = "w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center text-sm font-bold transition-all relative";
  
  const getBadgeStyle = () => {
    const isAnswered = status === 'answered';

    if (reviewMode === 'skipped') {
      if (isCurrent && isSkipped) {
        return "bg-[#1e293b]/20 text-[#1e293b] border-2 border-dashed border-[#1e293b]";
      }
      if (isCurrent) {
        return "bg-[#1e293b] text-white shadow-md z-10";
      }
      if (isSkipped) {
        return "bg-white text-[#1e293b] border-2 border-dashed border-[#1e293b]";
      }
      if (isAnswered) {
        return "bg-[#3A58EF] text-white";
      }
      return "bg-[#eef2f6] text-[#1e293b] hover:bg-gray-200";
    }

    if (isCurrent) {
      return "bg-[#1e293b] text-white shadow-md z-10";
    }

    if (isAnswered) {
      return "bg-[#3A58EF] text-white";
    }

    return "bg-[#eef2f6] text-[#1e293b] hover:bg-gray-200";
  };

  return (
    <button onClick={onClick} className={`${baseClasses} ${getBadgeStyle()}`}>
      {number}
      {isFlagged && (
        <div className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#f59e0b] rounded-full border-2 border-white flex items-center justify-center shadow-sm">
          <Flag size={10} fill="white" className="text-white" />
        </div>
      )}
    </button>
  );
};
