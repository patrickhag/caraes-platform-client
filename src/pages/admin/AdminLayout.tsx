import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { Building2, LayoutDashboardIcon, UsersIcon } from "lucide-react";

const sidebarLinks = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboardIcon className="size-5" />,
  },
  {
    label: "Manage Hospitals",
    path: "/admin/manage-hospitals",
    icon: <Building2 className="size-5" />,
  },
  {
    label: "Manage Users",
    path: "/admin/manage-users",
    icon: <UsersIcon className="size-5" />,
  },
];

export default function AdminLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar sidebarLinks={sidebarLinks} portalLabel="Admin Portal" />
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
