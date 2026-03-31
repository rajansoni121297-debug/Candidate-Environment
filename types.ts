import React from 'react';

export type AssessmentSection = 'MCQ' | 'SIM' | 'SUBJECTIVE' | 'VIDEO';
export type FlowStep = 'LANDING' | 'PROCTORING' | 'ASSESSMENT' | 'RESULTS';

export interface InstructionItem {
  id: number;
  icon: React.ReactNode;
  text: string;
  highlight?: string;
}

export interface SectionData {
  name: string;
  questionsCount: number;
  totalMarks: number;
}

export interface MCQQuestion {
  id: number;
  text: string;
  options: { label: string; text: string }[];
}

export interface SIMSubQuestion {
  id: string;
  no: string;
  question: string;
  options?: { label: string; text: string }[];
}

export interface SIMTask {
  id: string;
  label: string;
  type: 'spreadsheet' | 'table';
  subQuestions?: SIMSubQuestion[];
}

export interface SIMQuestion {
  id: number;
  title: string;
  description: string;
  tasks: SIMTask[];
}

export interface SubjectiveQuestion {
  id: number;
  text: string;
  options?: { label: string; text: string }[];
}
