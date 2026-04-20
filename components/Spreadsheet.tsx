
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Table as TableIcon, ChevronDown, Maximize2 } from 'lucide-react';

interface SpreadsheetProps {
  isOpen: boolean;
  onClose: () => void;
  data: Record<string, string>;
  onDataChange: (cellId: string, value: string) => void;
}

export const Spreadsheet: React.FC<SpreadsheetProps> = ({ isOpen, onClose, data, onDataChange }) => {
  const [activeCell, setActiveCell] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [position, setPosition] = useState({ x: 100, y: 120 });
  const [size, setSize] = useState({ width: 750, height: 480 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [rowHeights, setRowHeights] = useState<Record<number, number>>({});
  
  const inputRef = useRef<HTMLInputElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  // Drag logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  useEffect(() => {
    if (isOpen && activeCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeCell, isOpen]);

  if (!isOpen) return null;

  const cols = Array.from({ length: 15 }, (_, i) => String.fromCharCode(65 + i));
  const rows = Array.from({ length: 25 }, (_, i) => i + 1);

  const handleCellClick = (cellId: string) => {
    setActiveCell(cellId);
    setEditingValue(data[cellId] || '');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingValue(e.target.value);
  };

  const handleInputBlur = () => {
    if (activeCell) {
      onDataChange(activeCell, editingValue);
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

  const renderCellValue = (cellId: string) => {
    const val = data[cellId];
    if (val?.startsWith('=')) {
      if (val.toUpperCase().includes('SUM')) return '1,250.00';
      if (val.toUpperCase().includes('AVG')) return '416.67';
      return '#VALUE!';
    }
    return val || '';
  };

  const activeCol = activeCell?.match(/[A-Z]+/)?.[0];
  const activeRow = parseInt(activeCell?.match(/\d+/)?.[0] || '0');

  const getColWidth = (col: string) => columnWidths[col] || 100;
  const getRowHeight = (row: number) => rowHeights[row] || 25;

  const handleColumnResize = (e: React.MouseEvent, col: string) => {
    e.stopPropagation();
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = getColWidth(col);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(40, startWidth + (moveEvent.clientX - startX));
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
      const newHeight = Math.max(20, startHeight + (moveEvent.clientY - startY));
      setRowHeights(prev => ({ ...prev, [row]: newHeight }));
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div 
      ref={windowRef}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        position: 'fixed'
      }}
      className={`z-[100] bg-white rounded-xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden transition-shadow ${isDragging ? 'shadow-blue-500/20 ring-1 ring-blue-400' : ''}`}
      onMouseDown={handleMouseDown}
    >
      {/* Excel Header - Drag Handle */}
      <div className="drag-handle flex items-center justify-between px-5 py-2.5 bg-[#217346] text-white cursor-move select-none">
        <div className="flex items-center space-x-2.5">
          <TableIcon size={16} />
          <span className="text-[13px] font-bold tracking-wide">Worksheet - Tax Assessment Tools</span>
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-1 hover:bg-white/10 rounded transition-colors">
            <Maximize2 size={14} />
          </button>
          <button onClick={onClose} className="hover:bg-red-500 p-1 rounded transition-colors ml-1">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex items-center space-x-5 px-5 py-1.5 bg-[#f3f2f1] border-b border-slate-200 text-[11px] font-semibold text-slate-600 select-none">
        <span className="text-[#217346] border-b-2 border-[#217346] pb-0.5 cursor-pointer">File</span>
        <span className="cursor-pointer hover:text-black">Home</span>
        <span className="cursor-pointer hover:text-black">Insert</span>
        <span className="cursor-pointer hover:text-black">Page Layout</span>
        <span className="cursor-pointer hover:text-black">Formulas</span>
      </div>

      {/* Grid Container */}
      <div className="flex-grow overflow-auto bg-[#e1e1e1] custom-scrollbar">
        <table className="border-collapse bg-white table-fixed" style={{ width: 'max-content' }}>
          <thead>
            <tr style={{ height: '25px' }}>
              <th className="sticky top-0 left-0 z-30 w-10 bg-[#f3f2f1] border border-slate-300"></th>
              {cols.map(col => (
                <th 
                  key={col} 
                  style={{ width: `${getColWidth(col)}px`, minWidth: `${getColWidth(col)}px` }}
                  className={`sticky top-0 z-20 border border-slate-300 py-0.5 text-[10px] font-bold text-center transition-colors relative group select-none ${activeCol === col ? 'bg-[#c6efce] text-[#006100]' : 'bg-[#f3f2f1] text-slate-500'}`}
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
                  style={{ width: '40px', minWidth: '40px' }}
                  className={`sticky left-0 z-20 border border-slate-300 text-center text-[10px] font-bold transition-colors relative group select-none ${activeRow === row ? 'bg-[#c6efce] text-[#006100]' : 'bg-[#f3f2f1] text-slate-500'}`}
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
                  return (
                    <td 
                      key={id} 
                      onClick={() => handleCellClick(id)}
                      style={{ width: `${getColWidth(col)}px`, minWidth: `${getColWidth(col)}px` }}
                      className={`border border-slate-200 text-[12px] text-slate-700 relative cursor-cell overflow-hidden whitespace-nowrap ${
                        isActive ? 'ring-2 ring-inset ring-[#217346] z-10 bg-white px-0' : 'hover:bg-slate-50 px-2'
                      }`}
                    >
                      {isActive ? (
                        <input
                          ref={inputRef}
                          type="text"
                          className="w-full h-full bg-white outline-none font-medium px-2"
                          value={editingValue}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          onKeyDown={handleKeyDown}
                          autoFocus
                        />
                      ) : (
                        renderCellValue(id)
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Status Bar */}
      <div className="bg-[#f3f2f1] px-4 py-1 flex items-center justify-between border-t border-slate-200 text-[10px] text-slate-500 font-medium select-none">
        <div className="flex items-center space-x-4">
          <span className="uppercase tracking-wider">Ready</span>
          <div className="flex items-center space-x-1.5 opacity-60">
            <div className="w-2.5 h-2.5 rounded-full bg-[#217346]" />
            <span>Connected</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="px-2 py-0.5 border border-slate-300 rounded bg-white/50">
            100%
          </div>
          <ChevronDown size={12} />
        </div>
      </div>

      {/* Resize Handle */}
      <div 
        className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50 group"
        onMouseDown={(e) => {
          e.stopPropagation();
          const startX = e.clientX;
          const startY = e.clientY;
          const startWidth = size.width;
          const startHeight = size.height;

          const doResize = (moveEvent: MouseEvent) => {
            setSize({
              width: Math.max(400, startWidth + moveEvent.clientX - startX),
              height: Math.max(300, startHeight + moveEvent.clientY - startY)
            });
          };

          const stopResize = () => {
            window.removeEventListener('mousemove', doResize);
            window.removeEventListener('mouseup', stopResize);
          };

          window.addEventListener('mousemove', doResize);
          window.addEventListener('mouseup', stopResize);
        }}
      >
        <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-slate-400 opacity-50 group-hover:opacity-100" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border: 1px solid #ddd;
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
