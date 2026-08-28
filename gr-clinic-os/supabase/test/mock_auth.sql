-- SOMENTE PARA TESTE LOCAL — nunca aplicar isto num projeto Supabase
-- real (lá o schema `auth` e o papel `authenticated` já existem
-- nativamente). Reproduz o suficiente do Supabase Auth para validar as
-- políticas de RLS das migrations contra um Postgres comum.

create schema if not exists auth;

create table if not exists auth.users (
  id uuid primary key default gen_random_uuid(),
  email text
);

create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

-- Papel usado pelo PostgREST/Supabase para requisições autenticadas.
-- Sem BYPASSRLS — é exatamente o ponto do teste.
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin noinherit;
  end if;
end $$;

grant usage on schema public, auth to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;
