"use client";

import { createContext, useContext, useState, useSyncExternalStore } from "react";
import type { Role } from "./roles";

const STORAGE_KEY = "gr-clinic-os.role";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): Role {
  try {
    return (window.localStorage.getItem(STORAGE_KEY) as Role | null) ?? "admin";
  } catch {
    return "admin";
  }
}

function getServerSnapshot(): Role {
  return "admin";
}

interface RoleContextValue {
  role: Role;
  setRole: (r: Role) => void;
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  // Lê o perfil salvo via useSyncExternalStore — a forma correta do React
  // para sincronizar com uma fonte externa (localStorage) sem o risco de
  // divergência entre a renderização do servidor e a do navegador.
  const storedRole = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [override, setOverride] = useState<Role | null>(null);
  const role = override ?? storedRole;

  function setRole(r: Role) {
    setOverride(r);
    try {
      window.localStorage.setItem(STORAGE_KEY, r);
    } catch {
      // localStorage indisponível — o valor ainda muda para esta sessão.
    }
  }

  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
}

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole precisa estar dentro de <RoleProvider>");
  return ctx;
}
