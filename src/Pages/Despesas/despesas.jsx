import DataPage from "../../components/dataPage";

export default function Despesas() {
  // Colunas da tabela
  const tableColumns = [
    { key: "tipo", label: "Tipo" },
    { key: "descricao", label: "Descrição" },
    {
      key: "valor",
      label: "Valor (R$)",
      render: (v) => Number(v ?? 0).toFixed(2),
    },
    { key: "data", label: "Data" },
  ];

  // Campos do modal de formulário reutilizável
  const formFields = [
    {
      name: "tipo",
      label: "Tipo",
      placeholder: "Ex.: Alimentação",
      type: "text",
      colSpan: 1,
    },
    {
      name: "descricao",
      label: "Descrição",
      placeholder: "Ex.: Almoço com cliente",
      type: "text",
      colSpan: 2,
    },
    {
      name: "valor",
      label: "Valor (R$)",
      placeholder: "0,00",
      type: "text", // deixe text para aceitar vírgula, converteremos antes de salvar
      colSpan: 1,
    },
    {
      name: "data",
      label: "Data",
      type: "date",
      placeholder: "2025-08-30",
      colSpan: 1,
    },
  ];

  // Validação mínima (DataPage espera um array de mensagens de erro)
  const validateForm = (formData) => {
    const errs = [];
    if (!formData?.tipo || !String(formData.tipo).trim()) errs.push("Informe o tipo.");
    if (!formData?.descricao || !String(formData.descricao).trim()) errs.push("Informe a descrição.");

    const rawValor = String(formData?.valor ?? "").replace(",", ".");
    if (!rawValor || isNaN(parseFloat(rawValor))) errs.push("Informe um valor numérico válido.");

    if (!formData?.data) errs.push("Informe a data.");

    return errs;
  };

  // Transformações antes de salvar (ex.: converter valor para número, normalizar data)
  const transformBeforeSave = (formData) => {
    const valorNumber = parseFloat(String(formData.valor ?? "").replace(",", "."));
    return {
      ...formData,
      valor: isNaN(valorNumber) ? 0 : valorNumber,
      // se precisar ajustar a data para ISO/local, faça aqui
    };
  };

  return (
    <div className="p-4 space-y-6">
      <DataPage
        endpoint={"/api/despesas"}            // ajuste para o seu endpoint real
        tableColumns={tableColumns}
        formFields={formFields}
        modalTitle="Despesas"
        createTitle="Adicionar despesa"
        editTitle="Salvar alterações"
        validateForm={validateForm}
        allowCreate={true}
        allowEdit={true}
        allowDelete={true}
        extraParams={{ isDeleted: false }}     // se não usar, pode remover
        defaultFormData={{}}                   // valores iniciais do formulário
        linhasClicaveis={false}
        showActions={true}
        idField="id"
        nomePagina="Despesas"
        transformBeforeSave={transformBeforeSave}
      />
    </div>
  );
}
