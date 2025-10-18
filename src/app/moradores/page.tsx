"use client";

import AuthenticatedLayout from "@/components/authenticated-layout";
import { useEffect, useState } from "react";

interface IMorador {
  id_morador: number;
  nome_morador: string;
  contato_morador: string;
  condominio: string;
  usuario: string;
}

export default function ListaMoradores() {
  const [moradores, setMoradores] = useState<IMorador[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const buscaMoradores = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/moradores");
        const json = await response.json();

        if (!json.success) throw new Error(json.error);
        setMoradores(json.data);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar os dados");
      } finally {
        setLoading(false);
      }
    };

    buscaMoradores();
  }, []);

  return (
    <AuthenticatedLayout>
      <div className="p-6 max-w-full">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold">Moradores</h1>
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
                    Contato
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                    Condomínio
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                    Usuário
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {moradores.length === 0 ? (
                  <tr>
                    <td
                      className="px-4 py-3 text-sm text-gray-700 text-center"
                      colSpan={6}
                    >
                      Nenhum morador encontrado
                    </td>
                  </tr>
                ) : (
                  moradores.map((morador, index) => (
                    <tr
                      key={morador.id_morador}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {String(index + 1)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {morador.nome_morador}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {morador.contato_morador}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {morador.condominio}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {morador.usuario}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {/* Espaço para ações futuras (editar, excluir, etc.) */}
                      </td>
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