-- Funções auxiliares e triggers.

-- ── Papel do usuário logado ──────────────────────────────────────────
-- SECURITY DEFINER: roda com privilégio do dono da função, então lê
-- `usuarios` mesmo com RLS ativo na própria tabela — é o padrão usado
-- para "quebrar" a recursão de uma policy que precisaria consultar a
-- tabela que ela mesma protege.
create or replace function public.current_papel()
returns papel_tipo
language sql
stable
security definer
set search_path = public
as $$
  select papel from public.usuarios where id = auth.uid() and ativo;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_papel() = 'admin';
$$;

create or replace function public.is_admin_ou_gerente()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_papel() in ('admin', 'gerente');
$$;

-- ── Atribuição automática de campanha (Decisão 3) ───────────────────
-- Quando a SDR registra a mensagem inicial que o lead usou, resolve
-- sozinho a campanha de origem — sem precisar de UTM ou telefone.
create or replace function public.resolver_campanha_por_mensagem()
returns trigger
language plpgsql
as $$
begin
  if new.campanha_trafego_id is null and new.mensagem_inicial_recebida is not null then
    select campanha_trafego_id into new.campanha_trafego_id
    from public.mensagem_campanha
    where texto_mensagem_inicial = new.mensagem_inicial_recebida
    limit 1;
  end if;
  return new;
end;
$$;

create trigger trg_lead_resolver_campanha
  before insert or update of mensagem_inicial_recebida on public.lead
  for each row
  execute function public.resolver_campanha_por_mensagem();

-- ── Auditoria automática ─────────────────────────────────────────────
-- Registra criação, edição e exclusão com valor anterior e novo — sem
-- depender de nenhuma tela lembrar de chamar isso.
create or replace function public.registrar_auditoria()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.auditoria (tabela, registro_id, operacao, valores_antes, valores_depois, usuario_id)
  values (
    TG_TABLE_NAME,
    coalesce((case when TG_OP = 'DELETE' then old.id else new.id end), gen_random_uuid()),
    TG_OP,
    case when TG_OP in ('UPDATE', 'DELETE') then to_jsonb(old) else null end,
    case when TG_OP in ('UPDATE', 'INSERT') then to_jsonb(new) else null end,
    auth.uid()
  );
  return coalesce(new, old);
end;
$$;

do $$
declare
  tabela text;
begin
  foreach tabela in array array[
    'lead', 'interacao_social_selling', 'interacao_sdr', 'interacao_cs',
    'agendamento', 'confirmacao', 'fechamento', 'procedimento',
    'campanha_trafego', 'mensagem_campanha', 'conteudo', 'metrica_perfil',
    'retencao', 'meta', 'usuarios'
  ]
  loop
    execute format(
      'create trigger trg_auditoria_%1$s after insert or update or delete on public.%1$s
       for each row execute function public.registrar_auditoria();',
      tabela
    );
  end loop;
end $$;
