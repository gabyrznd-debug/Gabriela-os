import { ComingSoon } from "@/components/ui";

export default function Page() {
  return (
    <ComingSoon
      title="Tráfego Pago"
      responsavel="Gestor de Tráfego"
      telas={[
        "Registrar campanha/investimento semanal",
        "Cadastrar mensagem inicial → campanha (tabela de atribuição)",
      ]}
    />
  );
}
