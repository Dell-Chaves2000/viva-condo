"use client";

import { useState, useEffect } from "react";
import { ICondominio } from "@/services/condominio.service";
import { toast } from "sonner";

interface CondominioFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (condominio: Omit<ICondominio, 'id_condominio' | 'created_at'>) => void;
  condominio?: ICondominio | null;
  loading?: boolean;
}

export default function CondominioForm({ 
  isOpen, 
  onClose, 
  onSave, 
  condominio, 
  loading = false 
}: CondominioFormProps) {
  const [formData, setFormData] = useState({
    nome_condominio: '',
    endereco_condominio: '',
    cidade_condominio: '',
    uf_condominio: '',
    tipo_condominio: 'Residencial',
    id_administradora: 1 // ← AGORA em minúsculo
  });

  // Preenche o formulário quando editar
  useEffect(() => {
    if (condominio) {
      setFormData({
        nome_condominio: condominio.nome_condominio,
        endereco_condominio: condominio.endereco_condominio,
        cidade_condominio: condominio.cidade_condominio,
        uf_condominio: condominio.uf_condominio,
        tipo_condominio: condominio.tipo_condominio,
        id_administradora: condominio.id_administradora // ← AGORA em minúsculo
      });
    } else {
      // Reset do formulário para novo condomínio
      setFormData({
        nome_condominio: '',
        endereco_condominio: '',
        cidade_condominio: '',
        uf_condominio: '',
        tipo_condominio: 'Residencial',
        id_administradora: 1 // ← AGORA em minúsculo
      });
    }
  }, [condominio, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.nome_condominio.trim()) {
      toast.error("O nome do condomínio é obrigatório.");
      return;
    }

    if (!formData.endereco_condominio.trim()) {
      toast.error("O endereço é obrigatório.");
      return;
    }

    if (!formData.cidade_condominio.trim()) {
      toast.error("A cidade é obrigatória.");
      return;
    }

    if (!formData.uf_condominio.trim()) {
      toast.error("A UF é obrigatória.");
      return;
    }

    // Força o envio com os nomes corretos
    const dataToSend = {
      nome_condominio: formData.nome_condominio,
      endereco_condominio: formData.endereco_condominio,
      cidade_condominio: formData.cidade_condominio,
      uf_condominio: formData.uf_condominio,
      tipo_condominio: formData.tipo_condominio,
      id_administradora: formData.id_administradora // ← Mantém minúsculo
    };

    console.log("Dados enviados:", dataToSend); // Para debug
    onSave(dataToSend);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <h2 className="text-xl font-bold text-blue-800 mb-4">
            {condominio ? 'Editar Condomínio' : 'Novo Condomínio'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Condomínio *
              </label>
              <input
                type="text"
                name="nome_condominio"
                value={formData.nome_condominio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite o nome do condomínio"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço *
              </label>
              <input
                type="text"
                name="endereco_condominio"
                value={formData.endereco_condominio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite o endereço completo"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade *
                </label>
                <input
                  type="text"
                  name="cidade_condominio"
                  value={formData.cidade_condominio}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Cidade"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UF *
                </label>
                <input
                  type="text"
                  name="uf_condominio"
                  value={formData.uf_condominio}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="UF"
                  maxLength={2}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Condomínio
              </label>
              <select
                name="tipo_condominio"
                value={formData.tipo_condominio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Residencial">Residencial</option>
                <option value="Comercial">Comercial</option>
                <option value="Misto">Misto</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Salvando...' : (condominio ? 'Atualizar' : 'Cadastrar')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}