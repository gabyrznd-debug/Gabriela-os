"use client";

import { useActionState } from "react";
import { definirSenha } from "./actions";

export default function DefinirSenhaPage() {
  const [state, formAction, pending] = useActionState(definirSenha, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-sm">
        <div className="font-display text-2xl font-semibold">Bem-vinda ao GR Clinic OS</div>
        <p className="mt-1 text-sm text-ink-muted">Escolha sua senha para começar a usar o sistema.</p>

        <form action={formAction} className="mt-6 flex flex-col gap-4">
          <label className="block">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">Nova senha</span>
            <input
              type="password"
              name="senha"
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-1.5 w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">Confirmar senha</span>
            <input
              type="password"
              name="confirmar"
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-1.5 w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            />
          </label>
          {state && !state.ok && <p className="text-sm text-crit">{state.mensagem}</p>}
          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-lg bg-accent-strong px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Salvando..." : "Salvar e entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
