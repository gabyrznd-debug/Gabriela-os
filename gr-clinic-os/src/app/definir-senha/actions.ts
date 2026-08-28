"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface DefinirSenhaResultado {
  ok: boolean;
  mensagem: string;
}

export async function definirSenha(
  _prevState: DefinirSenhaResultado | null,
  formData: FormData
): Promise<DefinirSenhaResultado> {
  const senha = String(formData.get("senha") ?? "");
  const confirmar = String(formData.get("confirmar") ?? "");

  if (senha.length < 8) {
    return { ok: false, mensagem: "A senha precisa ter pelo menos 8 caracteres." };
  }
  if (senha !== confirmar) {
    return { ok: false, mensagem: "As duas senhas não são iguais." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: senha });
  if (error) {
    return { ok: false, mensagem: error.message };
  }

  redirect("/");
}
