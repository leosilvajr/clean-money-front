// === File: src/App.jsx ===

import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { useMemo, useState } from "react";
import "./index.css";
import Home from "./Pages/home";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

export default function AppRoutes() {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState({ produtos: false, config: false });

  const sidebarPx = useMemo(() => (collapsed ? 80 : 288), [collapsed]); // 80px vs 288px (~w-20 vs w-72)

  const toggleSidebar = () => {
    setCollapsed((v) => !v);
    // Close submenus on collapse
    if (!collapsed) setOpenMenus({ produtos: false, config: false });
  };

  const toggleSubmenu = (key) => {
    if (collapsed) return;
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <BrowserRouter>
      {/* Header */}
      <Header sidebarPx={sidebarPx} onToggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        openMenus={openMenus}
        toggleSubmenu={toggleSubmenu}
        sidebarPx={sidebarPx}
      />

      {/* Main content */}
      <main
        className="transition-all duration-300"
        style={{ marginLeft: sidebarPx, marginTop: 80, padding: "2rem" }}
      >
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Add more routes here as you build pages */}
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  );
}