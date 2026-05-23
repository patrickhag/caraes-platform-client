import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import UserDetailPage from "./pages/admin/UserDetailPage";
import ManageHospitalsPage from "./pages/admin/ManageHospitalsPage";
import HospitalDetailPage from "./pages/admin/HospitalDetailPage";
import HospitalAdminLayout from "./pages/hospital-admin/HospitalAdminLayout";
import HospitalAdminPage from "./pages/hospital-admin/HospitalAdminPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import OverviewAdminPage from "./pages/admin/OverviewAdminPage";
import ProtectedRoute from "#components/ProtectedRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import CoordinatorLayout from "./pages/coordinator/CoordinatorLayout";
import RegisterPatientPage from "./pages/coordinator/RegisterPatientPage";
import PatientDetailPage from "./pages/coordinator/PatientDetailPage";
import OverviewCoordinatorPage from "./pages/coordinator/CoodinatorOverview";
import ManagePatientsPage from "./pages/coordinator/ManagePatientsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/login",
    element: <Navigate to="/" replace />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
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
      { path: "manage-users/:id", element: <UserDetailPage /> },
      { path: "manage-hospitals", element: <ManageHospitalsPage /> },
      { path: "manage-hospitals/:id", element: <HospitalDetailPage /> },
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
      { path: "dashboard", element: <OverviewCoordinatorPage /> },
      { path: "manage-patients", element: <ManagePatientsPage /> },
      { path: "register-patient", element: <RegisterPatientPage /> },
      { path: "patients/:id", element: <PatientDetailPage /> },
    ],
  },
  // *** HOSPITAL ADMIN PAGES ***
  {
    path: "/hospital-admin",
    element: (
      <ProtectedRoute role="HOSPITAL_ADMIN">
        <HospitalAdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <HospitalAdminPage /> },
    ],
  },
]);
