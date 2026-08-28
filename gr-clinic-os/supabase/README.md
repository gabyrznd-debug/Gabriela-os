# Banco de dados do GR Clinic OS

Este diretório tem o schema completo (`migrations/`) já testado — veja
"Como isto foi testado" no fim deste arquivo. O que falta é criar o
projeto de verdade e aplicar essas migrações nele. São 3 passos, uns 10
minutos.

## 1. Criar o projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta (dá para
   entrar direto com uma conta Google, sem precisar confirmar e-mail).
2. "New Project" → escolha um nome (ex.: `gr-clinic-os`), uma senha forte
   para o banco (guarde essa senha num lugar seguro) e a região mais
   próxima (South America — São Paulo).
3. Espere ~2 minutos o projeto ser criado.

## 2. Aplicar o schema

Na barra lateral do projeto, abra **SQL Editor** → **New query**, e
execute os arquivos de `migrations/` **nesta ordem**, um de cada vez
(cole o conteúdo do arquivo, clique em Run, confira que não deu erro, e
siga para o próximo):

1. `0001_schema.sql`
2. `0002_functions_and_triggers.sql`
3. `0003_kpi_functions.sql`
4. `0004_rls_policies.sql`
5. `0005_seed_lookups.sql`

(Se preferir usar a CLI do Supabase em vez de colar manualmente:
`supabase link --project-ref <seu-project-ref>` e depois
`supabase db push` aplica os 5 arquivos de uma vez, na ordem certa.)

## 3. Conectar o app

Em **Settings → API**, copie:
- **Project URL**
- **anon public key**

Cole os dois num arquivo `.env.local` na raiz do projeto (copie de
`.env.example`). Rode `npm run dev` de novo — o app troca sozinho do
modo demonstração para o banco real.

## 4. Criar a primeira usuária (Administradora)

Ainda não existe uma tela de "criar conta" — é proposital, o sistema não
tem cadastro público. A primeira pessoa (você, como Administradora) é
criada manualmente:

1. **Authentication → Users → Add user** → coloque o e-mail e uma senha
   temporária (a pessoa troca no primeiro acesso, se quiser).
2. Copie o **User UID** que apareceu.
3. Volte ao **SQL Editor** e rode, trocando os valores:
   ```sql
   insert into public.usuarios (id, nome, papel)
   values ('<cole o User UID aqui>', 'Seu nome', 'admin');
   ```
4. Pronto — esse e-mail e senha já logam em `/login` como Administradora.

Depois disso, criar as demais pessoas (Flávia, Maria, Camila...) é o
mesmo processo — a tela de administração que faz isso pelo app (sem
precisar do SQL Editor) é a próxima peça a construir, listada no README
principal.

## Estrutura

- `migrations/0001_schema.sql` — todas as tabelas, enums e restrições.
- `migrations/0002_functions_and_triggers.sql` — papel do usuário logado,
  atribuição automática de campanha pela mensagem inicial (Decisão 3) e
  o gatilho de auditoria (grava criação/edição/exclusão sozinho).
- `migrations/0003_kpi_functions.sql` — as fórmulas oficiais dos KPIs
  como funções SQL, para nenhuma tela calcular o mesmo número de dois
  jeitos diferentes.
- `migrations/0004_rls_policies.sql` — a matriz de permissões da
  Especificação, aplicada linha a linha no banco.
- `migrations/0005_seed_lookups.sql` — listas de apoio (motivos de
  perda, canais do CS, territórios de marca) e o catálogo de
  procedimentos — configuração, não dado de demonstração.

## Como isto foi testado

Sem ainda ter um projeto Supabase real, todo o schema acima foi aplicado
e testado contra um Postgres local, simulando o Supabase Auth
(`test/mock_auth.sql`). O roteiro de teste (`test/rls_test.sql`) cobre,
com asserts que interrompem a execução se algo falhar:

- a SDR insere um lead e a campanha é atribuída sozinha pela mensagem
  inicial (Decisão 3);
- a Social Selling não consegue escrever nos dados da SDR, e a SDR só
  enxerga as oportunidades que a Social Selling marcou para ela;
- o CS não consegue corrigir um agendamento, mas a Recepção consegue
  (Decisão 5);
- a SDR não consegue registrar um fechamento, só o Financeiro (Decisão 1);
- a correção da Recepção e o fechamento da Financeiro aparecem na
  auditoria automaticamente, e a SDR não enxerga a tabela de auditoria;
- a função `kpis_comercial()` bate com a conta feita à mão;
- uma receita negativa é rejeitada pelo banco.

Para rodar de novo (requer PostgreSQL local):

```bash
createdb grclinic_test
psql -d grclinic_test -f supabase/test/mock_auth.sql
for f in supabase/migrations/*.sql; do psql -d grclinic_test -f "$f"; done
psql -d grclinic_test -f supabase/test/rls_test.sql
```

O que isto **não** testa: o fluxo HTTP real do Supabase Auth (login,
troca de sessão, cookies) — isso só é possível contra um projeto de
verdade, e é o motivo de não afirmarmos que o login já foi "testado",
só que segue exatamente o padrão documentado do Supabase.
