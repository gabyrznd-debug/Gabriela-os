import { ComingSoon } from "@/components/ui";

export default function Page() {
  return (
    <ComingSoon
      title="Dashboard Integrado"
      responsavel="leitura — Admin, Gerente"
      telas={["Funil cruzado: investimento/conteúdo → receita", "Receita por origem, orgânica x paga", "Leitura executiva automática: gargalo, causa, ação, responsável, prazo"]}
    />
  );
}
