"use client";

import AuthenticatedLayout from "@/components/authenticated-layout";
import { useEffect, useState } from "react";

interface IUsuario {
  id_usuario: number;
  nome_usuario: string;
  email_usuario: string;
  contato_usuario: string;
  tipo_usuario: string;
  status_usuario: string;
}

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const buscaUsuarios = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/usuarios");
        const json = await response.json();

        if (!json.success) throw new Error(json.error);
        setUsuarios(json.data);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar os dados");
      } finally {
        setLoading(false);
      }
    };

    buscaUsuarios();
  }, []);

  return (
    <AuthenticatedLayout>
      <div className="p-6 max-w-full">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold">Usuários</h1>
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
                    E-mail
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                    Contato
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {usuarios.length === 0 ? (
                  <tr>
                    <td
                      className="px-4 py-3 text-sm text-gray-700 text-center"
                      colSpan={7}
                    >
                      Nenhum usuário encontrado
                    </td>
                  </tr>
                ) : (
                  usuarios.map((usuario, index) => (
                    <tr
                      key={usuario.id_usuario}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {String(index + 1)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {usuario.nome_usuario}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {usuario.email_usuario}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {usuario.contato_usuario}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {usuario.tipo_usuario}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          usuario.status_usuario === 'Ativo' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {usuario.status_usuario}
                        </span>
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