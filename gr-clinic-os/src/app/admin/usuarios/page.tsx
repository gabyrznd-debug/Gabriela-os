import { ComingSoon } from "@/components/ui";

export default function Page() {
  return (
    <ComingSoon
      title="Usuários e Permissões"
      responsavel="Administradora"
      telas={["Criar/ativar/desativar usuário", "Atribuir perfil — sem nomes fixos no código", "Trocar uma funcionária por outra sem alterar código"]}
    />
  );
}
