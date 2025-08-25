
// === File: src/Pages/home.jsx ===
export default function Home() {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Bem-vindo ao Dashboard! 👋</h2>
        <p className="text-gray-600 text-lg">
          Gerencie seu projeto de forma eficiente com nossa interface moderna e intuitiva.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Produtos", value: "1,234", icon: "fas fa-box", bg: "bg-blue-100", iconColor: "text-blue-600" },
          { label: "Vendas Hoje", value: "89", icon: "fas fa-chart-line", bg: "bg-green-100", iconColor: "text-green-600" },
          { label: "Usuários Ativos", value: "456", icon: "fas fa-users", bg: "bg-purple-100", iconColor: "text-purple-600" },
          { label: "Receita", value: "R$ 12.5k", icon: "fas fa-dollar-sign", bg: "bg-yellow-100", iconColor: "text-yellow-600" },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{c.label}</p>
                <p className="text-3xl font-bold text-gray-800">{c.value}</p>
              </div>
              <div className={`w-12 h-12 ${c.bg} rounded-lg flex items-center justify-center`}>
                <i className={`${c.icon} ${c.iconColor} text-xl`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <i className="fas fa-plus text-blue-600" />
            <span className="text-blue-600 font-medium">Novo Produto</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <i className="fas fa-chart-bar text-green-600" />
            <span className="text-green-600 font-medium">Ver Relatórios</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <i className="fas fa-cog text-purple-600" />
            <span className="text-purple-600 font-medium">Configurar Sistema</span>
          </button>
        </div>
      </div>
    </div>
  );
}