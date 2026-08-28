-- Seed de configuração — listas de apoio e o catálogo de procedimentos.
-- Isto NÃO é dado de demonstração: são os valores reais que apareciam
-- nas planilhas originais (validações de dados das abas SDR, CS, Social
-- Selling e 06 Comercial), viram aqui listas editáveis pela
-- Administradora em vez de dropdown fixo em planilha.

insert into public.lista_config (categoria, valor, ordem) values
  ('motivo_perda_sdr', 'Valor consulta', 1),
  ('motivo_perda_sdr', 'Valor procedimento', 2),
  ('motivo_perda_sdr', 'Cidade / Distância', 3),
  ('motivo_perda_sdr', 'Falar com marido', 4),
  ('motivo_perda_sdr', 'Sem interesse', 5),
  ('motivo_perda_sdr', 'Sem resposta', 6),
  ('motivo_perda_sdr', 'Horário', 7),
  ('motivo_perda_sdr', 'Sem urgência', 8),
  ('motivo_perda_sdr', 'Concorrência', 9),
  ('motivo_perda_sdr', 'Aguardando pagamento', 10),
  ('motivo_perda_sdr', 'Outro', 99),

  ('motivo_perda_cs', 'Pagando procedimento anterior', 1),
  ('motivo_perda_cs', 'Sem tempo', 2),
  ('motivo_perda_cs', 'Estou doente', 3),
  ('motivo_perda_cs', 'Gestante / Lactante', 4),
  ('motivo_perda_cs', 'Mudei de cidade', 5),
  ('motivo_perda_cs', 'Satisfeito com resultado', 6),
  ('motivo_perda_cs', 'Sem interesse', 7),
  ('motivo_perda_cs', 'Sem condição financeira', 8),
  ('motivo_perda_cs', 'Sem resposta', 9),
  ('motivo_perda_cs', 'Outro', 99),

  ('motivo_perda_ss', 'Distância', 1),
  ('motivo_perda_ss', 'Preço', 2),
  ('motivo_perda_ss', 'Sem resposta', 3),
  ('motivo_perda_ss', 'Horário', 4),
  ('motivo_perda_ss', 'Sem urgência', 5),
  ('motivo_perda_ss', 'Concorrência', 6),
  ('motivo_perda_ss', 'Outro', 99),

  ('canal_cs', 'Resgate', 1),
  ('canal_cs', 'Orçamento em aberto', 2),
  ('canal_cs', 'Aniversário', 3),
  ('canal_cs', 'Toxina/Botox', 4),
  ('canal_cs', 'Indicação', 5),
  ('canal_cs', 'Manutenção', 6),
  ('canal_cs', 'Recorrência', 7),
  ('canal_cs', 'Outros', 99),

  ('origem_ss', 'Comentários', 1),
  ('origem_ss', 'Prospecção', 2),
  ('origem_ss', 'Tráfego', 3),

  ('territorio_marca', 'GR Method', 1),
  ('territorio_marca', 'Cápsula do Tempo', 2),
  ('territorio_marca', 'Âmbar', 3),
  ('territorio_marca', 'Preservação', 4),
  ('territorio_marca', 'Longevidade', 5),
  ('territorio_marca', 'Naturalidade sofisticada', 6),
  ('territorio_marca', 'Método proprietário', 7),
  ('territorio_marca', 'Eternize sua beleza', 8),
  ('territorio_marca', 'Lifestyle', 9),
  ('territorio_marca', 'Prova social', 10),
  ('territorio_marca', 'Autoridade', 11)
on conflict (categoria, valor) do nothing;

insert into public.procedimento (nome, categoria) values
  ('GR Method', 'Método proprietário'),
  ('Toxina botulínica', 'Injetáveis'),
  ('Preenchimento labial', 'Injetáveis'),
  ('Bioestimulador', 'Injetáveis'),
  ('Laser CO2', 'Tecnologia'),
  ('Fios', 'Tecnologia'),
  ('Beautification', 'Protocolo'),
  ('Tricologia', 'Capilar')
on conflict (nome) do nothing;
