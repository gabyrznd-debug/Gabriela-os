import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente com a chave secreta (service_role) do Supabase — ignora RLS
// completamente. Só existe para as duas ações que exigem privilégio de
// administrador da plataforma (convidar pessoa por e-mail, hoje) e NUNCA
// deve ser importado por um componente de cliente ou por uma tela comum.
// Quem chama isto já checou, antes, que a pessoa logada é Administradora.

export function isAdminClientConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function createAdminClient() {
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
