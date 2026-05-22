import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import ManageHospitalsPage from "./pages/admin/ManageHospitalsPage";
import HospitalAdminPage from "./pages/HospitalAdminPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import OverviewAdminPage from "./pages/admin/OverviewAdminPage";
import ProtectedRoute from "#components/ProtectedRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import CoordinatorLayout from "./pages/coordinator/CoordinatorLayout";
import CoordinatorPage from "./pages/coordinator/CoordinatorPage";
import RegisterPatientPage from "./pages/coordinator/RegisterPatientPage";
import PatientDetailPage from "./pages/coordinator/PatientDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/admin/overview",
    element: <Navigate to="/admin/dashboard" replace />,
  },
  {
    path: "/admin/overview/manage-users",
    element: <Navigate to="/admin/manage-users" replace />,
  },
  // *** ADMIN PAGES ***
  {
    path: "/admin",
    element: (
      <ProtectedRoute role="ADMIN">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <OverviewAdminPage /> },
      { path: "manage-users", element: <ManageUsersPage /> },
      { path: "manage-hospitals", element: <ManageHospitalsPage /> },
    ],
  },
  // *** COORDINATOR PAGES ***
  {
    path: "/coordinator",
    element: (
      <ProtectedRoute role="COORDINATOR">
        <CoordinatorLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <CoordinatorPage /> },
      { path: "manage-patients", element: <CoordinatorPage /> },
      { path: "register-patient", element: <RegisterPatientPage /> },
      { path: "patients/:id", element: <PatientDetailPage /> },
    ],
  },
  {
    path: "/hospital-admin/dashboard",
    element: (
      <ProtectedRoute role="HOSPITAL_ADMIN">
        <HospitalAdminPage />
      </ProtectedRoute>
    ),
  },
]);
