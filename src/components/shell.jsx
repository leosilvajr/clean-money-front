import React, { useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ConfirmModal from "./ConfirmModal";

export default function Shell() {
    const [collapsed, setCollapsed] = useState(false);
    const [openMenus, setOpenMenus] = useState({ produtos: false, config: false, grupos: false, despesas: false });
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const sidebarPx = useMemo(() => (collapsed ? 80 : 288), [collapsed]);
    const { logout } = useAuth();

    const navigate = useNavigate();

    const toggleSidebar = () => {
        setCollapsed(v => !v);
        if (!collapsed) setOpenMenus({ produtos: false, config: false, grupos: false, despesas: false });
    };
    const toggleSubmenu = (key) => {
        if (collapsed) return;
        setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <>
            <Header sidebarPx={sidebarPx} onToggleSidebar={toggleSidebar} />
            <Sidebar
                collapsed={collapsed}
                openMenus={openMenus}
                toggleSubmenu={toggleSubmenu}
                sidebarPx={sidebarPx}
                onLogout={() => setShowLogoutModal(true)}
            />

            <main className="transition-all duration-300" style={{ marginLeft: sidebarPx, marginTop: 80, padding: "2rem" }}>
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>

            <ConfirmModal
                isOpen={showLogoutModal}
                title="Confirmar Saída"
                message="Você realmente deseja sair do sistema?"
                onCancel={() => setShowLogoutModal(false)}
                onConfirm={() => { setShowLogoutModal(false); logout(); }}

            />
        </>
    );
}
