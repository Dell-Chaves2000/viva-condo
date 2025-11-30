import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/utils/supabase/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "ID inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log("Dados recebidos para atualização:", body);

    const supabase = await createServerSupabase();

    const { data, error } = await supabase
      .from("condominio")
      .update(body)
      .eq("id_condominio", id)
      .select()
      .single();

    if (error) {
      console.error("Erro do Supabase:", error);
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      data,
      message: "Condomínio atualizado com sucesso"
    });

  } catch (error: any) {
    console.error("Erro ao atualizar condomínio:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Erro interno do servidor" 
      },
      { status: 500 }
    );
  }
}