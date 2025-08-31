import { useState, useCallback } from "react";
import { api } from "../../services/api";

export default function useLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const login = useCallback(async () => {
        setError("");
        setLoading(true);
        try {
            const res = await api.post("/api/auth/login", { username, password });

            const { token, fullName, username: uName } = res.data || {};
            if (!token) throw new Error("Token não retornado pela API.");

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify({ fullName, username: uName }));

            const nome = fullName || uName || "Usuário";
            localStorage.setItem("nomeUsuario", nome);

            return { token, user: { fullName, username: uName } };
        } catch (err) {
            const msg =
                err?.response?.data?.error ||
                err?.response?.data?.message ||
                err?.message ||
                "Falha ao autenticar. Verifique usuário/senha.";
            setError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [username, password]);

    return {
        username, setUsername,
        password, setPassword,
        error, loading,
        showPass, setShowPass,
        login,
    };
}
