import { useMemo, useState } from "react";
import EnhancedTable from "../../components/enhancedTable";

// Gera N competências (mês/ano) retroativas a partir do mês atual
function gerarCompetencias(n = 12) {
  const hoje = new Date();
  const base = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const list = [];
  for (let i = 0; i < n; i++) {
    const d = new Date(base.getFullYear(), base.getMonth() - i, 1);
    const mes = d.getMonth() + 1; // 1-12
    const ano = d.getFullYear();  // ex: 2025
    list.push({
      id: i + 1,
      mes,
      ano,
    });
  }
  return list;
}

export default function Competencias() {
  // Dados mocados (12 meses para trás)
  const [data, setData] = useState(() => gerarCompetencias(12));

  // Colunas
  const columns = [
    {
      key: "mes",
      label: "Mês",
      render: (v) => String(v).padStart(2, "0"), // 01..12
    },
    { key: "ano", label: "Ano" },
    {
      key: "mesAno",
      label: "Mês/Ano",
      render: (_v, item) => `${String(item.mes).padStart(2, "0")}/${item.ano}`,
    },
  ];

  // Estados de tabela
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderField, setOrderField] = useState("ano"); // ordena por ano por padrão
  const [orderDirection, setOrderDirection] = useState("desc");
  const [filter, setFilter] = useState("");

  // Ações
  const handleEdit = (item) => {
    alert(`Editar competência: ${String(item.mes).padStart(2, "0")}/${item.ano}`);
  };

  const handleDelete = (id) => {
    setData((prev) => prev.filter((x) => x.id !== id));
  };

  const handleOrderChange = (field, direction) => {
    setOrderField(field);
    setOrderDirection(direction);
  };

  // Filtro por mês (01), ano (2025) ou "mm/yyyy"
  const filteredData = useMemo(() => {
    const f = filter.trim().toLowerCase();
    if (!f) return data;
    return data.filter((item) => {
      const mes2 = String(item.mes).padStart(2, "0");
      const ano4 = String(item.ano);
      const combinado = `${mes2}/${ano4}`.toLowerCase();
      return (
        mes2.includes(f) ||
        ano4.includes(f) ||
        combinado.includes(f)
      );
    });
  }, [data, filter]);

  // Ordenação
  const sortedData = useMemo(() => {
    const copy = [...filteredData];
    copy.sort((a, b) => {
      const getValue = (obj) => {
        if (orderField === "mesAno") return obj.ano * 100 + obj.mes; // facilita ordenação por mm/aaaa
        return obj[orderField];
      };
      const av = getValue(a);
      const bv = getValue(b);
      if (av < bv) return orderDirection === "asc" ? -1 : 1;
      if (av > bv) return orderDirection === "asc" ? 1 : -1;
      // Empate: desempata por mes/ano
      const aKey = a.ano * 100 + a.mes;
      const bKey = b.ano * 100 + b.mes;
      if (aKey < bKey) return orderDirection === "asc" ? -1 : 1;
      if (aKey > bKey) return orderDirection === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [filteredData, orderField, orderDirection]);

  // Paginação
  const paginatedData = useMemo(
    () => sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sortedData, page, rowsPerPage]
  );

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Competências (Mês/Ano)</h1>
      </div>

      <EnhancedTable
        data={paginatedData}
        value={filter}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        orderField={orderField}
        orderDirection={orderDirection}
        onOrderChange={handleOrderChange}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={sortedData.length}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        onFilterChange={setFilter}
        onApply={() => {}}
        linhasClicaveis={false}
        showActions={true}
        idField="id"
      />
    </div>
  );
}
