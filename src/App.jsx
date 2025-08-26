import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useMemo, useState } from "react";
import "./index.css";
import Home from "./Pages/home";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Login from "./Pages/login";
import ConfirmModal from "./components/ConfirmModal";
import Grupos from "./Pages/Grupos/grupos";
import Despesas from "./Pages/Despesas/despesas";
import Competencias from "./Pages/Competências/competências";


const GrupoNovo = () => <div>Novo Grupo</div>;
const GrupoEditar = () => <div>Editar Grupo</div>;
const Produtos = () => <div>Listar Produtos</div>;
const ProdutoNovo = () => <div>Novo Produto</div>;
const ProdutoEditar = () => <div>Editar Produto</div>;
const Perfil = () => <div>Perfil</div>;
const Seguranca = () => <div>Segurança</div>;
const Aparencia = () => <div>Aparência</div>;

export default function AppRoutes() {
  const [collapsed, setCollapsed] = useState(false);

  const [openMenus, setOpenMenus] = useState({
    produtos: false,
    config: false,
    grupos: false,
    despesas: false,
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const sidebarPx = useMemo(() => (collapsed ? 80 : 288), [collapsed]);

  const toggleSidebar = () => {
    setCollapsed((v) => !v);
    if (!collapsed)
      setOpenMenus({ produtos: false, config: false, grupos: false, despesas: false });
  };

  const toggleSubmenu = (key) => {
    if (collapsed) return;
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <BrowserRouter>
      <Header sidebarPx={sidebarPx} onToggleSidebar={toggleSidebar} />
      <Sidebar
        collapsed={collapsed}
        openMenus={openMenus}
        toggleSubmenu={toggleSubmenu}
        sidebarPx={sidebarPx}
        onLogout={() => setShowLogoutModal(true)}
      />
      <main
        className="transition-all duration-300"
        style={{ marginLeft: sidebarPx, marginTop: 80, padding: "2rem" }}
      >
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Competências */}
            <Route path="/competencias" element={<Competencias />} />

            {/* Grupos */}
            <Route path="/grupos" element={<Grupos />} />
            <Route path="/grupos/novo" element={<GrupoNovo />} />
            <Route path="/grupos/editar" element={<GrupoEditar />} />

            {/* Despesas */}
            <Route path="/despesas" element={<Despesas />} />

            {/* Produtos (se usar os itens do submenu) */}
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/produtos/novo" element={<ProdutoNovo />} />
            <Route path="/produtos/editar" element={<ProdutoEditar />} />

            {/* Configurações */}
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/seguranca" element={<Seguranca />} />
            <Route path="/aparencia" element={<Aparencia />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      <ConfirmModal
        isOpen={showLogoutModal}
        title="Confirmar Saída"
        message="Você realmente deseja sair do sistema?"
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          setIsAuthenticated(false);
        }}
      />
    </BrowserRouter>
  );
}
