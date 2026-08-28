# GR Clinic OS

Sistema operacional de gestão da GR Clinic — comercial, marketing e tráfego pago em um só lugar, com fonte única de verdade, histórico permanente e permissões por perfil.

Este repositório está na **Etapa 4 — Backend**: banco de dados, autenticação e permissões estão prontos e testados; falta só criar o projeto Supabase real (10 minutos, passo a passo em [`/supabase/README.md`](./supabase/README.md)) para o app trocar sozinho o modo demonstração pelo modo real.

## Documentos anteriores (Etapas 1 e 2)

- [Diagnóstico e Arquitetura do GR Clinic OS](https://claude.ai/code/artifact/b5576c1b-ae01-4493-995c-d513a88a06e2) — inventário das duas planilhas originais, duplicidades, arquitetura proposta e decisões da diretoria.
- [Especificação](https://claude.ai/code/artifact/cd7ee456-d6c2-4874-9be3-b5a0cf22c257) — mapa de telas, fluxos de usuário, matriz de permissões, dicionário de dados e critérios de aceite.

Cada tela e cada tabela do banco citam, no próprio código, a que parte desses documentos respondem.

## Etapa 3 — Protótipo (navegação e design)

- Design system (Fraunces/Public Sans/IBM Plex Mono, âmbar/off-white/grafite/dourado), responsivo, com tema claro/escuro.
- Navegação por módulo, filtrada pelo perfil.
- Telas construídas: **Meus resultados** (`/`), **SDR** (`/sdr`), **Dashboard Geral do Comercial** (`/dashboard/comercial`), **Central de Metas** (`/metas`). As demais existem como telas "em construção" navegáveis.
- Todo número exibido vem de `src/lib/mock-data.ts`, marcado com `demo: true`, com o banner "Demonstração" em toda tela que os usa.

## Etapa 4 — Banco de dados, autenticação e permissões

Tudo em [`/supabase`](./supabase):

- **Schema completo** (`supabase/migrations/`) — as tabelas do dicionário de dados da Especificação, com `check constraints` (nunca receita negativa, nunca data inválida), a atribuição automática de campanha pela mensagem inicial (Decisão 3), e auditoria automática (quem criou/editou/excluiu, valor anterior e novo) via trigger — nenhuma tela precisa lembrar de registrar isso.
- **Permissões no banco, não só na tela** (`0004_rls_policies.sql`) — Row Level Security implementando a matriz de perfis: cada pessoa só edita seu módulo; a Recepção corrige agendamento/comparecimento da SDR e do CS (Decisão 5); só o Financeiro registra fechamento (Decisão 1); só a Administradora lê a auditoria.
- **Testado de verdade, não só revisado** — o schema inteiro rodou contra um Postgres local simulando o Supabase Auth, com um roteiro de 10 verificações automatizadas (`supabase/test/rls_test.sql`) que interrompe a execução se qualquer permissão vazar ou qualquer KPI não bater com a conta manual. Todas passaram — detalhes em `supabase/README.md`.
- **Autenticação real** (login/logout via Supabase Auth) já integrada ao app — troca automaticamente o seletor de "Perfil de demonstração" pela pessoa de verdade assim que o projeto Supabase existir e ela estiver cadastrada.

O que ainda falta nesta frente: conectar os formulários e dashboards já construídos (hoje em `mock-data.ts`) às tabelas reais — trabalho mecânico, seguindo os mesmos padrões já estabelecidos em `src/lib/supabase/`, assim que houver um projeto real para testar contra.

## Rodando localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:3000`. Sem um `.env.local` configurado (veja `.env.example`), roda no modo demonstração — nada quebra.

```bash
npm run build   # build de produção
npm run lint    # eslint
```

## Próximos passos

1. Criar o projeto Supabase e aplicar as migrações — passo a passo em [`/supabase/README.md`](./supabase/README.md).
2. Conectar os formulários e dashboards já construídos ao banco real, no lugar de `mock-data.ts`.
3. Construir a tela de Usuários e Permissões (hoje só o SQL Editor cria pessoas — ver §4 do README do Supabase).
4. Etapa 5: importar os dados reais de julho/2026 das duas planilhas originais, com prévia e reconciliação de totais.
