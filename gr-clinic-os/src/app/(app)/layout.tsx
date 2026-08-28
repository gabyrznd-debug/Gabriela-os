import { RoleProvider } from "@/lib/role-context";
import { AppShell } from "@/components/AppShell";
import { getUsuarioAutenticado } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const serverUser = await getUsuarioAutenticado();

  return (
    <RoleProvider serverUser={serverUser}>
      <AppShell>{children}</AppShell>
    </RoleProvider>
  );
}
