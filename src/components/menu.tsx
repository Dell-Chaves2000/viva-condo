"use client";

import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { FaBuilding, FaUsers, FaHome ,FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";

export default function Menu() {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.replace("/");
  };

  const menuItems = [
    { name: "Condomínios", path: "/condominios", icon: <FaBuilding /> },
    { name: "Usuários", path: "/usuarios", icon: <FaUsers /> },
    { name: "Moradores", path: "/moradores", icon: <FaHome  /> },
  ];

  return (
    <div className="w-60 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0">
      <div className="flex-1">
        {/* Cabeçalho */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-800">Viva Condo</h1>
        </div>

        {/* Itens do menu */}
        <nav className="mt-4 flex flex-col">
          {menuItems.map((item) => {
            const active = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
          
          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors mt-4"
          >
            <FaSignOutAlt className="text-red-500" />
            {loading ? "Saindo..." : "Sair"}
          </button>
        </nav>
      </div>
    </div>
  );
}