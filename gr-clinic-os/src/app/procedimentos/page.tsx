import { ComingSoon } from "@/components/ui";

export default function Page() {
  return (
    <ComingSoon
      title="Procedimentos e Receita"
      responsavel="leitura — alimentado pelo Financeiro"
      telas={["Receita, ticket e conversão por procedimento", "Margem (não configurada até custo real ser informado)", "Origem dominante e gargalo por procedimento"]}
    />
  );
}
