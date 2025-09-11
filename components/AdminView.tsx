import React, { useState } from "react";
import { supabaseService } from "../services/supabaseService";
import type { Recipient } from "../types";

const DEFAULT_QUESTIONS = [
  "GHG boundary & scopes",
  "Energia (SASB IF-EU-130a.1)",
  "Risco climático (IFRS S2)",
  "Água",
  "Resíduos & circularidade",
];

export default function AdminView() {
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: crypto.randomUUID(), name: "", role: "", email: "", selectedQuestions: [] },
  ]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [generatedLinks, setGeneratedLinks] = useState<{ name: string; url: string }[]>([]);

  const updateRecipient = (i: number, key: keyof Recipient, val: any) => {
    setRecipients(prev => prev.map((r, idx) => idx === i ? { ...r, [key]: val } : r));
  };
  const toggleQ = (i: number, q: string) => {
    setRecipients(prev => prev.map((r, idx) => {
      if (idx !== i) return r;
      const list = r.selectedQuestions ?? [];
      return { ...r, selectedQuestions: list.includes(q) ? list.filter(x => x !== q) : [...list, q] };
    }));
  };

  async function handleSaveAndSend() {
    setMsg(null);
    setLoading(true);
    try {
      const result = await supabaseService.saveProjectData({ projectName, clientName, recipients });
      setGeneratedLinks(result.links.map(l => ({ name: l.recipientName, url: l.url })));

      // Abrir mailto (um por destinatário)
      recipients.forEach((r) => {
        const link = result.links.find(x => x.recipientName === r.name)?.url;
        const subject = `Formulário do Projeto: ${projectName}`;
        const body =
          `Olá ${r.name},\n\n` +
          `Por favor, responda às perguntas do projeto "${projectName}".\n` +
          `${link}\n\nObrigado,\nEnvironPact`;
        const mailto = `mailto:${encodeURIComponent(r.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailto, "_self");
      });

      setMsg("OK: links gerados e e-mails abertos.");
    } catch (e: any) {
      setMsg(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  const disabled =
    !projectName || !clientName || recipients.some(r => !r.name || !r.role || !r.email);

  return (
    <div style={{ maxWidth: 900, margin: "32px auto", padding: 16 }}>
      <h1>Admin – Criar Projeto & Enviar Links</h1>

      <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
        <label>Project Name
          <input value={projectName} onChange={e => setProjectName(e.target.value)} />
        </label>
        <label>Client Name
          <input value={clientName} onChange={e => setClientName(e.target.value)} />
        </label>
      </div>

      <h2 style={{ marginTop: 24 }}>Destinatários</h2>

      {recipients.map((r, i) => (
        <div key={r.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, margin: "12px 0" }}>
          <div style={{ display: "grid", gap: 8 }}>
            <label>Nome
              <input value={r.name} onChange={e => updateRecipient(i, "name", e.target.value)} />
            </label>
            <label>Role
              <input value={r.role} onChange={e => updateRecipient(i, "role", e.target.value)} />
            </label>
            <label>Email
              <input type="email" value={r.email} onChange={e => updateRecipient(i, "email", e.target.value)} />
            </label>
          </div>

          <fieldset style={{ marginTop: 8 }}>
            <legend>Select questions</legend>
            {DEFAULT_QUESTIONS.map(q => (
              <label key={q} style={{ display: "inline-flex", gap: 6, marginRight: 16 }}>
                <input
                  type="checkbox"
                  checked={(r.selectedQuestions ?? []).includes(q)}
                  onChange={() => toggleQ(i, q)}
                />
                {q}
              </label>
            ))}
          </fieldset>
        </div>
      ))}

      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" onClick={() =>
          setRecipients(prev => [...prev, { id: crypto.randomUUID(), name: "", role: "", email: "", selectedQuestions: [] }])
        }>+ Adicionar destinatário</button>

        <button type="button" onClick={() =>
          setRecipients(prev => prev.length > 1 ? prev.slice(0, -1) : prev)
        }>- Remover último</button>
      </div>

      <div style={{ marginTop: 16 }}>
        <button onClick={handleSaveAndSend} disabled={disabled || loading}>
          {loading ? "Enviando..." : "Salvar & abrir e-mails"}
        </button>
      </div>

      {msg && <p style={{ marginTop: 12, color: msg.startsWith("OK") ? "green" : "crimson" }}>{msg}</p>}

      {!!generatedLinks.length && (
        <>
          <h3 style={{ marginTop: 20 }}>Links gerados</h3>
          <ul>
            {generatedLinks.map((l) => (
              <li key={l.url}><a href={l.url} target="_blank">{l.name}</a></li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
