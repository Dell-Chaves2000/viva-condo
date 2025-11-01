"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
//import { FaEllipsisV } from "react-icons/fa";
import { BiDotsVertical } from "react-icons/bi";

interface DropdownProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function Dropdown({ onEdit, onDelete }: DropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
          {/*<FaEllipsisV className="w-4 h-4 text-gray-600" />*/}
          <BiDotsVertical className="w-6 h-6 text-blue-400" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[120px] bg-white rounded-md shadow-lg border border-gray-200 p-1 z-50"
          align="end"
          sideOffset={5}
        >
          <DropdownMenu.Item
            className="px-3 py-2 text-sm text-gray-700 rounded-sm hover:bg-blue-50 hover:text-blue-700 cursor-pointer focus:outline-none focus:bg-blue-50 focus:text-blue-700"
            onSelect={onEdit}
          >
            Editar
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="px-3 py-2 text-sm text-red-600 rounded-sm hover:bg-red-50 cursor-pointer focus:outline-none focus:bg-red-50"
            onSelect={onDelete}
          >
            Excluir
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}