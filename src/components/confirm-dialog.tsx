"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: React.ReactNode; // Agora aceita qualquer conteúdo React
  message?: string; // Mantido para compatibilidade
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  variant?: "default" | "destructive";
  itemName?: string; // Nome do item a ser excluído (opcional)
  warningText?: string; // Texto de aviso personalizado (opcional)
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  message, // Para compatibilidade com versões antigas
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  loading = false,
  variant = "default",
  itemName,
  warningText = "Todos os moradores vinculados a este condomínio também serão excluídos. Esta ação não poderá ser desfeita."
}: ConfirmDialogProps) {
  const isDestructive = variant === "destructive";

  // Conteúdo padrão para exclusão de condomínios
  const defaultCondominioContent = (
    <div className="space-y-3">
      {/* Pergunta em azul */}
      <p className="text-blue-600">
        Tem certeza de que deseja excluir o condomínio
      </p>
      
      {/* Nome do condomínio em preto, negrito e maior */}
      <p className="text-black font-bold text-lg py-1">
        {itemName}?
      </p>
      
      {/* Aviso em vermelho e negrito */}
      <div className="text-red-600 font-bold space-y-1">
        {warningText.split('. ').map((sentence, index) => (
          <p key={index}>{sentence.trim()}{sentence.trim().endsWith('.') ? '' : '.'}</p>
        ))}
      </div>
    </div>
  );

  // Se description for fornecido, usa ele, senão usa o conteúdo padrão
  const content = description || defaultCondominioContent;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <div className="fixed inset-0 z-40">
          <div 
            className="absolute inset-0 bg-transparent"
            onClick={onClose}
          />
          
          <Dialog.Content 
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-[0_0_0_100vmax_rgba(0,0,0,0.1)] p-6 w-full max-w-md z-50 border border-gray-200 focus:outline-none"
          >
            <Dialog.Close asChild>
              <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                <FaTimes className="w-4 h-4" />
              </button>
            </Dialog.Close>

            {isDestructive && (
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                <FaExclamationTriangle className="w-6 h-6 text-red-600" />
              </div>
            )}
            
            <div className="text-center mb-2">
              <Dialog.Title className={`text-xl font-bold ${
                isDestructive ? "text-blue-800" : "text-gray-900"
              }`}>
                {title}
              </Dialog.Title>
            </div>

            <div className="text-sm mb-6 text-center leading-relaxed px-2">
              {content}
            </div>
            
            <div className="flex justify-center gap-3">
              <Dialog.Close asChild>
                <button
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {cancelText}
                </button>
              </Dialog.Close>
              <button
                className={`px-6 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDestructive
                    ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                }`}
                onClick={onConfirm}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Excluindo...
                  </div>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}