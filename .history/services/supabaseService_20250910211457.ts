import { supabase } from "./supabase";

export type IntakePayload = {
  projectName: string;
  clientName: string;
  recipientName: string;
  role: string;
  email: string;
  selectedQuestions: string[];
};

export type QA = { question: string; answer: string };

export async function submitIntake(p: IntakePayload): Promise<string> {
  const { data, error } = await supabase.functions.invoke("submit-intake", {
    body: { mode: "intake", ...p },
  });
  if (error) throw error;
  const submissionId = (data as any)?.submissionId as string | undefined;
  if (!submissionId) throw new Error("Submission ID ausente na resposta da função");
  return submissionId;
}

export async function submitAnswers(submissionId: string, answers: QA[]) {
  const body = {
    mode: "answers",
    submissionId,
    answers: answers.filter((a) => a.question.trim().length > 0),
  };
  const { error } = await supabase.functions.invoke("submit-intake", { body });
  if (error) throw error;
  return { ok: true };
}
