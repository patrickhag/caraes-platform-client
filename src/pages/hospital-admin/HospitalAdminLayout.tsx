import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { LayoutDashboardIcon, UsersIcon, FileTextIcon } from "lucide-react";

const sidebarLinks = [
  {
    label: "Overview",
    path: "/hospital-admin/dashboard",
    icon: <LayoutDashboardIcon className="size-5" />,
  },
  {
    label: "Patients",
    path: "/hospital-admin/patients",
    icon: <UsersIcon className="size-5" />,
  },
  {
    label: "Reports",
    path: "/hospital-admin/reports",
    icon: <FileTextIcon className="size-5" />,
  },
];

export default function HospitalAdminLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar sidebarLinks={sidebarLinks} portalLabel="Hospital Admin Portal" />
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
