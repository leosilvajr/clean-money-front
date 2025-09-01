import { useEffect, useState } from "react";
import EnhancedTable from "../../components/enhancedTable";
import { useCrud } from "../../hooks/useCrud";

function formatCompetencia(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return "-";
  const mes = String(d.getUTCMonth() + 1).padStart(2, "0");
  const ano = d.getUTCFullYear();
  return `${mes}/${ano}`;
}

export default function Competencias() {
  const { items, total, loading, error, list, deleteItem } =
    useCrud("/api/competencias");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderField, setOrderField] = useState("dataCompetencia");
  const [orderDirection, setOrderDirection] = useState("desc");
  const [filter, setFilter] = useState("");


  const fetchPage = () =>
    list({
      "pagination.pageNumber": page + 1,
      "pagination.pageSize": rowsPerPage,
      "ordering.field": orderField,
      "ordering.direction": orderDirection,
      search: filter || undefined,
      // "showDeleted": false, //
    });

  useEffect(() => {
    fetchPage();
  }, [page, rowsPerPage, orderField, orderDirection, filter]);

  const columns = [
    { key: "id", label: "ID" },
    { key: "userId", label: "Usuário" },
    { key: "dataCompetencia", label: "Competência", render: (v) => formatCompetencia(v) },
  ];

  const handleDelete = async (id) => {
    await deleteItem(id);
    fetchPage();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Competências</h1>

      <EnhancedTable
        data={items ?? []}
        columns={columns}
        idField="id"
        value={filter}
        onFilterChange={setFilter}
        onApply={fetchPage}
        orderField={orderField}
        orderDirection={orderDirection}
        onOrderChange={(f, d) => {
          setOrderField(f);
          setOrderDirection(d);
          setPage(0);
        }}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={total ?? 0}                     
        onPageChange={(p) => p >= 0 && setPage(p)}
        onRowsPerPageChange={(n) => { setRowsPerPage(n); setPage(0); }}
        showActions
        onEdit={(row) => alert(`Editar ${row.id}`)}
        onDelete={handleDelete}
        loading={loading}
        error={typeof error === "string" ? error : undefined}
      />
    </div>
  );
}
