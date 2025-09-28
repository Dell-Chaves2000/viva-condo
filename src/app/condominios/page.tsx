"use client";

import { useEffect, useState } from "react";
import { ICondominio } from "@/services/condominio.service";

export default function ListaCondominios() {
  const [condominios, setCondominios] = useState<ICondominio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const buscaCondominios = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/condominios");
        const json = await response.json();

        if (!json.success) {
          throw new Error(json.error);
        }

        setCondominios(json.data);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar os dados");
      } finally {
        setLoading(false);
      }
    };

    buscaCondominios();
  }, []);

  return (
    <div className="p-6 max-w-full">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Condomínios</h1>
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
              {condominios.length === 0 ? (
                <tr>
                  <td
                    className="px-4 py-3 text-sm text-gray-700 text-center"
                    colSpan={7}
                  >
                    Nenhum condomínio encontrado
                  </td>
                </tr>
              ) : (
                condominios.map((condominio, index) => (
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
  );
}
