import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/auth";
import type { ReactNode } from "react";

type ProtectedRouteProps = {
  children: ReactNode;
  requireAuth?: boolean;
  requireRole?: string;
  requireAnyRole?: string[];
};

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requireRole,
  requireAnyRole,
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
    const roles: string[] = (user as any).roles || ((user as any).role ? [(user as any).role] : []);
    if (!roles.includes(requireRole)) {
      return <Navigate to="/" replace />;
    }
  }

  if (requireAnyRole && user) {
    const roles: string[] = (user as any).roles || ((user as any).role ? [(user as any).role] : []);
    const ok = requireAnyRole.some((r) => roles.includes(r));
    if (!ok) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
