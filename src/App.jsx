// === File: src/App.jsx ===
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useMemo, useState } from "react";
import "./index.css";
import Home from "./Pages/home";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Login from "./Pages/Login";
import ConfirmModal from "./components/ConfirmModal";

export default function AppRoutes() {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState({ produtos: false, config: false });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const sidebarPx = useMemo(() => (collapsed ? 80 : 288), [collapsed]);

  const toggleSidebar = () => {
    setCollapsed((v) => !v);
    if (!collapsed) setOpenMenus({ produtos: false, config: false });
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
