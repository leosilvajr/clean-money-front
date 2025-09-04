import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/authContext";
import PrivateRoute from "./routes/PrivateRoute";
import Home from "./Pages/home"
import Grupos from "./Pages/Grupos/grupos"
import Despesas from "./Pages/Despesas/despesas"
import Competencias from "./Pages/Competências/competências"
import DashboardDespesas from "./Pages/Dashboard/dashBoard"
import Login from "./Pages/Login/login"
import "./index.css";
import Shell from "./components/shell";

export default function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* pública */}
          <Route path="/login" element={<Login />} />

          {/* protegidas */}
          <Route element={<PrivateRoute />}>
            <Route element={<Shell />}>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<DashboardDespesas />} />
              <Route path="/competencias" element={<Competencias />} />
              <Route path="/grupos" element={<Grupos />} />
              <Route path="/despesas" element={<Despesas />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
