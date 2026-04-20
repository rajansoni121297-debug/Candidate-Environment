
import React, { useState } from 'react';
import { X, Star, ChevronLeft, ChevronRight, CheckCircle2, MessageSquare } from 'lucide-react';

interface FeedbackStepperProps {
  mode: 'none' | 'gate' | 'stepper';
  onStart: () => void;
  onCancel: () => void;
  onComplete: () => void;
}

type FeedbackAnswers = {
  overallRating: number;
  clarity: string;
  issues: string;
  likedMost: string;
  improvements: string;
  recommendation: string;
};

export const FeedbackStepper: React.FC<FeedbackStepperProps> = ({ mode, onStart, onCancel, onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<FeedbackAnswers>({
    overallRating: 0,
    clarity: '',
    issues: '',
    likedMost: '',
    improvements: '',
    recommendation: ''
  });

  if (mode === 'none') return null;

  const handleNext = () => {
    if (step < 6) setStep(step + 1);
    else onComplete();
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const isNextDisabled = () => {
    if (step === 0) return answers.overallRating === 0;
    if (step === 1) return !answers.clarity;
    if (step === 2) return !answers.issues;
    if (step === 5) return !answers.recommendation;
    return false;
  };

  // 1) Entry Gate Modal
  if (mode === 'gate') {
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onCancel} />
        <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl p-10 flex flex-col items-center text-center animate-in zoom-in duration-300">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-6">
            <MessageSquare size={32} />
          </div>
          <h2 className="text-2xl font-black text-[#1e293b] mb-3">We’d love your feedback!</h2>
          <p className="text-[#64748b] font-medium leading-relaxed mb-8">
            Your experience matters, and your input helps us improve. Can you take a minute to share your thoughts?
          </p>
          <div className="flex flex-col w-full space-y-3">
            <button 
              onClick={onStart}
              className="w-full py-4 rounded-xl bg-[#2563eb] text-white font-bold text-sm hover:bg-[#1d4ed8] transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
            >
              Yes, Sure
            </button>
            <button 
              onClick={onCancel}
              className="w-full py-4 rounded-xl border border-gray-200 text-[#475569] font-bold text-sm hover:bg-gray-50 transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2) Feedback Stepper Content
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-sm animate-in fade-in duration-300" />
      
      <div className="relative bg-white w-full max-w-2xl min-h-[500px] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
              {step < 7 ? step + 1 : '✓'}
            </div>
            <span className="text-sm font-bold text-[#1e293b]">
              {step < 7 ? `Step ${step + 1} of 7` : 'Feedback Complete'}
            </span>
          </div>
          <button onClick={onCancel} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Question Area */}
        <div className="flex-grow p-10 flex flex-col">
          {step === 0 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#1e293b]">How was your overall experience?</h3>
                <p className="text-[#64748b] font-medium italic">Tap a Star to Rate</p>
              </div>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star}
                    onClick={() => setAnswers({...answers, overallRating: star})}
                    className="group focus:outline-none"
                  >
                    <Star 
                      size={48} 
                      className={`transition-all ${star <= answers.overallRating ? 'fill-amber-400 text-amber-400 scale-110' : 'text-gray-200 group-hover:text-amber-200'}`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <SelectionStep 
              question="Was the assessment clear and effective?"
              options={['Yes', 'Somewhat', 'No']}
              value={answers.clarity}
              onChange={(val) => setAnswers({...answers, clarity: val})}
            />
          )}

          {step === 2 && (
            <SelectionStep 
              question="Did you face any issues while performing the assessment?"
              options={['No issues', 'Minor issues', 'Major issues']}
              value={answers.issues}
              onChange={(val) => setAnswers({...answers, issues: val})}
            />
          )}

          {step === 3 && (
            <TextStep 
              question="What did you like the most about your experience?"
              placeholder="Press “Enter” once done..."
              value={answers.likedMost}
              onChange={(val) => setAnswers({...answers, likedMost: val})}
              onFinish={handleNext}
            />
          )}

          {step === 4 && (
            <TextStep 
              question="Is there anything we could improve?"
              placeholder="Press “Enter” once done..."
              value={answers.improvements}
              onChange={(val) => setAnswers({...answers, improvements: val})}
              onFinish={handleNext}
            />
          )}

          {step === 5 && (
            <SelectionStep 
              question="How likely are you to recommend this experience to others?"
              options={['Very Likely', 'Likely', 'Neutral', 'Unlikely', 'Very Unlikely']}
              value={answers.recommendation}
              onChange={(val) => setAnswers({...answers, recommendation: val})}
            />
          )}

          {step === 6 && (
            <div className="flex-grow flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-[#f0fdf4] rounded-full flex items-center justify-center text-[#22c55e]">
                <CheckCircle2 size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-[#1e293b]">Thank You!</h2>
                <p className="text-[#64748b] text-lg font-medium max-w-sm">
                  We appreciate your time and will use your input to improve your experience.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-8 py-6 bg-white border-t border-gray-100 flex items-center justify-between">
          {step < 6 ? (
            <>
              <button 
                onClick={handleBack}
                disabled={step === 0}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                  step === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-[#475569] hover:bg-gray-100'
                }`}
              >
                <ChevronLeft size={18} />
                <span>Back</span>
              </button>
              <button 
                onClick={handleNext}
                disabled={isNextDisabled()}
                className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
                  isNextDisabled() 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                    : 'bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-blue-600/20 active:scale-[0.98]'
                }`}
              >
                <span>Next</span>
                <ChevronRight size={18} />
              </button>
            </>
          ) : (
            <button 
              onClick={onComplete}
              className="w-full py-4 rounded-xl bg-[#2563eb] text-white font-bold text-sm hover:bg-[#1d4ed8] transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const SelectionStep: React.FC<{ 
  question: string; 
  options: string[]; 
  value: string; 
  onChange: (val: string) => void;
}> = ({ question, options, value, onChange }) => (
  <div className="space-y-8 animate-in fade-in duration-300">
    <h3 className="text-2xl font-black text-[#1e293b] leading-tight">{question}</h3>
    <div className="space-y-3">
      {options.map((opt) => (
        <button 
          key={opt}
          onClick={() => onChange(opt)}
          className={`w-full p-5 rounded-2xl border-2 text-left font-bold transition-all flex items-center justify-between ${
            value === opt 
              ? 'border-[#2563eb] bg-[#eff6ff] text-[#2563eb] shadow-sm' 
              : 'border-gray-100 hover:border-gray-300 text-[#475569]'
          }`}
        >
          <span>{opt}</span>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            value === opt ? 'border-[#2563eb] bg-[#2563eb]' : 'border-gray-300'
          }`}>
            {value === opt && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
        </button>
      ))}
    </div>
  </div>
);

const TextStep: React.FC<{ 
  question: string; 
  placeholder: string; 
  value: string; 
  onChange: (val: string) => void;
  onFinish: () => void;
}> = ({ question, placeholder, value, onChange, onFinish }) => (
  <div className="space-y-8 animate-in fade-in duration-300">
    <h3 className="text-2xl font-black text-[#1e293b] leading-tight">{question}</h3>
    <textarea 
      rows={5}
      className="w-full p-6 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-[#2563eb] focus:bg-white outline-none text-lg font-medium text-[#1e293b] transition-all placeholder:text-gray-300"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          onFinish();
        }
      }}
    />
  </div>
);
