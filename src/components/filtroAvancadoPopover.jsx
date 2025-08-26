import { useState } from "react";
import { Filter, Trash2 } from "lucide-react";

export default function FiltroAvancadoPopover({ onApply, columns }) {
  const [open, setOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(columns[0]?.key || "");
  const [filterValue, setFilterValue] = useState("");
  const [filters, setFilters] = useState([]);

  const handleAddFilter = () => {
    if (!selectedField || !filterValue) return;
    const newFilters = [...filters, { field: selectedField, value: filterValue }];
    setFilters(newFilters);
    setFilterValue("");
  };

  const handleRemoveFilter = (index) => {
    const updated = [...filters];
    updated.splice(index, 1);
    setFilters(updated);
  };

  const handleApply = () => {
    const filterObject = {};
    filters.forEach((f) => {
      if (f.value.trim() !== "") {
        filterObject[f.field] = f.value;
      }
    });
    onApply(filterObject);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-blue-500 bg-blue-600 text-white dark:bg-blue-700 dark:hover:bg-blue-600 transition"
      >
        <Filter size={16} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 z-50 bg-white dark:bg-slate-800 border dark:border-slate-600 rounded-lg shadow-lg w-80 p-4">
          <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Adicionar Filtros</h3>

          <div className="flex gap-2 mb-4">
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="w-1/2 border dark:bg-slate-500 dark:border-slate-600 rounded-lg px-2 py-1 text-sm text-gray-900 dark:text-gray-100"
            >
              {columns.map((col) => (
                <option key={col.key} value={col.key}>
                  {col.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="w-1/2 border dark:border-slate-600 rounded-lg px-2 py-1 text-sm text-gray-900 dark:bg-slate-500 dark:text-gray-100"
              placeholder="Valor"
            />
          </div>

          <button
            onClick={handleAddFilter}
            className="w-full bg-gray-200 dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-slate-600 text-sm py-1 rounded-lg mb-3 transition"
          >
            Adicionar Filtro
          </button>

          <div className="max-h-32 overflow-y-auto space-y-2">
            {filters.map((f, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <select
                  value={f.field}
                  onChange={(e) => {
                    const newFilters = [...filters];
                    newFilters[idx].field = e.target.value;
                    setFilters(newFilters);
                  }}
                  className="w-1/3 border bg-gray-200 dark:bg-slate-500 dark:text-gray-100 dark:border-slate-600 rounded-lg px-2 py-1 text-sm text-gray-900"
                >
                  {columns.map((col) => (
                    <option key={col.key} value={col.key}>
                      {col.label}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={f.value}
                  onChange={(e) => {
                    const newFilters = [...filters];
                    newFilters[idx].value = e.target.value;
                    setFilters(newFilters);
                  }}
                  className="w-1/2 border bg-gray-200 dark:bg-slate-500 dark:border-slate-600 rounded-lg px-2 py-1 text-sm text-gray-900 dark:text-gray-100"
                  placeholder="Valor"
                />

                <button onClick={() => handleRemoveFilter(idx)} className="text-red-500 dark:text-red-400">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleApply}
            className="w-full mt-3 bg-blue-600 dark:bg-blue-700 text-white py-1 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
          >
            Aplicar Filtros
          </button>
        </div>
      )}
    </div>
  );
}
