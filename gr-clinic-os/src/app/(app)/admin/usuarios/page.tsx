import { getUsuarioAutenticado } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, Pill, SectionLabel } from "@/components/ui";
import { ROLES } from "@/lib/roles";
import { ConvidarForm } from "./ConvidarForm";
import { alternarAtivo } from "./actions";

export default async function UsuariosPage() {
  const quem = await getUsuarioAutenticado();

  if (!quem || quem.papel !== "admin") {
    return (
      <div>
        <SectionLabel>Administração</SectionLabel>
        <h1 className="mt-2 font-display text-3xl font-semibold">Acesso restrito</h1>
        <p className="mt-3 max-w-[60ch] text-ink-muted">
          Esta tela é só para a Administradora — quem gerencia usuários e permissões do sistema.
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: usuarios } = await supabase
    .from("usuarios")
    .select("id, nome, papel, ativo, criado_em")
    .order("criado_em", { ascending: false });

  return (
    <div>
      <SectionLabel>Administração</SectionLabel>
      <h1 className="mt-2 font-display text-3xl font-semibold">Usuários e Permissões</h1>
      <p className="mt-2 max-w-[60ch] text-ink-muted">
        Convide cada pessoa pelo e-mail dela — o sistema manda um link para ela escolher a própria senha, já com o
        perfil certo. Ninguém entra sem ser convidada por aqui.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        <ConvidarForm />

        <div>
          <SectionLabel>Pessoas cadastradas</SectionLabel>
          <Card className="mt-3 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-2 text-left font-mono text-[10.5px] uppercase tracking-wider text-ink-faint">
                    <th className="px-4 py-2.5">Nome</th>
                    <th className="px-4 py-2.5">Perfil</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {(usuarios ?? []).map((u) => {
                    const info = ROLES.find((r) => r.id === u.papel);
                    return (
                      <tr key={u.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-2.5 text-ink">{u.nome}</td>
                        <td className="px-4 py-2.5 text-ink-muted">{info?.label ?? u.papel}</td>
                        <td className="px-4 py-2.5">
                          <Pill tone={u.ativo ? "good" : "neutral"}>{u.ativo ? "ativa" : "inativa"}</Pill>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          {u.id !== quem.id && (
                            <form action={alternarAtivo.bind(null, u.id, !u.ativo)}>
                              <button type="submit" className="font-mono text-[11px] text-accent-strong hover:underline">
                                {u.ativo ? "desativar" : "reativar"}
                              </button>
                            </form>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {(usuarios ?? []).length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-ink-faint">
                        Nenhuma pessoa cadastrada ainda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
