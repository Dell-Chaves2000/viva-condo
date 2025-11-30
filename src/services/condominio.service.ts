import { createServerSupabase } from "@/utils/supabase/server";

export interface ICondominio {
  id_condominio: number;
  id_administradora: number;
  nome_condominio: string;
  endereco_condominio: string;
  cidade_condominio: string;
  uf_condominio: string;
  tipo_condominio: string;
  created_at: string;
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

export async function deleteCondominio(id: number) {
  const supabase = await createServerSupabase();

  const { error } = await supabase
    .from("condominio")
    .delete()
    .eq("id_condominio", id);

  if (error) throw new Error(error.message);

  return { success: true };
}

export async function createCondominio(condominioData: Omit<ICondominio, 'id_condominio' | 'create_at'>) {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("condominio")
    .insert([condominioData])
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function updateCondominio(id: number, condominioData: Partial<ICondominio>) {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("condominio")
    .update(condominioData)
    .eq("id_condominio", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}