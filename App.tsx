import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Video } from 'lucide-react';
import { AssessmentView } from './components/AssessmentView';
import { ResultsView } from './components/ResultsView';
import { Calculator } from './components/Calculator';
import { Spreadsheet } from './components/Spreadsheet';
import { SubmitConfirmationModal } from './components/SubmitConfirmationModal';
import { FeedbackStepper } from './components/FeedbackStepper';
import { LandingScreen } from './components/LandingScreen';
import { SimulationEnvironment } from './components/SimulationEnvironment';
import { QuestionNavigation } from './components/QuestionNavigation';
import { ProctoringVerification } from './components/ProctoringVerification';
import { AssessmentSection, FlowStep, MCQQuestion, SIMQuestion } from './types';

export type ReviewMode = 'none' | 'skipped' | 'flagged';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<AssessmentSection>('MCQ');
  const [flowStep, setFlowStep] = useState<FlowStep>('LANDING');
  const [completedSections, setCompletedSections] = useState<Set<AssessmentSection>>(new Set());
  
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  
  // MCQ State
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, string>>({});
  const [mcqFlags, setMcqFlags] = useState<Set<number>>(new Set());
  const [mcqSkipped, setMcqSkipped] = useState<Set<number>>(new Set());
  
  // Subjective State
  const [subjectiveAnswers, setSubjectiveAnswers] = useState<Record<number, string>>({});
  const [subjectiveFlags, setSubjectiveFlags] = useState<Set<number>>(new Set());
  const [subjectiveSkipped, setSubjectiveSkipped] = useState<Set<number>>(new Set());
  
  // SIM State
  const [simAnswers, setSimAnswers] = useState<Record<number, Record<string, Record<string, string>>>>({});
  const [simFlags, setSimFlags] = useState<Set<number>>(new Set());
  const [simSkipped, setSimSkipped] = useState<Set<number>>(new Set());
  
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isSpreadsheetOpen, setIsSpreadsheetOpen] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [reviewMode, setReviewMode] = useState<ReviewMode>('none');
  const [landingSubStep, setLandingSubStep] = useState(0); // 0: Instructions, 1: Navigating
  const [feedbackFlow, setFeedbackFlow] = useState<'none' | 'gate' | 'stepper'>('none');
  const [highlightSkipped, setHighlightSkipped] = useState(false);

  // Timer logic - persists across sections once started
  useEffect(() => {
    let timer: number;
    if (isTimerStarted && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerStarted) {
      handleFinalSubmit();
    }
    return () => clearInterval(timer);
  }, [isTimerStarted, timeLeft]);

  const mcqQuestions: MCQQuestion[] = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: 101 + i,
      text: [
        'What is the normal balance of an asset account?',
        'Which financial statement reports assets, liabilities, and equity?',
        'Under the accrual basis of accounting, when is revenue recognized?',
        'What is the accounting equation?',
        'Which of the following is an intangible asset?',
        'What is the primary purpose of the General Ledger?',
        'Which account is increased by a credit entry?',
        'What does GAAP stand for?',
        'Which of these is a contra-asset account?',
        'A trial balance is primarily used to...',
        'What is the impact of a net loss on Retained Earnings?',
        'Which method of depreciation results in higher initial expenses?',
        'What is a current liability?',
        'Inventory turnover ratio measures...',
        'What is the definition of "working capital"?',
        'Who is responsible for setting US accounting standards?',
        'Which account would not appear on a post-closing trial balance?',
        'The matching principle requires that...',
        'What is the effect of purchasing equipment for cash?',
        'Which of the following is a fixed cost?'
      ][i] || `MCQ Question ${i + 1}`,
      options: [
        { label: 'A', text: 'Option A' },
        { label: 'B', text: 'Option B' },
        { label: 'C', text: 'Option C' },
        { label: 'D', text: 'Option D' }
      ]
    }));
  }, []);

  const simQuestions: SIMQuestion[] = useMemo(() => {
    return [
      {
        id: 201,
        title: "Corporate Tax Basis",
        description: "Alpha Corp is a C-Corporation. At the beginning of the year, its accumulated earnings and profits (E&P) were $100,000.\n\nDuring the year, Alpha Corp had:\n• Taxable income: $50,000\n• Federal income taxes paid: $10,500\n• Cash distributions to shareholders: $20,000\n• Tax-exempt interest received: $5,000",
        tasks: [
          {
            id: 'task-1',
            label: 'E&P Calculation',
            type: 'spreadsheet'
          }
        ]
      },
      {
        id: 202,
        title: "Partnership Basis Simulation",
        description: "Tony and Claire are equal partners in TC Designs, a partnership. At the start of 2024, Tony's basis was $30,000.\n\nThe partnership had:\n• Ordinary business income: $40,000\n• Tax-exempt interest income: $2,000\n• Distributions to Tony: $10,000\n• Non-deductible expenses: $1,000",
        tasks: [
          {
            id: 'task-1',
            label: 'Basis Calculation',
            type: 'table',
            subQuestions: [
              { 
                id: 'q2.1', 
                no: 'Q2.1', 
                question: "What items increase Tony's basis? Answer in amount.",
                options: [
                  { label: 'A', text: '$25,000' },
                  { label: 'B', text: '$1,000' },
                  { label: 'C', text: '$26,000' },
                  { label: 'D', text: '$35,000' }
                ]
              },
              { 
                id: 'q2.2', 
                no: 'Q2.2', 
                question: "What items decrease Tonys basis? Answer in amount.",
                options: [
                  { label: 'A', text: '$10,000' },
                  { label: 'B', text: '$11,000' },
                  { label: 'C', text: '$1,000' },
                  { label: 'D', text: '$5,000' }
                ]
              },
              { 
                id: 'q2.3', 
                no: 'Q2.3', 
                question: "What is Tony's ending basis?",
                options: [
                  { label: 'A', text: '$40,000' },
                  { label: 'B', text: '$41,000' },
                  { label: 'C', text: '$30,000' },
                  { label: 'D', text: '$45,000' }
                ]
              },
              { 
                id: 'q2.4', 
                no: 'Q2.4', 
                question: "Does Tony recognize any gain or loss from the distribution?",
                options: [
                  { label: 'A', text: 'Yes, $5,000 Gain' },
                  { label: 'B', text: 'No Gain or Loss' },
                  { label: 'C', text: 'Yes, $10,000 Loss' },
                  { label: 'D', text: 'Yes, $2,000 Gain' }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 203,
        title: "Individual Income Tax",
        description: "Sarah is a single filer with a gross income of $85,000 in 2023.\n\nShe has the following items:\n• Standard deduction: $13,850\n• Student loan interest paid: $2,500\n• Contribution to a traditional IRA: $6,000\n• Medical expenses: $10,000 (AGI threshold is 7.5%)",
        tasks: [
          {
            id: 'task-1',
            label: 'Tax Calculation',
            type: 'spreadsheet'
          }
        ]
      },
      {
        id: 204,
        title: "Inventory & Depreciation",
        description: "Review the financial data for TC Designs regarding their inventory and fixed assets for the first quarter of 2024.",
        tasks: [
          {
            id: 'task-1',
            label: 'Inventory (FIFO)',
            type: 'spreadsheet'
          },
          {
            id: 'task-2',
            label: 'Depreciation',
            type: 'spreadsheet'
          }
        ]
      },
      {
        id: 205,
        title: "Ethics and Professional Conduct",
        description: "A tax preparer discovers an error in a client's previously filed tax return that results in a significant underpayment of tax.\n\nAccording to Circular 230, evaluate the preparer's responsibilities.",
        tasks: [
          {
            id: 'task-1',
            label: 'Task 1',
            type: 'spreadsheet'
          },
          {
            id: 'task-2',
            label: 'Task 2',
            type: 'spreadsheet'
          },
          {
            id: 'task-3',
            label: 'Task 3',
            type: 'spreadsheet'
          },
          {
            id: 'task-4',
            label: 'Task 4',
            type: 'spreadsheet'
          }
        ]
      }
    ];
  }, []);

  const subjectiveQuestions = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const base = {
        id: 301 + i,
        text: [
          'What items increase Rachel\'s basis?',
          'Explain the difference between accounts receivable and accounts payable.',
          'What is the purpose of a bank reconciliation?',
          'Describe the concept of double-entry bookkeeping.',
          'What are the key components of a balance sheet?'
        ][i] || `Subjective Question ${i + 1}`
      };

      if (i === 0) {
        return {
          ...base,
          options: [
            { label: 'A', text: '$25,000' },
            { label: 'B', text: '$1,000' },
            { label: 'C', text: '$26,000' },
            { label: 'D', text: '$35,000' }
          ]
        };
      }

      if (i === 5) {
        return {
          ...base,
          options: [
            { label: 'A', text: 'When cash is received' },
            { label: 'B', text: 'When the performance obligation is satisfied' },
            { label: 'C', text: 'At the end of the fiscal year' },
            { label: 'D', text: 'When the invoice is sent' }
          ]
        };
      }

      return base;
    });
  }, []);

  const handleStartSection = () => {
    if (completedSections.size === 0) {
      setFlowStep('PROCTORING');
    } else {
      setFlowStep('ASSESSMENT');
      setCurrentQuestionIdx(0);
    }
  };

  const handleProctoringComplete = () => {
    setIsTimerStarted(true);
    setFlowStep('ASSESSMENT');
    setCurrentQuestionIdx(0);
  };

  const handleNext = () => {
    const questions = currentSection === 'MCQ' ? mcqQuestions : (currentSection === 'SIM' ? simQuestions : (currentSection === 'SUBJECTIVE' ? subjectiveQuestions : []));
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
    }
  };

  const isSimQuestionAnswered = (qId: number) => {
    const ans = simAnswers[qId];
    if (!ans) return false;
    return Object.values(ans).some(taskAns => 
      Object.values(taskAns).some(val => val.trim() !== '')
    );
  };

  const handleSubmitAttempt = () => {
    const questions = currentSection === 'MCQ' ? mcqQuestions : (currentSection === 'SIM' ? simQuestions : subjectiveQuestions);
    const answers = currentSection === 'MCQ' ? mcqAnswers : (currentSection === 'SIM' ? simAnswers : subjectiveAnswers);
    const flags = currentSection === 'MCQ' ? mcqFlags : (currentSection === 'SIM' ? simFlags : subjectiveFlags);
    
    let skipped = 0;
    if (currentSection === 'MCQ') {
      skipped = mcqQuestions.length - Object.keys(mcqAnswers).length;
    } else if (currentSection === 'SIM') {
      skipped = simQuestions.filter(q => !isSimQuestionAnswered(q.id)).length;
    } else if (currentSection === 'SUBJECTIVE') {
      skipped = subjectiveQuestions.length - Object.keys(subjectiveAnswers).length;
    }

    if (currentSection === 'VIDEO') {
      handleFinalSubmit();
      return;
    }

    if (skipped > 0 || flags.size > 0) {
      setShowSubmitModal(true);
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = () => {
    setShowSubmitModal(false);
    setCompletedSections(prev => new Set(prev).add(currentSection));
    setLandingSubStep(0);
    
    if (currentSection === 'MCQ') {
      setCurrentSection('SIM');
      setFlowStep('LANDING');
    } else if (currentSection === 'SIM') {
      setCurrentSection('SUBJECTIVE');
      setFlowStep('LANDING');
    } else if (currentSection === 'SUBJECTIVE') {
      setCurrentSection('VIDEO');
      setFlowStep('LANDING');
    } else {
      setFeedbackFlow('gate');
    }
  };

  const completeFlowAndShowResults = () => {
    setFeedbackFlow('none');
    setFlowStep('RESULTS');
  };

  const startFeedbackStepper = () => {
    setFeedbackFlow('stepper');
  };

  const handleSelectOption = (qId: number, answer: string | Record<string, string>) => {
    if (currentSection === 'MCQ') {
      setMcqAnswers(prev => ({ ...prev, [qId]: answer as string }));
      setMcqSkipped(prev => {
        const next = new Set(prev);
        next.delete(qId);
        return next;
      });
    } else if (currentSection === 'SUBJECTIVE') {
      setSubjectiveAnswers(prev => ({ ...prev, [qId]: answer as string }));
      setSubjectiveSkipped(prev => {
        const next = new Set(prev);
        next.delete(qId);
        return next;
      });
    }
  };

  const handleSkipQuestion = (qId: number) => {
    if (currentSection === 'MCQ') {
      setMcqSkipped(prev => new Set(prev).add(qId));
    } else if (currentSection === 'SUBJECTIVE') {
      setSubjectiveSkipped(prev => new Set(prev).add(qId));
    } else if (currentSection === 'SIM') {
      setSimSkipped(prev => new Set(prev).add(qId));
    }
    handleNext();
  };

  const handleToggleFlag = (qId: number) => {
    if (currentSection === 'MCQ') {
      setMcqFlags(prev => {
        const next = new Set(prev);
        if (next.has(qId)) next.delete(qId);
        else next.add(qId);
        return next;
      });
    } else if (currentSection === 'SUBJECTIVE') {
      setSubjectiveFlags(prev => {
        const next = new Set(prev);
        if (next.has(qId)) next.delete(qId);
        else next.add(qId);
        return next;
      });
    } else {
      setSimFlags(prev => {
        const next = new Set(prev);
        if (next.has(qId)) next.delete(qId);
        else next.add(qId);
        return next;
      });
    }
  };

  const handleSimDataChange = (taskId: string, cellId: string, value: string) => {
    const qId = simQuestions[currentQuestionIdx].id;
    setSimAnswers(prev => ({
      ...prev,
      [qId]: {
        ...(prev[qId] || {}),
        [taskId]: {
          ...(prev[qId]?.[taskId] || {}),
          [cellId]: value
        }
      }
    }));
    setSimSkipped(prev => {
      const next = new Set(prev);
      next.delete(qId);
      return next;
    });
  };

  if (flowStep === 'RESULTS') {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center p-4 md:p-6 overflow-y-auto">
        <div className="w-full max-w-5xl">
          <ResultsView />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 md:p-8 relative">
      <FeedbackStepper 
        mode={feedbackFlow} 
        onStart={startFeedbackStepper}
        onCancel={completeFlowAndShowResults}
        onComplete={completeFlowAndShowResults}
      />

      <div className={`w-full max-w-6xl bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col ${flowStep === 'ASSESSMENT' ? 'h-[92vh]' : 'min-h-[85vh]'}`}>
        {flowStep === 'LANDING' ? (
          <LandingScreen 
            activeSection={currentSection}
            completedSections={completedSections}
            onStart={handleStartSection}
            timeLeft={timeLeft}
            subStep={landingSubStep}
            onNextSubStep={() => setLandingSubStep(1)}
            onPrevSubStep={() => setLandingSubStep(0)}
          />
        ) : flowStep === 'PROCTORING' ? (
          <ProctoringVerification onComplete={handleProctoringComplete} />
        ) : (
          <div className="w-full h-full flex flex-col">
            <Header 
              isAssessment={true} 
              title="Book-keeping Basics"
              timeLeft={timeLeft} 
              onToggleCalculator={() => setIsCalculatorOpen(!isCalculatorOpen)} 
              onToggleSpreadsheet={() => setIsSpreadsheetOpen(!isSpreadsheetOpen)}
            />
            
            <Calculator isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
            <Spreadsheet 
              isOpen={isSpreadsheetOpen} 
              onClose={() => setIsSpreadsheetOpen(false)} 
              data={{}}
              onDataChange={() => {}}
            />

            <SubmitConfirmationModal 
              isOpen={showSubmitModal}
              onClose={() => setShowSubmitModal(false)}
              onConfirm={handleFinalSubmit}
              onReviewSkipped={() => {
                setShowSubmitModal(false);
                setReviewMode('skipped');
                if (currentSection === 'MCQ') {
                  const firstSkipped = mcqQuestions.find(q => !mcqAnswers[q.id]);
                  if (firstSkipped) setCurrentQuestionIdx(mcqQuestions.indexOf(firstSkipped));
                }
              }}
              onReviewFlagged={() => {
                setShowSubmitModal(false);
                setReviewMode('flagged');
                if (currentSection === 'MCQ') {
                  const firstFlagged = mcqQuestions.find(q => mcqFlags.has(q.id));
                  if (firstFlagged) setCurrentQuestionIdx(mcqQuestions.indexOf(firstFlagged));
                } else {
                  const firstFlagged = simQuestions.find(q => simFlags.has(q.id));
                  if (firstFlagged) setCurrentQuestionIdx(simQuestions.indexOf(firstFlagged));
                }
              }}
              skippedCount={currentSection === 'MCQ' 
                ? mcqQuestions.length - Object.keys(mcqAnswers).length 
                : simQuestions.filter(q => !isSimQuestionAnswered(q.id)).length
              }
              flaggedCount={currentSection === 'MCQ' ? mcqFlags.size : simFlags.size}
              skippedQuestions={currentSection === 'MCQ' 
                ? mcqQuestions.filter(q => !mcqAnswers[q.id]).map((_, i) => i + 1)
                : simQuestions.filter(q => !isSimQuestionAnswered(q.id)).map((_, i) => i + 1)
              }
              onJumpToQuestion={(idx) => {
                setCurrentQuestionIdx(idx);
                setShowSubmitModal(false);
                setReviewMode('skipped');
                if (currentSection === 'SIM') {
                  setHighlightSkipped(true);
                  setTimeout(() => setHighlightSkipped(false), 3000);
                }
              }}
              sectionType={currentSection}
            />

            {currentSection === 'SIM' && (
              <QuestionNavigation 
                questions={simQuestions}
                currentIdx={currentQuestionIdx}
                answers={simAnswers}
                flaggedQuestions={simFlags}
                skippedQuestions={simSkipped}
                onJumpToQuestion={setCurrentQuestionIdx}
                reviewMode={reviewMode}
                sectionType="SIM"
              />
            )}

            <div className="flex-grow overflow-hidden">
              {currentSection === 'MCQ' ? (
                <AssessmentView 
                  questions={mcqQuestions.map(q => ({ ...q, type: 'MCQ' }))}
                  currentIdx={currentQuestionIdx}
                  answers={mcqAnswers}
                  flaggedQuestions={mcqFlags}
                  skippedQuestions={mcqSkipped}
                  onSelectOption={handleSelectOption}
                  onToggleFlag={handleToggleFlag}
                  onSkip={handleSkipQuestion}
                  onJumpToQuestion={setCurrentQuestionIdx}
                  reviewMode={reviewMode}
                  sectionType="MCQ"
                />
              ) : currentSection === 'SUBJECTIVE' ? (
                <AssessmentView 
                  questions={subjectiveQuestions.map(q => ({ ...q, type: 'Subjective' }))}
                  currentIdx={currentQuestionIdx}
                  answers={subjectiveAnswers}
                  flaggedQuestions={subjectiveFlags}
                  skippedQuestions={subjectiveSkipped}
                  onSelectOption={handleSelectOption}
                  onToggleFlag={handleToggleFlag}
                  onSkip={handleSkipQuestion}
                  onJumpToQuestion={setCurrentQuestionIdx}
                  reviewMode={reviewMode}
                  sectionType="SUBJECTIVE"
                />
              ) : currentSection === 'SIM' ? (
                <SimulationEnvironment 
                  question={simQuestions[currentQuestionIdx]}
                  answers={simAnswers[simQuestions[currentQuestionIdx].id] || {}}
                  onDataChange={handleSimDataChange}
                  onToggleFlag={handleToggleFlag}
                  onSkip={handleSkipQuestion}
                  isFlagged={simFlags.has(simQuestions[currentQuestionIdx].id)}
                  highlightSkipped={highlightSkipped}
                />
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center bg-gray-50 p-12 text-center space-y-6">
                  <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-[#3A58EF]">
                    <Video size={48} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-[#1e293b]">AI Video Interview</h2>
                    <p className="text-[#64748b] max-w-md">The AI Video Interview environment is currently being finalized. Please click "Submit Test" to complete your assessment.</p>
                  </div>
                </div>
              )}
            </div>
            
            <Footer 
              step={2} 
              onNext={handleNext} 
              onPrevious={handlePrevious} 
              onSubmit={handleSubmitAttempt} 
              isLastQuestion={
                currentSection === 'VIDEO' || 
                currentQuestionIdx === (
                  currentSection === 'MCQ' ? mcqQuestions.length - 1 : 
                  currentSection === 'SIM' ? simQuestions.length - 1 :
                  currentSection === 'SUBJECTIVE' ? subjectiveQuestions.length - 1 :
                  0
                )
              } 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
