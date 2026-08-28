// Fórmulas oficiais dos KPIs — espelham a Especificação §6.
// Uma única função por indicador, para nunca recalcular do mesmo jeito
// diferente em telas diferentes.

import { DEMO_AGENDAMENTOS, DEMO_FECHAMENTOS, DEMO_INTERACOES_SDR, DEMO_LEADS } from "./mock-data";

function safeDiv(a: number, b: number): number {
  return b === 0 ? 0 : a / b;
}

export function comercialKpis() {
  const leadsRecebidosSdr = DEMO_INTERACOES_SDR.length;
  const respondidos = DEMO_INTERACOES_SDR.filter((i) => i.respondeu).length;
  const qualificados = DEMO_INTERACOES_SDR.filter((i) => i.qualificado).length;
  const agendados = DEMO_AGENDAMENTOS.length;
  const confirmados24h = DEMO_AGENDAMENTOS.filter((a) => a.confirmado24h).length;
  const compareceram = DEMO_AGENDAMENTOS.filter((a) => a.compareceu === true).length;
  const noShow = DEMO_AGENDAMENTOS.filter((a) => a.compareceu === false).length;
  const fechamentos = DEMO_FECHAMENTOS.length;
  const receitaTotal = DEMO_FECHAMENTOS.reduce((s, f) => s + f.receita, 0);

  const leadsPorOrigem = DEMO_LEADS.reduce<Record<string, number>>((acc, l) => {
    acc[l.origem] = (acc[l.origem] ?? 0) + 1;
    return acc;
  }, {});

  return {
    leadsRecebidosSdr,
    taxaResposta: safeDiv(respondidos, leadsRecebidosSdr),
    taxaQualificacao: safeDiv(qualificados, respondidos),
    agendados,
    taxaConfirmacao: safeDiv(confirmados24h, agendados),
    compareceram,
    taxaComparecimento: safeDiv(compareceram, agendados),
    noShow,
    taxaNoShow: safeDiv(noShow, confirmados24h),
    fechamentos,
    taxaFechamento: safeDiv(fechamentos, compareceram),
    receitaTotal,
    ticketMedio: safeDiv(receitaTotal, fechamentos),
    leadsPorOrigem,
  };
}

export function followUpsVencidos(hojeIso: string) {
  return DEMO_INTERACOES_SDR.filter((i) => i.proximoFollowup && i.proximoFollowup <= hojeIso);
}
