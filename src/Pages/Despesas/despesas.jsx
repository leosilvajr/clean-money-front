import { useState } from "react";
import { despesasMock } from "./despesasMock";
import EnhancedTable from "../../components/enhancedTable";

export default function Despesas() {
  const [data, setData] = useState(despesasMock);

  const columns = [
    { key: "tipo", label: "Tipo" },
    { key: "descricao", label: "Descrição" },
    { key: "valor", label: "Valor (R$)", render: (v) => v.toFixed(2) },
    { key: "data", label: "Data" },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Despesas</h1>
      <EnhancedTable
        data={data}
        columns={columns}
        page={0}
        rowsPerPage={5}
        totalCount={data.length}
        orderField="tipo"
        orderDirection="asc"
        onEdit={() => {}}
        onDelete={() => {}}
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
