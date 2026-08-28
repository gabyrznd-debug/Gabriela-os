// ATENÇÃO: dados de DEMONSTRAÇÃO para o protótipo (Etapa 3).
// Números fixos e plausíveis, não a importação real de julho/2026 —
// essa migração acontece na Etapa 5. Todo registro carrega `demo: true`
// para que a interface nunca deixe isso implícito.

import type { Agendamento, Fechamento, InteracaoSDR, Lead } from "./types";

export const DEMO_LEADS: Lead[] = [
  { id: "L1", origem: "Orgânico", cidade: "Belo Horizonte", dataEntrada: "2026-07-01", demo: true },
  { id: "L2", origem: "WPP Ads", cidade: "Betim", dataEntrada: "2026-07-01", mensagemInicialRecebida: "Olá, vim do anúncio Tríade", demo: true },
  { id: "L3", origem: "Social Selling", cidade: "Belo Horizonte", dataEntrada: "2026-07-02", demo: true },
  { id: "L4", origem: "Orgânico", cidade: "Contagem", dataEntrada: "2026-07-03", demo: true },
  { id: "L5", origem: "WPP Ads", cidade: "Belo Horizonte", dataEntrada: "2026-07-03", mensagemInicialRecebida: "Olá, vim do anúncio Tríade", demo: true },
  { id: "L6", origem: "Indicação", cidade: "Nova Lima", dataEntrada: "2026-07-04", demo: true },
  { id: "L7", origem: "Social Selling", cidade: "Betim", dataEntrada: "2026-07-05", demo: true },
  { id: "L8", origem: "Orgânico", cidade: "Belo Horizonte", dataEntrada: "2026-07-06", demo: true },
  { id: "L9", origem: "WPP Ads", cidade: "Contagem", dataEntrada: "2026-07-07", mensagemInicialRecebida: "Olá, vim do anúncio Boston", demo: true },
  { id: "L10", origem: "Orgânico", cidade: "Belo Horizonte", dataEntrada: "2026-07-08", demo: true },
];

export const DEMO_INTERACOES_SDR: InteracaoSDR[] = [
  { id: "I1", leadId: "L1", responsavel: "Maria", data: "2026-07-01", respondeu: true, qualificado: true, agendou: true, demo: true },
  { id: "I2", leadId: "L2", responsavel: "Maria", data: "2026-07-01", respondeu: true, qualificado: true, agendou: false, motivoPerda: "Valor consulta", demo: true },
  { id: "I3", leadId: "L3", responsavel: "Maria", data: "2026-07-02", respondeu: true, qualificado: true, agendou: true, demo: true },
  { id: "I4", leadId: "L4", responsavel: "Maria", data: "2026-07-03", respondeu: false, qualificado: false, agendou: false, proximoFollowup: "2026-07-10", demo: true },
  { id: "I5", leadId: "L5", responsavel: "Maria", data: "2026-07-03", respondeu: true, qualificado: true, agendou: true, demo: true },
  { id: "I6", leadId: "L6", responsavel: "Maria", data: "2026-07-04", respondeu: true, qualificado: false, agendou: false, motivoPerda: "Sem interesse", demo: true },
  { id: "I7", leadId: "L7", responsavel: "Maria", data: "2026-07-05", respondeu: true, qualificado: true, agendou: true, demo: true },
  { id: "I8", leadId: "L8", responsavel: "Maria", data: "2026-07-06", respondeu: false, qualificado: false, agendou: false, proximoFollowup: "2026-07-09", demo: true },
  { id: "I9", leadId: "L9", responsavel: "Maria", data: "2026-07-07", respondeu: true, qualificado: true, agendou: false, motivoPerda: "Cidade / Distância", demo: true },
  { id: "I10", leadId: "L10", responsavel: "Maria", data: "2026-07-08", respondeu: true, qualificado: true, agendou: true, demo: true },
];

export const DEMO_AGENDAMENTOS: Agendamento[] = [
  { id: "A1", leadId: "L1", origemDoAgendamento: "SDR", profissional: "Dra. Gabriela", dataConsulta: "2026-07-08", confirmado24h: true, compareceu: true, demo: true },
  { id: "A2", leadId: "L3", origemDoAgendamento: "SDR", profissional: "Dra. Gabriela", dataConsulta: "2026-07-09", confirmado24h: true, compareceu: true, demo: true },
  { id: "A3", leadId: "L5", origemDoAgendamento: "SDR", profissional: "Dra. Giovanna", dataConsulta: "2026-07-10", confirmado24h: true, compareceu: false, demo: true },
  { id: "A4", leadId: "L7", origemDoAgendamento: "SDR", profissional: "Dra. Gabriela", dataConsulta: "2026-07-12", confirmado24h: false, compareceu: null, demo: true },
  { id: "A5", leadId: "L10", origemDoAgendamento: "SDR", profissional: "Dra. Giovanna", dataConsulta: "2026-07-14", confirmado24h: true, compareceu: true, demo: true },
];

export const DEMO_FECHAMENTOS: Fechamento[] = [
  { id: "F1", agendamentoId: "A1", procedimento: "Toxina botulínica", receita: 2200, dataFechamento: "2026-07-08", demo: true },
  { id: "F2", agendamentoId: "A2", procedimento: "Preenchimento labial", receita: 3400, dataFechamento: "2026-07-09", demo: true },
  { id: "F3", agendamentoId: "A5", procedimento: "Bioestimulador", receita: 5800, dataFechamento: "2026-07-14", demo: true },
];

export const META_FATURAMENTO_MENSAL = 750_000;
