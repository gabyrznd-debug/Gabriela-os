import { ComingSoon } from "@/components/ui";

export default function Page() {
  return (
    <ComingSoon
      title="Auditoria"
      responsavel="Administradora"
      telas={["Quem criou, quem editou, quando", "Valor anterior → valor novo por registro", "Exportação de relatórios filtrados"]}
    />
  );
}
