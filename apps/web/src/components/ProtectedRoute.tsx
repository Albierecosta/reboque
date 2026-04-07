import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/types";

export function ProtectedRoute({ roles }: { roles: Role[] }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-200">
        Carregando plataforma...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
