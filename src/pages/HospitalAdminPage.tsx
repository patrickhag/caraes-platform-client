import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const hospitalAdminContent = {
  overview: {
    title: "Hospital Admin Dashboard",
    description: "You are logged in as a Hospital Admin.",
  },
  patients: {
    title: "Patients",
    description: "Manage patient activity for your hospital.",
  },
  reports: {
    title: "Reports",
    description: "Review hospital reports and operational summaries.",
  },
};

export default function HospitalAdminPage() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("overview");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate("/");
  };
  const content =
    hospitalAdminContent[activeMenu as keyof typeof hospitalAdminContent] ??
    hospitalAdminContent.overview;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        activeMenu={activeMenu}
        role="HOSPITAL_ADMIN"
        setActiveMenu={setActiveMenu}
        onLogout={handleLogout}
      />

      <main className="flex-1 p-8 ml-64">
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <h1 className="mb-2 text-4xl font-bold text-slate-950">
            {content.title}
          </h1>
          <p className="text-lg text-slate-600">{content.description}</p>
        </div>
      </main>
    </div>
  );
}
