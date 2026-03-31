
import React, { useState, useEffect } from 'react';
import { Camera, Mic, Monitor, UserCheck, ShieldCheck, AlertCircle } from 'lucide-react';

interface ProctoringVerificationProps {
  onComplete: () => void;
}

export const ProctoringVerification: React.FC<ProctoringVerificationProps> = ({ onComplete }) => {
  const [steps, setSteps] = useState([
    { id: 'camera', label: 'Camera Access', status: 'pending', icon: <Camera size={20} /> },
    { id: 'mic', label: 'Microphone Access', status: 'pending', icon: <Mic size={20} /> },
    { id: 'screen', label: 'Screen Sharing', status: 'pending', icon: <Monitor size={20} /> },
    { id: 'identity', label: 'Identity Verification', status: 'pending', icon: <UserCheck size={20} /> },
  ]);

  const [isVerifying, setIsVerifying] = useState(false);

  const startVerification = () => {
    setIsVerifying(true);
    let currentStep = 0;
    
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setSteps(prev => prev.map((s, i) => i === currentStep ? { ...s, status: 'success' } : s));
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 600);
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center bg-gray-50 p-8">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-[#3A58EF] p-8 text-white text-center space-y-2">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-black">Proctoring Verification</h2>
          <p className="text-blue-100">Please complete the following checks to ensure a secure assessment environment.</p>
        </div>

        <div className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((step) => (
              <div 
                key={step.id}
                className={`flex items-center space-x-4 p-5 rounded-2xl border-2 transition-all ${
                  step.status === 'success' 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-gray-50 border-gray-100 text-gray-500'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  step.status === 'success' ? 'bg-green-500 text-white' : 'bg-white text-gray-400 shadow-sm'
                }`}>
                  {step.icon}
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-sm">{step.label}</p>
                  <p className="text-[10px] uppercase tracking-wider font-black opacity-60">
                    {step.status === 'success' ? 'Verified' : 'Pending'}
                  </p>
                </div>
                {step.status === 'success' && <ShieldCheck size={18} />}
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex items-start space-x-4">
            <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
            <p className="text-sm text-amber-800 leading-relaxed">
              By proceeding, you agree to be monitored throughout the assessment. Any suspicious activity may lead to disqualification.
            </p>
          </div>

          <button 
            onClick={startVerification}
            disabled={isVerifying}
            className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-lg ${
              isVerifying 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-[#3A58EF] text-white hover:bg-[#2d46cc] shadow-blue-200 active:scale-[0.98]'
            }`}
          >
            {isVerifying ? 'Verifying System...' : 'Start Verification'}
          </button>
        </div>
      </div>
    </div>
  );
};
