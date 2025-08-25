// === File: src/context/AuthContext.jsx ===
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // restore from storage
    const token = localStorage.getItem("auth_demo_token");
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    // Demo-only: accept admin / admin
    if (username === "admin" && password === "admin") {
      localStorage.setItem("auth_demo_token", "ok");
      setIsAuthenticated(true);
      return { ok: true };
    }
    return { ok: false, error: "Usuário ou senha inválidos." };
  };

  const logout = () => {
    localStorage.removeItem("auth_demo_token");
    setIsAuthenticated(false);
  };

  const value = useMemo(() => ({ isAuthenticated, loading, login, logout }), [isAuthenticated, loading]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}