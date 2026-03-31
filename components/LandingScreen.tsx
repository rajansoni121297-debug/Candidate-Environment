import React from 'react';
import { AssessmentSection } from '../types';
import { CheckCircle2, Clock, ShieldCheck, Video, FileText, Layout, Info, ChevronRight, Monitor, Wifi, User, Home, Smartphone, HelpCircle } from 'lucide-react';

interface LandingScreenProps {
  activeSection: AssessmentSection;
  completedSections: Set<AssessmentSection>;
  onStart: () => void;
  timeLeft: number;
  subStep: number;
  onNextSubStep: () => void;
  onPrevSubStep: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ 
  activeSection, 
  completedSections, 
  onStart,
  timeLeft,
  subStep,
  onNextSubStep,
  onPrevSubStep
}) => {
  const sections = [
    { id: 'MCQ' as AssessmentSection, label: 'MCQ', icon: <FileText size={18} /> },
    { id: 'SIM' as AssessmentSection, label: 'SIM', icon: <Layout size={18} /> },
    { id: 'SUBJECTIVE' as AssessmentSection, label: 'Subjective', icon: <FileText size={18} /> },
    { id: 'VIDEO' as AssessmentSection, label: 'AI Video', icon: <Video size={18} /> },
  ];

  const getSectionTitle = (id: AssessmentSection) => {
    switch (id) {
      case 'MCQ': return 'MCQ';
      case 'SIM': return 'Simulation';
      case 'SUBJECTIVE': return 'Subjective';
      case 'VIDEO': return 'AI Video Interview';
    }
  };

  const instructionPoints = [
    { icon: <Monitor className="text-blue-600" size={20} />, text: 'Use a desktop or laptop; mobile devices and tablets are not supported.' },
    { icon: <Wifi className="text-blue-600" size={20} />, text: 'Ensure your internet connection is stable.' },
    { icon: <User className="text-blue-600" size={20} />, text: 'Ensure your webcam and microphone stay active and functioning throughout the assessment.' },
    { icon: <Home className="text-blue-600" size={20} />, text: 'Sit alone in a quiet, well-lit room with no interruptions.' },
    { icon: <Smartphone className="text-blue-600" size={20} />, text: 'Ensure your desk is completely clear. Use of mobile phones or any other reference items is strictly prohibited.' },
  ];

  const navigationPoints = [
    { id: 1, title: 'Click "Start Assessment" to begin.', text: 'The system will automatically verify your setup and record your acceptance of the Terms and Conditions.' },
    { id: 2, title: 'Review the on-screen instructions carefully.', text: 'Take a moment to familiarize yourself with the layout and available features before proceeding.' },
    { id: 3, title: 'During the assessment.', text: 'Navigate between questions using the Next and Previous buttons. Use the Assessment Menu at the top right to jump directly to any question. Access the calculator tool for required calculations. Please use only the internal calculator provided for accuracy and compliance.' },
    { id: 4, title: 'Access help or instructions anytime.', text: 'Click the information icon on the top bar to revisit these guidelines without leaving the test environment.' },
    { id: 5, title: 'Submit your test when ready.', text: 'Click "Submit Test" and confirm to finalize your responses. Review all answers before submitting, as changes cannot be made afterward.' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-white px-10 py-6 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-sm rotate-45 transform origin-center" />
          </div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Tax Concepts</h1>
        </div>
        <div className="flex items-center space-x-6">
          <button className="text-[#3A58EF] font-bold text-sm hover:underline">Evaluation Criteria</button>
          <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
            <Clock size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Assessment Duration : <span className="font-bold text-[#1e293b]">40 min</span></span>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-10 space-y-8">
        {/* Stepper */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Assessment Progress</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3A58EF]">
              Step {completedSections.size + 1} of 4
            </span>
          </div>
          <div className="flex items-center justify-between relative">
            {/* Background Line */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0 rounded-full" />
            
            {/* Active Progress Line */}
            <div 
              className="absolute top-5 left-0 h-1 bg-[#3A58EF] -translate-y-1/2 z-0 transition-all duration-500 rounded-full" 
              style={{ 
                width: `${(completedSections.size / (sections.length - 1)) * 100}%` 
              }} 
            />

            {sections.map((s, i) => {
              const isCompleted = completedSections.has(s.id);
              const isActive = activeSection === s.id;
              
              return (
                <div key={s.id} className="relative z-10 flex flex-col items-center group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-green-500 border-green-100 text-white' 
                      : isActive 
                        ? 'bg-white border-[#3A58EF] text-[#3A58EF] ring-4 ring-blue-50' 
                        : 'bg-white border-gray-200 text-gray-400'
                  }`}>
                    {isCompleted ? <CheckCircle2 size={20} /> : <span className="font-bold text-sm">{i + 1}</span>}
                  </div>
                  <div className="absolute top-12 whitespace-nowrap flex flex-col items-center">
                    <span className={`text-[11px] font-black uppercase tracking-wider transition-colors ${
                      isActive ? 'text-[#3A58EF]' : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {getSectionTitle(s.id)}
                    </span>
                    {isActive && (
                      <span className="text-[9px] font-bold text-blue-400 animate-pulse">In Progress</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Card */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-10 py-5 border-b border-gray-100">
            <h2 className="text-xl font-bold text-[#1e293b]">
              {subStep === 0 ? 'Assessment Instructions' : 'Navigating the Exam'}
            </h2>
          </div>
          
          <div className="p-10">
            {subStep === 0 ? (
              <div className="space-y-6">
                {instructionPoints.map((point, i) => (
                  <div key={i} className="flex items-center space-x-6">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      {point.icon}
                    </div>
                    <span className="text-[#334155] font-medium">{point.text}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                {navigationPoints.map((point) => (
                  <div key={point.id} className="flex items-start space-x-6">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 text-[#3A58EF] font-bold">
                      {point.id}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-[#1e293b]">{point.title}</h4>
                      <p className="text-sm text-[#64748b] leading-relaxed">{point.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Table */}
          <div className="px-10 pb-10">
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold text-gray-600">Sections</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-600">
                      <div className="flex items-center space-x-1">
                        <span>No. Of Questions</span>
                        <HelpCircle size={14} className="text-gray-400" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left font-bold text-gray-600">Total Marks</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-600">Sample Questions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-6 py-5 font-medium text-gray-700">
                      <div className="flex items-center space-x-2">
                        {getSectionTitle(activeSection)}
                      </div>
                    </td>
                    <td className="px-6 py-5 font-medium text-gray-700">
                      {activeSection === 'MCQ' ? '20' : activeSection === 'SIM' ? '5' : activeSection === 'SUBJECTIVE' ? '20' : '1'}
                    </td>
                    <td className="px-6 py-5 font-medium text-gray-700">
                      {activeSection === 'MCQ' ? '20' : activeSection === 'SIM' ? '50' : activeSection === 'SUBJECTIVE' ? '20' : '10'}
                    </td>
                    <td className="px-6 py-5">
                      <button className="text-[#3A58EF] font-bold hover:underline">View</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Warning Box */}
          <div className="px-10 pb-10">
            <div className="bg-amber-50 border-l-4 border-amber-400 p-6 flex items-start space-x-4 rounded-r-2xl">
              <Info className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-amber-800 leading-relaxed font-medium">
                In the event of a system failure, you may resume the assessment; however, please be aware that the timer will continue running and will not pause during the interruption.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white px-10 py-6 border-t border-gray-100 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          By clicking on start assessment, you agree to our Terms & Conditions, <button className="text-[#3A58EF] hover:underline">click here</button> to read more about it.
        </p>
        <div className="flex items-center space-x-4">
          <button 
            onClick={onPrevSubStep}
            disabled={subStep === 0}
            className={`px-8 py-3 rounded-lg font-bold text-sm transition-all ${
              subStep === 0 ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : 'bg-blue-50 text-[#3A58EF] hover:bg-blue-100'
            }`}
          >
            Previous
          </button>
          <button 
            onClick={subStep === 0 ? onNextSubStep : onStart}
            className="px-10 py-3 bg-[#3A58EF] text-white font-bold rounded-lg hover:bg-[#2d46cc] transition-all shadow-md active:scale-[0.98]"
          >
            {subStep === 0 ? 'Next' : 'Start Assessment'}
          </button>
        </div>
      </div>
    </div>
  );
};
