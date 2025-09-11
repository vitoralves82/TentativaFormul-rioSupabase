import React, { useEffect, useState } from "react";
import { supabaseService } from "../services/supabaseService";
import type { Answer } from "../types";

// tenta achar submissionId em /?submissionId=... ou em #/?submissionId=...
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
  const [submissionId, setSubmissionId] = useState<string>(getSubmissionIdFromURL());
  const [qas, setQas] = useState<QA[]>([{ question: "", answer: "" }]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function addQA() { setQas(p => [...p, { question: "", answer: "" }]); }
  function removeQA(i: number) { setQas(p => p.filter((_, idx) => idx !== i)); }
  function setField(i: number, key: keyof QA, val: string) {
    setQas(p => p.map((row, idx) => idx === i ? { ...row, [key]: val } : row));
  }

  async function onSubmit() {
    setMsg(null);
    if (!submissionId) { setMsg("submissionId ausente. O link precisa conter ?submissionId=..."); return; }
    const filtered = qas.filter(x => x.question.trim().length || x.answer.trim().length);
    if (!filtered.length) { setMsg("Inclua ao menos uma pergunta/resposta."); return; }

    // converte para o map esperado { [key]: Answer }
    const answersMap: { [key: string]: Answer } = {};
    filtered.forEach((qa, i) => {
      const key = qa.question.trim() || `Q${i + 1}`;
      answersMap[key] = { text: qa.answer.trim() };
    });

    setBusy(true);
    try {
      await supabaseService.saveAnswers("ui", answersMap);
      setMsg("Respostas enviadas com sucesso. Obrigado!");
    } catch (e: any) {
      setMsg(e?.message ?? String(e));
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!submissionId) setMsg("Abra pelo link enviado por e-mail (contendo ?submissionId=...).");
  }, [submissionId]);

  return (
    <div style={{ maxWidth: 900, margin: "32px auto", padding: 16 }}>
      <h1>Submit Your Answers</h1>
      <p><strong>Submission ID:</strong> {submissionId || "Not found in URL"}</p>

      {!submissionId && (
        <div style={{ background: "#fffbe6", border: "1px solid #ffe58f", padding: 12, borderRadius: 8, marginBottom: 12 }}>
          <strong>Debug:</strong> cole o ID aqui, se você tiver:
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input style={{ flex: 1 }} placeholder="submissionId" onChange={(e) => sessionStorage.setItem("sid_tmp", e.target.value.trim())}/>
            <button type="button" onClick={() => setSubmissionId(sessionStorage.getItem("sid_tmp") || "")}>Usar este ID</button>
          </div>
        </div>
      )}

      {qas.map((qa, i) => (
        <div key={i} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <h3>Question {i + 1}</h3>
          <label>Question:
            <input value={qa.question} onChange={(e) => setField(i, "question", e.target.value)} />
          </label>
          <label style={{ display: "block", marginTop: 8 }}>Answer:
            <textarea rows={4} value={qa.answer} onChange={(e) => setField(i, "answer", e.target.value)} />
          </label>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button type="button" onClick={addQA} style={{ background: "#22c55e", color: "#fff", padding: "8px 12px", borderRadius: 6 }}>
              Add Question &amp; Answer
            </button>
            <button type="button" onClick={() => removeQA(i)} disabled={qas.length === 1} style={{ background: "#e11d48", color: "#fff", padding: "8px 12px", borderRadius: 6 }}>
              Remove
            </button>
          </div>
        </div>
      ))}

      <button onClick={onSubmit} disabled={!submissionId || busy} style={{ background: !submissionId || busy ? "#6b7280" : "#2563eb", color: "#fff", padding: "10px 16px", borderRadius: 6 }}>
        {busy ? "Enviando..." : "Submit Answers"}
      </button>

      <p style={{ marginTop: 12, color: "#888" }}>
        Note: a URL precisa conter <code>?submissionId=...</code> (ex.: <code>/#/?submissionId=UUID</code>).
      </p>

      {msg && <p style={{ marginTop: 12, color: msg.includes("sucesso") ? "green" : "crimson" }}>{msg}</p>}
    </div>
  );
}
