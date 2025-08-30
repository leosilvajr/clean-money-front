import { useMemo, useState } from "react";
import { despesasMock } from "./despesasMock";
import EnhancedTable from "../../components/enhancedTable";

export default function Despesas() {
  const [data, setData] = useState(despesasMock);
  const [form, setForm] = useState({
    tipo: "",
    descricao: "",
    valor: "",
    data: "",
  });
  const [editingId, setEditingId] = useState(null);

  const nextId = useMemo(() => {
    return data.length ? Math.max(...data.map(d => d.id)) + 1 : 1;
  }, [data]);

  const columns = [
    { key: "tipo", label: "Tipo" },
    { key: "descricao", label: "Descrição" },
    {
      key: "valor",
      label: "Valor (R$)",
      render: (v) => Number(v ?? 0).toFixed(2)
    },
    { key: "data", label: "Data" },
  ];

  function resetForm() {
    setForm({ tipo: "", descricao: "", valor: "", data: "" });
    setEditingId(null);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.tipo.trim() || !form.descricao.trim() || !form.valor.trim() || !form.data.trim()) {
      alert("Preencha todos os campos.");
      return;
    }

    const valorNumber = parseFloat(String(form.valor).replace(",", "."));
    if (isNaN(valorNumber)) {
      alert("Informe um valor numérico válido.");
      return;
    }

    if (editingId == null) {
      const nova = {
        id: nextId,
        tipo: form.tipo.trim(),
        descricao: form.descricao.trim(),
        valor: valorNumber,
        data: form.data.trim(),
      };
      setData(prev => [nova, ...prev]);
    } else {
      setData(prev =>
        prev.map(d =>
          d.id === editingId
            ? { ...d, tipo: form.tipo.trim(), descricao: form.descricao.trim(), valor: valorNumber, data: form.data.trim() }
            : d
        )
      );
    }

    resetForm();
  }

  function handleEdit(row) {
    setEditingId(row.id);
    setForm({
      tipo: row.tipo || "",
      descricao: row.descricao || "",
      valor: String(row.valor ?? ""),
      data: row.data || "",
    });
  }

  function handleDelete(row) {
    if (confirm(`Deseja remover a despesa "${row.descricao}"?`)) {
      setData(prev => prev.filter(d => d.id !== row.id));
      if (editingId === row.id) resetForm();
    }
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Despesas</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-transparent border border-gray-200 rounded-sm p-4"
      >
        <div className="flex flex-col">
          <label className="text-sm mb-1">Tipo</label>
          <input
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className="px-3 py-2 rounded-sm bg-slate-100 border border-gray-200 outline-none"
            placeholder="Ex.: Alimentação"
          />
        </div>

        <div className="md:col-span-2 flex flex-col">
          <label className="text-sm mb-1">Descrição</label>
          <input
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            className="px-3 py-2 rounded-sm bg-slate-100 border border-gray-200 outline-none"
            placeholder="Ex.: Almoço com cliente"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1">Valor (R$)</label>
          <input
            name="valor"
            value={form.valor}
            onChange={handleChange}
            className="px-3 py-2 rounded-sm bg-slate-100 border border-gray-200 outline-none"
            placeholder="0,00"
            inputMode="decimal"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1">Data</label>
          <input
            name="data"
            value={form.data}
            onChange={handleChange}
            className="px-3 py-2 rounded-sm bg-slate-100 border border-gray-200 outline-none"
            placeholder="2025-08-30"
            type="date"
          />
        </div>

        <div className="md:col-span-5 flex items-center gap-3">
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer transition font-medium"
          >
            {editingId == null ? "Adicionar despesa" : "Salvar alterações"}
          </button>
          {editingId != null && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition cursor-pointer"
            >
              Cancelar edição
            </button>
          )}
        </div>
      </form>

      <EnhancedTable
        data={data}
        columns={columns}
        page={0}
        rowsPerPage={5}
        totalCount={data.length}
        orderField="tipo"
        orderDirection="asc"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onOrderChange={() => {}}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        onFilterChange={() => {}}
        onApply={() => {}}
        linhasClicaveis={false}
        showActions={true}
        idField="id"
      />
    </div>
  );
}
