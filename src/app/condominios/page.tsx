"use client";

import AuthenticatedLayout from "@/components/authenticated-layout";
import SearchInput from "@/components/SearchInput";
import { useEffect, useState } from "react";
import { ICondominio } from "@/services/condominio.service";
import { FaSearch } from "react-icons/fa";

export default function ListaCondominios() {
  const [condominios, setCondominios] = useState<ICondominio[]>([]);
  const [condominiosFiltrados, setCondominiosFiltrados] = useState<ICondominio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pesquisa, setPesquisa] = useState<string>("");

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
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500"></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}