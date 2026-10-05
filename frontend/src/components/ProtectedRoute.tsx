import React from 'react';
import { Navigate } from 'react-router-dom';

// ✅ Agregamos requiredRole como propiedad opcional
interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: string; 
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // 1. Si no hay token, mandar al login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 2. Si se requiere un rol específico, verificarlo
    if (requiredRole) {
        const userRole = role?.toUpperCase() || '';
        
        // Permitimos tanto al rol específico como al SUPER_ADMIN (que tiene acceso a todo)
        const isAllowed = 
            userRole === requiredRole || 
            userRole === 'ROLE_SUPER_ADMIN' || 
            userRole === 'SUPER_ADMIN';

        if (!isAllowed) {
            // Si no tiene el rol, lo mandamos al home o a una página de "No autorizado"
            return <Navigate to="/" replace />; 
        }
    }

    return <>{children}</>;
};