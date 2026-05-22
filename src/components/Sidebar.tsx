import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

interface SidebarLink {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  portalLabel: string;
  sidebarLinks: SidebarLink[];
}

export default function Sidebar({ portalLabel, sidebarLinks }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-white shadow-lg">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-2">NCTAIS</h2>

        <p className="text-sm text-slate-600 mb-8">{portalLabel}</p>
      </div>

      <nav className="flex flex-1 flex-col px-6 py-4">
        <div className="space-y-2">
          {sidebarLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-800 border-l-4 border-blue-800"
                    : "text-slate-600 hover:bg-slate-50"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="px-6 pb-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 min-h-12 rounded-lg bg-blue-800 text-white font-medium shadow-md hover:bg-blue-900 transition-colors"
        >
          <LogOut className="size-5" />
          Log out
        </button>
      </div>
    </aside>
  );
}
