// === File: src/components/Sidebar.jsx ===
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
            className={`fas fa-chevron-down text-sm transition-transform ${
              open ? "rotate-180" : "rotate-0"
            }`}
          />
        )}
      </div>
      <div
        className={`bg-gray-800 overflow-hidden transition-[max-height] duration-300 ${
          open && !collapsed ? "max-h-60" : "max-h-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default function Sidebar({ collapsed, openMenus, toggleSubmenu, sidebarPx }) {
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
            className={`px-6 py-3 cursor-pointer flex items-center gap-3 hover:bg-gray-700 transition-all ${
              isActive("/") ? "bg-gray-700" : ""
            }`}
          >
            <i className="fas fa-home text-lg w-5" />
            {!collapsed && <span className="menu-text">Home</span>}
          </div>
        </Link>

        {/* Produtos */}
        <Submenu
          label="Produtos"
          icon="fas fa-box"
          open={openMenus.produtos}
          onToggle={() => toggleSubmenu("produtos")}
          collapsed={collapsed}
        >
          <div className="px-12 py-2 hover:bg-gray-700 transition-colors flex items-center gap-2">
            <i className="fas fa-plus text-sm w-4" />
            <span className="text-sm">Cadastrar</span>
          </div>
          <div className="px-12 py-2 hover:bg-gray-700 transition-colors flex items-center gap-2">
            <i className="fas fa-list text-sm w-4" />
            <span className="text-sm">Listar</span>
          </div>
          <div className="px-12 py-2 hover:bg-gray-700 transition-colors flex items-center gap-2">
            <i className="fas fa-edit text-sm w-4" />
            <span className="text-sm">Editar</span>
          </div>
        </Submenu>

        {/* Configurações */}
        <Submenu
          label="Configurações"
          icon="fas fa-cog"
          open={openMenus.config}
          onToggle={() => toggleSubmenu("config")}
          collapsed={collapsed}
        >
          <div className="px-12 py-2 hover:bg-gray-700 transition-colors flex items-center gap-2">
            <i className="fas fa-user text-sm w-4" />
            <span className="text-sm">Perfil</span>
          </div>
          <div className="px-12 py-2 hover:bg-gray-700 transition-colors flex items-center gap-2">
            <i className="fas fa-shield-alt text-sm w-4" />
            <span className="text-sm">Segurança</span>
          </div>
          <div className="px-12 py-2 hover:bg-gray-700 transition-colors flex items-center gap-2">
            <i className="fas fa-palette text-sm w-4" />
            <span className="text-sm">Aparência</span>
          </div>
        </Submenu>

        {/* Sair */}
        <div className="px-6 py-3 cursor-pointer flex items-center gap-3 hover:bg-red-600 transition-all mt-4">
          <i className="fas fa-sign-out-alt text-lg w-5" />
          {!collapsed && <span>Sair</span>}
        </div>
      </nav>
    </aside>
  );
}