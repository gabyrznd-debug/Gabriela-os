-- Fórmulas oficiais dos KPIs (Especificação §6), como funções SQL
-- parametrizadas por período — a mesma função alimenta qualquer tela
-- que precise do número, então nunca há duas contas diferentes para o
-- mesmo indicador. Chamadas do app via `supabase.rpc(...)`.
--
-- Cobrem hoje o Dashboard Geral do Comercial (já construído no
-- protótipo). Marketing/Tráfego/Integrado seguem o mesmo padrão quando
-- essas telas forem construídas — não há necessidade de criar agora
-- funções para dashboards que ainda não existem.

create or replace function public.kpis_comercial(p_inicio date, p_fim date)
returns table (
  leads_recebidos_sdr bigint,
  respondidos bigint,
  qualificados bigint,
  agendados bigint,
  confirmados_24h bigint,
  compareceram bigint,
  no_show bigint,
  fechamentos bigint,
  receita_total numeric,
  receita_organica numeric,
  receita_paga numeric,
  ticket_medio numeric,
  taxa_resposta numeric,
  taxa_qualificacao numeric,
  taxa_confirmacao numeric,
  taxa_comparecimento numeric,
  taxa_no_show numeric,
  taxa_fechamento numeric
)
language sql
stable
as $$
  with sdr_agg as (
    select
      count(*) as recebidos,
      count(*) filter (where respondeu) as respondidos,
      count(*) filter (where qualificado) as qualificados
    from public.interacao_sdr
    where data between p_inicio and p_fim
  ),
  ag_agg as (
    select
      count(*) as agendados,
      count(*) filter (where compareceu) as compareceram,
      count(*) filter (where no_show) as no_show
    from public.agendamento
    where data_consulta between p_inicio and p_fim
  ),
  conf_agg as (
    select count(*) filter (where c.confirmado) as confirmados_24h
    from public.confirmacao c
    join public.agendamento a on a.id = c.agendamento_id
    where c.janela = '24h' and a.data_consulta between p_inicio and p_fim
  ),
  fech_agg as (
    select count(*) as fechamentos, coalesce(sum(f.receita), 0) as receita_total
    from public.fechamento f
    join public.agendamento a on a.id = f.agendamento_id
    where a.data_consulta between p_inicio and p_fim
  ),
  receita_origem as (
    select
      coalesce(sum(f.receita) filter (where l.origem = 'Orgânico'), 0) as receita_organica,
      coalesce(sum(f.receita) filter (where l.origem not in ('Orgânico', 'Indicação')), 0) as receita_paga
    from public.fechamento f
    join public.agendamento a on a.id = f.agendamento_id
    join public.lead l on l.id = a.lead_id
    where a.data_consulta between p_inicio and p_fim
  )
  select
    sdr_agg.recebidos,
    sdr_agg.respondidos,
    sdr_agg.qualificados,
    ag_agg.agendados,
    conf_agg.confirmados_24h,
    ag_agg.compareceram,
    ag_agg.no_show,
    fech_agg.fechamentos,
    fech_agg.receita_total,
    receita_origem.receita_organica,
    receita_origem.receita_paga,
    case when fech_agg.fechamentos = 0 then 0 else fech_agg.receita_total / fech_agg.fechamentos end,
    case when sdr_agg.recebidos = 0 then 0 else sdr_agg.respondidos::numeric / sdr_agg.recebidos end,
    case when sdr_agg.respondidos = 0 then 0 else sdr_agg.qualificados::numeric / sdr_agg.respondidos end,
    case when ag_agg.agendados = 0 then 0 else conf_agg.confirmados_24h::numeric / ag_agg.agendados end,
    case when ag_agg.agendados = 0 then 0 else ag_agg.compareceram::numeric / ag_agg.agendados end,
    case when conf_agg.confirmados_24h = 0 then 0 else ag_agg.no_show::numeric / conf_agg.confirmados_24h end,
    case when ag_agg.compareceram = 0 then 0 else fech_agg.fechamentos::numeric / ag_agg.compareceram end
  from sdr_agg, ag_agg, conf_agg, fech_agg, receita_origem;
$$;

create or replace function public.leads_por_origem(p_inicio date, p_fim date)
returns table (origem origem_tipo, quantidade bigint)
language sql
stable
as $$
  select origem, count(*) as quantidade
  from public.lead
  where data_entrada between p_inicio and p_fim
  group by origem
  order by quantidade desc;
$$;

create or replace function public.followups_vencidos_sdr(p_hoje date default current_date)
returns setof public.interacao_sdr
language sql
stable
security definer
set search_path = public
as $$
  select *
  from public.interacao_sdr
  where proximo_followup is not null
    and proximo_followup <= p_hoje
    and responsavel_id = auth.uid();
$$;
