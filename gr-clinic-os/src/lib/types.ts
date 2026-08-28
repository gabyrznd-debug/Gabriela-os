// Tipos de domínio — espelham o dicionário de dados da Especificação (§4).
// Nesta Etapa 3 (protótipo) os dados vêm de src/lib/mock-data.ts, sempre
// marcados com `demo: true`. Na Etapa 4 estas mesmas formas passam a vir
// do Supabase.

export type Origem =
  | "Orgânico"
  | "Meta Ads"
  | "Google Ads"
  | "WPP Ads"
  | "Indicação"
  | "Social Selling";

export interface Lead {
  id: string;
  origem: Origem;
  cidade: string;
  dataEntrada: string; // ISO date
  mensagemInicialRecebida?: string;
  demo: true;
}

export interface InteracaoSDR {
  id: string;
  leadId: string;
  responsavel: string;
  data: string;
  respondeu: boolean;
  qualificado: boolean;
  agendou: boolean;
  motivoPerda?: string;
  proximoFollowup?: string;
  demo: true;
}

export interface Agendamento {
  id: string;
  leadId: string;
  origemDoAgendamento: "SDR" | "CS";
  profissional: string;
  dataConsulta: string;
  confirmado24h: boolean | null;
  compareceu: boolean | null;
  demo: true;
}

export interface Fechamento {
  id: string;
  agendamentoId: string;
  procedimento: string;
  receita: number;
  dataFechamento: string;
  demo: true;
}

export interface KpiPonto {
  label: string;
  valor: number;
  meta?: number;
  formato: "moeda" | "numero" | "percentual";
}
