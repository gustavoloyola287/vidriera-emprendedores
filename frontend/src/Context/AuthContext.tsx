import React, { useState, createContext, useEffect, useContext, type ReactNode } from "react";

// 1. Tipado
interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

// 2. Creación del contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Proveedor (AuthProvider)
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
const [token, setToken] = useState<string | null>(null);

useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) setToken(storedToken);
    }, []);

    const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
};

const isAuthenticated = token !== null;

return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
    {children}
    </AuthContext.Provider>
);
};

// 4. Hook personalizado (AQUÍ ES DONDE SE DECLARA Y EXPORTA)
export const useAuth = () => {
const context = useContext(AuthContext);
if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
}
return context;
};