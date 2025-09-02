import DataPage from "../../components/dataPage";

export default function Grupos() {

  const tableColumns = [
    { key: "nome", label: "Nome do Grupo" },
  ];

  const formFields = [
    {
      name: "nome",
      label: "Nome do Grupo",
      type: "text",
      placeholder: "ex.: Aluguel",
      colSpan: 2,
    },
  ];

  const validateForm = (formData) => {
    const errs = [];
    const nome = String(formData?.nome || "").trim();

    if (!nome) errs.push("Informe o nome do grupo.");
    if (nome.length < 3) errs.push("O nome do grupo deve ter pelo menos 3 caracteres.");

    return errs;
  };

  const transformBeforeSave = (formData) => {
    return {
      ...formData,
      nome: String(formData?.nome || "").trim(),
    };
  };

  return (
    <div className="p-4 space-y-6">
      <DataPage
        endpoint={"/api/grupos"}
        tableColumns={tableColumns}
        formFields={formFields}
        modalTitle="Grupos"
        createTitle="Criar grupo"
        editTitle="Salvar alterações"
        validateForm={validateForm}
        transformBeforeSave={transformBeforeSave}
        allowCreate={true}
        allowEdit={true}
        allowDelete={true}
        extraParams={{ isDeleted: false }}
        defaultFormData={{}}
        linhasClicaveis={false}
        showActions={true}
        idField="id"
        nomePagina="Grupos"
      />
    </div>
  );
}
