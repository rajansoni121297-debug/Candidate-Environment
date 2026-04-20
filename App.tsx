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
import { AssessmentSection, FlowStep, MCQQuestion, SIMQuestion, SimulationDesign } from './types';
import { ChevronDown, Zap } from 'lucide-react';

export type ReviewMode = 'none' | 'skipped' | 'flagged';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<AssessmentSection>('MCQ');
  const [flowStep, setFlowStep] = useState<FlowStep>('LANDING');
  const [completedSections, setCompletedSections] = useState<Set<AssessmentSection>>(new Set());
  
  const [timeLeft, setTimeLeft] = useState(2400); // 40 minutes
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
  const simDesign: SimulationDesign = 'Design2';

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
        'What is the normal balance of an asset account, and how does it change when a company records a transaction that involves both an increase in cash and a decrease in accounts receivable?',
        'Which financial statement reports assets, liabilities, and equity at a specific point in time?',
        'Under the accrual basis of accounting, when is revenue recognized, and what are the specific criteria that must be met before a company can record revenue in its financial statements according to GAAP?',
        'What is the accounting equation?',
        'Which of the following is an intangible asset, and what are the typical characteristics that distinguish intangible assets from tangible assets like property, plant, and equipment on a balance sheet?',
        'What is the primary purpose of the General Ledger?',
        'Which account is increased by a credit entry, and what is the underlying logic of the double-entry accounting system that requires every transaction to have equal debits and credits?',
        'What does GAAP stand for?',
        'Which of these is a contra-asset account, and how does its balance affect the carrying value of the related asset account on the balance sheet, such as accumulated depreciation and equipment?',
        'A trial balance is primarily used to verify that the total debits equal total credits.',
        'What is the impact of a net loss on Retained Earnings, and how does this flow through the statement of stockholders\' equity to affect the final balance of equity at the end of the period?',
        'Which method of depreciation results in higher initial expenses?',
        'What is a current liability, and how does it differ from a long-term liability in terms of the expected timeframe for settlement and the impact on a company\'s liquidity and working capital?',
        'Inventory turnover ratio measures how many times a company sells and replaces its inventory.',
        'What is the definition of "working capital", and why is it considered a critical measure of a company\'s short-term financial health and its ability to meet its upcoming obligations as they fall due?',
        'Who is responsible for setting US accounting standards?',
        'Which account would not appear on a post-closing trial balance, and what is the purpose of the closing process in resetting temporary accounts for the start of the next accounting period?',
        'The matching principle requires that expenses be recognized in the same period as the revenues they helped to generate.',
        'What is the effect of purchasing equipment for cash on the total assets of a company, and how does this transaction illustrate the fundamental principle that the accounting equation must always remain in balance?',
        'Which of the following is a fixed cost?'
      ][i] || `MCQ Question ${i + 1}`,
      options: [
        [
          { label: 'A', text: 'Debit balance; it increases with a debit and decreases with a credit, resulting in no net change to total assets when cash increases and receivables decrease by the same amount.' },
          { label: 'B', text: 'Credit balance; it increases with a credit and decreases with a debit, which is the opposite of how liability and equity accounts typically behave in a standard ledger.' },
          { label: 'C', text: 'Debit balance; however, the transaction described would actually result in a net increase in total assets because cash is considered a more liquid asset than accounts receivable.' },
          { label: 'D', text: 'None of the above statements accurately describe the normal balance or the impact of the transaction on the company\'s financial position at the end of the period.' }
        ],
        [
          { label: 'A', text: 'Balance Sheet: A comprehensive financial statement that reports a company\'s assets, liabilities, and shareholders\' equity at a specific point in time, providing a snapshot of the company\'s financial position.' },
          { label: 'B', text: 'Income Statement: A financial report that summarizes a company\'s revenues, expenses, and profits or losses over a specific period of time, such as a month, quarter, or fiscal year.' },
          { label: 'C', text: 'Statement of Cash Flows: A financial statement that provides aggregate data regarding all cash inflows a company receives from its ongoing operations and external investment sources.' },
          { label: 'D', text: 'Statement of Retained Earnings: A financial statement that outlines the changes in retained earnings for a specified period, including net income and dividends paid to shareholders.' }
        ],
        [
          { label: 'A', text: 'Revenue is recognized only when cash is received from the customer, regardless of when the goods were delivered or the services were actually performed by the company.' },
          { label: 'B', text: 'Revenue is recognized when it is earned and realized or realizable, which typically occurs when the performance obligation to the customer has been fully satisfied.' },
          { label: 'C', text: 'Revenue is recognized at the end of the fiscal year for all contracts signed during that year, provided that the total contract value exceeds a certain materiality threshold.' },
          { label: 'D', text: 'Revenue is recognized when the production process is complete, even if the goods have not yet been sold or delivered to a specific customer in the open market.' }
        ],
        [
          { label: 'A', text: 'Assets = Liabilities + Equity' },
          { label: 'B', text: 'Assets + Liabilities = Equity' },
          { label: 'C', text: 'Assets = Liabilities - Equity' },
          { label: 'D', text: 'Assets + Equity = Liabilities' }
        ],
        [
          { label: 'A', text: 'Goodwill; it represents the excess of the purchase price over the fair value of identifiable net assets acquired in a business combination and lacks physical substance.' },
          { label: 'B', text: 'Inventory; it is held for sale in the ordinary course of business and is expected to be converted into cash within one year or the operating cycle, whichever is longer.' },
          { label: 'C', text: 'Land; it is a tangible asset that is used in the production of goods and services and is not subject to depreciation because it has an indefinite useful life.' },
          { label: 'D', text: 'Accounts Receivable; it represents the amount owed to the company by its customers for goods sold or services performed on credit and is a current asset.' }
        ],
        [
          { label: 'A', text: 'To record daily transactions' },
          { label: 'B', text: 'To summarize all account balances' },
          { label: 'C', text: 'To prepare tax returns' },
          { label: 'D', text: 'To manage payroll' }
        ],
        [
          { label: 'A', text: 'Liability accounts, such as Accounts Payable or Notes Payable, which represent the company\'s obligations to external parties that must be settled in the future.' },
          { label: 'B', text: 'Asset accounts, such as Cash or Equipment, which represent the resources owned by the company that have future economic value and can be used to generate revenue.' },
          { label: 'C', text: 'Expense accounts, such as Rent Expense or Salary Expense, which represent the costs incurred by the company in the process of generating revenue during a specific period.' },
          { label: 'D', text: 'Dividend accounts, which represent the distribution of a portion of the company\'s earnings to its shareholders as a return on their investment in the business.' }
        ],
        [
          { label: 'A', text: 'Generally Accepted Accounting Principles' },
          { label: 'B', text: 'Global Accounting and Auditing Protocols' },
          { label: 'C', text: 'General Association of Accounting Professionals' },
          { label: 'D', text: 'Governmental Accounting and Analysis Procedures' }
        ],
        [
          { label: 'A', text: 'Accumulated Depreciation; it is subtracted from the cost of the related fixed asset to determine the net book value of the asset on the balance sheet at a specific date.' },
          { label: 'B', text: 'Sales Returns and Allowances; it is a contra-revenue account that is used to record the return of goods by customers and is subtracted from gross sales to arrive at net sales.' },
          { label: 'C', text: 'Allowance for Doubtful Accounts; it is a contra-asset account that reduces the gross amount of accounts receivable to the net realizable value expected to be collected.' },
          { label: 'D', text: 'Treasury Stock; it represents the cost of shares that the company has repurchased from the open market and is reported as a reduction of total stockholders\' equity.' }
        ],
        [
          { label: 'A', text: 'Check arithmetic accuracy' },
          { label: 'B', text: 'Detect all errors' },
          { label: 'C', text: 'Prepare financial statements' },
          { label: 'D', text: 'Close the books' }
        ],
        [
          { label: 'A', text: 'It decreases Retained Earnings, which in turn reduces the total stockholders\' equity reported on the balance sheet at the end of the accounting period.' },
          { label: 'B', text: 'It increases Retained Earnings because a net loss is considered a non-cash expense that does not actually affect the company\'s ability to pay dividends to shareholders.' },
          { label: 'C', text: 'It has no effect on Retained Earnings because net income or loss is only reported on the income statement and is not transferred to the balance sheet accounts.' },
          { label: 'D', text: 'It is reported as a separate line item in the liabilities section of the balance sheet because the company now owes this amount to its creditors and suppliers.' }
        ],
        [
          { label: 'A', text: 'Straight-line' },
          { label: 'B', text: 'Double-declining balance' },
          { label: 'C', text: 'Units-of-production' },
          { label: 'D', text: 'Sum-of-the-years\'-digits' }
        ],
        [
          { label: 'A', text: 'An obligation due within one year or the operating cycle, such as Accounts Payable, which requires the use of current assets or the creation of other current liabilities for settlement.' },
          { label: 'B', text: 'A long-term debt that is not due for at least five years, such as a mortgage payable on a factory building, and is classified as a non-current liability on the balance sheet.' },
          { label: 'C', text: 'A contingent liability that may or may not occur depending on the outcome of a future event, such as a pending lawsuit, and is only disclosed in the notes to the financial statements.' },
          { label: 'D', text: 'An equity instrument that represents an ownership interest in the company, such as preferred stock, and entitles the holder to a fixed dividend payment before common shareholders.' }
        ],
        [
          { label: 'A', text: 'Sales efficiency' },
          { label: 'B', text: 'Profit margin' },
          { label: 'C', text: 'Debt level' },
          { label: 'D', text: 'Asset growth' }
        ],
        [
          { label: 'A', text: 'The difference between current assets and current liabilities, representing the liquid resources available to fund day-to-day operations and meet short-term debt obligations.' },
          { label: 'B', text: 'The total amount of cash and cash equivalents held by the company in its bank accounts, which is used to pay for all expenses and investments as they arise.' },
          { label: 'C', text: 'The total value of all long-term assets minus all long-term liabilities, which represents the company\'s net investment in its productive capacity and infrastructure.' },
          { label: 'D', text: 'The amount of net income earned by the company during a specific period that has not been distributed to shareholders as dividends and is reinvested in the business.' }
        ],
        [
          { label: 'A', text: 'FASB' },
          { label: 'B', text: 'IRS' },
          { label: 'C', text: 'AICPA' },
          { label: 'D', text: 'IASB' }
        ],
        [
          { label: 'A', text: 'Service Revenue; it is a temporary account that is closed at the end of the period to Retained Earnings, so its balance is zero when the next period begins.' },
          { label: 'B', text: 'Cash; it is a permanent asset account that carries its balance forward to the next period and is never closed as part of the year-end accounting procedures.' },
          { label: 'C', text: 'Accounts Payable; it is a permanent liability account that represents an ongoing obligation of the company and remains on the books until it is paid or otherwise settled.' },
          { label: 'D', text: 'Common Stock; it is a permanent equity account that represents the initial investment by shareholders and is not affected by the closing of temporary revenue and expense accounts.' }
        ],
        [
          { label: 'A', text: 'Revenue recognition' },
          { label: 'B', text: 'Expense recognition' },
          { label: 'C', text: 'Asset valuation' },
          { label: 'D', text: 'Liability accrual' }
        ],
        [
          { label: 'A', text: 'Total assets remain unchanged because one asset (Cash) decreases while another asset (Equipment) increases by the exact same amount, maintaining the balance of the equation.' },
          { label: 'B', text: 'Total assets increase because the company has acquired a new piece of equipment that has future economic value and will be used to generate revenue in future periods.' },
          { label: 'C', text: 'Total assets decrease because the company has spent cash, which is its most liquid resource, and has replaced it with a less liquid asset that will take longer to convert back to cash.' },
          { label: 'D', text: 'Total liabilities increase because the company now has an obligation to maintain and operate the new equipment, which will result in future cash outflows for repairs and maintenance.' }
        ],
        [
          { label: 'A', text: 'Rent' },
          { label: 'B', text: 'Materials' },
          { label: 'C', text: 'Direct labor' },
          { label: 'D', text: 'Shipping' }
        ]
      ][i] || [
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
                question: "Based on the provided financial data for Tony and TC Designs, \nwhat are the specific items that will increase Tony's basis in the partnership for the 2024 tax year? \nPlease consider all forms of income and any relevant adjustments that must be made \naccording to the current tax code for partnerships.",
                options: [
                  { label: 'A', text: 'Ordinary business income of $40,000 and tax-exempt interest income of $2,000, \nresulting in a total increase of $21,000 for Tony\'s 50% share.' },
                  { label: 'B', text: 'Only the ordinary business income of $40,000, as tax-exempt interest is not considered \nfor basis adjustments in a standard partnership agreement.' },
                  { label: 'C', text: 'The total distributions to Tony of $10,000 plus his share of ordinary business income, \nwhich would be a total of $30,000.' },
                  { label: 'D', text: 'None of the above options correctly identify the items that increase Tony\'s basis \naccording to the specific rules governing partnership taxation.' }
                ]
              },
              { 
                id: 'q2.2', 
                no: 'Q2.2', 
                question: "What items decrease Tony's basis? Answer in amount. \nPlease specify the total amount of distributions and non-deductible expenses \nthat Tony should account for in his basis calculation.",
                options: [
                  { label: 'A', text: 'Distributions to Tony of $10,000 and his share of non-deductible expenses of $500, \nresulting in a total decrease of $10,500.' },
                  { label: 'B', text: 'Only the distributions to Tony of $10,000, as non-deductible expenses \ndo not affect the basis of a partner in a partnership.' },
                  { label: 'C', text: 'The total non-deductible expenses of $1,000 plus the distributions, \nwhich would be a total of $11,000.' },
                  { label: 'D', text: 'None of the above options correctly identify the items that decrease Tony\'s basis.' }
                ]
              },
              { 
                id: 'q2.3', 
                no: 'Q2.3', 
                question: "What is Tony's ending basis at the end of the 2024 tax year? \nPlease calculate the final basis after considering all increases and decreases \nthat occurred during the period.",
                options: [
                  { label: 'A', text: '$40,500' },
                  { label: 'B', text: '$30,000' },
                  { label: 'C', text: '$41,000' },
                  { label: 'D', text: '$39,500' }
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
      return {
        id: 301 + i,
        text: [
          'What items increase Rachel\'s basis in her partnership interest, and how do these adjustments ensure that the partnership\'s income is only taxed once at the partner level according to the principles of flow-through taxation?',
          'Explain the fundamental difference between accounts receivable and accounts payable, and describe how an imbalance between these two accounts can affect a company\'s overall cash flow and its ability to meet short-term obligations.',
          'What is the primary purpose of performing a bank reconciliation at the end of each month, and what are some common reconciling items that might cause a difference between the bank balance and the company\'s book balance?',
          'Describe the concept of double-entry bookkeeping in detail, and explain how the requirement that debits must always equal credits helps to maintain the integrity of the accounting equation and prevent errors in financial reporting.',
          'What are the key components of a balance sheet, and how does the classification of assets and liabilities into current and non-current categories provide valuable information to investors and creditors about a company\'s financial position?'
        ][i] || `Subjective Question ${i + 1}`
      };
    });
  }, []);

  const handleStartSection = () => {
    setReviewMode('none');
    if (completedSections.size === 0) {
      setFlowStep('PROCTORING');
    } else {
      setFlowStep('ASSESSMENT');
      setCurrentQuestionIdx(0);
    }
  };

  const handleQuickJump = (section: AssessmentSection) => {
    setCurrentSection(section);
    setFlowStep('LANDING');
    setLandingSubStep(0);
    setCurrentQuestionIdx(0);
    setReviewMode('none');
    
    // For demo purposes, we might want to mark previous sections as completed
    const sections: AssessmentSection[] = ['MCQ', 'SIM', 'SUBJECTIVE', 'VIDEO'];
    const sectionIndex = sections.indexOf(section);
    const newCompleted = new Set<AssessmentSection>();
    for (let i = 0; i < sectionIndex; i++) {
      newCompleted.add(sections[i]);
    }
    setCompletedSections(newCompleted);
  };

  const handleProctoringComplete = () => {
    setIsTimerStarted(true);
    setFlowStep('ASSESSMENT');
    setCurrentQuestionIdx(0);
  };

  const handleNext = () => {
    const questions = currentSection === 'MCQ' ? mcqQuestions : (currentSection === 'SIM' ? simQuestions : (currentSection === 'SUBJECTIVE' ? subjectiveQuestions : []));
    const answers = currentSection === 'MCQ' ? mcqAnswers : (currentSection === 'SIM' ? simAnswers : subjectiveAnswers);
    const currentQ = questions[currentQuestionIdx];
    
    const isAnswered = (ans: any) => {
      if (!ans) return false;
      if (typeof ans === 'string') return ans.trim() !== '';
      return isSimQuestionAnswered(currentQ.id);
    };

    if (!isAnswered(answers[currentQ.id])) {
      if (currentSection === 'MCQ') setMcqSkipped(prev => new Set(prev).add(currentQ.id));
      else if (currentSection === 'SIM') setSimSkipped(prev => new Set(prev).add(currentQ.id));
      else if (currentSection === 'SUBJECTIVE') setSubjectiveSkipped(prev => new Set(prev).add(currentQ.id));
    }

    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    }
  };

  const handlePrevious = () => {
    const questions = currentSection === 'MCQ' ? mcqQuestions : (currentSection === 'SIM' ? simQuestions : (currentSection === 'SUBJECTIVE' ? subjectiveQuestions : []));
    const answers = currentSection === 'MCQ' ? mcqAnswers : (currentSection === 'SIM' ? simAnswers : subjectiveAnswers);
    const currentQ = questions[currentQuestionIdx];
    
    const isAnswered = (ans: any) => {
      if (!ans) return false;
      if (typeof ans === 'string') return ans.trim() !== '';
      return isSimQuestionAnswered(currentQ.id);
    };

    if (!isAnswered(answers[currentQ.id])) {
      if (currentSection === 'MCQ') setMcqSkipped(prev => new Set(prev).add(currentQ.id));
      else if (currentSection === 'SIM') setSimSkipped(prev => new Set(prev).add(currentQ.id));
      else if (currentSection === 'SUBJECTIVE') setSubjectiveSkipped(prev => new Set(prev).add(currentQ.id));
    }

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
    setReviewMode('none');
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

  const handleJumpToQuestion = (idx: number) => {
    const questions = currentSection === 'MCQ' ? mcqQuestions : (currentSection === 'SIM' ? simQuestions : (currentSection === 'SUBJECTIVE' ? subjectiveQuestions : []));
    const answers = currentSection === 'MCQ' ? mcqAnswers : (currentSection === 'SIM' ? simAnswers : subjectiveAnswers);
    const currentQ = questions[currentQuestionIdx];
    
    const isAnswered = (ans: any) => {
      if (!ans) return false;
      if (typeof ans === 'string') return ans.trim() !== '';
      return isSimQuestionAnswered(currentQ.id);
    };

    if (!isAnswered(answers[currentQ.id])) {
      if (currentSection === 'MCQ') setMcqSkipped(prev => new Set(prev).add(currentQ.id));
      else if (currentSection === 'SIM') setSimSkipped(prev => new Set(prev).add(currentQ.id));
      else if (currentSection === 'SUBJECTIVE') setSubjectiveSkipped(prev => new Set(prev).add(currentQ.id));
    }

    setCurrentQuestionIdx(idx);
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
      <div className="min-h-screen bg-white flex flex-col items-center p-4 md:p-6 overflow-y-auto">
        <div className="w-full max-w-5xl">
          <ResultsView />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-8 relative">
      {/* Demo Quick Jump Dropdown */}
      <div className="fixed top-6 left-6 z-[100] group">
        <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-all cursor-pointer">
          <Zap size={16} className="text-amber-500 fill-amber-500" />
          <span className="text-xs font-black text-gray-700 uppercase tracking-wider">Quick Jump</span>
          <ChevronDown size={14} className="text-gray-400 group-hover:rotate-180 transition-transform duration-300" />
        </div>
        
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          {[
            { id: 'MCQ', label: 'MCQ Section' },
            { id: 'SIM', label: 'Simulation Section' },
            { id: 'SUBJECTIVE', label: 'Subjective Section' },
            { id: 'VIDEO', label: 'AI Video Interview' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleQuickJump(item.id as AssessmentSection)}
              className={`w-full text-left px-5 py-3 text-sm font-bold transition-colors hover:bg-blue-50 ${currentSection === item.id ? 'text-[#3A58EF] bg-blue-50/50' : 'text-gray-600'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <FeedbackStepper 
        mode={feedbackFlow} 
        onStart={startFeedbackStepper}
        onCancel={completeFlowAndShowResults}
        onComplete={completeFlowAndShowResults}
      />

<div className="w-full max-w-6xl bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[92vh]">
        {flowStep === 'LANDING' ? (
          <LandingScreen
            activeSection={currentSection}
            completedSections={completedSections}
            onStart={handleStartSection}
            timeLeft={timeLeft}
            isTimerStarted={isTimerStarted}
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
              title="Tax Concepts"
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
              onClose={() => {
                setShowSubmitModal(false);
                setReviewMode('none');
              }}
              onConfirm={handleFinalSubmit}
              onReviewSkipped={() => {
                setShowSubmitModal(false);
                setReviewMode('skipped');
                if (currentSection === 'MCQ') {
                  const unansweredIds = mcqQuestions.filter(q => !mcqAnswers[q.id]).map(q => q.id);
                  setMcqSkipped(prev => new Set([...prev, ...unansweredIds]));
                  const firstSkipped = mcqQuestions.find(q => !mcqAnswers[q.id]);
                  if (firstSkipped) setCurrentQuestionIdx(mcqQuestions.indexOf(firstSkipped));
                } else if (currentSection === 'SIM') {
                  const unansweredIds = simQuestions.filter(q => !isSimQuestionAnswered(q.id)).map(q => q.id);
                  setSimSkipped(prev => new Set([...prev, ...unansweredIds]));
                  const firstSkipped = simQuestions.find(q => !isSimQuestionAnswered(q.id));
                  if (firstSkipped) setCurrentQuestionIdx(simQuestions.indexOf(firstSkipped));
                } else if (currentSection === 'SUBJECTIVE') {
                  const unansweredIds = subjectiveQuestions.filter(q => !subjectiveAnswers[q.id]).map(q => q.id);
                  setSubjectiveSkipped(prev => new Set([...prev, ...unansweredIds]));
                  const firstSkipped = subjectiveQuestions.find(q => !subjectiveAnswers[q.id]);
                  if (firstSkipped) setCurrentQuestionIdx(subjectiveQuestions.indexOf(firstSkipped));
                }
              }}
              onReviewFlagged={() => {
                setShowSubmitModal(false);
                setReviewMode('flagged');
                if (currentSection === 'MCQ') {
                  const firstFlagged = mcqQuestions.find(q => mcqFlags.has(q.id));
                  if (firstFlagged) setCurrentQuestionIdx(mcqQuestions.indexOf(firstFlagged));
                } else if (currentSection === 'SIM') {
                  const firstFlagged = simQuestions.find(q => simFlags.has(q.id));
                  if (firstFlagged) setCurrentQuestionIdx(simQuestions.indexOf(firstFlagged));
                } else if (currentSection === 'SUBJECTIVE') {
                  const firstFlagged = subjectiveQuestions.find(q => subjectiveFlags.has(q.id));
                  if (firstFlagged) setCurrentQuestionIdx(subjectiveQuestions.indexOf(firstFlagged));
                }
              }}
              skippedCount={currentSection === 'MCQ' 
                ? mcqQuestions.length - Object.keys(mcqAnswers).length 
                : (currentSection === 'SIM' 
                    ? simQuestions.filter(q => !isSimQuestionAnswered(q.id)).length
                    : subjectiveQuestions.length - Object.keys(subjectiveAnswers).length)
              }
              flaggedCount={currentSection === 'MCQ' ? mcqFlags.size : (currentSection === 'SIM' ? simFlags.size : subjectiveFlags.size)}
              skippedQuestions={currentSection === 'MCQ' 
                ? mcqQuestions.filter(q => !mcqAnswers[q.id]).map((_, i) => i + 1)
                : (currentSection === 'SIM'
                    ? simQuestions.filter(q => !isSimQuestionAnswered(q.id)).map((_, i) => i + 1)
                    : subjectiveQuestions.filter(q => !subjectiveAnswers[q.id]).map((_, i) => i + 1))
              }
              onJumpToQuestion={(idx) => {
                if (currentSection === 'MCQ') {
                  const unansweredIds = mcqQuestions.filter(q => !mcqAnswers[q.id]).map(q => q.id);
                  setMcqSkipped(prev => new Set([...prev, ...unansweredIds]));
                } else if (currentSection === 'SIM') {
                  const unansweredIds = simQuestions.filter(q => !isSimQuestionAnswered(q.id)).map(q => q.id);
                  setSimSkipped(prev => new Set([...prev, ...unansweredIds]));
                } else if (currentSection === 'SUBJECTIVE') {
                  const unansweredIds = subjectiveQuestions.filter(q => !subjectiveAnswers[q.id]).map(q => q.id);
                  setSubjectiveSkipped(prev => new Set([...prev, ...unansweredIds]));
                }
                handleJumpToQuestion(idx);
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
                onJumpToQuestion={handleJumpToQuestion}
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
                  onJumpToQuestion={handleJumpToQuestion}
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
                  onJumpToQuestion={handleJumpToQuestion}
                  reviewMode={reviewMode}
                  sectionType="SUBJECTIVE"
                />
              ) : currentSection === 'SIM' ? (
                <SimulationEnvironment 
                  question={simQuestions[currentQuestionIdx]}
                  answers={simAnswers[simQuestions[currentQuestionIdx].id] || {}}
                  onDataChange={handleSimDataChange}
                  onToggleFlag={handleToggleFlag}
                  isFlagged={simFlags.has(simQuestions[currentQuestionIdx].id)}
                  highlightSkipped={highlightSkipped}
                  reviewMode={reviewMode}
                  design={simDesign}
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
