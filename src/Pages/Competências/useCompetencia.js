import { useState } from "react";
import { api } from "../../services/api";

export default function useCompetencia() {

    const [competencias, setCompetencias] = useState([]);

    async function loadCompetencias() {
        const res = await api.get("/api/competencias");
        setCompetencias(res.data);
    }
    return { competencias, loadCompetencias };
}