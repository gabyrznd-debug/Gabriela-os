"use client";

import { useState } from "react";
import { Card, DemoBanner, Pill, SectionLabel } from "@/components/ui";
import { formatData } from "@/lib/format";
import { DEMO_INTERACOES_SDR, DEMO_LEADS } from "@/lib/mock-data";
import type { Origem } from "@/lib/types";

const ORIGENS: Origem[] = ["Orgânico", "Meta Ads", "Google Ads", "WPP Ads", "Indicação", "Social Selling"];
const MOTIVOS_PERDA = ["Valor consulta", "Valor procedimento", "Cidade / Distância", "Falar com marido", "Sem interesse", "Outro"];
const MENSAGENS_CADASTRADAS = ["Olá, vim do anúncio Tríade", "Olá, vim do anúncio Boston", "Nenhuma — contato direto"];

interface NovoRegistro {
  id: string;
  origem: Origem;
  cidade: string;
  mensagemInicial: string;
  respondeu: boolean;
  qualificado: boolean;
  agendou: boolean;
  motivoPerda: string;
  proximoFollowup: string;
  criadoEm: string;
}

export default function SdrPage() {
  const [novos, setNovos] = useState<NovoRegistro[]>([]);
  const [salvo, setSalvo] = useState(false);

  const [origem, setOrigem] = useState<Origem>("Orgânico");
  const [cidade, setCidade] = useState("Belo Horizonte");
  const [mensagemInicial, setMensagemInicial] = useState(MENSAGENS_CADASTRADAS[2]);
  const [respondeu, setRespondeu] = useState(true);
  const [qualificado, setQualificado] = useState(false);
  const [agendou, setAgendou] = useState(false);
  const [motivoPerda, setMotivoPerda] = useState("");
  const [proximoFollowup, setProximoFollowup] = useState("");

  function registrar(e: React.FormEvent) {
    e.preventDefault();
    const reg: NovoRegistro = {
      id: `novo-${novos.length + 1}`,
      origem,
      cidade,
      mensagemInicial,
      respondeu,
      qualificado,
      agendou,
      motivoPerda,
      proximoFollowup,
      criadoEm: new Date().toISOString(),
    };
    setNovos((prev) => [reg, ...prev]);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2500);
    setQualificado(false);
    setAgendou(false);
    setMotivoPerda("");
    setProximoFollowup("");
  }

  return (
    <div>
      <SectionLabel>Módulo SDR</SectionLabel>
      <h1 className="mt-2 font-display text-3xl font-semibold">Registrar lead recebido</h1>
      <p className="mt-2 max-w-[60ch] text-ink-muted">
        Formulário curto, com listas em vez de digitação livre — do jeito descrito na Especificação (Fluxo A).
      </p>
      <DemoBanner>
        O que você registrar aqui fica só nesta sessão do navegador — é um protótipo visual. A persistência real
        chega na Etapa 4, com banco de dados.
      </DemoBanner>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        <Card className="p-6">
          <form onSubmit={registrar} className="flex flex-col gap-4">
            <Field label="Origem">
              <select value={origem} onChange={(e) => setOrigem(e.target.value as Origem)} className="input">
                {ORIGENS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </Field>

            <Field label="Cidade">
              <select value={cidade} onChange={(e) => setCidade(e.target.value)} className="input">
                {["Belo Horizonte", "Betim", "Contagem", "Nova Lima", "Outra"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>

            {(origem === "Meta Ads" || origem === "WPP Ads" || origem === "Google Ads") && (
              <Field label="Mensagem inicial recebida" hint="Define a campanha de origem automaticamente.">
                <select value={mensagemInicial} onChange={(e) => setMensagemInicial(e.target.value)} className="input">
                  {MENSAGENS_CADASTRADAS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </Field>
            )}

            <div className="flex flex-col gap-2.5 rounded-lg border border-border bg-surface-2 p-3.5">
              <Toggle label="Respondeu" checked={respondeu} onChange={setRespondeu} />
              <Toggle label="Qualificado" checked={qualificado} onChange={setQualificado} disabled={!respondeu} />
              <Toggle label="Agendou" checked={agendou} onChange={setAgendou} disabled={!qualificado} />
            </div>

            {respondeu && !agendou && (
              <Field label="Motivo de perda (se houver)">
                <select value={motivoPerda} onChange={(e) => setMotivoPerda(e.target.value)} className="input">
                  <option value="">—</option>
                  {MOTIVOS_PERDA.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </Field>
            )}

            {!agendou && (
              <Field label="Próximo follow-up">
                <input
                  type="date"
                  value={proximoFollowup}
                  onChange={(e) => setProximoFollowup(e.target.value)}
                  className="input"
                />
              </Field>
            )}

            <button
              type="submit"
              className="mt-2 rounded-lg bg-accent-strong px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Salvar registro
            </button>
            {salvo && <p className="text-center text-sm text-good">Registro salvo.</p>}
          </form>
        </Card>

        <div>
          <SectionLabel>Meus leads</SectionLabel>
          <Card className="mt-3 overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-2 text-left font-mono text-[10.5px] uppercase tracking-wider text-ink-faint">
                  <th className="px-4 py-2.5">Data</th>
                  <th className="px-4 py-2.5">Origem</th>
                  <th className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {novos.map((n) => (
                  <tr key={n.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5">agora</td>
                    <td className="px-4 py-2.5">{n.origem}</td>
                    <td className="px-4 py-2.5">
                      <Pill tone={n.agendou ? "good" : n.qualificado ? "warn" : "neutral"}>
                        {n.agendou ? "agendou" : n.qualificado ? "qualificado" : n.respondeu ? "respondeu" : "sem resposta"}
                      </Pill>
                    </td>
                  </tr>
                ))}
                {DEMO_INTERACOES_SDR.map((i) => {
                  const lead = DEMO_LEADS.find((l) => l.id === i.leadId)!;
                  return (
                    <tr key={i.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-2.5 text-ink-muted">{formatData(i.data)}</td>
                      <td className="px-4 py-2.5 text-ink-muted">{lead.origem}</td>
                      <td className="px-4 py-2.5">
                        <Pill tone={i.agendou ? "good" : i.qualificado ? "warn" : "neutral"}>
                          {i.agendou ? "agendou" : i.qualificado ? "qualificado" : i.respondeu ? "respondeu" : "sem resposta"}
                        </Pill>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          </Card>
        </div>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid var(--border-c);
          background: var(--surface);
          padding: 0.55rem 0.75rem;
          font-size: 0.875rem;
          color: var(--ink);
          outline: none;
        }
        .input:focus {
          border-color: var(--accent);
        }
      `}</style>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="mt-1 block text-[12px] text-ink-faint">{hint}</span>}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className={`flex items-center justify-between text-sm ${disabled ? "opacity-40" : ""}`}>
      <span className="text-ink">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[var(--accent-strong)]"
      />
    </label>
  );
}
