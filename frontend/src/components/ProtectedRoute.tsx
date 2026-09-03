import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // Si no hay token, redirige al login inmediatamente
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
