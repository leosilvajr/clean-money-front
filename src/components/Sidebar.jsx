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

function SubmenuItem({ to, icon, children, collapsed }) {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link to={to}>
      <div
        className={`px-12 py-2 transition-colors flex items-center gap-2 hover:bg-gray-700 ${
          active ? "bg-gray-700 text-white" : "text-gray-200"
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
            className={`px-6 py-3 cursor-pointer flex items-center gap-3 hover:bg-gray-700 transition-all ${
              isActive("/") ? "bg-gray-700" : ""
            }`}
          >
            <i className="fas fa-home text-lg w-5" />
            {!collapsed && <span className="menu-text">Home</span>}
          </div>
        </Link>

        {/* Produtos (exemplos de rotas; crie as páginas se for usar) */}
        <Submenu
          label="Produtos"
          icon="fas fa-box"
          open={!!openMenus.produtos}
          onToggle={() => toggleSubmenu("produtos")}
          collapsed={collapsed}
        >
          <SubmenuItem to="/produtos/novo" icon="fas fa-plus" collapsed={collapsed}>
            Cadastrar
          </SubmenuItem>
          <SubmenuItem to="/produtos" icon="fas fa-list" collapsed={collapsed}>
            Listar
          </SubmenuItem>
          <SubmenuItem to="/produtos/editar" icon="fas fa-edit" collapsed={collapsed}>
            Editar
          </SubmenuItem>
        </Submenu>

        {/* Competências */}
        <Submenu
          label="Competência"
          icon="fas fa-wallet"
          open={!!openMenus.competencias}
          onToggle={() => toggleSubmenu("competencias")}
          collapsed={collapsed}
        >
          <SubmenuItem to="/competencias" icon="fas fa-eye" collapsed={collapsed}>
            Ver Competências
          </SubmenuItem>
        </Submenu>

        {/* Despesas */}
        <Submenu
          label="Despesas"
          icon="fas fa-wallet"
          open={!!openMenus.despesas}
          onToggle={() => toggleSubmenu("despesas")}
          collapsed={collapsed}
        >
          <SubmenuItem to="/despesas" icon="fas fa-eye" collapsed={collapsed}>
            Ver Despesas
          </SubmenuItem>
        </Submenu>

        {/* Grupos */}
        <Submenu
          label="Grupos"
          icon="fas fa-layer-group"
          open={!!openMenus.grupos}
          onToggle={() => toggleSubmenu("grupos")}
          collapsed={collapsed}
        >
          <SubmenuItem to="/grupos/novo" icon="fas fa-plus" collapsed={collapsed}>
            Cadastrar
          </SubmenuItem>
          <SubmenuItem to="/grupos" icon="fas fa-list" collapsed={collapsed}>
            Listar
          </SubmenuItem>
          {/* Ex.: rota de edição genérica */}
          <SubmenuItem to="/grupos/editar" icon="fas fa-edit" collapsed={collapsed}>
            Editar
          </SubmenuItem>
        </Submenu>

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
