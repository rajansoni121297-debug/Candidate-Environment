
import React from 'react';

interface NavStepProps {
  number: number;
  title: string;
  bullets: React.ReactNode[];
}

const NavStep: React.FC<NavStepProps> = ({ number, title, bullets }) => (
  <div className="flex items-start space-x-6">
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#eff6ff] flex items-center justify-center">
      <span className="text-[#3b82f6] font-bold text-lg">{number}</span>
    </div>
    <div className="space-y-2 pt-1">
      <h3 className="text-[#1e293b] font-bold text-[16px]">{title}</h3>
      <ul className="space-y-2">
        {bullets.map((bullet, idx) => (
          <li key={idx} className="flex items-start space-x-2 text-[#64748b] text-[14px] leading-relaxed">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#94a3b8] flex-shrink-0" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export const NavigatingExamCard: React.FC = () => {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-sm">
      <div className="bg-[#f1f5f9] px-6 py-4 border-b border-[#e2e8f0]">
        <h2 className="text-lg font-bold text-[#334155]">Navigating the Exam</h2>
      </div>
      <div className="p-8 space-y-8">
        <NavStep 
          number={1} 
          title='Click "Start Assessment" to begin.'
          bullets={[
            <>The system will automatically verify your setup and record your acceptance of the Terms and Conditions.</>
          ]}
        />
        
        <NavStep 
          number={2} 
          title='Review the on-screen instructions carefully.'
          bullets={[
            <>Take a moment to familiarize yourself with the layout and available features before proceeding.</>
          ]}
        />

        <NavStep 
          number={3} 
          title='During the assessment.'
          bullets={[
            <>Navigate between questions using the <span className="font-bold text-[#334155]">Next</span> and <span className="font-bold text-[#334155]">Previous</span> buttons.</>,
            <>Use the <span className="font-bold text-[#334155]">Assessment Menu</span> at the top right to jump directly to any question.</>,
            <>Access the <span className="font-bold text-[#334155]">calculator tool</span> for required calculations. Please use <span className="font-bold text-[#334155]">only the internal calculator provided</span> for accuracy and compliance.</>
          ]}
        />

        <NavStep 
          number={4} 
          title='Access help or instructions anytime.'
          bullets={[
            <>Click the <span className="font-bold text-[#334155]">information icon</span> on the top bar to revisit these guidelines without leaving the test environment.</>
          ]}
        />

        <NavStep 
          number={5} 
          title='Submit your test when ready.'
          bullets={[
            <>Click <span className="font-bold text-[#334155]">"Submit Test"</span> and confirm to finalize your responses. Review all answers before submitting, as changes cannot be made afterward.</>
          ]}
        />
      </div>
    </div>
  );
};
