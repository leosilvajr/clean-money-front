import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = !!token;

  useEffect(() => {
    if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete api.defaults.headers.common["Authorization"];
  }, [token]);

  useEffect(() => {
    const id = api.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err?.response?.status === 401) logout();
        return Promise.reject(err);
      }
    );
    return () => api.interceptors.response.eject(id);
  }, []);

  useEffect(() => {
    if (!token) return;
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return;
      const payload = JSON.parse(atob(parts[1]));
      const expMs = (payload?.exp ?? 0) * 1000;
      const ms = expMs - Date.now();
      if (ms <= 0) return logout();
      const t = setTimeout(logout, ms);
      return () => clearTimeout(t);
    } catch {
    }
  }, [token]);

  async function login(username, password) {
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { username, password });
      const { token: tk, fullName, username: uName } = res.data || {};
      if (!tk) throw new Error("Token não retornado pela API.");

      const u = { fullName, username: uName };

      setUser(u);
      setToken(tk);

      localStorage.setItem("token", tk);
      localStorage.setItem("user", JSON.stringify(u));
      localStorage.setItem("nomeUsuario", fullName || uName || "Usuário");
    } catch (e) {
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e?.message ||
        "Falha ao autenticar.";
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("nomeUsuario");
  }

  const value = useMemo(
    () => ({ user, token, isAuthenticated, loading, error, login, logout }),
    [user, token, isAuthenticated, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}