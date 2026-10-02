import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Login from "./views/Login";
import Dashboard from "./views/Dashboard";
import ManureSupply from "./views/ManureSupply";
import BiogasProduction from "./views/BiogasProduction";
import FertilizerDist from "./views/FertilizerDist";
import Members from "./views/Members";
import Maintenance from "./views/Maintenance";
import JanegasLogo from "./components/JanegasLogo";
import AICopilotDrawer from "./components/AICopilotDrawer";
import TechAndGuideModal from "./components/TechAndGuideModal";
import { 
  LayoutDashboard, 
  Layers, 
  Flame, 
  Sprout, 
  Users, 
  Wrench, 
  LogOut,
  ChevronRight,
  Sparkles,
  BookOpen
} from "lucide-react";
import "./index.css";

const NAV_ITEMS = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard, section: "Utama", roles: ["admin", "kps", "peternak", "tani"] },
  { path: "/supply", label: "Pasokan Limbah Ternak", icon: Layers, section: "Rantai Pasok", roles: ["admin", "kps", "peternak"] },
  { path: "/biogas", label: "Produksi Biogas", icon: Flame, section: "Rantai Pasok", roles: ["admin", "kps"] },
  { path: "/fertilizer", label: "Distribusi Pupuk Bio-Slurry", icon: Sprout, section: "Rantai Pasok", roles: ["admin", "kps", "tani"] },
  { path: "/members", label: "Anggota Komunitas", icon: Users, section: "Manajemen", roles: ["admin", "kps"] },
  { path: "/maintenance", label: "Log Pemeliharaan", icon: Wrench, section: "Manajemen", roles: ["admin", "kps"] },
];

const ROUTE_TITLES = {
  "/": { title: "Dashboard Monitoring", subtitle: "Ringkasan performa dan aliran energi terbarukan komunitas" },
  "/supply": { title: "Pasokan Limbah Ternak", subtitle: "Pencatatan volume kotoran sapi & kambing dari peternak mitra" },
  "/biogas": { title: "Produksi Biogas Komunal", subtitle: "Monitoring volume gas metana, tekanan digester & rumah tangga terlayani" },
  "/fertilizer": { title: "Distribusi Pupuk Organik", subtitle: "Penyaluran bio-slurry cair & padat untuk kelompok tani mitra Jantho" },
  "/members": { title: "Anggota Komunitas", subtitle: "Direktori peternak mitra dan kelompok tani binaan Jantho Renewable Gas" },
  "/maintenance": { title: "Log Pemeliharaan Digester", subtitle: "Riwayat perawatan rutin, inspeksi teknis, dan perbaikan jaringan gas" },
};

const ROLE_LABELS = {
  admin: "Admin Pengelola",
  kps: "Operator KPS Jantho",
  peternak: "Peternak Mitra",
  tani: "Kelompok Tani Mitra",
};

function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showGuideModal, setShowGuideModal] = useState(false);

  useEffect(() => {
    const handleOpenGuide = () => setShowGuideModal(true);
    window.addEventListener("open-tech-guide", handleOpenGuide);
    return () => window.removeEventListener("open-tech-guide", handleOpenGuide);
  }, []);

  if (!user) return <Navigate to="/login" replace />;

  const visibleNav = NAV_ITEMS.filter((item) => item.roles.includes(user.role));
  const sections = [...new Set(visibleNav.map((n) => n.section))];
  const currentHeader = ROUTE_TITLES[location.pathname] || { title: "JANEGAS Dashboard", subtitle: "" };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <JanegasLogo size={38} style={{ boxShadow: "0 2px 10px rgba(45, 106, 79, 0.4)" }} />
            <div>
              <div className="sidebar-logo-name">JANEGAS</div>
              <div className="sidebar-logo-tagline">Jantho Renewable Gas</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sections.map((section) => (
            <div key={section} style={{ marginBottom: 16 }}>
              <div className="sidebar-section-title">{section}</div>
              {visibleNav
                .filter((item) => item.section === section)
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      id={`nav-${item.path.replace("/", "") || "home"}`}
                      className={`nav-item ${isActive ? "active" : ""}`}
                      onClick={() => navigate(item.path)}
                      style={{
                        width: "100%",
                        border: "none",
                        background: "none",
                        textAlign: "left",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 10
                      }}
                    >
                      <Icon size={18} className="nav-item-icon" />
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {isActive && <ChevronRight size={14} style={{ opacity: 0.6 }} />}
                    </button>
                  );
                })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div style={{
            padding: "10px 12px",
            borderRadius: 10,
            background: "rgba(58, 125, 64, 0.18)",
            border: "1px solid rgba(114, 196, 120, 0.2)",
            marginBottom: 10
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-forest-300)" }}>
              {user.username}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-on-dark-muted)", marginTop: 2 }}>
              {ROLE_LABELS[user.role] || user.role}
            </div>
          </div>
          <button
            id="btn-logout"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="nav-item"
            style={{
              width: "100%",
              border: "none",
              background: "none",
              color: "#fca5a5",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10
            }}
          >
            <LogOut size={17} />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        <header className="topbar">
          <div>
            <h2 className="topbar-title">{currentHeader.title}</h2>
            {currentHeader.subtitle && (
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                {currentHeader.subtitle}
              </p>
            )}
          </div>
          <div className="topbar-meta" style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <button
              id="topbar-btn-guide"
              onClick={() => setShowGuideModal(true)}
              className="btn btn-secondary btn-sm"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                padding: "6px 12px",
                borderRadius: 20
              }}
              title="Buka Penjelasan Rekayasa Teknologi & SOP Penggunaan"
            >
              <BookOpen size={14} color="var(--color-forest-700)" />
              <span>Panduan &amp; Teknologi</span>
            </button>

            <button
              id="topbar-btn-ai"
              onClick={() => window.dispatchEvent(new CustomEvent("open-janegas-ai"))}
              className="btn btn-sm"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                padding: "6px 12px",
                borderRadius: 20,
                background: "linear-gradient(135deg, #1b4332 0%, #0d9488 100%)",
                color: "#ffffff",
                border: "none",
                fontWeight: 600,
                boxShadow: "0 2px 8px rgba(13, 148, 136, 0.25)"
              }}
              title="Konsultasi Cerdas Bersama JANEGAS AI Advisor"
            >
              <Sparkles size={14} color="#5eead4" />
              <span>Tanya JANEGAS AI</span>
            </button>

            <span style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: 6,
              background: "var(--color-forest-50)", 
              padding: "4px 10px", 
              borderRadius: 20,
              border: "1px solid var(--border-default)",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--color-forest-700)"
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }}></span>
              BREYI 2026 • Jantho, Aceh Besar
            </span>
          </div>
        </header>

        <main className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/supply" element={<ManureSupply />} />
            <Route path="/biogas" element={<BiogasProduction />} />
            <Route path="/fertilizer" element={<FertilizerDist />} />
            <Route path="/members" element={<Members />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* JANEGAS AI Copilot Drawer */}
      <AICopilotDrawer />

      {/* Pusat Penjelasan Teknologi & Panduan Penggunaan (SOP) Modal */}
      <TechAndGuideModal isOpen={showGuideModal} onClose={() => setShowGuideModal(false)} />
    </div>
  );
}

function LoginGuard() {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : <Login />;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginGuard />} />
            <Route path="/*" element={<Layout />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}
