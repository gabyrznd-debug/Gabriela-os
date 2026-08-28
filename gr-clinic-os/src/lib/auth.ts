import "server-only";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/lib/roles";

export interface UsuarioAutenticado {
  id: string;
  nome: string;
  papel: Role;
  ativo: boolean;
}

// Sem projeto Supabase configurado, não há usuário real — quem chama
// isto cai de volta no modo demonstração. É a única checagem que o
// resto do app precisa fazer.
export async function getUsuarioAutenticado(): Promise<UsuarioAutenticado | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("id, nome, papel, ativo")
    .eq("id", user.id)
    .single();

  if (!usuario || !usuario.ativo) return null;
  return usuario as UsuarioAutenticado;
}
