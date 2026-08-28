import { ComingSoon } from "@/components/ui";

export default function Page() {
  return (
    <ComingSoon
      title="Financeiro — Fechamento e Pagamento"
      responsavel="Flávia"
      telas={[
        "Fila de agendamentos comparecidos sem fechamento",
        "Registrar fechamento (procedimento + valor + forma de pagamento)",
        "Meus fechamentos do dia",
      ]}
    />
  );
}
