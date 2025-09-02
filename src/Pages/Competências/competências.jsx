import DataPage from "../../components/dataPage";

// helper para exibir MM/AAAA
function formatCompetencia(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return "-";
  const mes = String(d.getUTCMonth() + 1).padStart(2, "0");
  const ano = d.getUTCFullYear();
  return `${mes}/${ano}`;
}

// normaliza para o 1º dia do mês às 00:00:00Z
function toMonthStartISO(yyyymm) {
  // yyyymm pode vir como "2025-09" (input type="month") ou "2025-09-01"
  const m = String(yyyymm || "").trim();
  if (!m) return null;

  const [yearStr, monthStrRaw] = m.split("-");
  if (!yearStr || !monthStrRaw) return null;

  const monthStr = monthStrRaw.padStart(2, "0");
  const year = Number(yearStr);
  const month = Number(monthStr);

  if (!year || !month || month < 1 || month > 12) return null;

  const iso = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0)).toISOString();
  return iso;
}

export default function Competencias() {
  // colunas da tabela
  const tableColumns = [
    // { key: "id", label: "ID" },
    // { key: "userId", label: "Usuário" },
    {
      key: "dataCompetencia",
      label: "Competência",
      render: (v) => formatCompetencia(v),
    },
  ];

  // campos do formulário do modal
  const formFields = [
    {
      name: "userId",
      label: "Usuário (ID)",
      type: "number",
      placeholder: "ex.: 123",
      colSpan: 1,
    },
    {
      name: "dataCompetencia",
      label: "Competência (mês/ano)",
      // usar type="month" facilita a entrada (gera "YYYY-MM")
      type: "month",
      placeholder: "YYYY-MM",
      colSpan: 1,
    },
  ];

  // validações (DataPage espera array de mensagens)
  const validateForm = (formData) => {
    const errs = [];
    const userIdNum = Number(formData?.userId);

    if (!formData?.userId || Number.isNaN(userIdNum) || userIdNum <= 0) {
      errs.push("Informe um usuário válido.");
    }

    if (!formData?.dataCompetencia) {
      errs.push("Informe a competência (mês/ano).");
    } else {
      const iso = toMonthStartISO(formData.dataCompetencia);
      if (!iso) errs.push("Competência inválida. Use o formato YYYY-MM.");
    }

    return errs;
  };

  const transformBeforeSave = (formData) => {
    const iso = toMonthStartISO(formData.dataCompetencia);
    return {
      ...formData,
      userId: Number(formData.userId),
      dataCompetencia: iso,
    };
  };

  return (
    <div className="p-4 space-y-6">
      <DataPage
        endpoint={"/api/competencias"}
        tableColumns={tableColumns}
        formFields={formFields}
        modalTitle="Competências"
        createTitle="Criar competência"
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
        nomePagina="Competências"
      />
    </div>
  );
}
