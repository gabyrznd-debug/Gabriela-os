-- GR Clinic OS — schema principal
-- Espelha o dicionário de dados da Especificação (§4), com duas
-- simplificações deliberadas, documentadas aqui em vez de escondidas:
--
-- 1. `comparecimento` não é uma tabela própria — vira colunas de
--    `agendamento` (compareceu/no_show/motivo_no_show), porque é sempre
--    1:1 com o agendamento e nunca existe sozinho.
-- 2. `motivo_perda` não é uma tabela própria — vira uma coluna de texto
--    em cada tabela operacional, validada no app contra `lista_config`
--    (categoria configurável), em vez de uma tabela genérica com FK
--    polimórfica. Mais simples de consultar, igualmente configurável.

create extension if not exists pgcrypto;

-- ── Enums ────────────────────────────────────────────────────────────
-- Papéis são enum (poucos, estáveis, exigem migração para mudar — o que
-- é correto: papel é uma decisão de arquitetura, não um cadastro).
-- Nomes de PESSOAS nunca aparecem aqui — só o papel.
create type papel_tipo as enum (
  'admin', 'gerente', 'social_selling', 'sdr', 'cs', 'recepcao', 'financeiro', 'marketing', 'trafego'
);

-- Origem é enum fechado e canônico — fim da duplicidade "Indicação" /
-- "Indicações" encontrada no diagnóstico (§4.2).
create type origem_tipo as enum (
  'Orgânico', 'Meta Ads', 'Google Ads', 'WPP Ads', 'Indicação', 'Social Selling'
);

create type janela_confirmacao as enum ('30d', '7d', '24h');

-- Distingue registro por pessoa de registro só agregado por plataforma
-- (critério de aceite nº16 — nunca misturar as duas contagens).
create type granularidade_tipo as enum ('individual', 'agregado');

-- ── Usuários e papéis ────────────────────────────────────────────────
-- Perfil de cada pessoa que usa o sistema, 1:1 com auth.users do
-- Supabase Auth. Nenhum nome fica fixo no código — trocar "Flávia" por
-- outra pessoa é uma linha nesta tabela, não uma alteração de código
-- (critério de aceite nº20).
create table public.usuarios (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null,
  papel papel_tipo not null,
  ativo boolean not null default true,
  pode_editar_metas boolean not null default false,
  criado_em timestamptz not null default now()
);

-- ── Listas configuráveis ─────────────────────────────────────────────
-- Canais do CS, motivos de perda por módulo, objetivos de conteúdo etc.
-- Configurável pela Administradora sem alterar código (critério nº9).
create table public.lista_config (
  id uuid primary key default gen_random_uuid(),
  categoria text not null, -- ex.: 'canal_cs', 'motivo_perda_sdr', 'objetivo_conteudo'
  valor text not null,
  ordem integer not null default 0,
  ativo boolean not null default true,
  unique (categoria, valor)
);

-- ── Marketing e tráfego ──────────────────────────────────────────────
create table public.campanha_trafego (
  id uuid primary key default gen_random_uuid(),
  plataforma text not null,
  campanha text not null,
  conjunto text,
  anuncio text,
  objetivo text,
  cidade_alvo text,
  investimento numeric(12, 2) not null default 0 check (investimento >= 0),
  periodo_inicio date not null,
  periodo_fim date not null,
  criado_por uuid references public.usuarios (id),
  criado_em timestamptz not null default now(),
  check (periodo_fim >= periodo_inicio)
);

-- Decisão 3 (validada com a diretoria): a chave de atribuição
-- tráfego → SDR é a mensagem inicial pré-programada da conversa
-- ("Olá, vim do anúncio X"), não UTM nem telefone.
create table public.mensagem_campanha (
  id uuid primary key default gen_random_uuid(),
  texto_mensagem_inicial text not null unique,
  campanha_trafego_id uuid not null references public.campanha_trafego (id) on delete cascade,
  criado_em timestamptz not null default now()
);

create table public.conteudo (
  id uuid primary key default gen_random_uuid(),
  data date not null,
  perfil text not null,
  formato text not null,
  titulo text,
  pilar text,
  objetivo text,
  cta text,
  territorio_marca text[] not null default '{}',
  alcance integer not null default 0 check (alcance >= 0),
  visualizacoes integer not null default 0 check (visualizacoes >= 0),
  curtidas integer not null default 0 check (curtidas >= 0),
  comentarios integer not null default 0 check (comentarios >= 0),
  salvamentos integer not null default 0 check (salvamentos >= 0),
  compartilhamentos integer not null default 0 check (compartilhamentos >= 0),
  visitas_perfil integer not null default 0 check (visitas_perfil >= 0),
  cliques integer not null default 0 check (cliques >= 0),
  codigo_atribuicao text unique,
  aprendizado text,
  criado_por uuid references public.usuarios (id),
  criado_em timestamptz not null default now()
);

create table public.metrica_perfil (
  id uuid primary key default gen_random_uuid(),
  perfil text not null,
  periodo_inicio date not null,
  periodo_fim date not null,
  seguidores_inicio integer,
  seguidores_fim integer,
  alcance integer,
  visualizacoes integer,
  nao_seguidores_pct numeric(5, 4),
  visitas_perfil integer,
  cliques_bio integer,
  respostas_stories integer,
  dms_iniciadas integer,
  criado_por uuid references public.usuarios (id),
  criado_em timestamptz not null default now(),
  unique (perfil, periodo_inicio, periodo_fim),
  check (periodo_fim >= periodo_inicio)
);

-- ── Procedimentos ────────────────────────────────────────────────────
create table public.procedimento (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  categoria text,
  -- Nulo até a diretoria informar o custo real — nunca um percentual
  -- fictício de margem (critério de aceite nº18).
  custo_real numeric(12, 2) check (custo_real is null or custo_real >= 0),
  recorrencia_esperada text,
  -- Reservado para a Decisão 4 (2ª fase, quando a planilha do GR Method
  -- chegar) — inativo até lá.
  tag_gr_method boolean not null default false,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

-- ── Funil comercial ──────────────────────────────────────────────────
create table public.lead (
  id uuid primary key default gen_random_uuid(),
  origem origem_tipo not null,
  cidade text not null,
  data_entrada date not null default current_date,
  mensagem_inicial_recebida text,
  campanha_trafego_id uuid references public.campanha_trafego (id),
  granularidade granularidade_tipo not null default 'individual',
  criado_por uuid references public.usuarios (id),
  criado_em timestamptz not null default now()
);

create table public.interacao_social_selling (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.lead (id),
  responsavel_id uuid not null references public.usuarios (id),
  data date not null default current_date,
  conversas_iniciadas integer not null default 1 check (conversas_iniciadas >= 0),
  respondeu boolean,
  oportunidade_identificada boolean,
  oportunidade_enviada_sdr boolean not null default false,
  continuou_apos_localizacao boolean,
  agendamento_atribuido boolean not null default false,
  motivo_perda text,
  observacao text,
  criado_em timestamptz not null default now()
);

create table public.interacao_sdr (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.lead (id),
  responsavel_id uuid not null references public.usuarios (id),
  data date not null default current_date,
  respondeu boolean not null default false,
  primeira_resposta_min integer check (primeira_resposta_min is null or primeira_resposta_min >= 0),
  qualificado boolean not null default false,
  agendou boolean not null default false,
  pagou_consulta boolean,
  motivo_perda text,
  proximo_followup date,
  observacao text,
  criado_em timestamptz not null default now()
);

create table public.interacao_cs (
  id uuid primary key default gen_random_uuid(),
  -- Paciente existente — reaproveita `lead` como identidade única da
  -- pessoa, mesmo quando ela já é da base (não um lead novo).
  lead_id uuid not null references public.lead (id),
  responsavel_id uuid not null references public.usuarios (id),
  data date not null default current_date,
  canal text not null, -- lista em lista_config categoria='canal_cs'
  contatos integer not null default 1 check (contatos >= 0),
  respondeu boolean,
  reativou boolean,
  agendou boolean not null default false,
  motivo_perda text,
  proximo_followup date,
  observacao text,
  criado_em timestamptz not null default now()
);

create table public.agendamento (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.lead (id),
  origem_do_agendamento text not null check (origem_do_agendamento in ('SDR', 'CS')),
  criado_por uuid not null references public.usuarios (id),
  profissional text not null,
  unidade text,
  data_consulta date not null,
  pagamento_consulta boolean not null default false,
  -- Resultado final — 1:1 com o agendamento, nunca existe sozinho.
  compareceu boolean,
  no_show boolean,
  motivo_no_show text,
  criado_em timestamptz not null default now()
);

-- Substitui os 3 blocos soltos (30d/7d/24h) da planilha da Secretária —
-- um único agendamento_id, três marcos de tempo.
create table public.confirmacao (
  id uuid primary key default gen_random_uuid(),
  agendamento_id uuid not null references public.agendamento (id) on delete cascade,
  janela janela_confirmacao not null,
  enviado_em date,
  mensagens_enviadas integer not null default 0 check (mensagens_enviadas >= 0),
  respondeu boolean,
  confirmado boolean,
  desmarcado boolean not null default false,
  reagendado boolean not null default false,
  nova_data date,
  criado_por uuid references public.usuarios (id),
  criado_em timestamptz not null default now(),
  unique (agendamento_id, janela)
);

-- Só existe fechamento vinculado a um agendamento com comparecimento —
-- é a tabela que hoje não existe em nenhuma planilha real da clínica.
create table public.fechamento (
  id uuid primary key default gen_random_uuid(),
  agendamento_id uuid not null unique references public.agendamento (id),
  procedimento_id uuid not null references public.procedimento (id),
  receita numeric(12, 2) not null check (receita >= 0),
  forma_pagamento text,
  data_fechamento date not null default current_date,
  registrado_por uuid not null references public.usuarios (id),
  criado_em timestamptz not null default now()
);

-- ── Retenção ─────────────────────────────────────────────────────────
create table public.retencao (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.lead (id),
  data_retorno date,
  dias_ate_retorno integer check (dias_ate_retorno is null or dias_ate_retorno >= 0),
  nps integer check (nps is null or (nps >= 0 and nps <= 10)),
  indicou boolean,
  valor_indicacao numeric(12, 2) check (valor_indicacao is null or valor_indicacao >= 0),
  ltv_atual numeric(12, 2) check (ltv_atual is null or ltv_atual >= 0),
  status_relacionamento text,
  proxima_acao text,
  responsavel_id uuid references public.usuarios (id),
  criado_em timestamptz not null default now()
);

-- ── Metas ────────────────────────────────────────────────────────────
create table public.meta (
  id uuid primary key default gen_random_uuid(),
  escopo text not null, -- 'clinica' | 'unidade' | 'pessoa' | 'setor' | 'origem' | 'procedimento'
  escopo_ref text, -- identifica a unidade/pessoa/procedimento quando aplicável
  indicador text not null,
  periodo_inicio date not null,
  periodo_fim date not null,
  valor_meta numeric(14, 2) not null,
  criado_por uuid references public.usuarios (id),
  criado_em timestamptz not null default now(),
  check (periodo_fim >= periodo_inicio)
);

-- ── Auditoria e importação ───────────────────────────────────────────
create table public.auditoria (
  id uuid primary key default gen_random_uuid(),
  tabela text not null,
  registro_id uuid not null,
  operacao text not null check (operacao in ('INSERT', 'UPDATE', 'DELETE')),
  valores_antes jsonb,
  valores_depois jsonb,
  usuario_id uuid references public.usuarios (id),
  criado_em timestamptz not null default now()
);

create table public.importacao_run (
  id uuid primary key default gen_random_uuid(),
  arquivo_origem text not null,
  aba text not null,
  linha integer not null,
  tabela_destino text not null,
  registro_id uuid,
  data_importacao timestamptz not null default now(),
  usuario_id uuid references public.usuarios (id)
);

-- ── Índices de apoio ─────────────────────────────────────────────────
create index on public.lead (origem);
create index on public.lead (data_entrada);
create index on public.interacao_social_selling (responsavel_id);
create index on public.interacao_social_selling (lead_id);
create index on public.interacao_sdr (responsavel_id);
create index on public.interacao_sdr (lead_id);
create index on public.interacao_sdr (proximo_followup);
create index on public.interacao_cs (responsavel_id);
create index on public.interacao_cs (lead_id);
create index on public.agendamento (lead_id);
create index on public.agendamento (data_consulta);
create index on public.confirmacao (agendamento_id);
create index on public.fechamento (data_fechamento);
create index on public.fechamento (procedimento_id);
create index on public.auditoria (tabela, registro_id);
create index on public.meta (indicador, periodo_inicio, periodo_fim);
