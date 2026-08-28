// Enquanto não existe um projeto Supabase real, o app inteiro continua
// funcionando no modo demonstração (seletor de perfil + dados de
// exemplo). Assim que as duas variáveis abaixo forem configuradas
// (README em /supabase explica como obtê-las), o app passa a usar
// login e banco de dados reais automaticamente — nenhuma outra troca
// de código é necessária.

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
