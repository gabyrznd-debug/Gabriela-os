import { ComingSoon } from "@/components/ui";

export default function Page() {
  return (
    <ComingSoon
      title="Retenção"
      responsavel="CS"
      telas={["Taxa de retorno e tempo até o retorno", "LTV e NPS", "Indicações e receita por indicação", "Pacientes sem ação futura"]}
    />
  );
}
