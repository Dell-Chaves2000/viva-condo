"use client";

import AuthenticatedLayout from "@/components/authenticated-layout";
import SearchInput from "@/components/SearchInput";
import { useEffect, useState } from "react";
import { ICondominio } from "@/services/condominio.service";
import { FaSearch } from "react-icons/fa";
import Dropdown from "@/components/dropdown";
import ConfirmDialog from "@/components/confirm-dialog";
import CondominioForm from "@/components/condominio-form";
import { toast } from "sonner";

export default function ListaCondominios() {
  const [condominios, setCondominios] = useState<ICondominio[]>([]);
  const [condominiosFiltrados, setCondominiosFiltrados] = useState<ICondominio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pesquisa, setPesquisa] = useState<string>("");
  
  // Estados para o modal de confirmação de exclusão
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [condominioToDelete, setCondominioToDelete] = useState<ICondominio | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Estados para o formulário de incluir/editar
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [condominioToEdit, setCondominioToEdit] = useState<ICondominio | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    buscaCondominios();
  }, []);

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

  // Funções para o formulário de incluir/editar
  const handleOpenForm = (condominio?: ICondominio) => {
    setCondominioToEdit(condominio || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCondominioToEdit(null);
  };

  const handleSaveCondominio = async (formData: any) => {
  try {
    setIsSaving(true);

    // URLs corrigidas
    const url = condominioToEdit 
      ? `/api/condominios/${condominioToEdit.id_condominio}/edit`  // Nova URL para PUT
      : '/api/condominios';  // POST permanece o mesmo
    
    const method = condominioToEdit ? 'PUT' : 'POST';

    console.log("Enviando dados para:", url, "Método:", method);
    console.log("Dados:", formData);

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    // Verifica se a resposta é válida
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Resposta de erro:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Resposta do servidor:", result);

    if (!result.success) {
      throw new Error(result.error);
    }

    // Atualiza a lista
    await buscaCondominios();
    
    // Fecha o formulário
    handleCloseForm();
    
    // Mensagem de sucesso
    toast.success(
      condominioToEdit 
        ? "Condomínio atualizado com sucesso." 
        : "Condomínio cadastrado com sucesso."
    );
    
  } catch (error: any) {
    console.error("Erro ao salvar condomínio:", error);
    
    // Mensagem de erro mais específica
    let errorMessage = "Não foi possível salvar o condomínio. Tente novamente.";
    
    if (error.message.includes('HTTP error')) {
      errorMessage = "Erro de conexão com o servidor. Verifique sua internet.";
    } else if (error.message.includes('Unexpected token')) {
      errorMessage = "Erro no formato da resposta do servidor.";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    toast.error(errorMessage);
  } finally {
    setIsSaving(false);
  }
};

  // Funções para exclusão
  const handleOpenDeleteDialog = (condominio: ICondominio) => {
    setCondominioToDelete(condominio);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCondominioToDelete(null);
  };

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

      setCondominios(prev => 
        prev.filter(c => c.id_condominio !== condominioToDelete.id_condominio)
      );
      
      handleCloseDialog();
      toast.success("Condomínio excluído com sucesso.");
      
    } catch (error: any) {
      console.error("Erro ao excluir condomínio:", error);
      toast.error("Não foi possível excluir o condomínio. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="p-6 max-w-full">
        {/* Cabeçalho com título e dropdown de ações */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Condomínios</h1>
          
          {/* Dropdown para ações gerais (incluir) */}
          <Dropdown
            onAdd={() => handleOpenForm()}
            onEdit={() => toast.info("Selecione um condomínio para editar")}
            onDelete={() => toast.info("Selecione um condomínio para excluir")}
            showAddOption={true}
          />
        </div>

        {/* Input de Pesquisa */}
        <div className="mb-6">
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
                          onEdit={() => handleOpenForm(condominio)}
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

        {/* Modal de Confirmação de Exclusão */}
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

        {/* Formulário de Incluir/Editar Condomínio */}
        <CondominioForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSave={handleSaveCondominio}
          condominio={condominioToEdit}
          loading={isSaving}
        />
      </div>
    </AuthenticatedLayout>
  );
}