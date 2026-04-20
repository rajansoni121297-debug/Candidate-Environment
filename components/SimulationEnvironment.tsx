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
import { SIMQuestion, SIMTask, SIMSubQuestion, SimulationDesign } from '../types';
import { AttachmentPopup } from './AttachmentPopup';
import { ReviewMode } from '../App';

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
          <h2 className="text-lg font-bold text-[#1e293b]">Select Your Answer</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-8 space-y-6">
          <div className="space-y-1">
            <span className="text-[#64748b] text-xs font-medium">Question :</span>
            <p className="text-base font-bold text-[#1e293b] whitespace-pre-line">{questionText}</p>
          </div>
          <div className="space-y-3">
            {options.map((opt) => (
              <button 
                key={opt.label}
                onClick={() => onSelect(opt.text)}
                className={`flex items-start w-full group transition-all rounded-md p-2 ${currentSelection === opt.text ? 'bg-[#eff6ff]' : 'hover:bg-gray-50'}`}
              >
                <div className={`w-10 h-10 shrink-0 rounded-md flex items-center justify-center font-bold border transition-colors ${
                  currentSelection === opt.text 
                    ? 'bg-[#3A58EF] text-white border-[#3A58EF]' 
                    : 'bg-[#eff6ff] text-[#1e293b] border-transparent'
                }`}>
                  {opt.label}
                </div>
                <div className={`flex-grow text-left font-medium ml-4 py-2 whitespace-pre-line ${currentSelection === opt.text ? 'text-[#3A58EF]' : 'text-[#334155]'}`}>
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
  isFlagged: boolean;
  highlightSkipped?: boolean;
  reviewMode?: ReviewMode;
  design?: SimulationDesign;
}

export const SimulationEnvironment: React.FC<SimulationEnvironmentProps> = ({
  question,
  answers,
  onDataChange,
  onToggleFlag,
  isFlagged,
  highlightSkipped: externalHighlightSkipped,
  reviewMode = 'none',
  design = 'Design2'
}) => {
  const [activeTaskId, setActiveTaskId] = useState(question.tasks[0].id);
  const [zoom, setZoom] = useState(100);
  const [activeCell, setActiveCell] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [internalHighlightSkipped, setInternalHighlightSkipped] = useState(false);
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const [selectedSubQuestion, setSelectedSubQuestion] = useState<SIMSubQuestion | null>(null);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [rowHeights, setRowHeights] = useState<Record<number, number>>({});
  
  const gridRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeTask = question.tasks.find(t => t.id === activeTaskId) || question.tasks[0];
  const currentTaskAnswers = answers[activeTaskId] || {};

  const activeCol = activeCell?.match(/[A-Z]+/)?.[0];
  const activeRow = parseInt(activeCell?.match(/\d+/)?.[0] || '0');

  // Reset active task and cell when question changes
  useEffect(() => {
    setActiveTaskId(question.tasks[0].id);
    setActiveCell(null);
    setEditingValue('');
    setSelectedSubQuestion(null);
  }, [question.id]);

  const highlightSkipped = (externalHighlightSkipped || internalHighlightSkipped) && reviewMode === 'skipped';

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

  const getColWidth = (col: string) => columnWidths[col] || 100;
  const getRowHeight = (row: number) => rowHeights[row] || 25;

  const handleColumnResize = (e: React.MouseEvent, col: string) => {
    e.stopPropagation();
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = getColWidth(col);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = (moveEvent.clientX - startX) / (zoom / 100);
      const newWidth = Math.max(40, startWidth + delta);
      setColumnWidths(prev => ({ ...prev, [col]: newWidth }));
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleRowResize = (e: React.MouseEvent, row: number) => {
    e.stopPropagation();
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = getRowHeight(row);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = (moveEvent.clientY - startY) / (zoom / 100);
      const newHeight = Math.max(20, startHeight + delta);
      setRowHeights(prev => ({ ...prev, [row]: newHeight }));
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Auto-scroll to active cell when zooming
  useEffect(() => {
    if (activeCell && gridRef.current) {
      const cell = document.getElementById(`cell-${activeCell}`);
      if (cell) {
        cell.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
    }
  }, [zoom, activeCell]);

  const renderSpreadsheetGrid = () => {
    const headerTop = isDesign2 ? '41px' : (question.tasks.length > 1 ? '37px' : '0px');
    
    return (
      <div className="bg-white">
        <div style={{ zoom: zoom / 100 }}>
          <table className="border-collapse bg-white table-fixed" style={{ width: 'max-content' }}>
            <thead>
              <tr style={{ height: '25px' }}>
                <th 
                  style={{ top: headerTop }}
                  className="sticky left-0 z-30 w-12 bg-[#f3f2f1] border border-gray-300"
                ></th>
                {cols.map(col => (
                  <th 
                    key={col} 
                    style={{ 
                      width: `${getColWidth(col)}px`, 
                      minWidth: `${getColWidth(col)}px`,
                      top: headerTop
                    }}
                    className={`sticky z-20 border border-gray-300 py-1 text-[11px] font-bold text-center transition-colors relative group select-none ${
                      activeCol === col ? 'bg-[#c6efce] text-[#006100]' : 'bg-[#f3f2f1] text-gray-500'
                    }`}
                  >
                    {col}
                    <div 
                      className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize hover:bg-[#217346] z-30 opacity-0 group-hover:opacity-100 transition-opacity"
                      onMouseDown={(e) => handleColumnResize(e, col)}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row} style={{ height: `${getRowHeight(row)}px` }}>
                  <td 
                    style={{ width: '48px', minWidth: '48px' }}
                    className={`sticky left-0 z-20 border border-gray-300 text-center text-[11px] font-bold transition-colors relative group select-none ${
                      activeRow === row ? 'bg-[#c6efce] text-[#006100]' : 'bg-[#f3f2f1] text-gray-500'
                    }`}
                  >
                    {row}
                    <div 
                      className="absolute bottom-0 left-0 w-full h-1.5 cursor-row-resize hover:bg-[#217346] z-30 opacity-0 group-hover:opacity-100 transition-opacity"
                      onMouseDown={(e) => handleRowResize(e, row)}
                    />
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
                        style={{ width: `${getColWidth(col)}px`, minWidth: `${getColWidth(col)}px` }}
                        className={`border text-[13px] text-gray-700 relative cursor-cell overflow-hidden whitespace-nowrap transition-colors ${
                          isActive ? 'ring-2 ring-inset ring-[#217346] z-10 bg-white border-gray-200 px-0' : 
                          isSkipped ? 'bg-amber-50 border-2 border-amber-400 border-dotted px-3' : 'border-gray-200 hover:bg-gray-50 px-3'
                        }`}
                      >
                        {isActive ? (
                          <input
                            ref={inputRef}
                            type="text"
                            className="w-full h-full bg-white outline-none font-medium px-3"
                            value={editingValue}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            onKeyDown={handleKeyDown}
                            autoFocus
                          />
                        ) : (
                          currentTaskAnswers[id] || ''
                        )}
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
  };

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
                  <td className="px-6 py-5 text-sm text-[#1e293b] border-b border-gray-100 whitespace-pre-line">{sq.question}</td>
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

  const isDesign2 = design === 'Design2';

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* FIXED TOP SECTION */}
      <div className="flex-none z-50 shadow-sm bg-white">
        <div className="border-b border-gray-200 px-6 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">
              Question {question.id - 200} :
            </h3>
            {!isDesign2 && (
              <>
                <div className="h-6 w-px bg-gray-200" />
                <div className="flex items-center space-x-2">
                  <ToolbarButton icon={<Eye size={16} />} label="Overview" onClick={handleOverview} />
                </div>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {!isDesign2 && (
              <>
                <button 
                  onClick={() => setIsAttachmentOpen(true)}
                  disabled={question.id === 205 && activeTaskId === 'task-3'}
                  className={`flex items-center text-xs font-bold transition-all ${
                    question.id === 205 && activeTaskId === 'task-3' 
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
          </div>
        </div>
      </div>

      {/* SCROLLABLE MIDDLE SECTION */}
      <div className="flex-grow overflow-auto custom-scrollbar bg-white" ref={gridRef}>
        {/* Question Description */}
        <div className="sticky left-0 w-full px-8 py-5 border-b border-gray-100 bg-gray-50 z-[30]">
          <div className="text-[#1e293b] text-sm font-medium leading-relaxed max-w-5xl whitespace-pre-line">
            {question.description}
          </div>
        </div>

        {/* Design 2 Toolbar - Sticky at Top */}
        {isDesign2 && (
          <div className="sticky top-0 left-0 w-full border-b border-gray-200 flex items-center justify-between px-6 py-2 bg-white z-[40] shadow-sm h-[41px]">
            <div className="flex items-center space-x-6">
              {/* Task Tabs for Design 2 (only if multiple) */}
              {question.tasks.length > 1 ? (
                <div className="flex items-center space-x-1">
                  {question.tasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => {
                        setActiveTaskId(task.id);
                        setActiveCell(null);
                        setEditingValue('');
                      }}
                      className={`px-4 py-1.5 text-xs font-bold transition-all rounded-md ${
                        activeTaskId === task.id
                          ? 'bg-[#3A58EF] text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {task.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-xs font-bold text-[#3A58EF] bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100">
                  {question.tasks[0].label}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <button onClick={handleOverview} className="text-gray-500 hover:text-[#3A58EF] flex items-center space-x-1 text-[11px] font-bold transition-colors">
                <Eye size={14} />
                <span>Overview</span>
              </button>
              <div className="h-4 w-px bg-gray-200" />
              <button 
                onClick={() => setIsAttachmentOpen(true)}
                disabled={question.id === 205 && activeTaskId === 'task-3'}
                className={`flex items-center text-[11px] font-bold transition-all ${
                  question.id === 205 && activeTaskId === 'task-3' 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-[#3A58EF] hover:underline'
                }`}
              >
                <Paperclip size={14} className="mr-1" />
                Check Attachment
              </button>
            </div>
          </div>
        )}

        {/* Task Tabs for Design 1 (only if multiple) */}
        {!isDesign2 && question.tasks.length > 1 && (
          <div className="sticky top-0 left-0 w-full border-b border-gray-200 flex items-center px-6 overflow-x-auto custom-scrollbar bg-white z-[40] h-[37px]">
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
