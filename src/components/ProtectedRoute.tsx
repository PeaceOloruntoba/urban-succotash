import { Navigate, useLocation } from "react-router";
import { useAuthStore } from "../stores/auth";
import type { ReactNode } from "react";

type ProtectedRouteProps = {
  children: ReactNode;
  requireAuth?: boolean;
  requireRole?: string;
};

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requireRole,
}: ProtectedRouteProps) {
  const { user, accessToken } = useAuthStore();
  const location = useLocation();

  if (requireAuth && !accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireRole && user) {
    // Check if user has the required role
    const userRole = (user as any).role || (user as any).roles?.[0];
    if (userRole !== requireRole) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
