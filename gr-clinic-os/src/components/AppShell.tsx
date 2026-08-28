"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useRole } from "@/lib/role-context";
import { MODULES, ROLES, modulesForRole, roleInfo } from "@/lib/roles";
import { logout } from "@/app/login/actions";

const GROUPS: Array<(typeof MODULES)[number]["grupo"]> = ["Meu trabalho", "Painéis", "Gestão", "Administração"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { role, setRole, authMode, nome } = useRole();
  const pathname = usePathname();
  const modules = modulesForRole(role);
  const info = roleInfo(role);
  const [menuOpen, setMenuOpen] = useState(false);

  // Fecha o menu ao trocar de rota (relevante só no celular). Ajustar
  // estado durante a renderização — em vez de um efeito — é o padrão
  // recomendado pelo React para "resetar estado quando uma prop muda".
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  const nav = (
    <nav className="flex-1 overflow-y-auto px-3 pb-6">
      {GROUPS.map((grupo) => {
        const items = modules.filter((m) => m.grupo === grupo);
        if (items.length === 0) return null;
        return (
          <div key={grupo} className="mb-5">
            <div className="px-2.5 pb-1.5 font-mono text-[10.5px] uppercase tracking-wider text-ink-faint">
              {grupo}
            </div>
            <div className="flex flex-col gap-0.5">
              {items.map((m) => {
                const active = pathname === m.href;
                return (
                  <Link
                    key={m.id}
                    href={m.href}
                    className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
                      active
                        ? "bg-accent-soft text-accent-strong font-medium"
                        : "text-ink-muted hover:bg-surface-2 hover:text-ink"
                    }`}
                  >
                    <span>{m.label}</span>
                    {m.status === "em_construcao" && (
                      <span className="font-mono text-[9.5px] text-ink-faint">em breve</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );

  const roleSwitcher =
    authMode === "real" ? (
      <div className="border-t border-border p-4">
        <div className="font-mono text-[10.5px] uppercase tracking-wider text-ink-faint">Conectada</div>
        <div className="mt-1.5 text-sm font-medium text-ink">{nome}</div>
        <p className="mt-1 text-[12px] text-ink-faint">{info.label}</p>
        <form action={logout} className="mt-3">
          <button
            type="submit"
            className="w-full rounded-lg border border-border px-2.5 py-2 text-sm text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
          >
            Sair
          </button>
        </form>
      </div>
    ) : (
      <div className="border-t border-border p-4">
        <label className="block font-mono text-[10.5px] uppercase tracking-wider text-ink-faint">
          Perfil de demonstração
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as typeof role)}
          className="mt-2 w-full rounded-lg border border-border bg-surface-2 px-2.5 py-2 text-sm text-ink outline-none focus:border-accent"
        >
          {ROLES.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
        <p className="mt-2 text-[12px] text-ink-faint">
          {info.pessoaExemplo} · {info.descricao}
        </p>
      </div>
    );

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Topbar — só aparece abaixo do breakpoint lg */}
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 lg:hidden">
        <div>
          <div className="font-display text-base font-semibold leading-tight">GR Clinic OS</div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">protótipo · etapa 3</div>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-ink"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 -translate-x-full flex-col border-r border-border bg-surface transition-transform duration-200 lg:static lg:w-64 lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : ""
        }`}
      >
        <div className="hidden px-5 py-6 lg:block">
          <div className="font-display text-lg font-semibold leading-tight">GR Clinic OS</div>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-ink-faint">
            protótipo · etapa 3
          </div>
        </div>
        {nav}
        {roleSwitcher}
      </aside>

      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">{children}</div>
      </main>
    </div>
  );
}
