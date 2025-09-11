import { supabase } from "./supabase";
import type { ProjectData, Answer } from "../types";

// lê parâmetro por search (?x=) e por hash (#/?x=)
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
  links: Array<{ recipientName: string; submissionId: string; url: string }>;
};

export const supabaseService = {
  // cria uma submission por destinatário e retorna links com ?submissionId=...
  async saveProjectData(projectData: ProjectData): Promise<SaveProjectResult> {
    const links: Array<{ recipientName: string; submissionId: string; url: string }> = [];

    for (const r of projectData.recipients) {
      const { data, error } = await supabase.functions.invoke("submit-intake", {
        body: {
          mode: "intake",
          projectName: projectData.projectName,
          clientName:  projectData.clientName,
          recipientName: r.name,
          role: r.role,
          email: r.email,
          selectedQuestions: r.selectedQuestions ?? [],
        },
      });
      if (error) throw error;
      const submissionId = (data as any)?.submissionId as string | undefined;
      if (!submissionId) throw new Error("Falha ao obter submissionId da função");

      // mantém hash-route (/#/?submissionId=...)
      const url = `${window.location.origin}/#/?submissionId=${submissionId}`;
      links.push({ recipientName: r.name, submissionId, url });
    }

    return { success: true, links };
  },

  // envia respostas (lendo submissionId da URL)
  async saveAnswers(_respondentId: string, answersMap: { [key: string]: Answer }) {
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

// Alias, caso algum arquivo importe esses nomes:
export async function submitAnswers(
  respondentId: string,
  answersMap: { [key: string]: Answer }
) {
  return supabaseService.saveAnswers(respondentId, answersMap);
}
export async function submitIntakeCompat(payload: {
  projectName: string; clientName: string; recipientName: string;
  role: string; email: string; selectedQuestions: string[];
}) {
  const { data, error } = await supabase.functions.invoke("submit-intake", {
    body: { mode: "intake", ...payload },
  });
  if (error) throw error;
  return (data as any)?.submissionId as string;
}
