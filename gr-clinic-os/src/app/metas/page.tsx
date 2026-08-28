import { Card, DemoBanner, Pill, SectionLabel } from "@/components/ui";
import { formatMoeda, formatNumero, formatPercentual } from "@/lib/format";
import { comercialKpis } from "@/lib/metrics";
import { META_FATURAMENTO_MENSAL } from "@/lib/mock-data";

const METAS = [
  { escopo: "Clínica", indicador: "Faturamento mensal", meta: META_FATURAMENTO_MENSAL, formato: "moeda" as const },
  { escopo: "SDR", indicador: "Novas consultas qualificadas / mês", meta: 50, formato: "numero" as const },
  { escopo: "CS", indicador: "Reativações / agendamentos da base / mês", meta: 70, formato: "numero" as const },
  { escopo: "Tráfego", indicador: "Dependência máxima do pago", meta: 0.55, formato: "percentual" as const },
  { escopo: "Retenção", indicador: "Taxa de retorno", meta: 0.55, formato: "percentual" as const },
];

export default function MetasPage() {
  const k = comercialKpis();
  const realizadoPorIndicador: Record<string, number> = {
    "Faturamento mensal": k.receitaTotal,
    "Novas consultas qualificadas / mês": k.agendados,
    "Reativações / agendamentos da base / mês": 0,
    "Dependência máxima do pago": 0,
    "Taxa de retorno": 0,
  };

  return (
    <div>
      <SectionLabel>Central de metas · leitura</SectionLabel>
      <h1 className="mt-2 font-display text-3xl font-semibold">Metas do período</h1>
      <p className="mt-2 max-w-[60ch] text-ink-muted">
        Configuráveis por escopo (clínica, unidade, pessoa, procedimento) e período — sem nome fixo no código. A
        edição fica disponível para Administradora e Gerente autorizada.
      </p>
      <DemoBanner />

      <Card className="mt-2 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-2 text-left font-mono text-[10.5px] uppercase tracking-wider text-ink-faint">
              <th className="px-4 py-2.5">Escopo</th>
              <th className="px-4 py-2.5">Indicador</th>
              <th className="px-4 py-2.5">Meta</th>
              <th className="px-4 py-2.5">Realizado</th>
              <th className="px-4 py-2.5">Status</th>
            </tr>
          </thead>
          <tbody>
            {METAS.map((m) => {
              const realizado = realizadoPorIndicador[m.indicador] ?? 0;
              const fmt = m.formato === "moeda" ? formatMoeda : m.formato === "percentual" ? formatPercentual : formatNumero;
              const atingiu = realizado >= m.meta;
              return (
                <tr key={m.indicador} className="border-b border-border last:border-0">
                  <td className="px-4 py-2.5 text-ink">{m.escopo}</td>
                  <td className="px-4 py-2.5 text-ink-muted">{m.indicador}</td>
                  <td className="px-4 py-2.5 font-mono tabular-nums text-ink-muted">{fmt(m.meta)}</td>
                  <td className="px-4 py-2.5 font-mono tabular-nums text-ink">{fmt(realizado)}</td>
                  <td className="px-4 py-2.5">
                    <Pill tone={atingiu ? "good" : "warn"}>{atingiu ? "atingida" : "em progresso"}</Pill>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  );
}
