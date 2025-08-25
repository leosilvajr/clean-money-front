// === File: src/App.jsx ===
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import "./index.css";
import Home from "./Pages/home";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./Pages/login";

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function Shell() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState({ produtos: false, config: false });
  const sidebarPx = useMemo(() => (collapsed ? 80 : 288), [collapsed]);

  const toggleSidebar = () => {
    setCollapsed((v) => !v);
    if (!collapsed) setOpenMenus({ produtos: false, config: false });
  };

  const toggleSubmenu = (key) => {
    if (collapsed) return;
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      {/* Only show chrome when NOT on login */}
      {!isLogin && (
        <>
          <Header sidebarPx={sidebarPx} onToggleSidebar={toggleSidebar} />
          <Sidebar
            collapsed={collapsed}
            openMenus={openMenus}
            toggleSubmenu={toggleSubmenu}
            sidebarPx={sidebarPx}
          />
        </>
      )}

      <main
        className="transition-all duration-300"
        style={{ marginLeft: !isLogin ? sidebarPx : 0, marginTop: !isLogin ? 80 : 0, padding: !isLogin ? "2rem" : 0 }}
      >
        <div className={!isLogin ? "max-w-7xl mx-auto" : ""}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />
            {/* Add more protected routes here */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
          </Routes>
        </div>
      </main>
    </>
  );
}

export default function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </AuthProvider>
  );
}

