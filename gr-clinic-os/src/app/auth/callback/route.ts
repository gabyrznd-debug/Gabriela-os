import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Recebe o link do e-mail de convite (ou de recuperação de senha) e troca
// o código de uma vez por uma sessão de verdade, antes de mandar a pessoa
// para a tela de definir a senha.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?erro=${encodeURIComponent("Link inválido ou expirado.")}`);
}
