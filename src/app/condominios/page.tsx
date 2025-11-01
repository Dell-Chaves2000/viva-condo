"use client";

import AuthenticatedLayout from "@/components/authenticated-layout";
import SearchInput from "@/components/SearchInput";
import { useEffect, useState } from "react";
import { ICondominio } from "@/services/condominio.service";
import { FaSearch } from "react-icons/fa";
import Dropdown from "@/components/dropdown";
import ConfirmDialog from "@/components/confirm-dialog";
import { toast } from "sonner";

export default function ListaCondominios() {
  const [condominios, setCondominios] = useState<ICondominio[]>([]);
  const [condominiosFiltrados, setCondominiosFiltrados] = useState<ICondominio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pesquisa, setPesquisa] = useState<string>("");
  
  // Estados para o modal de confirmação
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [condominioToDelete, setCondominioToDelete] = useState<ICondominio | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const buscaCondominios = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/condominios");
        const json = await response.json();

        if (!json.success) throw new Error(json.error);
        setCondominios(json.data);
        setCondominiosFiltrados(json.data);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar os dados");
      } finally {
        setLoading(false);
      }
    };

    buscaCondominios();
  }, []);

  // Função para filtrar condomínios baseado na pesquisa
  useEffect(() => {
    if (pesquisa.trim() === "") {
      setCondominiosFiltrados(condominios);
    } else {
      const filtrados = condominios.filter(condominio =>
        condominio.nome_condominio.toLowerCase().includes(pesquisa.toLowerCase()) ||
        condominio.cidade_condominio.toLowerCase().includes(pesquisa.toLowerCase()) ||
        condominio.endereco_condominio.toLowerCase().includes(pesquisa.toLowerCase())||
        condominio.uf_condominio.toLowerCase().includes(pesquisa.toLowerCase()) ||
        condominio.tipo_condominio.toLowerCase().includes(pesquisa.toLowerCase())
      );
      setCondominiosFiltrados(filtrados);
    }
  }, [pesquisa, condominios]);

  // Função para abrir o modal de confirmação
  const handleOpenDeleteDialog = (condominio: ICondominio) => {
    setCondominioToDelete(condominio);
    setIsDialogOpen(true);
  };

  // Função para fechar o modal
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCondominioToDelete(null);
  };

  // Função para excluir o condomínio
  const handleDeleteCondominio = async () => {
    if (!condominioToDelete) return;

    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/condominios/${condominioToDelete.id_condominio}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      // Remove o item da lista sem recarregar a página
      setCondominios(prev => 
        prev.filter(c => c.id_condominio !== condominioToDelete.id_condominio)
      );
      
      // Fecha o modal
      handleCloseDialog();
      
      // Exibe mensagem de sucesso
     // 1º - Toast de sucesso na cor verde - rodapé direito
      toast.success("Condomínio excluído com sucesso.", {
        style: {
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          color: '#166534',
        },
        icon: (
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        ),
      });
      
    } catch (error: any) {
      console.error("Erro ao excluir condomínio:", error);
      
      // 3º - Toast de erro na cor vermelha
      toast.error("Não foi possível excluir o condomínio. Tente novamente.", {
        style: {
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
        },
        icon: (
          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        ),
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Função para editar (placeholder)
  const handleEdit = (condominio: ICondominio) => {
    
    console.log("Editar condomínio:", condominio);
    toast.info("Funcionalidade de edição em desenvolvimento", {
      style: {
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        color: '#1e40af',
      },
    });
  };

  return (
    <AuthenticatedLayout>
      <div className="p-6 max-w-full">
        
        {/* Cabeçalho com título e input abaixo */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold mb-4">Condomínios</h1>
          
          {/* Input de Pesquisa usando o componente */}
          <SearchInput
            placeholder="Pesquisar"
            icon={FaSearch}
            value={pesquisa}
            onChange={setPesquisa}
          />
        </div>

        <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-4 text-center text-gray-600">Carregando...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-600">{error}</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider w-12">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                    Nome
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                    Endereço
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                    Cidade
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                    UF
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {condominiosFiltrados.length === 0 ? (
                  <tr>
                    <td
                      className="px-4 py-3 text-sm text-gray-700 text-center"
                      colSpan={7}
                    >
                      {pesquisa ? "Nenhum condomínio encontrado para a pesquisa" : "Nenhum condomínio encontrado"}
                    </td>
                  </tr>
                ) : (
                  condominiosFiltrados.map((condominio, index) => (
                    <tr
                      key={condominio.id_condominio}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {String(index + 1)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {condominio.nome_condominio}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {condominio.endereco_condominio}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {condominio.cidade_condominio}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {condominio.uf_condominio}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {condominio.tipo_condominio}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <Dropdown
                          onEdit={() => handleEdit(condominio)}
                          onDelete={() => handleOpenDeleteDialog(condominio)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal de Confirmação de Exclusão - Estilo específico para condomínios */}
        <ConfirmDialog
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          onConfirm={handleDeleteCondominio}
          title="Excluir condomínio"
          itemName={condominioToDelete?.nome_condominio}
          warningText="Todos os moradores vinculados a este condomínio também serão excluídos. Esta ação não poderá ser desfeita."
          confirmText="Excluir"
          loading={isDeleting}
          variant="destructive"
        />
      </div>
    </AuthenticatedLayout>
  );
}