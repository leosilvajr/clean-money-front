import { useMemo, useState } from "react";
import ModalCreateGroup from "./modalGrupos";
import EnhancedTable from "../../components/enhancedTable";

export default function Grupos() {
  // dados mocados
  const [data, setData] = useState([
    { id: 1, nome: "Alugel" },
    { id: 2, nome: "Conta de Luz" },
    { id: 3, nome: "Combustível" },
    { id: 4, nome: "Reforma" },
    { id: 5, nome: "Mercado" },
    { id: 6, nome: "Internet" },
    { id: 7, nome: "Roupas" },
    { id: 8, nome: "Viagem" },
    { id: 9, nome: "Faculdade" },
    { id: 10, nome: "Academia" },
  ]);

  const columns = [{ key: "nome", label: "Nome do Grupo" }];

  // estados de tabela
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderField, setOrderField] = useState("nome");
  const [orderDirection, setOrderDirection] = useState("asc");
  const [filter, setFilter] = useState("");

  // modal
  const [openCreate, setOpenCreate] = useState(false);

  const handleEdit = (item) => {
    alert(`Editar grupo: ${item.nome}`);
  };

  const handleDelete = (id) => {
    setData((prev) => prev.filter((x) => x.id !== id));
  };

  const handleOrderChange = (field, direction) => {
    setOrderField(field);
    setOrderDirection(direction);
  };

  const filteredData = useMemo(
    () => data.filter((i) => i.nome.toLowerCase().includes(filter.toLowerCase())),
    [data, filter]
  );

  const sortedData = useMemo(() => {
    const copy = [...filteredData];
    copy.sort((a, b) => {
      if (a[orderField] < b[orderField]) return orderDirection === "asc" ? -1 : 1;
      if (a[orderField] > b[orderField]) return orderDirection === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [filteredData, orderField, orderDirection]);

  const paginatedData = useMemo(
    () => sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sortedData, page, rowsPerPage]
  );

  const existingNames = useMemo(() => data.map((d) => d.nome), [data]);

  const handleCreate = (name) => {
    const nextId = (data.length ? Math.max(...data.map((x) => x.id)) : 0) + 1;
    setData((prev) => [{ id: nextId, nome: name }, ...prev]);
    setPage(0); // volta para a 1ª página para ver o novo item
  };

  return (
    <div className="p-4 space-y-4">
      {/* topo da tela */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Grupos</h1>
        <button
          onClick={() => setOpenCreate(true)}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Criar grupo
        </button>
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

      {/* modal */}
      <ModalCreateGroup
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreate={handleCreate}
        existingNames={existingNames}
      />
    </div>
  );
}
