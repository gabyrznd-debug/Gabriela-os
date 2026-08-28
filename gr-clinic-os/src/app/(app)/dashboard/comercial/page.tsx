import { Card, DemoBanner, Pill, SectionLabel } from "@/components/ui";
import { formatMoeda, formatNumero, formatPercentual } from "@/lib/format";
import { comercialKpis } from "@/lib/metrics";
import { META_FATURAMENTO_MENSAL } from "@/lib/mock-data";

const FUNIL_STEPS = [
  { label: "Leads recebidos", key: "leadsRecebidosSdr" as const },
  { label: "Respondidos", key: "respondidos" as const },
  { label: "Qualificados", key: "qualificados" as const },
  { label: "Agendados", key: "agendados" as const },
  { label: "Compareceram", key: "compareceram" as const },
  { label: "Fecharam", key: "fechamentos" as const },
];

export default function DashboardComercialPage() {
  const k = comercialKpis();
  const atingimento = k.receitaTotal / META_FATURAMENTO_MENSAL;

  const funilValores: Record<string, number> = {
    leadsRecebidosSdr: k.leadsRecebidosSdr,
    respondidos: Math.round(k.leadsRecebidosSdr * k.taxaResposta),
    qualificados: Math.round(k.leadsRecebidosSdr * k.taxaResposta * k.taxaQualificacao),
    agendados: k.agendados,
    compareceram: k.compareceram,
    fechamentos: k.fechamentos,
  };
  const maxFunil = funilValores.leadsRecebidosSdr || 1;

  return (
    <div>
      <SectionLabel>Painel · leitura das bases operacionais</SectionLabel>
      <h1 className="mt-2 font-display text-3xl font-semibold">Dashboard Geral do Comercial</h1>
      <p className="mt-2 text-ink-muted">Julho/2026 (exemplo) · comparado ao mês anterior</p>

      <DemoBanner />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="p-5 sm:col-span-2">
          <SectionLabel>Meta mensal x realizado</SectionLabel>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="font-display text-3xl font-semibold tabular-nums">{formatMoeda(k.receitaTotal)}</span>
            <span className="text-sm text-ink-muted">de {formatMoeda(META_FATURAMENTO_MENSAL)}</span>
          </div>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-accent-strong"
              style={{ width: `${Math.min(atingimento * 100, 100)}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <Pill tone={atingimento >= 0.5 ? "good" : "warn"}>{formatPercentual(atingimento)} da meta</Pill>
            <span className="text-ink-faint">faltam {formatMoeda(Math.max(META_FATURAMENTO_MENSAL - k.receitaTotal, 0))}</span>
          </div>
        </Card>
        <Card className="p-5">
          <SectionLabel>Ticket médio</SectionLabel>
          <div className="mt-2 font-display text-2xl font-semibold tabular-nums">{formatMoeda(k.ticketMedio)}</div>
        </Card>
        <Card className="p-5">
          <SectionLabel>Taxa de no-show</SectionLabel>
          <div className="mt-2 font-display text-2xl font-semibold tabular-nums">{formatPercentual(k.taxaNoShow)}</div>
        </Card>
      </div>

      <div className="mt-8">
        <SectionLabel>Funil executivo</SectionLabel>
        <Card className="mt-3 p-6">
          <div className="flex flex-col gap-3">
            {FUNIL_STEPS.map((step) => {
              const valor = funilValores[step.key];
              const pct = Math.max((valor / maxFunil) * 100, 4);
              return (
                <div key={step.key} className="flex items-center gap-4">
                  <div className="w-32 shrink-0 text-sm text-ink-muted">{step.label}</div>
                  <div className="h-7 flex-1 overflow-hidden rounded-md bg-surface-2">
                    <div
                      className="flex h-full items-center rounded-md bg-accent-soft px-3 font-mono text-[12px] font-medium text-accent-strong"
                      style={{ width: `${pct}%` }}
                    >
                      {formatNumero(valor)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <SectionLabel>Leads por origem</SectionLabel>
          <Card className="mt-3 overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full min-w-[280px] text-sm">
              <tbody>
                {Object.entries(k.leadsPorOrigem).map(([origem, qtd]) => (
                  <tr key={origem} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5 text-ink">{origem}</td>
                    <td className="px-4 py-2.5 text-right font-mono tabular-nums text-ink-muted">{qtd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </Card>
        </div>

        <div>
          <SectionLabel>Gargalo principal (leitura automática)</SectionLabel>
          <Card className="mt-3 p-5">
            <p className="text-sm text-ink">
              A maior perda proporcional do funil está entre <strong>agendados</strong> e{" "}
              <strong>compareceram</strong> — taxa de comparecimento de {formatPercentual(k.taxaComparecimento)}.
            </p>
            <p className="mt-3 text-sm text-ink-muted">
              Ação sugerida: reforçar a janela de confirmação de 24h (Recepção) e medir de novo no próximo período.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
