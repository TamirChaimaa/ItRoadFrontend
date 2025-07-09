import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, FileText, Plus, Users, Settings } from "lucide-react";

const Sidebar = ({ isOpen }) => {
  const location = useLocation();

   const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/dashboard/documents", label: "Documents", icon: FileText },
    { path: "/dashboard/add-document", label: "Ajouter Document", icon: Plus },
    { path: "/dashboard/users", label: "Utilisateurs", icon: Users },
    { path: "/dashboard/profile", label: "Profil", icon: Settings },
  ];

  return (
    <aside className={`bg-white w-64 border-r shadow-sm z-30 lg:static ${isOpen ? "block" : "hidden"} lg:block`}>
      <div className="h-full flex flex-col">
        <div className="p-4 font-bold text-lg text-center border-b">Admin</div>
        <nav className="flex-1 px-4 py-2 space-y-1">
          {menuItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center px-4 py-2 rounded-lg transition ${
                location.pathname === path
                  ? "bg-cyan-100 text-cyan-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="mr-3" size={20} />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
