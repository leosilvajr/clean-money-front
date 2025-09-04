import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";

export default function useLogin() {
    const { login: authLogin, isAuthenticated, loading: ctxLoading, error: ctxError } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);

    const loading = ctxLoading ?? false;
    const error = ctxError ?? "";

    const login = useCallback(async () => {
        const res = await authLogin(username, password);
        const user = res?.user || JSON.parse(localStorage.getItem("user") || "null");
        const token = res?.token || localStorage.getItem("token");
        return { user, token };
    }, [username, password, authLogin]);

    return {
        username, setUsername,
        password, setPassword,
        error, loading,
        showPass, setShowPass,
        login,
        isAuthenticated,
    };
}
