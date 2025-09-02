import React, { useEffect, useState } from "react";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import EnhancedTable from "./enhancedTable";
import ConfirmationModal from "./confirmationModal";
import ReusableFormModal from "./reusableFormModal";
import { useDebounce } from "../hooks/useDebounce";
import { useCrud } from "../hooks/useCrud";

const DataPage = ({
  endpoint,
  tableColumns,
  formFields,
  modalTitle,
  CustomFormModal = null,
  mergeEndereco = false,
  createTitle,
  editTitle,
  validateForm,
  allowCreate = true,
  allowEdit = true,
  allowDelete = true,
  extraParams,
  defaultFormData = {},
  linhasClicaveis,
  showActions,
  idProdutor,
  formTabs = null,
  openEditPedidos = false,
  disableFormModal = false,
  transformBeforeSave,
  idField = "id",
  nomePagina,
}) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 1000);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [orderField, setOrderField] = useState("Codigo");
  const [orderDirection, setOrderDirection] = useState("asc");
  const [formErrors, setFormErrors] = useState({});
  const [filters, setFilters] = useState({ isDeleted: false });
  const [formData, setFormData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const {
    data,
    create,
    update,
    remove,
    updateParams,
    totalCount,
  } = useCrud(endpoint, {
    search: debouncedSearch,
    page: currentPage,
    limit: itemsPerPage,
    orderOptions: [{ Field: orderField, OrderDirection: orderDirection }],
    filters,
  });

  useEffect(() => {
    if (extraParams) {
      updateParams({ extraParams });
    }
  }, [extraParams]);

  useEffect(() => {
    updateParams({ search: debouncedSearch });
  }, [debouncedSearch]);

  const handleAdvancedFilterChange = (filtrosRecebidos) => {
    const newFilters = { ...filtrosRecebidos };
    setFilters(newFilters);
    updateParams({ filters: newFilters });
  };

  const handleOrderChange = (field, direction) => {
    setOrderField(field);
    setOrderDirection(direction);
    updateParams({
      orderOptions: [{ Field: field, OrderDirection: direction }],
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage + 1);
    updateParams({ page: newPage + 1 });
  };

  const handleRowsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
    updateParams({ limit: newLimit, page: 1 });
  };

  const handleCreate = () => {
    setFormData(defaultFormData || {});
    setEditMode(false);
    setOpenModal(true);
  };

  const handleEdit = async (item) => {
    setFormData({ ...item, id: item.id });
    setEditMode(true);
    setOpenModal(true);
  };

  const confirmDelete = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    if (selectedId) {
      try {
        await remove(selectedId);
        toast.success("Excluído com sucesso!", {
          position: "top-right",
          autoClose: 3000,
        });
        setShowConfirm(false);
        setSelectedId(null);
      } catch (error) {
        toast.error("Erro ao excluir", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (typeof validateForm === "function") {
      const validationErrors = validateForm(formData);
      if (validationErrors.length > 0) {
        const fieldErrors = {};
        const shownErrors = new Set();

        validationErrors.forEach((msg) => {
          //produtor
          if (msg.includes("nome")) fieldErrors.nome = msg;
          if (msg.includes("CPF") || msg.includes("CNPJ")) fieldErrors.cnpjCpf = msg;
          if (msg.includes("Regime")) fieldErrors.codigoRegimeTributario = msg;

          if (msg.includes("nome do contador")) fieldErrors.accountant = msg;
          if (msg.includes("CPF") || msg.includes("CNPJ")) fieldErrors.accountCpfCnpj = msg;
          if (msg.includes("nome")) fieldErrors.accountName = msg;

          //Pessoa
          if (msg.includes("Nome")) fieldErrors.nome = msg;
          if (msg.includes("CNPJ") || msg.includes("CPF")) fieldErrors.cnpjCpf = msg;
          if (msg.includes("Email") || msg.includes("email")) fieldErrors.email = msg;

          if (msg.includes("Logradouro")) fieldErrors["enderecoPessoas.logradouro"] = msg;
          if (msg.includes("Número")) fieldErrors["enderecoPessoas.numero"] = msg;
          if (msg.includes("Bairro")) fieldErrors["enderecoPessoas.bairro"] = msg;
          if (msg.includes("Cidade")) fieldErrors["enderecoPessoas.cidade"] = msg;
          if (msg.includes("UF")) fieldErrors["enderecoPessoas.uf"] = msg;
          if (msg.includes("CEP")) fieldErrors["enderecoPessoas.cep"] = msg;
          if (msg.includes("Telefone")) fieldErrors["telefones[0].telefone"] = msg;

          if (msg.includes("Logradouro")) fieldErrors.logradouro = msg;
          if (msg.includes("Número")) fieldErrors.numero = msg;
          if (msg.includes("Bairro")) fieldErrors.bairro = msg;
          if (msg.includes("Cidade")) fieldErrors.cidade = msg;
          if (msg.includes("UF")) fieldErrors.uf = msg;
          if (msg.includes("CEP")) fieldErrors.cep = msg;
          if (msg.includes("Telefone")) fieldErrors.telefone = msg;
          if (msg.includes("IBGE")) fieldErrors.ibgeCidade = msg;
          if (msg.includes("CRT")) fieldErrors.crt = msg;
          if (msg.includes("Série")) fieldErrors.serie = msg;
          if (msg.includes("Ambiente")) fieldErrors.ambiente = msg;
          if (msg.includes("Serial")) fieldErrors.certificateSerial = msg;
          if (msg.includes("contador")) fieldErrors.contadorId = msg;

          if (msg.includes("Inscrição")) fieldErrors.inscEstadual = msg;
          if (msg.includes("Contribuinte")) fieldErrors.tipoContribuinte = msg;
          if (msg.includes("Atividade")) fieldErrors.atividade = msg;

          //Produto
          if (msg.includes("Descrição")) fieldErrors.descricao = msg;
          if (msg.includes("Unidade")) fieldErrors.un = msg;
          if (msg.includes("NCM")) fieldErrors.ncm = msg;
          if (msg.includes("Origem")) fieldErrors.origem = msg;
          if (msg.includes("Situação")) fieldErrors.situacao = msg;
          if (msg.includes("Tributação")) fieldErrors.tributacaoId = msg;
          if (msg.includes("IPI Enquadramento")) fieldErrors.ipiEnquadramento = msg;
          if (msg.includes("IPI CST Entrada")) fieldErrors.ipicstEntrada = msg;
          if (msg.includes("IPI CST Saída")) fieldErrors.ipicstSaida = msg;
          if (msg.includes("PIS CST")) fieldErrors.pisCST = msg;
          if (msg.includes("COFINS CST")) fieldErrors.cofinsCST = msg;
          if (msg.includes("Código de Barras")) fieldErrors.codigoDeBarras = msg;

          // Evita toasts duplicados
          if (!shownErrors.has(msg)) {
            toast.error(msg, {
              position: "top-right",
              autoClose: 3000,
            });
            shownErrors.add(msg);
          }
        });

        console.log("valores do form: ", formData)

        setFormErrors(fieldErrors);
        return;
      }
    }

    const toastId = toast.loading(editMode ? "Editando..." : "Criando...");

    try {
      const preparedData = typeof transformBeforeSave === "function"
        ? transformBeforeSave(formData)
        : formData;

      if (editMode) {
        await update(preparedData[idField], preparedData);
      } else {
        await create(preparedData);
      }

      setOpenModal(false);
      setFormErrors({});

      toast.update(toastId, {
        render: editMode ? "Editado com sucesso" : "Criado com sucesso",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Erro ao salvar",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 py-2">
      <h1 className="text-2xl font-bold text-gray-800">{nomePagina}</h1>
      <div className="flex justify-between items-center">
        {allowCreate && (
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {createTitle}
          </button>
        )}
      </div>

      {!disableFormModal && (
        CustomFormModal ? (
          <CustomFormModal
            open={openModal}
            handleClose={() => setOpenModal(false)}
            title={editMode ? editTitle : createTitle}
            formData={formData}
            fields={formFields}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            formErrors={formErrors}
          />
        ) : (
          <ReusableFormModal
            open={openModal}
            handleClose={() => setOpenModal(false)}
            title={editMode ? editTitle : createTitle}
            fields={formFields}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            formErrors={formErrors}
            tabs={formTabs}
          />
        )
      )}

      {showConfirm && (
        <ConfirmationModal
          show={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={handleDelete}
          title="Tem certeza que deseja Deletar?"
          message="Você irá deletar este item da lista!"
          confirmText="Sim, quero deletar"
          cancelText="Cancelar"
        />
      )}

      <EnhancedTable
        data={data}
        value={search}
        columns={tableColumns}
        onEdit={allowEdit ? handleEdit : undefined}
        onDelete={allowDelete ? confirmDelete : undefined}
        orderField={orderField}
        orderDirection={orderDirection}
        onOrderChange={handleOrderChange}
        page={currentPage - 1}
        rowsPerPage={itemsPerPage}
        totalCount={totalCount}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onFilterChange={(e) => setSearch(e.target.value)}
        onApply={handleAdvancedFilterChange}
        linhasClicaveis={linhasClicaveis}
        showActions={showActions}
        idField={idField}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Slide}
      />
    </div>
  );
};

export default DataPage;
