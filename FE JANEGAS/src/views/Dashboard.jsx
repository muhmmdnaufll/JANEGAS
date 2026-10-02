import React, { useState, useEffect, useCallback } from "react";
import { dashboardService } from "../services/api";
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { 
  Layers, Flame, Sprout, Users, Building2, Home, 
  Activity, Clock, ShieldAlert, Leaf, RefreshCw,
  Gauge, CheckCircle2, AlertTriangle, Sparkles, BookOpen
} from "lucide-react";

const KPICard = ({ icon: Icon, label, value, unit, color = "#3a7d40", sub }) => (
  <div className="kpi-card">
    <div
      className="kpi-icon-wrap"
      style={{
        background: `linear-gradient(145deg, ${color}16 0%, ${color}08 100%)`,
        borderColor: `${color}28`,
        color,
      }}
    >
      <Icon size={19} strokeWidth={1.75} />
    </div>
    <div className="kpi-label">{label}</div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
      <span className="kpi-value" style={{ color }}>{value}</span>
      <span className="kpi-unit">{unit}</span>
    </div>
    {sub && <div className="text-xs text-muted" style={{ marginTop: 4 }}>{sub}</div>}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #c8e6c9",
      borderRadius: 10,
      padding: "10px 14px",
      fontSize: 12.5,
      boxShadow: "0 6px 20px rgba(13, 31, 15, 0.12)"
    }}>
      <div style={{ fontWeight: 700, marginBottom: 6, color: "var(--color-forest-900)" }}>
        Tanggal: {label}
      </div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, display: "flex", justifyContent: "space-between", gap: 14 }}>
          <span>{p.name}:</span>
          <b>{typeof p.value === "number" ? p.value.toLocaleString("id-ID") : p.value}</b>
        </div>
      ))}
    </div>
  );
};

const BioEnergyOptimizationCard = ({ forecast }) => {
  if (!forecast) return null;

  const isHealthy = forecast.is_healthy;
  const ph = forecast.latest_ph || 7.2;
  const press = forecast.latest_pressure || 1.2;
  const projBiogas = forecast.projected_7d_biogas_m3 || 0;
  const projHH = forecast.projected_hh_capacity || 0;
  const projManure = forecast.projected_7d_manure_kg || 0;
  const projWater = forecast.recommended_daily_water_liters || 0;
  const projSlurry = forecast.projected_7d_liquid_slurry_liters || 0;
  const projLpg = forecast.projected_lpg_cylinders || 0;
  const projSavings = forecast.projected_economic_savings_idr || 0;

  const phStatus = forecast.ph_assessment?.status || (ph >= 6.8 && ph <= 7.6 ? "optimal" : "warning");
  const pressStatus = forecast.pressure_assessment?.status || (press >= 1.0 && press <= 1.5 ? "optimal" : "warning");

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f4fbf4 100%)",
        border: "1.5px solid var(--border-default)",
        borderRadius: "var(--radius-lg)",
        padding: "20px 24px",
        boxShadow: "0 4px 20px rgba(13, 31, 15, 0.06)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative background glow */}
      <div
        style={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(94, 234, 212, 0.25) 0%, rgba(20, 184, 179, 0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Top Banner Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          borderBottom: "1px solid var(--border-default)",
          paddingBottom: 14,
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "linear-gradient(135deg, #1a3d1e 0%, #0ea5a0 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(14, 165, 160, 0.3)",
              color: "#ffffff",
            }}
          >
            <Gauge size={20} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "var(--color-forest-900)" }}>
                Pusat Optimasi Bio-Energi &amp; Proyeksi Teknis 7 Hari
              </h3>
              <span
                style={{
                  background: isHealthy ? "rgba(34, 197, 94, 0.12)" : "rgba(245, 158, 11, 0.12)",
                  color: isHealthy ? "#16a34a" : "#d97706",
                  border: isHealthy ? "1px solid rgba(34, 197, 94, 0.3)" : "1px solid rgba(245, 158, 11, 0.3)",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: 12,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {isHealthy ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                {isHealthy ? "Parameter Biodigester Optimal" : "Perhatian Parameter Operasional"}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
              Kalkulasi neraca massa fermentasi anaerobik berbasis riwayat 30 hari untuk efisiensi transisi energi Jantho
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(58, 125, 64, 0.08)",
              color: "var(--color-forest-800)",
              padding: "6px 12px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-default)",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <Activity size={14} color="var(--color-forest-600)" />
            <span>Pemodelan Stoikiometri Aktif</span>
          </div>

          <button
            id="btn-card-guide"
            onClick={() => window.dispatchEvent(new CustomEvent("open-tech-guide"))}
            className="btn btn-secondary btn-sm"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12 }}
          >
            <BookOpen size={14} />
            <span>Edukasi Teknologi &amp; SOP</span>
          </button>

          <button
            id="btn-card-ai"
            onClick={() => window.dispatchEvent(new CustomEvent("open-janegas-ai", { detail: "Bagaimana analisis performa fermentasi anaerobik biodigester Jantho hari ini?" }))}
            className="btn btn-primary btn-sm"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              background: "linear-gradient(135deg, #166534 0%, #0d9488 100%)",
              border: "none",
              color: "#ffffff",
              boxShadow: "0 2px 8px rgba(13, 148, 136, 0.25)"
            }}
          >
            <Sparkles size={14} />
            <span>Konsultasi AI Advisor</span>
          </button>
        </div>
      </div>

      {/* 4 Forecast Highlights */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div style={{ background: "#ffffff", padding: "12px 14px", borderRadius: 10, border: "1px solid var(--border-default)" }}>
          <div style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 600 }}>Proyeksi Biogas (7 Hari)</div>
          <div className="stat-number" style={{ fontSize: 22, fontWeight: 750, color: "var(--color-bio-500)", marginTop: 2 }}>
            {projBiogas.toFixed(1)} <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>m³</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Sanggup suplai ~{projHH} KK warga</div>
        </div>

        <div style={{ background: "#ffffff", padding: "12px 14px", borderRadius: 10, border: "1px solid var(--border-default)" }}>
          <div style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 600 }}>Kebutuhan Substrat Limbah</div>
          <div className="stat-number" style={{ fontSize: 22, fontWeight: 750, color: "var(--color-forest-700)", marginTop: 2 }}>
            {projManure.toLocaleString("id-ID")} <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>kg</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Air pengenceran ~{projWater.toLocaleString("id-ID")} L/hari (1:1)</div>
        </div>

        <div style={{ background: "#ffffff", padding: "12px 14px", borderRadius: 10, border: "1px solid var(--border-default)" }}>
          <div style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 600 }}>Ketersediaan Bio-Slurry Cair</div>
          <div className="stat-number" style={{ fontSize: 22, fontWeight: 750, color: "var(--color-earth-500)", marginTop: 2 }}>
            {projSlurry.toLocaleString("id-ID")} <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>L</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Siap salur ke kelompok tani</div>
        </div>

        <div style={{ background: "#ffffff", padding: "12px 14px", borderRadius: 10, border: "1px solid var(--border-default)" }}>
          <div style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 600 }}>Substitusi &amp; Penghematan</div>
          <div className="stat-number" style={{ fontSize: 22, fontWeight: 750, color: "#16a34a", marginTop: 2 }}>
            ~{projLpg.toFixed(0)} <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>Tabung 3kg</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Hemat Rp {projSavings.toLocaleString("id-ID")} / pekan</div>
        </div>
      </div>

      {/* Technical Status & Operational Evaluation Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 12,
        }}
      >
        {/* pH Card */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 10,
            padding: "12px 14px",
            border: phStatus === "optimal" ? "1px solid var(--border-default)" : "1px solid #fed7aa",
            borderLeft: `4px solid ${phStatus === "optimal" ? "#22c55e" : "#f59e0b"}`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-forest-900)" }}>
              Derajat Keasaman (pH Slurry)
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 8,
                background: phStatus === "optimal" ? "rgba(34, 197, 94, 0.12)" : "rgba(245, 158, 11, 0.12)",
                color: phStatus === "optimal" ? "#16a34a" : "#d97706",
              }}
            >
              pH {ph}
            </span>
          </div>
          <div style={{ fontSize: 11.5, color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {forecast.ph_assessment?.recommendation || "Kondisi fermentasi metanogenik stabil pada rentang netral 6.8 - 7.6."}
          </div>
        </div>

        {/* Pressure Card */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 10,
            padding: "12px 14px",
            border: pressStatus === "optimal" ? "1px solid var(--border-default)" : "1px solid #fed7aa",
            borderLeft: `4px solid ${pressStatus === "optimal" ? "#0ea5a0" : "#f59e0b"}`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-forest-900)" }}>
              Tekanan Gas Biodigester
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 8,
                background: pressStatus === "optimal" ? "rgba(14, 165, 160, 0.12)" : "rgba(245, 158, 11, 0.12)",
                color: pressStatus === "optimal" ? "#0ea5a0" : "#d97706",
              }}
            >
              {press} bar
            </span>
          </div>
          <div style={{ fontSize: 11.5, color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {forecast.pressure_assessment?.recommendation || "Tekanan aman untuk transmisi pipa distribusi kompor warga Jantho."}
          </div>
        </div>

        {/* Dilution Ratio & Feedstock Card */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 10,
            padding: "12px 14px",
            border: "1px solid var(--border-default)",
            borderLeft: "4px solid var(--color-forest-500)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-forest-900)" }}>
              Rasio Pengenceran Substrat
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 8,
                background: "rgba(58, 125, 64, 0.12)",
                color: "var(--color-forest-800)",
              }}
            >
              1 : 1 (TS 8-10%)
            </span>
          </div>
          <div style={{ fontSize: 11.5, color: "var(--text-secondary)", lineHeight: 1.5 }}>
            Campurkan 1 kg kotoran : 1 liter air untuk mempertahankan fluiditas slurry dan mencegah endapan kerak di inlet digester.
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await dashboardService.getSummary();
      setSummary(res.data);
    } catch {
      setError("Gagal memuat ringkasan data. Pastikan server backend JANEGAS sedang berjalan.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400 }}>
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <ShieldAlert size={48} color="#ef4444" />
        </div>
        <div className="empty-state-title">Koneksi Backend Gagal</div>
        <div className="empty-state-desc">{error}</div>
        <button className="btn btn-primary btn-sm" onClick={fetchData} style={{ marginTop: 14 }}>
          <RefreshCw size={14} style={{ marginRight: 6 }} /> Coba Lagi
        </button>
      </div>
    );
  }

  const kpi = summary?.kpi || {};
  const totalBiogas = kpi.total_biogas_m3 || 0;
  const totalManure = kpi.total_manure_kg || 0;

  // Impact calculations
  const lpgEquivalentKg = (totalBiogas * 0.46).toFixed(1);
  const lpgCylinderCount = ((totalBiogas * 0.46) / 3).toFixed(0);
  const emissionReductionKg = (totalManure * 0.08 + totalBiogas * 1.5).toFixed(1);

  // Prepare chart series (merged dates)
  const chartData = (summary?.trend_biogas || []).map((b) => {
    const m = (summary?.trend_manure || []).find((x) => x.date === b.date);
    return {
      date: b.date?.slice(5) || b.date,
      "Produksi Biogas (m³)": b.biogas_m3,
      "Pasokan Kotoran (kg)": m?.volume_kg ?? 0,
      "KK Dilayani": b.hh_served,
    };
  });

  // Recent combined logs
  const allLogs = [
    ...(summary?.recent_supply_log || []),
    ...(summary?.recent_prod_log || []),
    ...(summary?.recent_dist_log || []),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <KPICard
          icon={Layers}
          label="Total Limbah Terkumpul"
          value={(kpi.total_manure_kg || 0).toLocaleString("id-ID")}
          unit="kg"
          color="#3a7d40"
          sub="Kotoran sapi & kambing terolah"
        />
        <KPICard
          icon={Flame}
          label="Total Biogas Dihasilkan"
          value={(kpi.total_biogas_m3 || 0).toFixed(1)}
          unit="m³"
          color="#0ea5a0"
          sub="Gas metana bersih komunal"
        />
        <KPICard
          icon={Sprout}
          label="Pupuk Bio-Slurry Disalurkan"
          value={(kpi.total_fertilizer_liter_kg || 0).toLocaleString("id-ID")}
          unit="L/kg"
          color="#8b5e3c"
          sub="Pupuk organik cair & padat"
        />
        <KPICard
          icon={Users}
          label="Peternak Mitra Aktif"
          value={kpi.total_peternak || 0}
          unit="orang"
          color="#52a659"
          sub="Pemasok bahan baku biodigester"
        />
        <KPICard
          icon={Building2}
          label="Kelompok Tani Mitra"
          value={kpi.total_tani || 0}
          unit="kelompok"
          color="#f59e0b"
          sub="Pemanfaat bio-slurry Jantho"
        />
        <KPICard
          icon={Home}
          label="Kapasitas Rumah Tangga"
          value={kpi.max_households_served || 0}
          unit="KK/hari"
          color="#3b82f6"
          sub="Penerima sambungan pipa gas"
        />
      </div>

      {/* Environmental & Economic Impact Banner */}
      <div className="card" style={{ 
        background: "linear-gradient(135deg, #132a16 0%, #1a3d1e 50%, #245228 100%)",
        color: "#ffffff",
        border: "none",
        padding: "20px 24px"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "rgba(114, 196, 120, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Leaf size={24} color="#72c478" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#d4edd5" }}>
                Dampak Lingkungan & Transisi Energi Komunitas
              </div>
              <div style={{ fontSize: 12.5, color: "#a8dca9", marginTop: 2 }}>
                Estimasi kontribusi nyata program JANEGAS terhadap dekarbonisasi dan substitusi LPG bersubsidi
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <div style={{ background: "rgba(255, 255, 255, 0.08)", padding: "10px 16px", borderRadius: 10, border: "1px solid rgba(255, 255, 255, 0.12)" }}>
              <div style={{ fontSize: 11, color: "#a8dca9", textTransform: "uppercase", letterSpacing: "1px" }}>
                Substitusi LPG
              </div>
              <div className="stat-number" style={{ fontSize: 20, fontWeight: 750, color: "#ffffff", marginTop: 2 }}>
                ~{lpgEquivalentKg} kg <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.75)" }}>({lpgCylinderCount} tabung 3kg)</span>
              </div>
            </div>

            <div style={{ background: "rgba(255, 255, 255, 0.08)", padding: "10px 16px", borderRadius: 10, border: "1px solid rgba(255, 255, 255, 0.12)" }}>
              <div style={{ fontSize: 11, color: "#a8dca9", textTransform: "uppercase", letterSpacing: "1px" }}>
                Reduksi Emisi Metana & CO₂
              </div>
              <div className="stat-number" style={{ fontSize: 20, fontWeight: 750, color: "#5eead4", marginTop: 2 }}>
                ~{emissionReductionKg} kg CO₂e
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pusat Optimasi Bio-Energi & Proyeksi Teknis 7 Hari */}
      <BioEnergyOptimizationCard forecast={summary?.forecast} />

      {/* Charts Section */}
      <div className="grid-2">
        {/* Chart 1: Biogas Production & Feedstock Input */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Tren Produksi Biogas & Input Kotoran</h3>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                30 hari terakhir pemantauan biodigester komunal
              </p>
            </div>
          </div>
          <div className="card-body">
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBiogas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5a0" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0ea5a0" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0f0e0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#5c7a5e" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#5c7a5e" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                  <Area
                    type="monotone"
                    dataKey="Produksi Biogas (m³)"
                    stroke="#0ea5a0"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorBiogas)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Chart 2: Households Served */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Penyaluran Energi ke Rumah Tangga (KK)</h3>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                Jumlah kepala keluarga yang menikmati biogas per hari
              </p>
            </div>
          </div>
          <div className="card-body">
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0f0e0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#5c7a5e" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#5c7a5e" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                  <Bar
                    dataKey="KK Dilayani"
                    fill="#3a7d40"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline Feed */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Activity size={18} color="var(--color-forest-600)" />
            <h3 className="card-title">Aktivitas Terkini Rantai Pasok Jantho</h3>
          </div>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Log otomatis 8 transaksi terbaru
          </span>
        </div>
        <div className="card-body">
          {allLogs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-desc">Belum ada aktivitas tercatat</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {allLogs.map((log, idx) => {
                let badgeClass = "badge-forest";
                let typeLabel = "Pasokan";
                let Icon = Layers;

                if (log.type === "production") {
                  badgeClass = "badge-teal";
                  typeLabel = "Produksi";
                  Icon = Flame;
                } else if (log.type === "distribution") {
                  badgeClass = "badge-earth";
                  typeLabel = "Distribusi";
                  Icon = Sprout;
                }

                return (
                  <div
                    key={`${log.type}-${log.id}-${idx}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      borderRadius: 10,
                      background: "var(--bg-base)",
                      border: "1px solid var(--border-default)",
                      fontSize: 13
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span className={`badge ${badgeClass}`} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Icon size={12} />
                        {typeLabel}
                      </span>
                      <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                        {log.desc}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: 12 }}>
                      <Clock size={13} />
                      <span>{log.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
