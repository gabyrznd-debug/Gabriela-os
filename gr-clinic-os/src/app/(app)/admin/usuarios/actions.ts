"use server";

import { revalidatePath } from "next/cache";
import { getUsuarioAutenticado } from "@/lib/auth";
import { createAdminClient, isAdminClientConfigured } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { ROLES, type Role } from "@/lib/roles";

function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export interface ConvidarResultado {
  ok: boolean;
  mensagem: string;
}

export async function convidarUsuario(
  _prevState: ConvidarResultado | null,
  formData: FormData
): Promise<ConvidarResultado> {
  const quem = await getUsuarioAutenticado();
  if (!quem || quem.papel !== "admin") {
    return { ok: false, mensagem: "Só a Administradora pode convidar novas pessoas." };
  }
  if (!isAdminClientConfigured()) {
    return {
      ok: false,
      mensagem: "A chave secreta do Supabase (SUPABASE_SERVICE_ROLE_KEY) ainda não foi configurada neste ambiente.",
    };
  }

  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const papel = String(formData.get("papel") ?? "") as Role;

  if (!nome || !email || !ROLES.some((r) => r.id === papel)) {
    return { ok: false, mensagem: "Preencha nome, e-mail e perfil corretamente." };
  }

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${siteUrl()}/auth/callback?next=/definir-senha`,
  });

  if (error || !data.user) {
    return { ok: false, mensagem: `Não consegui enviar o convite: ${error?.message ?? "erro desconhecido"}.` };
  }

  const { error: erroInsert } = await admin.from("usuarios").insert({
    id: data.user.id,
    nome,
    papel,
  });

  if (erroInsert) {
    return {
      ok: false,
      mensagem: `O convite foi enviado, mas houve um erro ao salvar o perfil: ${erroInsert.message}.`,
    };
  }

  revalidatePath("/admin/usuarios");
  return { ok: true, mensagem: `Convite enviado para ${email}.` };
}

export async function alternarAtivo(id: string, ativo: boolean, _formData: FormData) {
  void _formData; // exigido pela assinatura de uma server action ligada via <form action={fn.bind(...)}>
  const quem = await getUsuarioAutenticado();
  if (!quem || quem.papel !== "admin") return;

  const supabase = await createClient();
  await supabase.from("usuarios").update({ ativo }).eq("id", id);
  revalidatePath("/admin/usuarios");
}
