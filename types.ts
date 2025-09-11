export type Answer = {
  text: string;
  fileName?: string;
  file?: File | null;
};

export type Recipient = {
  id: string;
  name: string;
  role: string;
  email: string;
  selectedQuestions?: string[];
};

export type ProjectData = {
  projectName: string;
  clientName: string;
  recipients: Recipient[];
};
