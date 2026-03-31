import React, { useState, useRef, useEffect } from 'react';
import { 
  Maximize2, 
  Paperclip, 
  Flag, 
  ZoomIn, 
  ZoomOut, 
  Eye, 
  ArrowUpRight,
  X
} from 'lucide-react';
import { SIMQuestion, SIMTask, SIMSubQuestion } from '../types';
import { AttachmentPopup } from './AttachmentPopup';

interface SelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionText: string;
  options: { label: string; text: string }[];
  currentSelection?: string;
  onSelect: (text: string) => void;
}

const SelectionModal: React.FC<SelectionModalProps> = ({ 
  isOpen, 
  onClose, 
  questionText, 
  options, 
  currentSelection, 
  onSelect 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1e293b]/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#1e293b]">Select Your Answer</h2>
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

interface SimulationEnvironmentProps {
  question: SIMQuestion;
  answers: Record<string, Record<string, string>>;
  onDataChange: (taskId: string, cellId: string, value: string) => void;
  onToggleFlag: (qId: number) => void;
  onSkip?: (qId: number) => void;
  isFlagged: boolean;
  highlightSkipped?: boolean;
}

export const SimulationEnvironment: React.FC<SimulationEnvironmentProps> = ({
  question,
  answers,
  onDataChange,
  onToggleFlag,
  onSkip,
  isFlagged,
  highlightSkipped: externalHighlightSkipped
}) => {
  const [activeTaskId, setActiveTaskId] = useState(question.tasks[0].id);
  const [zoom, setZoom] = useState(100);
  const [activeCell, setActiveCell] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [internalHighlightSkipped, setInternalHighlightSkipped] = useState(false);
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const [selectedSubQuestion, setSelectedSubQuestion] = useState<SIMSubQuestion | null>(null);
  
  const gridRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeTask = question.tasks.find(t => t.id === activeTaskId) || question.tasks[0];
  const currentTaskAnswers = answers[activeTaskId] || {};

  // Reset active task and cell when question changes
  useEffect(() => {
    setActiveTaskId(question.tasks[0].id);
    setActiveCell(null);
    setEditingValue('');
    setSelectedSubQuestion(null);
  }, [question.id]);

  const highlightSkipped = externalHighlightSkipped || internalHighlightSkipped;

  const cols = Array.from({ length: 20 }, (_, i) => String.fromCharCode(65 + i));
  const rows = Array.from({ length: 40 }, (_, i) => i + 1);

  const handleCellClick = (cellId: string) => {
    setActiveCell(cellId);
    setEditingValue(currentTaskAnswers[cellId] || '');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingValue(e.target.value);
  };

  const handleInputBlur = () => {
    if (activeCell) {
      onDataChange(activeTaskId, activeCell, editingValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
      const col = activeCell?.match(/[A-Z]+/)?.[0];
      const row = parseInt(activeCell?.match(/\d+/)?.[0] || '0');
      if (col && row < rows.length) {
        handleCellClick(`${col}${row + 1}`);
      }
    } else if (e.key === 'Escape') {
      setActiveCell(null);
    }
  };

  const handleFitToScreen = () => {
    setZoom(80); // Simple fit to screen
  };

  const handleOverview = () => {
    handleFitToScreen();
    setInternalHighlightSkipped(true);
    setTimeout(() => setInternalHighlightSkipped(false), 3000);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));

  // Auto-scroll to active cell when zooming
  useEffect(() => {
    if (activeCell && gridRef.current) {
      const cell = document.getElementById(`cell-${activeCell}`);
      if (cell) {
        cell.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
    }
  }, [zoom, activeCell]);

  const renderFormulaBar = () => (
    <div className="flex items-center border-b border-gray-200 bg-white flex-none">
      <div className="w-16 px-3 py-2 text-center text-xs font-mono text-gray-500 border-r border-gray-200 bg-gray-50 font-bold">
        {activeCell || ''}
      </div>
      <div className="px-4 py-2 font-serif italic text-[#217346] text-sm border-r border-gray-200 bg-gray-50 select-none">
        fx
      </div>
      <div className="flex-grow">
        <input 
          ref={inputRef}
          type="text"
          className="w-full px-4 py-2 text-sm focus:outline-none font-sans text-gray-800"
          value={editingValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder="Enter value or formula"
        />
      </div>
    </div>
  );

  const renderSpreadsheetGrid = () => (
    <div className="bg-white" style={{ minWidth: 'max-content' }}>
      <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}>
        <table className="border-collapse bg-white table-fixed">
          <thead>
            <tr className="h-8">
              <th className="sticky top-0 left-0 z-30 w-12 bg-[#f3f2f1] border border-gray-300"></th>
              {cols.map(col => (
                <th 
                  key={col} 
                  className="sticky top-0 z-20 w-32 border border-gray-300 py-1 text-[11px] font-bold text-center bg-[#f3f2f1] text-gray-500"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row} className="h-8">
                <td className="sticky left-0 z-20 w-12 border border-gray-300 text-center text-[11px] font-bold bg-[#f3f2f1] text-gray-500">
                  {row}
                </td>
                {cols.map(col => {
                  const id = `${col}${row}`;
                  const isActive = activeCell === id;
                  const isAnswered = !!currentTaskAnswers[id];
                  const isSkipped = highlightSkipped && !isAnswered;
                  
                  return (
                    <td 
                      key={id} 
                      id={`cell-${id}`}
                      onClick={() => handleCellClick(id)}
                      className={`border px-3 text-[13px] text-gray-700 relative cursor-cell overflow-hidden whitespace-nowrap transition-colors ${
                        isActive ? 'ring-2 ring-inset ring-[#217346] z-10 bg-white border-gray-200' : 
                        isSkipped ? 'bg-amber-50 border-2 border-amber-400 border-dotted' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {isActive ? editingValue : currentTaskAnswers[id] || ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTableContent = (task: SIMTask) => (
    <div className="bg-white p-8">
      <div className="max-w-5xl mx-auto border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#f1f5f9]">
              <th className="px-6 py-4 text-left text-sm font-bold text-[#1e293b] border-b border-gray-200 w-20">No.</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#1e293b] border-b border-gray-200">Questions</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#1e293b] border-b border-gray-200 w-64">Answer</th>
            </tr>
          </thead>
          <tbody>
            {task.subQuestions?.map((sq) => {
              const isAnswered = !!currentTaskAnswers[sq.id]?.trim();
              const isSkipped = highlightSkipped && !isAnswered;
              
              return (
                <tr key={sq.id} className={`hover:bg-gray-50 transition-colors ${isSkipped ? 'bg-amber-50' : ''}`}>
                  <td className="px-6 py-5 text-sm text-[#64748b] border-b border-gray-100">{sq.no}</td>
                  <td className="px-6 py-5 text-sm text-[#1e293b] border-b border-gray-100">{sq.question}</td>
                  <td className="px-6 py-5 border-b border-gray-100">
                    <div className="relative group">
                      <button 
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border transition-all text-sm ${
                          currentTaskAnswers[sq.id] 
                            ? 'border-[#3A58EF] text-[#3A58EF] bg-blue-50' 
                            : isSkipped 
                              ? 'border-amber-400 text-amber-600 bg-white border-dotted border-2'
                              : 'border-gray-200 text-gray-400 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedSubQuestion(sq)}
                      >
                        <span className="font-medium">{currentTaskAnswers[sq.id] || 'Select Option'}</span>
                        <ArrowUpRight size={18} className={`${isSkipped ? 'text-amber-400' : 'text-gray-400'} group-hover:text-[#3A58EF]`} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#f3f2f1] overflow-hidden">
      {/* FIXED TOP SECTION (Toolbar only) */}
      <div className="flex-none z-20 shadow-sm bg-white">
        {/* Combined Toolbar & Question Header */}
        <div className="border-b border-gray-200 px-6 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">
              Question {question.id - 200} :
            </h3>
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-center space-x-2">
              <ToolbarButton icon={<Maximize2 size={16} />} label="Fit To Screen" onClick={handleFitToScreen} />
              <ToolbarButton icon={<Eye size={16} />} label="Overview" onClick={handleOverview} />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button onClick={handleZoomOut} className="p-1 hover:bg-white rounded-md transition-all text-gray-600">
                <ZoomOut size={16} />
              </button>
              <span className="px-2 text-xs font-bold text-gray-700 min-w-[45px] text-center">{zoom}%</span>
              <button onClick={handleZoomIn} className="p-1 hover:bg-white rounded-md transition-all text-gray-600">
                <ZoomIn size={16} />
              </button>
            </div>
            <div className="h-6 w-px bg-gray-200" />
            {question.id !== 205 ? (
              <>
                <button 
                  onClick={() => setIsAttachmentOpen(true)}
                  className="flex items-center text-[#3A58EF] text-xs font-bold hover:underline"
                >
                  <Paperclip size={14} className="mr-1" />
                  Check Attachment
                </button>
                <div className="h-6 w-px bg-gray-200" />
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsAttachmentOpen(true)}
                  disabled={activeTaskId === 'task-3'}
                  className={`flex items-center text-xs font-bold transition-all ${
                    activeTaskId === 'task-3' 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-[#3A58EF] hover:underline'
                  }`}
                >
                  <Paperclip size={14} className="mr-1" />
                  Check Attachment
                </button>
                <div className="h-6 w-px bg-gray-200" />
              </>
            )}
            <button 
              onClick={() => onToggleFlag(question.id)}
              className={`flex items-center px-3 py-1 rounded-lg border font-bold text-xs transition-all ${
                isFlagged 
                  ? 'bg-amber-50 border-amber-200 text-amber-600' 
                  : 'bg-white border-amber-200 text-amber-600 hover:bg-amber-50'
              }`}
            >
              <Flag size={12} className="mr-1.5" fill={isFlagged ? 'currentColor' : 'none'} />
              Flag Question
            </button>
            <button 
              onClick={() => onSkip?.(question.id)}
              className="flex items-center px-3 py-1 rounded-lg border border-gray-200 text-gray-500 hover:border-[#3A58EF] hover:text-[#3A58EF] bg-white font-bold text-xs transition-all shadow-sm"
            >
              Skip
            </button>
          </div>
        </div>
      </div>

      {/* SCROLLABLE MIDDLE SECTION (Everything else) */}
      <div className="flex-grow overflow-auto custom-scrollbar bg-white" ref={gridRef}>
        {/* Question Description */}
        <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/30">
          <div className="text-[#1e293b] text-sm font-medium leading-relaxed max-w-5xl whitespace-pre-line">
            {question.description}
          </div>
        </div>

        {/* Task Tabs */}
        {question.tasks.length > 1 && (
          <div className="border-b border-gray-200 flex items-center px-6 overflow-x-auto custom-scrollbar bg-white">
            {question.tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => {
                  setActiveTaskId(task.id);
                  setActiveCell(null);
                  setEditingValue('');
                }}
                className={`px-6 py-2 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                  activeTaskId === task.id
                    ? 'border-[#3A58EF] text-[#3A58EF] bg-blue-50/30'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {task.label}
              </button>
            ))}
          </div>
        )}

        {/* Formula Bar (if spreadsheet) */}
        {activeTask.type === 'spreadsheet' && (
          <div className="bg-white border-b border-gray-200">
            {renderFormulaBar()}
          </div>
        )}

        {/* Simulation Content */}
        <div className="relative">
          {activeTask.type === 'spreadsheet' ? renderSpreadsheetGrid() : renderTableContent(activeTask)}
        </div>
      </div>

      <AttachmentPopup 
        isOpen={isAttachmentOpen}
        onClose={() => setIsAttachmentOpen(false)}
        questionId={question.id}
        activeTaskId={activeTaskId}
        tasks={question.tasks}
      />

      <SelectionModal 
        isOpen={!!selectedSubQuestion}
        onClose={() => setSelectedSubQuestion(null)}
        questionText={selectedSubQuestion?.question || ''}
        options={selectedSubQuestion?.options || []}
        currentSelection={selectedSubQuestion ? currentTaskAnswers[selectedSubQuestion.id] : undefined}
        onSelect={(text) => {
          if (selectedSubQuestion) {
            onDataChange(activeTaskId, selectedSubQuestion.id, text);
          }
        }}
      />

      {/* FIXED BOTTOM SECTION */}
      <div className="flex-none">
        {/* Status Bar */}
        <div className="bg-[#217346] text-white px-6 py-1.5 flex items-center justify-between text-xs font-bold">
          <div className="flex items-center space-x-6">
            <span className="uppercase tracking-widest">Simulation Mode</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>Live Sync Active</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span>Question ID: {question.id}</span>
            <div className="h-4 w-px bg-white/20" />
            <span>{activeTask.type === 'spreadsheet' ? `${cols.length} Columns x ${rows.length} Rows` : `${activeTask.subQuestions?.length} Questions`}</span>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border: 3px solid #f1f1f1;
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}} />
    </div>
  );
};

const ToolbarButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; active?: boolean }> = ({ 
  icon, 
  label, 
  onClick, 
  active 
}) => (
  <button 
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all border font-bold text-sm ${
      active 
        ? 'bg-amber-50 border-amber-200 text-amber-600' 
        : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);
