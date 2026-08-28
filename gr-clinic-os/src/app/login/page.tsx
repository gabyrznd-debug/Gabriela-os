import { isSupabaseConfigured } from "@/lib/supabase/config";
import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  const configured = isSupabaseConfigured();

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-sm">
        <div className="font-display text-2xl font-semibold">GR Clinic OS</div>
        <p className="mt-1 text-sm text-ink-muted">Entre com o e-mail e senha da sua conta.</p>

        {!configured ? (
          <div className="mt-6 rounded-lg border border-accent-soft bg-accent-soft/60 p-4 text-sm text-ink-muted">
            O login real ainda não está disponível — o banco de dados (Supabase) deste ambiente ainda não foi
            configurado. Volte para a página inicial e use o seletor <strong className="text-ink">Perfil de
            demonstração</strong> no menu para navegar pelo protótipo.
          </div>
        ) : (
          <form action={login} className="mt-6 flex flex-col gap-4">
            <label className="block">
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">E-mail</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="mt-1.5 w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-ink outline-none focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">Senha</span>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                className="mt-1.5 w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-ink outline-none focus:border-accent"
              />
            </label>
            {erro && <p className="text-sm text-crit">{erro}</p>}
            <button
              type="submit"
              className="mt-2 rounded-lg bg-accent-strong px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Entrar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
