export interface Question {
  id: string;
  category: string;
  code: string;
  number: number;
  text: string;
}

export interface Recipient {
  id: string;
  name: string;
  role: string;
  email: string;
  selectedQuestions: string[];
}

export interface Answer {
  text?: string;
  file?: File | null;
  fileName?: string;
}

export type ViewMode = 'admin' | 'respondent';

export interface ProjectData {
  projectName: string;
  clientName: string;
  recipients: Recipient[];
}