import { createServerSupabase } from "@/utils/supabase/server";

export interface ICondominio {
  id_condominio: number;
  Id_administradora: number;
  nome_condominio: string;
  endereco_condominio: string;
  cidade_condominio: string;
  uf_condominio: string;
  tipo_condominio: string;
  create_at: string;
}

export async function getCondominios() {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("condominio")
    .select("*")
    .order("id_condominio");

  if (error) throw new Error(error.message);

  return data ?? [];
}
