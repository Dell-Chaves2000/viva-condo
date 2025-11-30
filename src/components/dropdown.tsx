"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { BiDotsVertical, BiPlus, BiEdit, BiTrash } from "react-icons/bi";

interface DropdownProps {
  onAdd?: () => void;
  onEdit: () => void;
  onDelete: () => void;
  showAddOption?: boolean;
}

export default function Dropdown({ onAdd, onEdit, onDelete, showAddOption = false }: DropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
          <BiDotsVertical className="w-6 h-6 text-blue-600" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[140px] bg-white rounded-md shadow-lg border border-gray-200 p-1 z-50"
          align="end"
          sideOffset={5}
        >
          {showAddOption && onAdd && (
            <DropdownMenu.Item
              className="px-3 py-2 text-sm text-gray-700 rounded-sm hover:bg-blue-50 hover:text-blue-700 cursor-pointer focus:outline-none focus:bg-blue-50 focus:text-blue-700 flex items-center gap-2"
              onSelect={onAdd}
            >
              <BiPlus className="w-4 h-4" />
              Incluir
            </DropdownMenu.Item>
          )}
          <DropdownMenu.Item
            className="px-3 py-2 text-sm text-gray-700 rounded-sm hover:bg-blue-50 hover:text-blue-700 cursor-pointer focus:outline-none focus:bg-blue-50 focus:text-blue-700 flex items-center gap-2"
            onSelect={onEdit}
          >
            <BiEdit className="w-4 h-4" />
            Editar
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="px-3 py-2 text-sm text-red-600 rounded-sm hover:bg-red-50 cursor-pointer focus:outline-none focus:bg-red-50 flex items-center gap-2"
            onSelect={onDelete}
          >
            <BiTrash className="w-4 h-4" />
            Excluir
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}