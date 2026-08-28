# GR Clinic OS

Sistema operacional de gestão da GR Clinic — comercial, marketing e tráfego pago em um só lugar, com fonte única de verdade, histórico permanente e permissões por perfil.

Este repositório está na **Etapa 3 — Protótipo funcional**: navegação, design system e telas de demonstração. Ainda **não há banco de dados nem autenticação real** — isso é a Etapa 4.

## Documentos anteriores (Etapas 1 e 2)

- [Diagnóstico e Arquitetura do GR Clinic OS](https://claude.ai/code/artifact/b5576c1b-ae01-4493-995c-d513a88a06e2) — inventário das duas planilhas originais, duplicidades, arquitetura proposta e decisões da diretoria.
- [Especificação](https://claude.ai/code/artifact/cd7ee456-d6c2-4874-9be3-b5a0cf22c257) — mapa de telas, fluxos de usuário, matriz de permissões, dicionário de dados e critérios de aceite.

Este protótipo segue essa especificação; cada tela cita, no próprio código, a que parte do documento ela responde.

## O que já existe nesta rodada

- Design system (cores, tipografia — Fraunces/Public Sans/IBM Plex Mono — componentes) alinhado à identidade âmbar/off-white/grafite/dourado pedida para a marca.
- Navegação por módulo, filtrada pelo perfil selecionado (seletor de "Perfil de demonstração" no rodapé do menu — substitui o login real até a Etapa 4).
- Responsivo (celular e desktop) e com suporte a tema claro/escuro do sistema operacional.
- Telas construídas de ponta a ponta:
  - **Meus resultados** (`/`) — home adaptada por perfil.
  - **SDR** (`/sdr`) — formulário curto de registro de lead + lista "Meus leads".
  - **Dashboard Geral do Comercial** (`/dashboard/comercial`) — funil executivo, meta x realizado, leitura automática de gargalo.
  - **Central de Metas** (`/metas`) — leitura das metas por escopo.
- Demais módulos (Social Selling, CS, Recepção, Financeiro, Marketing, Tráfego, Procedimentos, Retenção, Qualidade de Dados, Inteligência, Administração) existem como telas "em construção" navegáveis, já mostrando o que cada uma vai conter — a arquitetura de informação completa está de pé, só falta construir cada formulário/painel.

## Dados de demonstração

Todo número mostrado vem de `src/lib/mock-data.ts` e está marcado com `demo: true` em cada registro — nunca é a importação real de julho/2026 (essa migração é a Etapa 5). O banner amarelo "Demonstração" aparece em toda tela que exibe esses números. O que você digita no formulário da SDR fica só na sessão do navegador (não persiste) — a persistência real chega com o banco de dados na Etapa 4.

## Rodando localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:3000`.

```bash
npm run build   # build de produção
npm run lint    # eslint
```

## Próximos passos (Etapa 4 em diante)

1. Criar o projeto no Supabase (banco de dados + autenticação) — ver instruções que serão enviadas separadamente.
2. Modelar as tabelas do dicionário de dados da Especificação (`lead`, `agendamento`, `confirmacao`, `fechamento`, `auditoria`, etc.) com Row Level Security por perfil.
3. Trocar o "Perfil de demonstração" por login real (Supabase Auth).
4. Conectar cada formulário e dashboard ao banco, no lugar de `mock-data.ts`.
5. Etapa 5: importar os dados reais de julho/2026 das duas planilhas originais, com prévia e reconciliação de totais.
