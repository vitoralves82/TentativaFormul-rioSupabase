import { supabase } from "./supabase";
import type { ProjectData, Answer, Recipient } from "../types";

// Lê ?param tanto em search (?x=) quanto no hash (#/?x=), mantendo compatibilidade
function getQueryParam(name: string): string | null {
  const bySearch = new URLSearchParams(window.location.search).get(name);
  if (bySearch) return bySearch;
  // Ex.: "#/?submissionId=UUID&..."
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

/**
 * Salva o projeto e cria uma "submission" por destinatário via Edge Function (mode: "intake").
 * Retorna os links já com ?submissionId=..., para você usar no e-mail.
 */
export const supabaseService = {
  saveProjectData: async (projectData: ProjectData): Promise<SaveProjectResult> => {
    const { projectName, clientName, recipients } = projectData;

    // cria uma submission para CADA destinatário
    const links: Array<{ recipientId: string; submissionId: string; url: string }> = [];

    for (const r of recipients) {
      const payload = {
        mode: "intake",
        projectName,
        clientName,
        recipientName: r.name,
        role: r.role,
        email: r.email,
        // você já guarda os IDs; tudo bem salvar assim como text[] também
        selectedQuestions: r.selectedQuestions ?? [],
      };

      const { data, error } = await supabase.functions.invoke("submit-intake", { body: payload });
      if (error) throw error;

      const submissionId = (data as any)?.submissionId as string | undefined;
      if (!submissionId) throw new Error("Falha ao obter submissionId");

      // mantém teu padrão de hash route e já injeta o submissionId
      const url = `${window.location.origin}/#/?submissionId=${submissionId}`;
      links.push({ recipientId: r.id, submissionId, url });
    }

    return { success: true, links };
  },

  /**
   * Envia as respostas do destinatário. Mantém a assinatura original:
   *   saveAnswers(respondentId, answersMap)
   * Mas o que manda pro Supabase é o "submissionId" lido da URL.
   */
  saveAnswers: async (
    _respondentId: string,
    answersMap: { [key: string]: Answer }
  ): Promise<{ success: true }> => {
    const submissionId = getQueryParam("submissionId");
    if (!submissionId) throw new Error("submissionId não encontrado na URL (?submissionId=...)");

    // Converte teu map {questionId: {text, fileName, file}} -> array [{question, answer}]
    // Obs.: anexos ainda não enviados; se quiser, depois integramos Storage.
    const answers = Object.entries(answersMap).map(([questionId, a]) => ({
      question: questionId,        // ou troque para o texto da pergunta se preferir
      answer: (a?.text ?? "").trim(),
    })).filter(row => row.answer.length > 0 || String(row.question).length > 0);

    const { error } = await supabase.functions.invoke("submit-intake", {
      body: { mode: "answers", submissionId, answers },
    });
    if (error) throw error;

    return { success: true };
  },
};
