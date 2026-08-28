import { ComingSoon } from "@/components/ui";

export default function Page() {
  return (
    <ComingSoon
      title="Recepção e Agenda"
      responsavel="Camila"
      telas={[
        "Agenda do dia/semana",
        "Registrar confirmação — 30d / 7d / 24h do mesmo agendamento",
        "Registrar comparecimento / no-show / reagendamento",
        "Corrigir registro de agendamento da SDR ou do CS",
      ]}
    />
  );
}
