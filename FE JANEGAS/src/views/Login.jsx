import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, AlertCircle } from "lucide-react";
import JanegasLogo from "../components/JanegasLogo";

const DEMO_ACCOUNTS = [
  { label: "Admin KPS", username: "admin", password: "admin123", role: "admin", desc: "Akses Penuh Semua Modul", color: "#52a659" },
  { label: "Operator KPS", username: "operator_kps", password: "kps123", role: "kps", desc: "Input Produksi & Pemeliharaan", color: "#14b8b3" },
  { label: "Peternak Mitra", username: "peternak_baihaqi", password: "peternak123", role: "peternak", desc: "Setor Limbah Ternak Sapi", color: "#f59e0b" },
  { label: "Kelompok Tani", username: "tani_mekar", password: "tani123", role: "tani", desc: "Penerima Pupuk Bio-Slurry", color: "#8b5e3c" },
];

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(username, password);
      if (user.role === "peternak") {
        navigate("/supply");
      } else if (user.role === "tani") {
        navigate("/fertilizer");
      } else {
        navigate("/");
      }
    } catch {
      setError("Username atau password salah. Silakan coba kembali.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (acc) => {
    setUsername(acc.username);
    setPassword(acc.password);
    setError("");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo-wrap">
          <div style={{ marginBottom: 14, display: "inline-block" }}>
            <JanegasLogo size={68} style={{ boxShadow: "0 8px 24px rgba(45, 106, 79, 0.35)" }} />
          </div>
          <h1 className="login-title">JANEGAS</h1>
          <p className="login-subtitle">
            Jantho Renewable Gas<br />
            Sistem Monitoring Rantai Pasok Biogas Komunitas
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label className="login-label">Username Pengguna</label>
            <input
              id="login-username"
              className="login-input"
              type="text"
              placeholder="Contoh: admin atau operator_kps"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="login-label">Kata Sandi (Password)</label>
            <input
              id="login-password"
              className="login-input"
              type="password"
              placeholder="Masukkan kata sandi..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="login-error" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button id="login-submit" className="login-btn" type="submit" disabled={loading}>
            <span>{loading ? "Memverifikasi Kredensial..." : "Masuk ke Dashboard"}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: 24, paddingTop: 18, borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            color: "rgba(168, 213, 170, 0.7)",
            textTransform: "uppercase",
            letterSpacing: "1.2px",
            marginBottom: 10,
            textAlign: "center"
          }}>
            Klik Akun Demo Cepat
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.username}
                id={`demo-${acc.role}`}
                type="button"
                onClick={() => fillDemo(acc)}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: `1px solid ${acc.color}44`,
                  borderRadius: 10,
                  padding: "8px 10px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s ease"
                }}
              >
                <div style={{ fontSize: 11.5, fontWeight: 700, color: acc.color }}>
                  {acc.label}
                </div>
                <div style={{ fontSize: 10, color: "rgba(255, 255, 255, 0.55)", marginTop: 2 }}>
                  {acc.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 20, textAlign: "center", fontSize: 11, color: "rgba(168, 213, 170, 0.5)" }}>
          Inisiatif Transisi Energi Bersih Berbasis Komunitas
        </div>
      </div>
    </div>
  );
}
