import { ComingSoon } from "@/components/ui";

export default function Page() {
  return (
    <ComingSoon
      title="Qualidade de Dados"
      responsavel="automático + responsável de cada módulo"
      telas={["Completude por módulo e por funcionário", "Campos pendentes e impacto da ausência", "Índice geral de confiabilidade"]}
    />
  );
}
