import type { ReactNode } from "react";
import { formatMoeda, formatNumero, formatPercentual } from "@/lib/format";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-surface shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="font-mono text-[11px] tracking-wider uppercase text-ink-faint">
      {children}
    </div>
  );
}

type Tone = "neutral" | "good" | "warn" | "crit" | "accent";
const toneClasses: Record<Tone, string> = {
  neutral: "bg-surface-2 text-ink-muted border border-border",
  good: "bg-good-soft text-good",
  warn: "bg-accent-soft text-accent-strong",
  crit: "bg-crit-soft text-crit",
  accent: "bg-accent-soft text-accent-strong",
};

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-medium whitespace-nowrap ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}

export function DemoBanner({ children }: { children?: ReactNode }) {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-lg border border-accent-soft bg-accent-soft/60 px-4 py-3 text-sm text-accent-strong">
      <span className="mt-0.5 font-mono text-[11px] tracking-wider uppercase shrink-0">Demonstração</span>
      <span className="text-ink-muted">
        {children ?? "Estes números são dados de exemplo do protótipo — a importação real de julho/2026 acontece na Etapa 5."}
      </span>
    </div>
  );
}

export function KpiCard({
  label,
  valor,
  meta,
  formato,
}: {
  label: string;
  valor: number;
  meta?: number;
  formato: "moeda" | "numero" | "percentual";
}) {
  const fmt = formato === "moeda" ? formatMoeda : formato === "percentual" ? formatPercentual : formatNumero;
  const abaixoDaMeta = meta !== undefined && valor < meta;
  return (
    <Card className="p-5">
      <SectionLabel>{label}</SectionLabel>
      <div className="mt-2 font-display text-3xl font-semibold text-ink tabular-nums">{fmt(valor)}</div>
      {meta !== undefined && (
        <div className="mt-2">
          <Pill tone={abaixoDaMeta ? "warn" : "good"}>
            meta {fmt(meta)}
          </Pill>
        </div>
      )}
    </Card>
  );
}

export function ComingSoon({ title, telas, responsavel }: { title: string; telas: string[]; responsavel: string }) {
  return (
    <div>
      <SectionLabel>Módulo planejado</SectionLabel>
      <h1 className="mt-2 font-display text-3xl font-semibold">{title}</h1>
      <p className="mt-3 max-w-[60ch] text-ink-muted">
        Esta tela ainda não foi construída nesta rodada do protótipo. Ela está especificada e entra nas próximas —
        preenchida por <strong className="text-ink">{responsavel}</strong>.
      </p>
      <Card className="mt-6 p-6">
        <SectionLabel>Telas previstas</SectionLabel>
        <ul className="mt-3 space-y-2">
          {telas.map((t) => (
            <li key={t} className="flex items-center gap-2 text-sm text-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {t}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
