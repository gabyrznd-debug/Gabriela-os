"use client";

import { useActionState } from "react";
import { convidarUsuario } from "./actions";
import { Card, SectionLabel } from "@/components/ui";
import { ROLES } from "@/lib/roles";

export function ConvidarForm() {
  const [state, formAction, pending] = useActionState(convidarUsuario, null);

  return (
    <Card className="h-fit p-6">
      <SectionLabel>Convidar nova pessoa</SectionLabel>
      <form action={formAction} className="mt-4 flex flex-col gap-4">
        <Field label="Nome">
          <input name="nome" required className="input" placeholder="Flávia" />
        </Field>
        <Field label="E-mail">
          <input type="email" name="email" required className="input" placeholder="flavia@grclinic.com" />
        </Field>
        <Field label="Perfil">
          <select name="papel" required defaultValue="" className="input">
            <option value="" disabled>
              Selecione
            </option>
            {ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </Field>
        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-lg bg-accent-strong px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Enviando..." : "Enviar convite"}
        </button>
        {state && <p className={`text-sm ${state.ok ? "text-good" : "text-crit"}`}>{state.mensagem}</p>}
      </form>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid var(--border-c);
          background: var(--surface);
          padding: 0.55rem 0.75rem;
          font-size: 0.875rem;
          color: var(--ink);
          outline: none;
        }
        .input:focus {
          border-color: var(--accent);
        }
      `}</style>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
