import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

/**
 * Hook CRUD genérico para qualquer recurso REST.
 * @param {string} endpoint Ex.: "/users" ou "/api/usuarios"
 */
export function useCrud(endpoint) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);


  const url = useMemo(() => endpoint.replace(/\/+$/, ""), [endpoint]);

  /**
   * Lista itens.
   * Aceita API que retorna:
   *  - um array simples: [ ... ]
   *  - um objeto paginado: { data: [...], total: 123 }
   * @param {object} params Ex.: { page:1, pageSize:10, search:"abc" }
   */
  const list = useCallback(async (params) => {
    setLoading(true);
    setError(undefined);
    try {
      const res = await api.get(url, { params });
      const payload = res.data;

      if (Array.isArray(payload)) {
        setItems(payload);
        setTotal(undefined);
      } else {
        setItems(Array.isArray(payload.data) ? payload.data : []);
        setTotal(payload.total);
      }
    } catch (e) {
      const msg = e?.response?.data?.message || "Erro ao carregar dados";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [url]);

  const getById = useCallback(async (id) => {
    const res = await api.get(`${url}/${id}`);
    return res.data;
  }, [url]);

  const createItem = useCallback(async (payload) => {
    const res = await api.post(url, payload);
    setItems((prev) => [res.data, ...prev]);
    return res.data;
  }, [url]);

  const updateItem = useCallback(async (id, payload) => {
    const res = await api.put(`${url}/${id}`, payload);
    const updated = res.data;
    setItems((prev) => prev.map((it) => (String(it.id) === String(id) ? updated : it)));
    return updated;
  }, [url]);

  const deleteItem = useCallback(async (id) => {
    await api.delete(`${url}/${id}`);
    setItems((prev) => prev.filter((it) => String(it.id) !== String(id)));
  }, [url]);

  return {
    items, total, loading, error,
    list, getById, createItem, updateItem, deleteItem,
    setItems,
  };
}
