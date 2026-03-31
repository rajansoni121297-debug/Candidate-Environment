
import React, { useState } from 'react';
import { X, Delete, Equal, Minus, Plus, X as Multiply, Divide } from 'lucide-react';

interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  if (!isOpen) return null;

  const handleNumber = (num: string) => {
    setDisplay(prev => (prev === '0' ? num : prev + num));
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleCalculate = () => {
    try {
      const result = eval((equation + display).replace('×', '*').replace('÷', '/'));
      setDisplay(String(result));
      setEquation('');
    } catch (e) {
      setDisplay('Error');
    }
  };

  return (
    <div className="fixed top-24 right-8 z-[60] w-72 bg-[#1e293b] rounded-2xl shadow-2xl overflow-hidden border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-200">
      <div className="flex items-center justify-between px-4 py-3 bg-[#0f172a] border-b border-slate-800">
        <span className="text-white text-xs font-bold uppercase tracking-widest">Calculator</span>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>
      
      <div className="p-4 bg-[#0f172a]">
        <div className="text-slate-400 text-right text-xs h-4 mb-1 font-mono">{equation}</div>
        <div className="text-white text-right text-3xl font-mono overflow-hidden whitespace-nowrap">{display}</div>
      </div>

      <div className="grid grid-cols-4 gap-1 p-2 bg-[#1e293b]">
        <CalcButton label="C" onClick={handleClear} className="bg-slate-700 text-red-400" />
        <CalcButton label="÷" onClick={() => handleOperator('÷')} className="bg-slate-700 text-blue-400" />
        <CalcButton label="×" onClick={() => handleOperator('×')} className="bg-slate-700 text-blue-400" />
        <CalcButton label="DEL" onClick={() => setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0')} className="bg-slate-700 text-slate-300" />
        
        {[7, 8, 9].map(n => <CalcButton key={n} label={String(n)} onClick={() => handleNumber(String(n))} />)}
        <CalcButton label="-" onClick={() => handleOperator('-')} className="bg-slate-700 text-blue-400" />
        
        {[4, 5, 6].map(n => <CalcButton key={n} label={String(n)} onClick={() => handleNumber(String(n))} />)}
        <CalcButton label="+" onClick={() => handleOperator('+')} className="bg-slate-700 text-blue-400" />
        
        {[1, 2, 3].map(n => <CalcButton key={n} label={String(n)} onClick={() => handleNumber(String(n))} />)}
        <CalcButton label="=" onClick={handleCalculate} className="row-span-2 bg-blue-600 text-white" />
        
        <CalcButton label="0" onClick={() => handleNumber('0')} className="col-span-2" />
        <CalcButton label="." onClick={() => handleNumber('.')} />
      </div>
    </div>
  );
};

const CalcButton: React.FC<{ label: string; onClick: () => void; className?: string }> = ({ label, onClick, className = '' }) => (
  <button 
    onClick={onClick}
    className={`p-4 rounded-lg font-bold text-sm transition-all active:scale-95 ${className || 'bg-slate-800 text-white hover:bg-slate-700'}`}
  >
    {label}
  </button>
);
