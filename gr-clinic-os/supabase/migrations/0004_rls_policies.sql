-- Row Level Security — a matriz de permissões da Especificação (§3)
-- aplicada no banco, não só escondendo botão na interface (critério de
-- aceite nº19). Uma pessoa autenticada sem linha em `usuarios`, ou com
-- `ativo = false`, não passa em nenhuma policy abaixo — `current_papel()`
-- retorna null e nenhuma comparação de papel é verdadeira.

alter table public.usuarios enable row level security;
alter table public.lista_config enable row level security;
alter table public.campanha_trafego enable row level security;
alter table public.mensagem_campanha enable row level security;
alter table public.conteudo enable row level security;
alter table public.metrica_perfil enable row level security;
alter table public.procedimento enable row level security;
alter table public.lead enable row level security;
alter table public.interacao_social_selling enable row level security;
alter table public.interacao_sdr enable row level security;
alter table public.interacao_cs enable row level security;
alter table public.agendamento enable row level security;
alter table public.confirmacao enable row level security;
alter table public.fechamento enable row level security;
alter table public.retencao enable row level security;
alter table public.meta enable row level security;
alter table public.auditoria enable row level security;
alter table public.importacao_run enable row level security;

-- ── usuarios ─────────────────────────────────────────────────────────
create policy usuarios_admin_all on public.usuarios for all
  using (public.is_admin()) with check (public.is_admin());
create policy usuarios_self_select on public.usuarios for select
  using (id = auth.uid());

-- ── lista_config — leitura liberada (é só uma lista de apoio) ────────
create policy lista_config_admin_write on public.lista_config for all
  using (public.is_admin()) with check (public.is_admin());
create policy lista_config_select on public.lista_config for select
  using (auth.uid() is not null);

-- ── campanha_trafego / mensagem_campanha ─────────────────────────────
create policy campanha_admin_all on public.campanha_trafego for all
  using (public.is_admin()) with check (public.is_admin());
create policy campanha_trafego_write on public.campanha_trafego for all
  using (public.current_papel() = 'trafego') with check (public.current_papel() = 'trafego');
create policy campanha_select on public.campanha_trafego for select
  using (public.current_papel() in ('gerente', 'marketing', 'trafego', 'sdr'));

create policy msgcamp_admin_all on public.mensagem_campanha for all
  using (public.is_admin()) with check (public.is_admin());
create policy msgcamp_trafego_write on public.mensagem_campanha for all
  using (public.current_papel() = 'trafego') with check (public.current_papel() = 'trafego');
create policy msgcamp_select on public.mensagem_campanha for select
  using (public.current_papel() in ('gerente', 'sdr'));

-- ── conteudo / metrica_perfil — Marketing ────────────────────────────
create policy conteudo_admin_all on public.conteudo for all
  using (public.is_admin()) with check (public.is_admin());
create policy conteudo_marketing_own on public.conteudo for all
  using (public.current_papel() = 'marketing' and criado_por = auth.uid())
  with check (public.current_papel() = 'marketing' and criado_por = auth.uid());
create policy conteudo_select on public.conteudo for select
  using (public.current_papel() in ('gerente', 'marketing', 'trafego'));

create policy metrica_perfil_admin_all on public.metrica_perfil for all
  using (public.is_admin()) with check (public.is_admin());
create policy metrica_perfil_marketing_own on public.metrica_perfil for all
  using (public.current_papel() = 'marketing' and criado_por = auth.uid())
  with check (public.current_papel() = 'marketing' and criado_por = auth.uid());
create policy metrica_perfil_select on public.metrica_perfil for select
  using (public.current_papel() in ('gerente', 'marketing', 'trafego'));

-- ── procedimento — Admin controla custo real; leitura ampla ──────────
create policy procedimento_admin_all on public.procedimento for all
  using (public.is_admin()) with check (public.is_admin());
create policy procedimento_select on public.procedimento for select
  using (auth.uid() is not null);

-- ── lead ─────────────────────────────────────────────────────────────
create policy lead_admin_all on public.lead for all
  using (public.is_admin()) with check (public.is_admin());
create policy lead_insert on public.lead for insert
  with check (public.current_papel() in ('social_selling', 'sdr', 'cs'));
create policy lead_select on public.lead for select
  using (public.current_papel() in ('gerente', 'social_selling', 'sdr', 'cs', 'recepcao', 'financeiro'));
-- Recepção corrige dados de agendamento (Decisão 5) — inclui a cidade
-- do lead quando necessário; Gerente corrige conforme política.
create policy lead_update_recepcao on public.lead for update
  using (public.current_papel() in ('recepcao', 'gerente'))
  with check (public.current_papel() in ('recepcao', 'gerente'));

-- ── interacao_social_selling ──────────────────────────────────────────
create policy ss_admin_all on public.interacao_social_selling for all
  using (public.is_admin()) with check (public.is_admin());
create policy ss_own on public.interacao_social_selling for all
  using (public.current_papel() = 'social_selling' and responsavel_id = auth.uid())
  with check (public.current_papel() = 'social_selling' and responsavel_id = auth.uid());
create policy ss_gerente_select on public.interacao_social_selling for select
  using (public.current_papel() = 'gerente');
-- A SDR só vê as oportunidades que a Social Selling marcou para ela —
-- não o restante do trabalho da Social Selling (Fluxo B da Especificação).
create policy ss_select_sdr on public.interacao_social_selling for select
  using (public.current_papel() = 'sdr' and oportunidade_enviada_sdr);

-- ── interacao_sdr ────────────────────────────────────────────────────
create policy sdr_admin_all on public.interacao_sdr for all
  using (public.is_admin()) with check (public.is_admin());
create policy sdr_own on public.interacao_sdr for all
  using (public.current_papel() = 'sdr' and responsavel_id = auth.uid())
  with check (public.current_papel() = 'sdr' and responsavel_id = auth.uid());
create policy sdr_gerente_select on public.interacao_sdr for select
  using (public.current_papel() = 'gerente');

-- ── interacao_cs ─────────────────────────────────────────────────────
create policy cs_admin_all on public.interacao_cs for all
  using (public.is_admin()) with check (public.is_admin());
create policy cs_own on public.interacao_cs for all
  using (public.current_papel() = 'cs' and responsavel_id = auth.uid())
  with check (public.current_papel() = 'cs' and responsavel_id = auth.uid());
create policy cs_gerente_select on public.interacao_cs for select
  using (public.current_papel() = 'gerente');

-- ── agendamento ──────────────────────────────────────────────────────
create policy agendamento_admin_all on public.agendamento for all
  using (public.is_admin()) with check (public.is_admin());
create policy agendamento_insert on public.agendamento for insert
  with check (public.current_papel() in ('sdr', 'cs'));
create policy agendamento_select on public.agendamento for select
  using (public.current_papel() in ('gerente', 'sdr', 'cs', 'recepcao', 'financeiro'));
-- Recepção corrige agendamento/comparecimento da SDR e do CS (Decisão 5).
create policy agendamento_update_recepcao on public.agendamento for update
  using (public.current_papel() = 'recepcao')
  with check (public.current_papel() = 'recepcao');
create policy agendamento_update_criador on public.agendamento for update
  using (public.current_papel() in ('sdr', 'cs') and criado_por = auth.uid())
  with check (public.current_papel() in ('sdr', 'cs') and criado_por = auth.uid());

-- ── confirmacao — só Recepção mexe ───────────────────────────────────
create policy confirmacao_admin_all on public.confirmacao for all
  using (public.is_admin()) with check (public.is_admin());
create policy confirmacao_recepcao on public.confirmacao for all
  using (public.current_papel() = 'recepcao') with check (public.current_papel() = 'recepcao');
create policy confirmacao_gerente_select on public.confirmacao for select
  using (public.current_papel() = 'gerente');

-- ── fechamento — só Financeiro (Decisão 1) ───────────────────────────
create policy fechamento_admin_all on public.fechamento for all
  using (public.is_admin()) with check (public.is_admin());
create policy fechamento_financeiro on public.fechamento for all
  using (public.current_papel() = 'financeiro' and registrado_por = auth.uid())
  with check (public.current_papel() = 'financeiro' and registrado_por = auth.uid());
create policy fechamento_select on public.fechamento for select
  using (public.current_papel() in ('gerente', 'recepcao'));

-- ── retencao — CS ────────────────────────────────────────────────────
create policy retencao_admin_all on public.retencao for all
  using (public.is_admin()) with check (public.is_admin());
create policy retencao_cs on public.retencao for all
  using (public.current_papel() = 'cs') with check (public.current_papel() = 'cs');
create policy retencao_gerente_select on public.retencao for select
  using (public.current_papel() = 'gerente');

-- ── meta — Admin cria; Gerente edita só se autorizada; todos leem ────
create policy meta_admin_all on public.meta for all
  using (public.is_admin()) with check (public.is_admin());
create policy meta_select on public.meta for select
  using (auth.uid() is not null);
create policy meta_gerente_update on public.meta for update
  using (
    public.current_papel() = 'gerente'
    and coalesce((select pode_editar_metas from public.usuarios where id = auth.uid()), false)
  )
  with check (
    public.current_papel() = 'gerente'
    and coalesce((select pode_editar_metas from public.usuarios where id = auth.uid()), false)
  );

-- ── auditoria — só leitura, só Admin; nunca editável ─────────────────
create policy auditoria_admin_select on public.auditoria for select
  using (public.is_admin());

-- ── importacao_run — Admin (Etapa 5) ─────────────────────────────────
create policy importacao_admin_all on public.importacao_run for all
  using (public.is_admin()) with check (public.is_admin());
