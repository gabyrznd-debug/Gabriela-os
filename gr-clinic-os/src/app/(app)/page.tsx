"use client";

import Link from "next/link";
import { useRole } from "@/lib/role-context";
import { modulesForRole, roleInfo } from "@/lib/roles";
import { Card, DemoBanner, KpiCard, Pill, SectionLabel } from "@/components/ui";
import { comercialKpis, followUpsVencidos } from "@/lib/metrics";
import { formatData } from "@/lib/format";
import { DEMO_LEADS } from "@/lib/mock-data";

export default function MeusResultadosPage() {
  const { role, nome, authMode } = useRole();
  const info = roleInfo(role);
  // Com login real, mostra o nome de verdade de quem está logada; no
  // modo demonstração, cai no nome de exemplo do perfil selecionado.
  const nomeExibido = nome ?? info.pessoaExemplo;
  const modules = modulesForRole(role).filter((m) => m.id !== "meus_resultados");
  const kpis = comercialKpis();
  const vencidos = followUpsVencidos("2026-07-09");

  return (
    <div>
      <SectionLabel>Meus resultados</SectionLabel>
      <h1 className="mt-2 font-display text-3xl font-semibold">Olá, {nomeExibido}</h1>
      <p className="mt-2 text-ink-muted">
        {authMode === "real" ? (
          <>
            Perfil: <strong className="text-ink">{info.label}</strong> — {info.descricao}
          </>
        ) : (
          <>
            Perfil selecionado: <strong className="text-ink">{info.label}</strong> — {info.descricao}
          </>
        )}
      </p>

      <DemoBanner />

      {role === "sdr" && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Leads recebidos" valor={kpis.leadsRecebidosSdr} formato="numero" />
            <KpiCard label="Taxa de resposta" valor={kpis.taxaResposta} formato="percentual" />
            <KpiCard label="Qualificados" valor={kpis.leadsRecebidosSdr === 0 ? 0 : Math.round(kpis.taxaQualificacao * 100) / 100} formato="percentual" />
            <KpiCard label="Agendamentos" valor={kpis.agendados} meta={50} formato="numero" />
          </div>
          {vencidos.length > 0 && (
            <Card className="mt-6 p-5">
              <SectionLabel>Follow-ups vencidos</SectionLabel>
              <ul className="mt-3 space-y-2">
                {vencidos.map((v) => {
                  const lead = DEMO_LEADS.find((l) => l.id === v.leadId);
                  return (
                    <li key={v.id} className="flex items-center justify-between text-sm">
                      <span>Lead {v.leadId} · {lead?.origem}</span>
                      <Pill tone="crit">venceu {formatData(v.proximoFollowup!)}</Pill>
                    </li>
                  );
                })}
              </ul>
            </Card>
          )}
        </>
      )}

      {(role === "admin" || role === "gerente") && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Receita do período" valor={kpis.receitaTotal} formato="moeda" />
          <KpiCard label="Fechamentos" valor={kpis.fechamentos} formato="numero" />
          <KpiCard label="Taxa de comparecimento" valor={kpis.taxaComparecimento} formato="percentual" />
          <KpiCard label="Ticket médio" valor={kpis.ticketMedio} formato="moeda" />
        </div>
      )}

      {!["sdr", "admin", "gerente"].includes(role) && (
        <Card className="p-6">
          <p className="text-ink-muted">
            O painel de indicadores deste perfil entra nas próximas rodadas do protótipo. Por enquanto, use o menu à
            esquerda para navegar pelos módulos liberados para <strong className="text-ink">{info.label}</strong>.
          </p>
        </Card>
      )}

      <div className="mt-8">
        <SectionLabel>Seus módulos</SectionLabel>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <Link
              key={m.id}
              href={m.href}
              className="rounded-xl border border-border bg-surface p-4 text-sm transition-colors hover:border-accent hover:bg-surface-2"
            >
              <div className="font-medium text-ink">{m.label}</div>
              <div className="mt-1 font-mono text-[11px] text-ink-faint">
                {m.access === "edit" ? "preencher" : "somente leitura"}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
