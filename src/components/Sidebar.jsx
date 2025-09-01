import { Link, useLocation } from "react-router-dom";

function Submenu({ label, icon, open, onToggle, collapsed, children }) {
  return (
    <div className="select-none">
      <div
        className="px-6 py-3 cursor-pointer flex items-center justify-between hover:bg-gray-700 transition-all"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <i className={`${icon} text-lg w-5`} />
          {!collapsed && <span className="menu-text">{label}</span>}
        </div>
        {!collapsed && (
          <i
            className={`fas fa-chevron-down text-sm transition-transform ${open ? "rotate-180" : "rotate-0"}`}
          />
        )}
      </div>
      <div
        className={`bg-gray-800 overflow-hidden transition-[max-height] duration-300 ${open && !collapsed ? "max-h-60" : "max-h-0"}`}
      >
        {children}
      </div>
    </div>
  );
}

function Menu({ label, icon, to}) {
  return (
    <Link to={to} className="select-none">
      <div
        className="px-6 py-3 cursor-pointer flex items-center justify-between hover:bg-gray-700 transition-all"
      >
        <div className="flex items-center gap-3">
          <i className={`${icon} text-lg w-5`} />
          <span className="menu-text">{label}</span>
        </div>
      </div>
    </Link>
  );
}

function SubmenuItem({ to, icon, children, collapsed }) {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link to={to}>
      <div
        className={`px-12 py-2 transition-colors flex items-center gap-2 hover:bg-gray-700 ${active ? "bg-gray-700 text-white" : "text-gray-200"
          }`}
      >
        <i className={`${icon} text-sm w-4`} />
        {!collapsed && <span className="text-sm">{children}</span>}
      </div>
    </Link>
  );
}

export default function Sidebar({ collapsed, openMenus, toggleSubmenu, sidebarPx, onLogout }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className="fixed left-0 top-0 h-full text-white shadow-xl z-50 transition-all duration-300 bg-gradient-to-br from-gray-800 to-gray-700"
      style={{ width: sidebarPx }}
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-cube text-xl" />
          </div>
          {!collapsed && (
            <div className="transition-opacity">
              <h2 className="text-xl font-bold">MeuProjeto</h2>
              <p className="text-xs text-gray-300">v1.0.0</p>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-6">
        {/* Home */}
        <Link to="/">
          <div
            className={`px-6 py-3 cursor-pointer flex items-center gap-3 hover:bg-gray-700 transition-all ${isActive("/") ? "bg-gray-700" : ""
              }`}
          >
            <i className="fas fa-home text-lg w-5" />
            {!collapsed && <span className="menu-text">Início</span>}
          </div>
        </Link>

        {/* Despesas */}
        <Menu
          label="Despesas"
          icon="fas fa-wallet"
          to="/despesas"
        />

        {/* Competências */}
        <Menu
          label="Competências"
          icon="fas fa-calendar"
          to="/competencias"
        />

        {/* Grupos */}
        <Menu
          label="Grupos"
          icon="fas fa-layer-group"
          to="/grupos"
        />

        {/* Configurações */}
        <Submenu
          label="Configurações"
          icon="fas fa-cog"
          open={!!openMenus.config}
          onToggle={() => toggleSubmenu("config")}
          collapsed={collapsed}
        >
          <SubmenuItem to="/perfil" icon="fas fa-user" collapsed={collapsed}>
            Perfil
          </SubmenuItem>
          <SubmenuItem to="/seguranca" icon="fas fa-shield-alt" collapsed={collapsed}>
            Segurança
          </SubmenuItem>
          <SubmenuItem to="/aparencia" icon="fas fa-palette" collapsed={collapsed}>
            Aparência
          </SubmenuItem>
        </Submenu>

        {/* DashBoard */}
        <Submenu
          label="Dashboard"
          icon="fas fa-bar-chart"
          open={!!openMenus.dashboard}
          onToggle={() => toggleSubmenu("dashboard")}
          collapsed={collapsed}
        >
          <SubmenuItem to="/dashboard" icon="fas fa-eye" collapsed={collapsed}>
            Ver Dashboard
          </SubmenuItem>
        </Submenu>

        {/* Sair */}
        <div
          onClick={onLogout}
          className="px-6 py-3 cursor-pointer flex items-center gap-3 hover:bg-gray-700 transition-all mt-4"
        >
          <i className="fas fa-sign-out-alt text-lg w-5" />
          {!collapsed && <span>Sair</span>}
        </div>
      </nav>
    </aside>
  );
}
