import React, { useState, useEffect, useCallback } from "react";
import { dashboardService } from "../services/api";
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { 
  Layers, Flame, Sprout, Users, Building2, Home, 
  Activity, Clock, ShieldAlert, Leaf, RefreshCw
} from "lucide-react";

const KPICard = ({ icon: Icon, label, value, unit, color = "#3a7d40", sub }) => (
  <div className="kpi-card">
    <div className="kpi-icon-wrap" style={{ background: `${color}18`, color }}>
      <Icon size={24} />
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
            <div style={{ background: "rgba(255, 255, 255, 0.08)", padding: "10px 16px", borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: "#a8dca9", textTransform: "uppercase", letterSpacing: "1px" }}>
                Substitusi LPG
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#ffffff", marginTop: 2 }}>
                ~{lpgEquivalentKg} kg <span style={{ fontSize: 12, fontWeight: 500 }}>({lpgCylinderCount} tabung 3kg)</span>
              </div>
            </div>

            <div style={{ background: "rgba(255, 255, 255, 0.08)", padding: "10px 16px", borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: "#a8dca9", textTransform: "uppercase", letterSpacing: "1px" }}>
                Reduksi Emisi Metana & CO₂
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#5eead4", marginTop: 2 }}>
                ~{emissionReductionKg} kg CO₂e
              </div>
            </div>
          </div>
        </div>
      </div>

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
