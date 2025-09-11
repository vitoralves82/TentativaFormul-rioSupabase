import { supabase } from "./supabase";
import type { ProjectData, Answer, Recipient } from "../types";

// Lê param tanto em search (?x=) quanto no hash (#/?x=)
function getQueryParam(name: string): string | null {
  const s1 = new URLSearchParams(window.location.search).get(name);
  if (s1) return s1;
  if (window.location.hash.startsWith("#/")) {
    const hashQuery = window.location.hash.split("?")[1] || "";
    return new URLSearchParams(hashQuery).get(name);
  }
  return null;
}

type SaveProjectResult = {
  success: true;
  links: Array<{ recipientId: string; submissionId: string; url: string }>;
};

export const supabaseService = {
  // Cria uma submission por destinatário e devolve o link já com ?submissionId=...
  saveProjectData: async (projectData: ProjectData): Promise<SaveProjectResult> => {
    const { projectName, clientName, recipients } = projectData;
    const links: Array<{ recipientId: string; submissionId: string; url: string }> = [];

    for (const r of recipients) {
      const payload = {
        mode: "intake",
        projectName,
        clientName,
        recipientName: r.name,
        role: r.role,
        email: r.email,
        selectedQuestions: r.selectedQuestions ?? [],
      };
      const { data, error } = await supabase.functions.invoke("submit-intake", { body: payload });
      if (error) throw error;

      const submissionId = (data as any)?.submissionId as string | undefined;
      if (!submissionId) throw new Error("Falha ao obter submissionId");

      const url = `${window.location.origin}/#/?submissionId=${submissionId}`;
      links.push({ recipientId: r.id, submissionId, url });
    }

    return { success: true, links };
  },

  // Envia respostas lendo o submissionId da URL (search ou hash)
  saveAnswers: async (
    _respondentId: string,
    answersMap: { [key: string]: Answer }
  ): Promise<{ success: true }> => {
    const submissionId = getQueryParam("submissionId");
    if (!submissionId) throw new Error("submissionId não encontrado na URL (?submissionId=...)");

    const answers = Object.entries(answersMap).map(([questionId, a]) => ({
      question: questionId,
      answer: (a?.text ?? "").trim(),
    }));

    const { error } = await supabase.functions.invoke("submit-intake", {
      body: { mode: "answers", submissionId, answers },
    });
    if (error) throw error;

    return { success: true };
  },
};

// Alias opcional — se algum arquivo importar submitAnswers
export async function submitAnswers(
  respondentId: string,
  answersMap: { [key: string]: Answer }
) {
  return supabaseService.saveAnswers(respondentId, answersMap);
}
