import { NextRequest, NextResponse } from "next/server";
import { deleteCondominio } from "@/services/condominio.service";

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

     await deleteCondominio(id);

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