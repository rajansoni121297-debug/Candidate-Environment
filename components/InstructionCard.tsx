import React from 'react';
import { Monitor, Wifi, Camera, Scan, Ban } from 'lucide-react';

interface InstructionItemProps {
  icon: React.ReactNode;
  text: string;
  bgColor: string;
  iconColor: string;
}

const InstructionItem: React.FC<InstructionItemProps> = ({ icon, text, bgColor, iconColor }) => (
  <div className="flex items-start space-x-4 group">
    <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center ${iconColor}`}>
      {icon}
    </div>
    <p className="text-[#334155] text-[15px] leading-relaxed pt-2">
      {text}
    </p>
  </div>
);

export const InstructionCard: React.FC = () => {
  const instructions = [
    {
      icon: <Monitor size={18} />,
      text: "Use a desktop or laptop; mobile devices and tablets are not supported.",
      bgColor: "bg-[#eef2ff]",
      iconColor: "text-[#6366f1]"
    },
    {
      icon: <Wifi size={18} />,
      text: "Ensure your internet connection is stable.",
      bgColor: "bg-[#eff6ff]",
      iconColor: "text-[#3b82f6]"
    },
    {
      icon: <Camera size={18} />,
      text: "Ensure your webcam and microphone stay active and functioning throughout the assessment.",
      bgColor: "bg-[#f0f9ff]",
      iconColor: "text-[#0ea5e9]"
    },
    {
      icon: <Scan size={18} />,
      text: "Sit alone in a quiet, well-lit room with no interruptions.",
      bgColor: "bg-[#f5f3ff]",
      iconColor: "text-[#8b5cf6]"
    },
    {
      icon: <Ban size={18} />,
      text: "Ensure your desk is completely clear. Use of mobile phones or any other reference items is strictly prohibited.",
      bgColor: "bg-[#f1f5f9]",
      iconColor: "text-[#64748b]"
    }
  ];

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-sm">
      <div className="bg-white px-6 py-4 border-b border-[#e2e8f0]">
        <h2 className="text-lg font-bold text-[#1e293b]">Assessment Instructions</h2>
      </div>
      <div className="p-8 space-y-6">
        {instructions.map((item, idx) => (
          <InstructionItem key={idx} {...item} />
        ))}
      </div>
    </div>
  );
};