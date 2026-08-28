import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Cliente para Server Components, Server Actions e Route Handlers. Roda
// com a sessão de quem está logado — as políticas de RLS do banco se
// aplicam normalmente, nunca a service role key (que ignoraria RLS).
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Chamado de dentro de um Server Component — o middleware
            // já cuida de renovar a sessão nesse caso.
          }
        },
      },
    }
  );
}
