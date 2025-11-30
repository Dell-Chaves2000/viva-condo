import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/utils/supabase/server";

export async function DELETE(
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

    const supabase = await createServerSupabase();

    const { error } = await supabase
      .from("condominio")
      .delete()
      .eq("id_condominio", id);

    if (error) {
      console.error("Erro do Supabase:", error);
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      message: "Condomínio excluído com sucesso"
    });

  } catch (error: any) {
    console.error("Erro ao excluir condomínio:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Erro interno do servidor" 
      },
      { status: 500 }
    );
  }
}