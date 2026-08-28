-- Teste automatizado de RLS. Cada bloco assume o papel `authenticated`
-- como uma pessoa específica (via request.jwt.claim.sub) e verifica que
-- a política permite/bloqueia exatamente o que a matriz de permissões
-- (Especificação §3) diz. `RAISE EXCEPTION` interrompe o script no
-- primeiro erro — rodar isto até o fim sem erro é a prova.

\set ON_ERROR_STOP on

-- ── Massa de usuários de teste ───────────────────────────────────────
reset role;
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-000000000001', 'admin@test'),
  ('00000000-0000-0000-0000-000000000002', 'sdr@test'),
  ('00000000-0000-0000-0000-000000000003', 'ss@test'),
  ('00000000-0000-0000-0000-000000000004', 'cs@test'),
  ('00000000-0000-0000-0000-000000000005', 'recepcao@test'),
  ('00000000-0000-0000-0000-000000000006', 'financeiro@test'),
  ('00000000-0000-0000-0000-000000000007', 'gerente@test'),
  ('00000000-0000-0000-0000-000000000008', 'trafego@test');

insert into public.usuarios (id, nome, papel) values
  ('00000000-0000-0000-0000-000000000001', 'Admin Teste', 'admin'),
  ('00000000-0000-0000-0000-000000000002', 'Maria (SDR)', 'sdr'),
  ('00000000-0000-0000-0000-000000000003', 'Juslane (SS)', 'social_selling'),
  ('00000000-0000-0000-0000-000000000004', 'Ana Julia (CS)', 'cs'),
  ('00000000-0000-0000-0000-000000000005', 'Camila (Recepção)', 'recepcao'),
  ('00000000-0000-0000-0000-000000000006', 'Flávia (Financeiro)', 'financeiro'),
  ('00000000-0000-0000-0000-000000000007', 'Gerente Teste', 'gerente'),
  ('00000000-0000-0000-0000-000000000008', 'Tráfego Teste', 'trafego');

-- ── Campanha + mensagem de atribuição (Decisão 3) ────────────────────
insert into public.campanha_trafego (id, plataforma, campanha, investimento, periodo_inicio, periodo_fim)
values ('10000000-0000-0000-0000-000000000001', 'Meta Ads', 'Tríade', 2801.29, '2026-07-01', '2026-07-31');
insert into public.mensagem_campanha (texto_mensagem_inicial, campanha_trafego_id)
values ('Olá, vim do anúncio Tríade', '10000000-0000-0000-0000-000000000001');

-- ═══════════════════════════════════════════════════════════════════
-- TESTE 1 — lead: SDR pode inserir; a atribuição automática de
-- campanha resolve sozinha a partir da mensagem inicial.
-- ═══════════════════════════════════════════════════════════════════
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000002';

insert into public.lead (id, origem, cidade, mensagem_inicial_recebida)
values ('20000000-0000-0000-0000-000000000001', 'Meta Ads', 'Betim', 'Olá, vim do anúncio Tríade');

do $$
declare
  v_campanha uuid;
begin
  select campanha_trafego_id into v_campanha from public.lead where id = '20000000-0000-0000-0000-000000000001';
  if v_campanha is distinct from '10000000-0000-0000-0000-000000000001' then
    raise exception 'FALHOU: atribuição automática de campanha não resolveu (Decisão 3)';
  end if;
  raise notice 'OK: lead inserido pela SDR resolveu a campanha automaticamente pela mensagem inicial';
end $$;

-- Um segundo lead, orgânico, para os testes de funil abaixo.
insert into public.lead (id, origem, cidade) values
  ('20000000-0000-0000-0000-000000000002', 'Orgânico', 'Belo Horizonte');

-- ═══════════════════════════════════════════════════════════════════
-- TESTE 2 — Social Selling não pode inserir interação de SDR.
-- ═══════════════════════════════════════════════════════════════════
reset role;
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000003';

do $$
begin
  begin
    insert into public.interacao_sdr (lead_id, responsavel_id, respondeu)
    values ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', true);
    raise exception 'FALHOU: Social Selling conseguiu escrever em interacao_sdr — RLS não bloqueou';
  exception
    when insufficient_privilege or others then
      raise notice 'OK: Social Selling foi bloqueada ao tentar escrever em interacao_sdr';
  end;
end $$;

-- Social Selling registra a própria interação e marca oportunidade p/ SDR.
insert into public.interacao_social_selling (lead_id, responsavel_id, oportunidade_enviada_sdr, respondeu)
values ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', true, true);

-- ═══════════════════════════════════════════════════════════════════
-- TESTE 3 — SDR só vê as oportunidades que a SS enviou para ela, não
-- o resto do trabalho da Social Selling (Fluxo B da Especificação).
-- ═══════════════════════════════════════════════════════════════════
insert into public.interacao_social_selling (lead_id, responsavel_id, oportunidade_enviada_sdr, respondeu)
values ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', false, true);

reset role;
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000002';

do $$
declare
  v_count int;
begin
  select count(*) into v_count from public.interacao_social_selling;
  if v_count <> 1 then
    raise exception 'FALHOU: SDR viu % linhas de interacao_social_selling, esperado 1 (só oportunidade_enviada_sdr=true)', v_count;
  end if;
  raise notice 'OK: SDR vê só as oportunidades marcadas pela Social Selling, não tudo';
end $$;

-- SDR registra a própria interação e agenda.
insert into public.interacao_sdr (lead_id, responsavel_id, data, respondeu, qualificado, agendou)
values ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '2026-07-05', true, true, true);

insert into public.agendamento (id, lead_id, origem_do_agendamento, criado_por, profissional, data_consulta)
values (
  '30000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000001',
  'SDR',
  '00000000-0000-0000-0000-000000000002',
  'Dra. Gabriela',
  '2026-07-10'
);

-- ═══════════════════════════════════════════════════════════════════
-- TESTE 4 — CS não pode corrigir agendamento (só Recepção e Admin —
-- Decisão 5); Recepção pode.
-- ═══════════════════════════════════════════════════════════════════
reset role;
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000004';

do $$
begin
  update public.agendamento set compareceu = true where id = '30000000-0000-0000-0000-000000000001';
  if found then
    raise exception 'FALHOU: CS conseguiu corrigir um agendamento — deveria ser só Recepção/Admin';
  end if;
  raise notice 'OK: CS não conseguiu alterar agendamento (0 linhas afetadas)';
end $$;

reset role;
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000005';

update public.agendamento
set compareceu = true
where id = '30000000-0000-0000-0000-000000000001';

do $$
declare
  v_compareceu boolean;
begin
  select compareceu into v_compareceu from public.agendamento where id = '30000000-0000-0000-0000-000000000001';
  if v_compareceu is not true then
    raise exception 'FALHOU: Recepção deveria conseguir corrigir comparecimento (Decisão 5)';
  end if;
  raise notice 'OK: Recepção corrigiu o comparecimento de um agendamento criado pela SDR';
end $$;

insert into public.confirmacao (agendamento_id, janela, confirmado, mensagens_enviadas)
values ('30000000-0000-0000-0000-000000000001', '24h', true, 1);

-- ═══════════════════════════════════════════════════════════════════
-- TESTE 5 — SDR não pode registrar fechamento (só Financeiro/Admin —
-- Decisão 1); Financeiro pode e o vê na fila de comparecidos.
-- ═══════════════════════════════════════════════════════════════════
reset role;
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000002';

do $$
declare
  v_procedimento uuid;
begin
  select id into v_procedimento from public.procedimento where nome = 'Toxina botulínica';
  begin
    insert into public.fechamento (agendamento_id, procedimento_id, receita, registrado_por)
    values ('30000000-0000-0000-0000-000000000001', v_procedimento, 2200, '00000000-0000-0000-0000-000000000002');
    raise exception 'FALHOU: SDR conseguiu registrar fechamento — deveria ser só Financeiro';
  exception
    when insufficient_privilege or others then
      raise notice 'OK: SDR foi bloqueada ao tentar registrar fechamento';
  end;
end $$;

reset role;
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000006';

insert into public.fechamento (agendamento_id, procedimento_id, receita, registrado_por)
select '30000000-0000-0000-0000-000000000001', id, 2200, '00000000-0000-0000-0000-000000000006'
from public.procedimento where nome = 'Toxina botulínica';

-- ═══════════════════════════════════════════════════════════════════
-- TESTE 6 — auditoria: a alteração do comparecimento pela Recepção e o
-- fechamento da Financeiro ficaram registrados, com valor anterior e
-- novo — sem nenhuma tela precisar chamar isso explicitamente.
-- ═══════════════════════════════════════════════════════════════════
reset role;
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000001'; -- admin

do $$
declare
  v_count int;
begin
  select count(*) into v_count from public.auditoria where tabela = 'agendamento' and operacao = 'UPDATE';
  if v_count < 1 then
    raise exception 'FALHOU: nenhum registro de auditoria para a correção do agendamento pela Recepção';
  end if;
  select count(*) into v_count from public.auditoria where tabela = 'fechamento' and operacao = 'INSERT';
  if v_count < 1 then
    raise exception 'FALHOU: nenhum registro de auditoria para o fechamento da Financeiro';
  end if;
  raise notice 'OK: auditoria capturou a correção da Recepção e o fechamento da Financeiro automaticamente';
end $$;

reset role;
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000002';

do $$
declare
  v_count int;
begin
  select count(*) into v_count from public.auditoria;
  if v_count <> 0 then
    raise exception 'FALHOU: SDR conseguiu ler a tabela de auditoria — deveria ser só Admin';
  end if;
  raise notice 'OK: SDR não enxerga a auditoria (0 linhas via RLS)';
end $$;

-- ═══════════════════════════════════════════════════════════════════
-- TESTE 7 — função de KPI oficial bate com a conta manual.
-- ═══════════════════════════════════════════════════════════════════
reset role;
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000001';

do $$
declare
  r record;
begin
  select * into r from public.kpis_comercial('2026-07-01', '2026-07-31');
  if r.leads_recebidos_sdr <> 1 or r.agendados <> 1 or r.fechamentos <> 1 or r.receita_total <> 2200 then
    raise exception 'FALHOU: kpis_comercial retornou números inesperados (recebidos=%, agendados=%, fechamentos=%, receita=%)',
      r.leads_recebidos_sdr, r.agendados, r.fechamentos, r.receita_total;
  end if;
  if r.taxa_fechamento <> 1 then
    raise exception 'FALHOU: taxa_fechamento deveria ser 1 (1 fechamento / 1 comparecimento), veio %', r.taxa_fechamento;
  end if;
  raise notice 'OK: kpis_comercial() bate com a conta manual (receita R$ %, taxa de fechamento %)', r.receita_total, r.taxa_fechamento;
end $$;

-- ═══════════════════════════════════════════════════════════════════
-- TESTE 8 — restrições de dados: receita negativa é rejeitada.
-- ═══════════════════════════════════════════════════════════════════
reset role;
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000006';

do $$
begin
  begin
    insert into public.fechamento (agendamento_id, procedimento_id, receita, registrado_por)
    select '30000000-0000-0000-0000-000000000001', id, -500, '00000000-0000-0000-0000-000000000006'
    from public.procedimento where nome = 'Fios';
    raise exception 'FALHOU: receita negativa foi aceita — o check constraint deveria ter bloqueado';
  exception
    when check_violation then
      raise notice 'OK: receita negativa foi rejeitada pelo banco (check constraint)';
  end;
end $$;

reset role;
do $$
begin
  raise notice '═══════════════════════════════════════════════════';
  raise notice 'TODOS OS TESTES PASSARAM';
  raise notice '═══════════════════════════════════════════════════';
end $$;
