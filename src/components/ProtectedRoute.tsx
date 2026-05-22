import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  role: string;
  children: React.ReactNode;
}

export default function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const token = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");
  const isAuthenticated = !!token;

  if (!isAuthenticated || userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
