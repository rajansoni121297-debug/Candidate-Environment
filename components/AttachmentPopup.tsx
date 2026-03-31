import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileText, Download, GripHorizontal } from 'lucide-react';

interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
}

interface AttachmentData {
  [key: string]: Attachment[];
}

const ATTACHMENT_MAPPING: Record<number, AttachmentData | Attachment[]> = {
  201: [
    { id: '1', name: 'Case_Study_Overview.pdf', size: '1.2 MB', type: 'PDF' }
  ],
  202: [
    { id: '1', name: 'Partnership_Agreement.pdf', size: '2.4 MB', type: 'PDF' },
    { id: '2', name: 'TC_Designs_Balance_Sheet_2023.xlsx', size: '850 KB', type: 'XLSX' },
    { id: '3', name: 'Tax_Basis_Worksheet.pdf', size: '1.1 MB', type: 'PDF' }
  ],
  203: [
    { id: '1', name: 'Client_Financial_Summary.pdf', size: '1.5 MB', type: 'PDF' }
  ],
  204: {
    'task-1': [
      { id: 't1-1', name: 'Inventory_List_Q1.xlsx', size: '450 KB', type: 'XLSX' },
      { id: 't1-2', name: 'Vendor_Invoices_Jan.pdf', size: '3.2 MB', type: 'PDF' },
      { id: 't1-3', name: 'Purchase_Orders.pdf', size: '1.8 MB', type: 'PDF' }
    ],
    'task-2': [
      { id: 't2-1', name: 'Sales_Report_Feb.xlsx', size: '620 KB', type: 'XLSX' },
      { id: 't2-2', name: 'Customer_Returns_Log.pdf', size: '1.1 MB', type: 'PDF' },
      { id: 't2-3', name: 'Marketing_Expenses.xlsx', size: '340 KB', type: 'XLSX' },
      { id: 't2-4', name: 'Payroll_Summary_Feb.pdf', size: '2.1 MB', type: 'PDF' },
      { id: 't2-5', name: 'Utility_Bills.pdf', size: '980 KB', type: 'PDF' },
      { id: 't2-6', name: 'Bank_Statement_Feb.pdf', size: '1.4 MB', type: 'PDF' }
    ]
  },
  205: {
    'task-1': [
      { id: 't1-1', name: 'Circular_230_Excerpt.pdf', size: '450 KB', type: 'PDF' }
    ],
    'task-2': [
      { id: 't2-1', name: 'Compliance_Checklist.xlsx', size: '120 KB', type: 'XLSX' }
    ],
    'task-3': [], // No attachments for Tab 3
    'task-4': [
      { id: 't4-1', name: 'Reporting_Form_Draft.pdf', size: '890 KB', type: 'PDF' }
    ]
  }
};

interface AttachmentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  questionId: number;
  activeTaskId: string;
  tasks: { id: string; label: string }[];
}

export const AttachmentPopup: React.FC<AttachmentPopupProps> = ({
  isOpen,
  onClose,
  questionId,
  activeTaskId,
  tasks
}) => {
  const [activeTab, setActiveTab] = useState(activeTaskId);

  // Reset tab when popup opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(activeTaskId);
    }
  }, [isOpen, activeTaskId]);

  if (!isOpen) return null;

  const data = ATTACHMENT_MAPPING[questionId] || [];
  const isMultiTask = !Array.isArray(data);
  
  const currentAttachments = isMultiTask 
    ? (data as AttachmentData)[activeTab] || []
    : (data as Attachment[]);

  return (
    <AnimatePresence>
      <motion.div
        drag
        dragMomentum={false}
        initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-50%', left: '50%', top: '50%' }}
        animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%', left: '50%', top: '50%' }}
        exit={{ opacity: 0, scale: 0.9 }}
        key={questionId} // Ensure reset on question change
        className="fixed z-[100] w-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
        style={{ position: 'fixed', touchAction: 'none' }}
      >
        {/* Header / Drag Handle */}
        <div className="bg-[#1e293b] text-white px-4 py-3 flex items-center justify-between cursor-move select-none">
          <div className="flex items-center space-x-2">
            <GripHorizontal size={18} className="text-gray-400" />
            <span className="font-bold text-sm">Attachments - Question {questionId - 200}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs if Q4 or multi-task */}
        {isMultiTask && (
          <div className="flex border-b border-gray-200 bg-gray-50">
            {tasks.map(task => (
              <button
                key={task.id}
                onClick={() => setActiveTab(task.id)}
                className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 ${
                  activeTab === task.id
                    ? 'border-[#3A58EF] text-[#3A58EF] bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {task.label}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar bg-white">
          {currentAttachments.length > 0 ? (
            <div className="space-y-3">
              {currentAttachments.map(file => (
                <div 
                  key={file.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <FileText size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-800">{file.name}</div>
                      <div className="text-[11px] text-gray-500 uppercase font-medium">{file.type} • {file.size}</div>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-[#3A58EF] hover:bg-white rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-sm">
                    <Download size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-400 mb-3">
                <FileText size={24} />
              </div>
              <p className="text-sm text-gray-500 font-medium">No documents attached.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100 transition-all"
          >
            Close
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
