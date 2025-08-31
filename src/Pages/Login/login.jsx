import { useState } from "react";
import useLogin from "./useLogin";

export default function Login({ onLoginSuccess }) {

  const { username, setUsername, password, setPassword, error, setError, loading, setLoading, login, showPass, setShowPass } = useLogin();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { user } = await login();
      onLoginSuccess?.(user);
    } catch {
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            <i className="fas fa-user-shield" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-800">Bem-vindo</h2>
          <p className="text-gray-500">Acesse sua conta</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Digite seu usuário"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Digite sua senha"
            />
            <button type="button" onClick={() => setShowPass(s => !s)}>
              {showPass ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}