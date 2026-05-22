import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { LayoutDashboardIcon, UsersIcon } from "lucide-react";

const sidebarLinks = [
  {
    label: "Overview",
    path: "/coordinator/dashboard",
    icon: <LayoutDashboardIcon className="size-5" />,
  },
  {
    label: "Patients",
    path: "/coordinator/manage-patients",
    icon: <UsersIcon className="size-5" />,
  },
];

export default function CoordinatorLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar sidebarLinks={sidebarLinks} portalLabel="Coordinator Portal" />
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
