
import React, { useState } from 'react';
import { X, ArrowUpRight, Flag } from 'lucide-react';
import { ReviewMode } from '../App';

export interface SubQuestion {
  id: string;
  text: string;
  options: { label: string; text: string }[];
}

export interface Question {
  id: number;
  type: 'MCQ' | 'Simulation' | 'Subjective';
  text: string;
  description?: string;
  dataPoints?: string[];
  options?: { label: string; text: string }[];
  subQuestions?: SubQuestion[];
}

interface AssessmentViewProps {
  questions: Question[];
  currentIdx: number;
  answers: Record<number, string | Record<string, string>>;
  flaggedQuestions: Set<number>;
  skippedQuestions?: Set<number>;
  onSelectOption: (questionId: number, answer: string | Record<string, string>) => void;
  onToggleFlag: (questionId: number) => void;
  onSkip?: (questionId: number) => void;
  onJumpToQuestion: (idx: number) => void;
  reviewMode?: ReviewMode;
  sectionType: 'MCQ' | 'SUBJECTIVE';
}

const Modal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  questionText: string;
  options: { label: string; text: string }[];
  currentSelection?: string;
  onSelect: (text: string) => void;
}> = ({ isOpen, onClose, title, questionText, options, currentSelection, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1e293b]/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#1e293b]">{title}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-8 space-y-6">
          <div className="space-y-1">
            <span className="text-[#64748b] text-sm font-medium">Question :</span>
            <p className="text-lg font-bold text-[#1e293b]">{questionText}</p>
          </div>
          <div className="space-y-3">
            {options.map((opt) => (
              <button 
                key={opt.label}
                onClick={() => onSelect(opt.text)}
                className={`flex items-center w-full group transition-all rounded-md p-2 ${currentSelection === opt.text ? 'bg-[#eff6ff]' : 'hover:bg-gray-50'}`}
              >
                <div className={`w-10 h-10 rounded-md flex items-center justify-center font-bold border transition-colors ${
                  currentSelection === opt.text 
                    ? 'bg-[#3A58EF] text-white border-[#3A58EF]' 
                    : 'bg-[#eff6ff] text-[#1e293b] border-transparent'
                }`}>
                  {opt.label}
                </div>
                <div className={`flex-grow text-left font-medium ml-4 ${currentSelection === opt.text ? 'text-[#3A58EF]' : 'text-[#334155]'}`}>
                  {opt.text}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-2.5 rounded-lg bg-[#3A58EF] text-white font-bold text-sm hover:bg-[#2d46cc] transition-all shadow-md active:scale-[0.98]"
          >
            Submit Answer
          </button>
        </div>
      </div>
    </div>
  );
};

export const AssessmentView: React.FC<AssessmentViewProps> = ({ 
  questions, 
  currentIdx, 
  answers, 
  flaggedQuestions,
  skippedQuestions,
  onSelectOption,
  onToggleFlag,
  onSkip,
  onJumpToQuestion,
  reviewMode = 'none',
  sectionType
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentQuestion = questions[currentIdx];
  const isFlagged = flaggedQuestions.has(currentQuestion.id);
  
  const answeredCount = questions.filter(q => {
    const ans = answers[q.id];
    return ans && (typeof ans === 'string' ? ans.trim() !== '' : Object.keys(ans).length > 0);
  }).length;

  const flaggedCount = flaggedQuestions.size;
  const pendingCount = questions.length - answeredCount;

  const getStatus = (qId: number) => {
    const ans = answers[qId];
    return ans && (typeof ans === 'string' ? ans.trim() !== '' : Object.keys(ans).length > 0) ? 'answered' : 'pending';
  };

  return (
    <div className="flex h-full w-full bg-white">
      {/* Main Content Area */}
      <div className="flex-grow flex flex-col bg-white overflow-hidden border-r border-gray-100">
        {/* Question Area */}
        <div className="flex-grow p-12 overflow-y-auto bg-white custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <span className="text-[#64748b] font-medium text-base">Question {currentIdx + 1} :</span>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => onSkip?.(currentQuestion.id)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all border border-gray-200 text-gray-500 hover:border-[#3A58EF] hover:text-[#3A58EF] bg-white shadow-sm"
                >
                  <span className="text-sm font-bold">Skip</span>
                </button>
                <button 
                  onClick={() => onToggleFlag(currentQuestion.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all border ${
                    isFlagged 
                      ? 'bg-amber-50 border-amber-200 text-amber-600' 
                      : 'bg-white border-gray-200 text-gray-400 hover:border-amber-300 hover:text-amber-500'
                  }`}
                >
                  <Flag size={18} fill={isFlagged ? 'currentColor' : 'none'} />
                  <span className="text-sm font-bold">Flag Question</span>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="text-xl font-bold text-[#1e293b] leading-relaxed whitespace-pre-line">
                {currentQuestion.text}
              </div>
              
              {currentQuestion.type === 'MCQ' ? (
                <div className="space-y-4 pt-4">
                  {currentQuestion.options?.map((opt) => (
                    <button 
                      key={opt.label}
                      onClick={() => onSelectOption(currentQuestion.id, opt.label)}
                      className={`flex items-center w-full group transition-all rounded-xl ${answers[currentQuestion.id] === opt.label ? 'bg-[#eff6ff]' : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center space-x-6 w-full px-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold border transition-colors ${
                          answers[currentQuestion.id] === opt.label 
                            ? 'bg-[#3A58EF] text-white border-[#3A58EF]' 
                            : 'bg-[#eff6ff] text-[#1e293b] border-transparent shadow-sm'
                        }`}>
                          {opt.label}
                        </div>
                        <div className={`flex-grow text-left font-semibold text-lg py-5 ${answers[currentQuestion.id] === opt.label ? 'text-[#3A58EF]' : 'text-[#334155]'}`}>
                          {opt.text}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : currentQuestion.options ? (
                <div className="space-y-4 pt-4">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-xl border-2 transition-all group ${
                      answers[currentQuestion.id] 
                        ? 'border-[#3A58EF] bg-[#eff6ff] text-[#3A58EF]' 
                        : 'border-gray-200 text-gray-400 hover:border-[#3A58EF] hover:text-[#3A58EF]'
                    }`}
                  >
                    <span className="text-lg font-bold">
                      {answers[currentQuestion.id] ? `Selected: ${answers[currentQuestion.id]}` : 'Select Option'}
                    </span>
                    <ArrowUpRight size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4 pt-4">
                  <textarea
                    value={(answers[currentQuestion.id] as string) || ''}
                    onChange={(e) => onSelectOption(currentQuestion.id, e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full h-64 p-6 rounded-xl border border-gray-200 focus:border-[#3A58EF] focus:ring-2 focus:ring-[#3A58EF]/20 outline-none transition-all text-lg resize-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Your Answer"
        questionText={currentQuestion.text}
        options={currentQuestion.options || []}
        currentSelection={answers[currentQuestion.id] as string}
        onSelect={(text) => {
          onSelectOption(currentQuestion.id, text);
        }}
      />

      {/* Sidebar */}
      <div className="w-80 flex flex-col bg-[#f8fafc] p-6 space-y-8">
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-[#1e293b]">{sectionType}</h3>
          
          <div className="grid grid-cols-5 gap-3">
            {questions.map((q, i) => {
              const status = getStatus(q.id);
              const isFlagged = flaggedQuestions.has(q.id);
              const isSkipped = skippedQuestions?.has(q.id);
              const isActive = i === currentIdx;
              
              let badgeStyle = "";
              if (isActive) {
                badgeStyle = "bg-[#1e293b] text-white shadow-md";
              } else if (status === 'answered') {
                badgeStyle = "bg-[#3A58EF] text-white";
              } else if (isSkipped) {
                badgeStyle = "bg-white text-[#1e293b] border-2 border-dotted border-[#3A58EF]";
              } else {
                badgeStyle = "bg-[#eef2f6] text-[#1e293b] hover:bg-gray-200";
              }

              return (
                <button
                  key={q.id}
                  onClick={() => onJumpToQuestion(i)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-base font-bold transition-all relative ${badgeStyle}`}
                >
                  {String(i + 1).padStart(2, '0')}
                  {isFlagged && (
                    <div className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#f59e0b] rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                      <Flag size={10} fill="white" className="text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between p-3 bg-[#eff6ff] rounded-lg">
            <span className="text-xs font-bold text-[#3A58EF] uppercase tracking-wider">Answered</span>
            <span className="text-lg font-black text-[#3A58EF]">{String(answeredCount).padStart(2, '0')}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Flagged</span>
            <span className="text-lg font-black text-amber-600">{String(flaggedCount).padStart(2, '0')}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending</span>
            <span className="text-lg font-black text-gray-500">{String(pendingCount).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}} />
    </div>
  );
};
