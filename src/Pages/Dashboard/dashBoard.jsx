import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const despesasMock = [
  { id: 1, tipo: "Comida", descricao: "Supermercado do mês", valor: 850.75, data: "2025-08-01" },
  { id: 2, tipo: "Combustível", descricao: "Abastecimento carro", valor: 320.5, data: "2025-08-02" },
  { id: 3, tipo: "Aluguel", descricao: "Apartamento centro", valor: 2200.0, data: "2025-08-05" },
  { id: 4, tipo: "Conta de Luz", descricao: "Energia elétrica", valor: 410.32, data: "2025-08-07" },
  { id: 5, tipo: "Comida", descricao: "Almoço restaurante", valor: 75.0, data: "2025-08-10" },
  { id: 6, tipo: "Combustível", descricao: "Gasolina viagem", valor: 500.0, data: "2025-08-11" },
  { id: 7, tipo: "Conta de Luz", descricao: "Conta de julho", valor: 398.9, data: "2025-08-15" },
  { id: 8, tipo: "Aluguel", descricao: "Sala comercial", valor: 1800.0, data: "2025-08-20" },

  // === Novos registros ===
  { id: 9, tipo: "Internet", descricao: "Plano residencial", valor: 150.0, data: "2025-01-12" },
  { id: 10, tipo: "Lazer", descricao: "Cinema com amigos", valor: 120.0, data: "2025-02-08" },
  { id: 11, tipo: "Saúde", descricao: "Consulta médica", valor: 350.0, data: "2025-03-05" },
  { id: 12, tipo: "Comida", descricao: "Jantar especial", valor: 200.0, data: "2025-04-14" },
  { id: 13, tipo: "Transporte", descricao: "Uber para aeroporto", valor: 90.0, data: "2025-05-03" },
  { id: 14, tipo: "Educação", descricao: "Curso online React", valor: 600.0, data: "2025-06-10" },
  { id: 15, tipo: "Saúde", descricao: "Exames laboratoriais", valor: 280.0, data: "2025-07-18" },
  { id: 16, tipo: "Internet", descricao: "Plano comercial", valor: 300.0, data: "2025-09-09" },
  { id: 17, tipo: "Lazer", descricao: "Viagem fim de semana", valor: 1200.0, data: "2025-10-15" },
  { id: 18, tipo: "Comida", descricao: "Compras hortifruti", valor: 180.0, data: "2025-11-02" },
  { id: 19, tipo: "Aluguel", descricao: "Casa de praia (temporada)", valor: 2500.0, data: "2025-12-20" },
  { id: 20, tipo: "Combustível", descricao: "Abastecimento extra", valor: 450.0, data: "2025-12-28" },
  { id: 21, tipo: "Conta de Luz", descricao: "Conta de novembro", valor: 420.5, data: "2025-11-25" },
  { id: 22, tipo: "Educação", descricao: "Livros técnicos", valor: 320.0, data: "2025-03-22" },
  { id: 23, tipo: "Lazer", descricao: "Show musical", valor: 500.0, data: "2025-07-30" }
];

const BRLCurrency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const monthNames = [
  "janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro",
];

function toYYYYMM(dateStr) {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  return `${y}-${m}`;
}

function formatMonthLabel(yyyymm) {
  const [y, m] = yyyymm.split("-");
  const idx = parseInt(m, 10) - 1;
  return `${monthNames[idx]} / ${y}`;
}

export default function DashboardDespesas({ despesas = despesasMock }) {
  // Lista de meses disponíveis a partir dos dados (ordenada desc)
  const mesesDisponiveis = useMemo(() => {
    const set = new Set(despesas.map((d) => toYYYYMM(d.data)));
    return Array.from(set).sort((a, b) => (a < b ? 1 : -1));
  }, [despesas]);

  const [mesSelecionado, setMesSelecionado] = useState(
    mesesDisponiveis[0] || toYYYYMM(new Date().toISOString())
  );

  // Filtra despesas pelo mês selecionado
  const despesasDoMes = useMemo(() => {
    return despesas.filter((d) => toYYYYMM(d.data) === mesSelecionado);
  }, [despesas, mesSelecionado]);

  // Agrupa por tipo somando valor
  const dadosAgrupados = useMemo(() => {
    const mapa = new Map();
    for (const d of despesasDoMes) {
      const atual = mapa.get(d.tipo) || 0;
      mapa.set(d.tipo, atual + Number(d.valor || 0));
    }
    // Ordena decrescente por valor para leitura melhor
    const arr = Array.from(mapa.entries()).map(([tipo, total]) => ({ tipo, total }));
    arr.sort((a, b) => b.total - a.total);
    return arr;
  }, [despesasDoMes]);

  const totalMes = useMemo(() => despesasDoMes.reduce((acc, cur) => acc + Number(cur.valor || 0), 0), [despesasDoMes]);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard de Despesas</h1>
          <p className="text-sm text-gray-500">Visualize seus gastos por tipo e filtre por mês.</p>
        </div>

        {/* Filtro de mês */}
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Mês:</label>
          <select
            className="border rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2"
            value={mesSelecionado}
            onChange={(e) => setMesSelecionado(e.target.value)}
          >
            {mesesDisponiveis.map((m) => (
              <option key={m} value={m}>
                {formatMonthLabel(m)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow p-5">
          <div className="text-sm text-gray-500">Total do mês</div>
          <div className="text-2xl font-bold">{BRLCurrency.format(totalMes)}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-5">
          <div className="text-sm text-gray-500">Tipos de despesa</div>
          <div className="text-2xl font-bold">{dadosAgrupados.length}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-5">
          <div className="text-sm text-gray-500">Transações no mês</div>
          <div className="text-2xl font-bold">{despesasDoMes.length}</div>
        </div>
      </div>

      {/* Gráfico de Barras */}
      <div className="bg-white rounded-2xl shadow p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Gastos por tipo — {formatMonthLabel(mesSelecionado)}</h2>
        </div>
        <div className="h-80">
          {dadosAgrupados.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">Sem dados para este mês.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosAgrupados} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tipo" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => BRLCurrency.format(v)} width={90} />
                <Tooltip
                  formatter={(value) => BRLCurrency.format(value)}
                  labelFormatter={(label) => `Tipo: ${label}`}
                />
                <Bar fill="#4F46E5" dataKey="total" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Tabela (opcional) */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h3 className="text-lg font-semibold mb-3">Detalhes do mês</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">Data</th>
                <th className="py-2 pr-4">Tipo</th>
                <th className="py-2 pr-4">Descrição</th>
                <th className="py-2 pr-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              {despesasDoMes.map((d) => (
                <tr key={d.id} className="border-b last:border-0">
                  <td className="py-2 pr-4">{new Date(d.data).toLocaleDateString("pt-BR")}</td>
                  <td className="py-2 pr-4">{d.tipo}</td>
                  <td className="py-2 pr-4">{d.descricao}</td>
                  <td className="py-2 pr-4 text-right font-medium">{BRLCurrency.format(d.valor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
