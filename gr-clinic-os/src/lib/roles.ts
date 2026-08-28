// Perfis e módulos do GR Clinic OS.
// Nenhum nome de pessoa fica fixo aqui — isto é a configuração de PAPÉIS,
// não de usuários. A ligação usuário → papel acontece no cadastro (Etapa 4).

export type Role =
  | "admin"
  | "gerente"
  | "social_selling"
  | "sdr"
  | "cs"
  | "recepcao"
  | "financeiro"
  | "marketing"
  | "trafego";

export interface RoleInfo {
  id: Role;
  label: string;
  pessoaExemplo: string;
  descricao: string;
}

export const ROLES: RoleInfo[] = [
  { id: "admin", label: "Administradora / Diretoria", pessoaExemplo: "Diretoria", descricao: "Acesso total, metas e usuários." },
  { id: "gerente", label: "Gerente", pessoaExemplo: "Gerência", descricao: "Visão geral e revisão de inconsistências." },
  { id: "social_selling", label: "Social Selling", pessoaExemplo: "Juslane", descricao: "Prospecção e conversas." },
  { id: "sdr", label: "SDR", pessoaExemplo: "Maria", descricao: "Qualificação e 1º agendamento." },
  { id: "cs", label: "CS", pessoaExemplo: "Ana Julia", descricao: "Reativação e recorrência da base." },
  { id: "recepcao", label: "Recepção / Agenda", pessoaExemplo: "Camila", descricao: "Confirmação, comparecimento, no-show." },
  { id: "financeiro", label: "Financeiro", pessoaExemplo: "Flávia", descricao: "Fechamento, procedimento e valor por paciente." },
  { id: "marketing", label: "Marketing / Instagram", pessoaExemplo: "Netinho", descricao: "Conteúdo, branding, planejamento." },
  { id: "trafego", label: "Gestor de Tráfego", pessoaExemplo: "Mídia paga", descricao: "Campanhas e investimento." },
];

export type ModuleId =
  | "meus_resultados"
  | "social_selling"
  | "sdr"
  | "cs"
  | "recepcao"
  | "financeiro"
  | "marketing"
  | "trafego"
  | "procedimentos"
  | "retencao"
  | "metas"
  | "qualidade_dados"
  | "inteligencia"
  | "dashboard_comercial"
  | "dashboard_marketing"
  | "dashboard_integrado"
  | "admin_usuarios"
  | "admin_auditoria";

export interface ModuleInfo {
  id: ModuleId;
  label: string;
  href: string;
  grupo: "Meu trabalho" | "Painéis" | "Gestão" | "Administração";
  status: "pronto" | "em_construcao";
}

export const MODULES: ModuleInfo[] = [
  { id: "meus_resultados", label: "Meus resultados", href: "/", grupo: "Meu trabalho", status: "pronto" },
  { id: "social_selling", label: "Social Selling", href: "/social-selling", grupo: "Meu trabalho", status: "em_construcao" },
  { id: "sdr", label: "SDR", href: "/sdr", grupo: "Meu trabalho", status: "pronto" },
  { id: "cs", label: "CS", href: "/cs", grupo: "Meu trabalho", status: "em_construcao" },
  { id: "recepcao", label: "Recepção e Agenda", href: "/recepcao", grupo: "Meu trabalho", status: "em_construcao" },
  { id: "financeiro", label: "Financeiro", href: "/financeiro", grupo: "Meu trabalho", status: "em_construcao" },
  { id: "marketing", label: "Marketing e Instagram", href: "/marketing", grupo: "Meu trabalho", status: "em_construcao" },
  { id: "trafego", label: "Tráfego Pago", href: "/trafego", grupo: "Meu trabalho", status: "em_construcao" },
  { id: "dashboard_comercial", label: "Dashboard Comercial", href: "/dashboard/comercial", grupo: "Painéis", status: "pronto" },
  { id: "dashboard_marketing", label: "Dashboard Marketing & Tráfego", href: "/dashboard/marketing", grupo: "Painéis", status: "em_construcao" },
  { id: "dashboard_integrado", label: "Dashboard Integrado", href: "/dashboard/integrado", grupo: "Painéis", status: "em_construcao" },
  { id: "procedimentos", label: "Procedimentos e Receita", href: "/procedimentos", grupo: "Painéis", status: "em_construcao" },
  { id: "retencao", label: "Retenção", href: "/retencao", grupo: "Painéis", status: "em_construcao" },
  { id: "metas", label: "Central de Metas", href: "/metas", grupo: "Gestão", status: "pronto" },
  { id: "qualidade_dados", label: "Qualidade de Dados", href: "/qualidade-dados", grupo: "Gestão", status: "em_construcao" },
  { id: "inteligencia", label: "Inteligência e Ação", href: "/inteligencia", grupo: "Gestão", status: "em_construcao" },
  { id: "admin_usuarios", label: "Usuários e Permissões", href: "/admin/usuarios", grupo: "Administração", status: "em_construcao" },
  { id: "admin_auditoria", label: "Auditoria", href: "/admin/auditoria", grupo: "Administração", status: "em_construcao" },
];

// Matriz de acesso — espelha a Especificação §3. "edit" = módulo pertence
// ao perfil; "view" = leitura; ausência de entrada = sem acesso.
type Access = "edit" | "view";
const MATRIX: Record<Role, Partial<Record<ModuleId, Access>>> = {
  admin: Object.fromEntries(MODULES.map((m) => [m.id, "edit"])) as Record<ModuleId, Access>,
  gerente: {
    meus_resultados: "view",
    dashboard_comercial: "view",
    dashboard_marketing: "view",
    dashboard_integrado: "view",
    procedimentos: "view",
    retencao: "view",
    metas: "view",
    qualidade_dados: "view",
    inteligencia: "edit",
  },
  social_selling: { meus_resultados: "view", social_selling: "edit", metas: "view", qualidade_dados: "view" },
  sdr: { meus_resultados: "view", sdr: "edit", metas: "view", qualidade_dados: "view" },
  cs: { meus_resultados: "view", cs: "edit", retencao: "edit", metas: "view", qualidade_dados: "view" },
  recepcao: { meus_resultados: "view", recepcao: "edit", metas: "view", qualidade_dados: "view" },
  financeiro: { meus_resultados: "view", financeiro: "edit", procedimentos: "view", metas: "view", qualidade_dados: "view" },
  marketing: { meus_resultados: "view", marketing: "edit", dashboard_marketing: "view", metas: "view", qualidade_dados: "view" },
  trafego: { meus_resultados: "view", trafego: "edit", dashboard_marketing: "view", metas: "view", qualidade_dados: "view" },
};

export function modulesForRole(role: Role): (ModuleInfo & { access: Access })[] {
  const allowed = MATRIX[role];
  return MODULES.filter((m) => allowed[m.id]).map((m) => ({ ...m, access: allowed[m.id]! }));
}

export function canEdit(role: Role, moduleId: ModuleId): boolean {
  return MATRIX[role][moduleId] === "edit";
}

export function roleInfo(role: Role): RoleInfo {
  return ROLES.find((r) => r.id === role)!;
}
