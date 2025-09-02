import { useCallback, useMemo, useState } from "react";
import { api } from "../services/api";

export function useCrudCore(endpoint) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(undefined);
  const [pagination, setPagination] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);

  const url = useMemo(() => endpoint.replace(/\/+$/, ""), [endpoint]);

  const list = useCallback(async (params) => {
    setLoading(true);
    setError(undefined);
    try {
      const res = await api.get(url, { params });
      const payload = res.data;

      if (Array.isArray(payload)) {
        setItems(payload);
        setTotal(payload.length);
        setPagination(undefined);
      } else if (payload && typeof payload === "object") {
        const fromItems = Array.isArray(payload.items) ? payload.items : undefined;
        const fromData = Array.isArray(payload.data) ? payload.data : undefined;

        const listArr = fromItems ?? fromData ?? [];
        const totalNum =
          (payload && payload.pagination && payload.pagination.totalItems) ??
          payload?.total ??
          listArr.length;

        setItems(listArr);
        setTotal(totalNum);
        setPagination(payload?.pagination);
      } else {
        setItems([]);
        setTotal(0);
        setPagination(undefined);
      }
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Erro ao carregar dados";
      setError(msg);
      setItems([]);
      setTotal(0);
      setPagination(undefined);
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
    items,
    total,
    pagination,
    loading,
    error,
    list,
    getById,
    createItem,
    updateItem,
    deleteItem,
    setItems,
  };
}
