import { useState } from "react";
import useLogin from "./useLogin";
import imgbg from "../../assets/images/FinancialControlImg.png";

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
    <div className="min-h-screen flex h-screen w-screen bg-gradient-to-br from-gray-800 via-gray-600 to-gray-500">
      <div className="flex items-center justify-center h-full basis-[70%]">
        <img
          src={imgbg}
          alt="Financial Control"
          className=""
        />
      </div>
      <div className="bg-white flex flex-col items-center justify-center p-6 h-full basis-[30%]">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-[#041c3c] rounded-full flex items-center justify-center text-white text-2xl font-bold">
            <i className="fas fa-line-chart" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-800">Bem-vindo</h2>
          <p className="text-gray-500">Acesse sua conta</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <div>
            <label className="block text-sm font-medium text-gray-700">Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-[#041c3c] rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Digite seu usuário"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-[#041c3c] rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Digite sua senha"
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="absolute inset-y-0 top-6 right-3 flex items-center text-gray-500"
            >
              {showPass ? <i className="fas fa-eye-slash" /> : <i className="fas fa-eye" />}
            </button>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#041c3c] text-white font-bold rounded-lg hover:bg-[#044c84] transition-colors cursor-pointer"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}