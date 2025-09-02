import { useCallback, useEffect, useRef, useState } from "react";
import { useCrudCore } from "./useCrudCore";

/**
 * Adapter para o DataPage (JS puro)
 * - Sincroniza params locais e chama core.list(params) sempre que mudarem.
 * - Expõe a interface esperada pelo DataPage.
 */
export function useCrud(endpoint, initialParams = {}) {
  const core = useCrudCore(endpoint);

  const [params, setParams] = useState({
    search: "",
    page: 1,            // 1-based
    limit: 10,
    orderOptions: [{ Field: "Codigo", OrderDirection: "asc" }],
    filters: {},
    extraParams: {},
    ...initialParams,
  });

  const firstRun = useRef(true);

  const toPascalPath = (s) =>
    (s || "")
      .split(".")
      .map(seg => seg ? seg.charAt(0).toUpperCase() + seg.slice(1) : seg)
      .join(".");

  const buildQuery = useCallback(() => {
    const { search, page, limit, orderOptions, filters, extraParams } = params;

    const primaryOrder = Array.isArray(orderOptions) && orderOptions.length > 0
      ? orderOptions[0]
      : { Field: "Id", OrderDirection: "asc" };
    const fieldApi = toPascalPath(primaryOrder.Field);
    const directionApi = /^desc$/i.test(primaryOrder.OrderDirection) ? "Desc" : "Asc";

    // Monte um objeto "rico". Se sua API só entende alguns campos,
    // ajuste aqui (ou no backend) sem tocar o DataPage.
    const query = {
      // novo formato
      search,
      page,
      limit,
      orderField: primaryOrder.Field,
      orderDirection: primaryOrder.OrderDirection,

      "ordering.items[0].field": fieldApi,
      "ordering.items[0].direction": directionApi,

      // legado (o seu back atual usa estes)
      "pagination.pageNumber": page,
      "pagination.pageSize": limit,
      "ordering.field": primaryOrder.Field,
      "ordering.direction": primaryOrder.OrderDirection,

      ...filters,
      ...(extraParams || {}),
    };

    return query;
  }, [params]);

  // Carrega ao iniciar e a cada mudança de params
  useEffect(() => {
    // evita duplo disparo em StrictMode
    if (firstRun.current) {
      firstRun.current = false;
      core.list(buildQuery());
      return;
    }
    core.list(buildQuery());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildQuery, endpoint]);

  const updateParams = useCallback((patch) => {
    setParams((prev) => ({ ...prev, ...(patch || {}) }));
  }, []);

  const create = useCallback(async (payload) => {
    await core.createItem(payload);
    await core.list(buildQuery());
  }, [core, buildQuery]);

  const update = useCallback(async (id, payload) => {
    await core.updateItem(id, payload);
    await core.list(buildQuery());
  }, [core, buildQuery]);

  const remove = useCallback(async (id) => {
    await core.deleteItem(id);
    await core.list(buildQuery());
  }, [core, buildQuery]);

  return {
    data: core.items,
    totalCount: core.total ?? (Array.isArray(core.items) ? core.items.length : 0),
    loading: core.loading,
    error: core.error,
    create,
    update,
    remove,
    updateParams,
  };
}
