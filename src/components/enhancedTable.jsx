import { Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Filter from "./filter";
import FiltroAvancadoPopover from "./filtroAvancadoPopover";

const idUser = localStorage.getItem("idUser");

export default function EnhancedTable({
  data,
  value,
  columns,
  onEdit,
  onDelete,
  orderField,
  orderDirection,
  onOrderChange,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  onFilterChange,
  onApply,
  linhasClicaveis,
  showActions,
  idField = "id",
}) {

  // Verificando o tipo de usuário (a partir do localStorage)
  const navigate = useNavigate();
  const tipoUser = localStorage.getItem("tipoUser");

  const handleRowClick = (item) => {
    // Direciona para página de visualização do produtor
    navigate(`/produtor/${item.codigo}`);
  };

  const handleSort = (key) => {
    const isAsc = orderField === key && orderDirection === "asc";
    onOrderChange(key, isAsc ? "desc" : "asc");
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-row items-start justify-between gap-2">
        <Filter value={value} onChange={onFilterChange} placeholder="Buscar..." />
        <FiltroAvancadoPopover onApply={onApply} columns={columns} />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 dark:border-slate-700 text-sm">
          <thead className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200">
            <tr>
              {showActions && <th className="px-4 py-2 min-w-[100px] max-w-[150px]">Ações</th>}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-2 cursor-pointer text-left px-4 py-2 cursor-pointer text-left min-w-[200px] max-w-[300px] break-words"
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {orderField === col.key ? (
                      orderDirection === "asc" ? (
                        <ArrowUp size={14} />
                      ) : (
                        <ArrowDown size={14} />
                      )
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item[idField]}
                onClick={() => linhasClicaveis && handleRowClick(item)}
                className="border-t border-none border-gray-300 dark:border-slate-700 even:bg-gray-50 dark:even:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                {showActions && (
                  <td className="px-4 py-2 space-x-2">
                    <button onClick={(e) => { e.stopPropagation(); onEdit(item); }} className="text-blue-600 hover:underline dark:text-blue-400">
                      <Pencil size={16} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(item[idField]); }} className="text-red-600 hover:underline dark:text-red-400">
                      <Trash2 size={16} />
                    </button>
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2 text-gray-900 dark:text-gray-100 min-w-[200px] max-w-[300px] break-words truncate">
                    {typeof col.render === "function"
                      ? col.render(item[col.key], item)
                      : item[col.key]}
                  </td>
                ))}

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 text-sm gap-2 text-gray-700 dark:text-gray-300">
        <div className="flex items-center">
          <span>Itens por página:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(parseInt(e.target.value))}
            className="ml-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 px-2 py-1 rounded"
          >
            {[1, 5, 10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span>
            Página {page + 1} de {Math.max(1, Math.ceil(totalCount / rowsPerPage))}
          </span>

          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0}
            className="px-2 py-1 border border-gray-300 dark:border-slate-600 rounded disabled:opacity-50"
          >
            Anterior
          </button>

          {Array.from({ length: Math.ceil(totalCount / rowsPerPage) }, (_, i) => i)
            .filter(
              (i) =>
                i === 0 || // primeira página
                i === Math.ceil(totalCount / rowsPerPage) - 1 || // última página
                (i >= page - 1 && i <= page + 1) // 2 antes e 2 depois da atual
            )
            .map((i, idx, arr) => (
              <div key={i}>
                {/* Ellipses entre blocos de página */}
                {idx > 0 && i > arr[idx - 1] + 1 && (
                  <span className="px-1">...</span>
                )}

                <button
                  onClick={() => onPageChange(i)}
                  className={`px-2 py-1 border rounded ${page === i
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200"
                    }`}
                >
                  {i + 1}
                </button>
              </div>
            ))}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page + 1 >= Math.ceil(totalCount / rowsPerPage)}
            className="px-2 py-1 border border-gray-300 dark:border-slate-600 rounded disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}
