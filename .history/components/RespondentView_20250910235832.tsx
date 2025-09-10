import React, { useEffect, useMemo, useState } from "react";
import { supabaseService } from "../services/supabaseService";
import type { Answer } from "../types";

/** Tenta achar submissionId tanto em /?submissionId=... quanto em #/?submissionId=... */
function getSubmissionIdFromURL(): string {
  const s1 = new URLSearchParams(window.location.search).get("submissionId");
  if (s1) return s1;
  if (window.location.hash.startsWith("#/")) {
    const hashQuery = window.location.hash.split("?")[1] || "";
    const s2 = new URLSearchParams(hashQuery).get("submissionId");
    if (s2) return s2;
  }
  return "";
}

type QA = { question: string; answer: string };

export default function RespondentView() {
  // ID vindo da URL ou vazio (para habilitar o fallback de debug)
  const [submissionId, setSubmissionId] = useState<string>(getSubmissionIdFromURL());

  const [qas, setQas] = useState<QA[]>([{ question: "", answer: "" }]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function addQA() {
    setQas((p) => [...p, { question: "", answer: "" }]);
  }
  function removeQA(i: number) {
    setQas((p) => p.filter((_, idx) => idx !== i));
  }
  function setField(i: number, key: keyof QA, val: string) {
    setQas((p) => p.map((row, idx) => (idx === i ? { ...row, [key]: val } : row)));
  }

  async function onSubmit() {
    setMsg(null);

    if (!submissionId) {
      setMsg("submissionId não encontrado. Inclua ?submissionId=... na URL ou cole no campo amarelo acima.");
      return;
    }

    // monta o map no formato esperado pelo serviço: { [key]: Answer }
    const answersArray = qas.filter((x) => x.question.trim().length > 0 || x.answer.trim().length > 0);
    if (!answersArray.length) {
      setMsg("Inclua ao menos uma pergunta/resposta.");
      return;
    }

    const answersMap: { [key: string]: Answer } = {};
    answersArray.forEach((qa, idx) => {
      const key = qa.question.trim() || `Q${idx + 1}`;
      answersMap[key] = { text: qa.answer.trim() };
    });

    setBusy(true);
    try {
      // Mantemos a assinatura original: o serviço ignora o respondentId e lê o submissionId da URL
      await supabaseService.saveAnswers("ui", answersMap);
      setMsg("Respostas enviadas com sucesso. Obrigado!");
    } catch (err: any) {
      setMsg(err?.message ?? String(err));
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!submissionId) {
      setMsg("A página precisa do parâmetro ?submissionId=... na URL.");
    }
  }, [submissionId]);

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h1>Submit Your Answers</h1>
      <p>
        <strong>Submission ID:</strong> {submissionId || "Not found in URL"}
      </p>

      {/* Fallback de debug: permitir colar o ID quando não vier na URL */}
      {!submissionId && (
        <div
          style={{
            background: "#fffbe6",
            border: "1px solid #ffe58f",
            padding: 12,
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          <strong>Submission ID não encontrado na URL.</strong>
          <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
            <input
              placeholder="Cole aqui o submissionId"
              onChange={(e) => sessionStorage.setItem("submissionId_tmp", e.target.value.trim())}
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={() => setSubmissionId(sessionStorage.getItem("submissionId_tmp") || "")}
            >
              Usar este ID
            </button>
          </div>
          <div style={{ marginTop: 6, color: "#666" }}>
            Dica: o link correto precisa conter <code>?submissionId=...</code> (pode estar após <code>#/</code>).
          </div>
        </div>
      )}

      {qas.map((qa, i) => (
        <div
          key={i}
          style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, marginBottom: 16 }}
        >
          <h3>Question {i + 1}</h3>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Question:</label>
            <input
              value={qa.question}
              onChange={(e) => setField(i, "question", e.target.value)}
              style={{ width: "100%", padding: 10 }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Answer:</label>
            <textarea
              value={qa.answer}
              onChange={(e) => setField(i, "answer", e.target.value)}
              rows={4}
              style={{ width: "100%", padding: 10 }}
            />
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button type="button" onClick={addQA} style={{ background: "#22c55e", color: "#fff", padding: "8px 12px", borderRadius: 6 }}>
              Add Question &amp; Answer
            </button>
            <button
              type="button"
              onClick={() => removeQA(i)}
              disabled={qas.length === 1}
              style={{ background: "#e11d48", color: "#fff", padding: "8px 12px", borderRadius: 6 }}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={onSubmit}
        disabled={!submissionId || busy}
        style={{
          background: !submissionId || busy ? "#6b7280" : "#2563eb",
          color: "#fff",
          padding: "10px 16px",
          borderRadius: 6,
        }}
      >
        {busy ? "Enviando..." : "Submit Answers"}
      </button>

      <p style={{ marginTop: 12, color: "#888" }}>
        Note: make sure the URL includes <code>?submissionId=...</code> (e.g., <code>?submissionId=123</code>).
      </p>

      {msg && (
        <p
          style={{
            marginTop: 12,
            color: msg.includes("sucesso") ? "green" : "crimson",
            whiteSpace: "pre-wrap",
          }}
        >
          {msg}
        </p>
      )}
    </div>
  );
}
