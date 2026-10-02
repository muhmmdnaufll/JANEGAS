import React, { useState, useEffect, useMemo } from "react";
import { biogasService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { downloadCSV, BIOGAS_COLUMNS } from "../utils/csvExport";
import DateRangeFilter, { filterByDateRange } from "../components/DateRangeFilter";
import { 
  Flame, Plus, Search, Edit2, Trash2, X, Activity, Home, Download,
  ShieldAlert, CheckCircle2, AlertTriangle
} from "lucide-react";

const STATUS_MAP = {
  optimal: { label: "Optimal", badge: "badge-green" },
  normal: { label: "Normal", badge: "badge-teal" },
  perawatan: { label: "Perawatan", badge: "badge-yellow" },
  gangguan: { label: "Gangguan", badge: "badge-red" },
};

export default function BiogasProduction() {
  const { user } = useAuth();
  const { toast, openConfirm } = useToast();
  const canEdit = user?.role === "admin" || user?.role === "kps";

  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    production_date: new Date().toISOString().slice(0, 10),
    input_volume_kg: "",
    biogas_volume_m3: "",
    digester_status: "normal",
    gas_pressure_bar: "1.2",
    ph_level: "7.2",
    households_served: "25",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await biogasService.getAll({ limit: 500 });
      setProductions(res.data);
    } catch {
      setError("Gagal memuat riwayat produksi biogas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNewModal = () => {
    setEditingItem(null);
    setForm({
      production_date: new Date().toISOString().slice(0, 10),
      input_volume_kg: "",
      biogas_volume_m3: "",
      digester_status: "normal",
      gas_pressure_bar: "1.2",
      ph_level: "7.2",
      households_served: "25",
      notes: "",
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      production_date: item.production_date,
      input_volume_kg: item.input_volume_kg,
      biogas_volume_m3: item.biogas_volume_m3,
      digester_status: item.digester_status,
      gas_pressure_bar: item.gas_pressure_bar || "",
      ph_level: item.ph_level || "",
      households_served: item.households_served || "",
      notes: item.notes || "",
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.biogas_volume_m3 || !form.input_volume_kg) return;
    setSaving(true);
    try {
      const payload = {
        production_date: form.production_date,
        input_volume_kg: parseFloat(form.input_volume_kg),
        biogas_volume_m3: parseFloat(form.biogas_volume_m3),
        digester_status: form.digester_status,
        gas_pressure_bar: form.gas_pressure_bar ? parseFloat(form.gas_pressure_bar) : null,
        ph_level: form.ph_level ? parseFloat(form.ph_level) : null,
        households_served: form.households_served ? parseInt(form.households_served, 10) : 0,
        notes: form.notes,
      };

      if (editingItem) {
        await biogasService.update(editingItem.id, payload);
      } else {
        await biogasService.create(payload);
      }
      setShowModal(false);
      loadData();
      toast.success(editingItem ? "Data produksi berhasil diperbarui." : "Catatan produksi baru berhasil disimpan.");
    } catch {
      toast.error("Gagal menyimpan data produksi biogas.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await openConfirm("Yakin ingin menghapus catatan produksi ini? Data yang dihapus tidak bisa dikembalikan.");
    if (!confirmed) return;
    try {
      await biogasService.remove(id);
      loadData();
      toast.success("Catatan produksi berhasil dihapus.");
    } catch {
      toast.error("Gagal menghapus data produksi.");
    }
  };

  const filtered = useMemo(() => {
    const byDate = filterByDateRange(productions, "production_date", dateRange.from, dateRange.to);
    return byDate.filter((p) => {
      const dateStr = p.production_date || "";
      const notesStr = p.notes || "";
      return dateStr.includes(search) || notesStr.toLowerCase().includes(search.toLowerCase());
    });
  }, [productions, search, dateRange]);

  const totalBiogasM3 = productions.reduce((acc, curr) => acc + (curr.biogas_volume_m3 || 0), 0);
  const totalInputKg = productions.reduce((acc, curr) => acc + (curr.input_volume_kg || 0), 0);
  const avgYield = totalInputKg ? (totalBiogasM3 / totalInputKg).toFixed(3) : 0;

  const latestRecord = useMemo(() => {
    if (!productions || productions.length === 0) return null;
    return [...productions].sort((a, b) => (b.production_date || "").localeCompare(a.production_date || ""))[0];
  }, [productions]);

  const ewsData = useMemo(() => {
    if (!latestRecord) return null;
    const ph = latestRecord.ph_level ?? 7.2;
    const pressure = latestRecord.gas_pressure_bar ?? 1.2;

    const isPhOptimal = ph >= 6.8 && ph <= 7.6;
    const isPressureOptimal = pressure >= 1.0 && pressure <= 1.5;
    const isHealthy = isPhOptimal && isPressureOptimal && latestRecord.digester_status !== "gangguan";

    let phStatus = "optimal";
    let phMsg = `Kondisi fermentasi metanogenik stabil pada pH ${ph} (rentang ideal 6.8 - 7.6).`;
    if (ph < 6.8) {
      phStatus = "critical";
      phMsg = `Waspada Asidifikasi (Sour Digester): pH ${ph} di bawah batas 6.8. Kurangi laju pengisian dan sirkulasikan slurry matang / buffer kapur.`;
    } else if (ph > 7.6) {
      phStatus = "warning";
      phMsg = `Alkalinitas Meningkat: pH ${ph} melebihi 7.6. Waspadai amonia bebas, tingkatkan rasio pengenceran air 1:1.`;
    }

    let pressStatus = "optimal";
    let pressMsg = `Tekanan ${pressure} bar berada dalam rentang aman transmisi pipa kompor (1.0 - 1.5 bar).`;
    if (pressure < 0.8) {
      pressStatus = "warning";
      pressMsg = `Tekanan Rendah: ${pressure} bar (di bawah 0.8 bar). Periksa potensi kebocoran sambungan pipa atau penurunan produksi.`;
    } else if (pressure > 1.6) {
      pressStatus = "critical";
      pressMsg = `Waspada Overpressure: ${pressure} bar (melebihi 1.6 bar). Buka katup pelepas atau alirkan gas ke tangki kompresi/burner.`;
    }

    return {
      date: latestRecord.production_date,
      ph,
      pressure,
      isHealthy,
      phStatus,
      phMsg,
      pressStatus,
      pressMsg,
    };
  }, [latestRecord]);

  const handleExport = () => {
    if (filtered.length === 0) {
      toast.warning("Tidak ada data untuk diekspor.");
      return;
    }
    downloadCSV(filtered, BIOGAS_COLUMNS, "produksi_biogas");
    toast.success(`${filtered.length} baris berhasil diekspor ke CSV.`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Top Metric Strip */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div className="kpi-card" style={{ flex: "1 1 200px" }}>
          <div className="kpi-icon-wrap" style={{ background: "rgba(14, 165, 160, 0.12)", color: "#0ea5a0" }}>
            <Flame size={22} />
          </div>
          <div className="kpi-label">Total Gas Terproduksi</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span className="kpi-value" style={{ color: "#0ea5a0", fontSize: 24 }}>
              {totalBiogasM3.toFixed(1)}
            </span>
            <span className="kpi-unit">m³</span>
          </div>
        </div>

        <div className="kpi-card" style={{ flex: "1 1 200px" }}>
          <div className="kpi-icon-wrap" style={{ background: "rgba(59, 130, 246, 0.12)", color: "#3b82f6" }}>
            <Home size={22} />
          </div>
          <div className="kpi-label">Penyaluran Tertinggi</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span className="kpi-value" style={{ color: "#3b82f6", fontSize: 24 }}>
              {Math.max(...productions.map((p) => p.households_served || 0), 0)}
            </span>
            <span className="kpi-unit">KK</span>
          </div>
        </div>

        <div className="kpi-card" style={{ flex: "1 1 200px" }}>
          <div className="kpi-icon-wrap" style={{ background: "rgba(34, 197, 94, 0.12)", color: "#22c55e" }}>
            <Activity size={22} />
          </div>
          <div className="kpi-label">Rasio Rendemen Gas</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span className="kpi-value" style={{ color: "#22c55e", fontSize: 24 }}>
              {avgYield}
            </span>
            <span className="kpi-unit">m³/kg input</span>
          </div>
        </div>
      </div>

      {/* Early Warning System (EWS) - Parameter Stabilitas Fermentasi */}
      {ewsData && (
        <div
          style={{
            background: ewsData.isHealthy
              ? "linear-gradient(135deg, #ffffff 0%, #f4fbf4 100%)"
              : "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
            border: ewsData.isHealthy ? "1.5px solid var(--border-default)" : "1.5px solid #fcd34d",
            borderRadius: "var(--radius-lg)",
            padding: "16px 20px",
            boxShadow: "0 2px 12px rgba(13, 31, 15, 0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              paddingBottom: 10,
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: ewsData.isHealthy ? "rgba(34, 197, 94, 0.15)" : "rgba(245, 158, 11, 0.2)",
                  color: ewsData.isHealthy ? "#16a34a" : "#d97706",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShieldAlert size={18} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: "var(--color-forest-900)" }}>
                    Early Warning System (EWS) — Stabilitas Biokimiawi Biodigester
                  </h4>
                  <span
                    style={{
                      background: ewsData.isHealthy ? "rgba(34, 197, 94, 0.12)" : "rgba(245, 158, 11, 0.15)",
                      color: ewsData.isHealthy ? "#16a34a" : "#d97706",
                      border: ewsData.isHealthy ? "1px solid rgba(34, 197, 94, 0.3)" : "1px solid rgba(245, 158, 11, 0.4)",
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 10,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {ewsData.isHealthy ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                    {ewsData.isHealthy ? "Kondisi Fermentasi Aman" : "Perhatian Parameter Teknis"}
                  </span>
                </div>
                <div style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 2 }}>
                  Evaluasi data monitoring terakhir ({ewsData.date}) terhadap ambang batas fermentasi anaerobik
                </div>
              </div>
            </div>

            <div style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>
              Standar Operasional KPS Jantho
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 12,
            }}
          >
            {/* pH Parameter Gauge */}
            <div
              style={{
                background: "#ffffff",
                padding: "12px 14px",
                borderRadius: 8,
                border: "1px solid var(--border-default)",
                borderLeft: `4px solid ${ewsData.phStatus === "optimal" ? "#22c55e" : ewsData.phStatus === "critical" ? "#ef4444" : "#f59e0b"}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-forest-900)" }}>
                  Indikator Keasaman (pH Slurry)
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    fontWeight: 700,
                    color: ewsData.phStatus === "optimal" ? "#16a34a" : "#dc2626",
                  }}
                >
                  pH {ewsData.ph}
                </span>
              </div>

              {/* Visual Meter Bar */}
              <div style={{ position: "relative", height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
                <div style={{ position: "absolute", left: "46%", width: "14%", top: 0, bottom: 0, background: "rgba(34, 197, 94, 0.4)" }} />
                <div
                  style={{
                    position: "absolute",
                    left: `${Math.min(100, Math.max(0, ((ewsData.ph - 4) / 6) * 100))}%`,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    background: ewsData.phStatus === "optimal" ? "#16a34a" : "#dc2626",
                    borderRadius: 2,
                    transform: "translateX(-50%)",
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-muted)", marginBottom: 6 }}>
                <span>Asam (&lt;6.5)</span>
                <span style={{ color: "#16a34a", fontWeight: 600 }}>Netral Ideal (6.8–7.6)</span>
                <span>Basa (&gt;8.0)</span>
              </div>
              <div style={{ fontSize: 11.5, color: "var(--text-secondary)", lineHeight: 1.4 }}>
                {ewsData.phMsg}
              </div>
            </div>

            {/* Gas Pressure Gauge */}
            <div
              style={{
                background: "#ffffff",
                padding: "12px 14px",
                borderRadius: 8,
                border: "1px solid var(--border-default)",
                borderLeft: `4px solid ${ewsData.pressStatus === "optimal" ? "#0ea5a0" : ewsData.pressStatus === "critical" ? "#ef4444" : "#f59e0b"}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-forest-900)" }}>
                  Manometer Tekanan Gas Komunal
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    fontWeight: 700,
                    color: ewsData.pressStatus === "optimal" ? "#0ea5a0" : "#dc2626",
                  }}
                >
                  {ewsData.pressure} bar
                </span>
              </div>

              {/* Visual Meter Bar */}
              <div style={{ position: "relative", height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
                <div style={{ position: "absolute", left: "40%", width: "20%", top: 0, bottom: 0, background: "rgba(14, 165, 160, 0.4)" }} />
                <div
                  style={{
                    position: "absolute",
                    left: `${Math.min(100, Math.max(0, (ewsData.pressure / 2.5) * 100))}%`,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    background: ewsData.pressStatus === "optimal" ? "#0ea5a0" : "#dc2626",
                    borderRadius: 2,
                    transform: "translateX(-50%)",
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-muted)", marginBottom: 6 }}>
                <span>Drop (&lt;0.8)</span>
                <span style={{ color: "#0ea5a0", fontWeight: 600 }}>Operasional (1.0–1.5 bar)</span>
                <span>Overpressure (&gt;1.6)</span>
              </div>
              <div style={{ fontSize: 11.5, color: "var(--text-secondary)", lineHeight: 1.4 }}>
                {ewsData.pressMsg}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Table Card */}
      <div className="card">
        <div className="card-header" style={{ flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h3 className="card-title">Riwayat Harian Produksi Biodigester</h3>
            <span className="badge badge-teal">{filtered.length} Hari Terdata</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ position: "relative" }}>
              <Search size={15} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                className="form-input"
                placeholder="Cari tanggal / catatan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 32, width: 220 }}
              />
            </div>

            <DateRangeFilter
              dateFrom={dateRange.from}
              dateTo={dateRange.to}
              onChange={setDateRange}
            />

            {canEdit && (
              <button id="btn-add-biogas" className="btn btn-primary btn-sm" onClick={openNewModal}>
                <Plus size={16} />
                <span>Input Produksi</span>
              </button>
            )}
            <button
              id="btn-export-biogas"
              className="btn btn-secondary btn-sm"
              onClick={handleExport}
              disabled={filtered.length === 0}
              title="Ekspor data yang ditampilkan ke CSV"
            >
              <Download size={15} />
              <span>Ekspor CSV</span>
            </button>
          </div>
        </div>

        <div className="card-body">
          {error && <div style={{ color: "#dc2626", fontSize: 13, marginBottom: 10 }}>{error}</div>}

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
              <div className="spinner" />
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Input Slurry (kg)</th>
                    <th>Biogas (m³)</th>
                    <th>Tekanan (bar)</th>
                    <th>pH Slurry</th>
                    <th>KK Terlayani</th>
                    <th>Status Digester</th>
                    <th>Catatan</th>
                    {canEdit && <th>Aksi</th>}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9}>
                        <div className="empty-state">
                          <div className="empty-state-icon">
                            <Flame size={40} color="var(--border-strong)" />
                          </div>
                          <div className="empty-state-desc">Belum ada catatan produksi biogas.</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item) => {
                      const stat = STATUS_MAP[item.digester_status] || STATUS_MAP.normal;
                      return (
                        <tr key={item.id}>
                          <td style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>
                            {item.production_date}
                          </td>
                          <td style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>
                            {item.input_volume_kg.toLocaleString("id-ID")} kg
                          </td>
                          <td style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "#0ea5a0" }}>
                            {item.biogas_volume_m3.toFixed(2)} m³
                          </td>
                          <td style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>
                            {item.gas_pressure_bar ? `${item.gas_pressure_bar} bar` : "-"}
                          </td>
                          <td style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>
                            {item.ph_level ?? "-"}
                          </td>
                          <td style={{ fontWeight: 600 }}>
                            {item.households_served} KK
                          </td>
                          <td>
                            <span className={`badge ${stat.badge}`}>{stat.label}</span>
                          </td>
                          <td style={{ fontSize: 12.5, color: "var(--text-secondary)", maxWidth: 180 }}>
                            {item.notes || "-"}
                          </td>
                          {canEdit && (
                            <td>
                              <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                                <button
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => openEditModal(item)}
                                  title="Edit"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleDelete(item.id)}
                                  title="Hapus"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Add / Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingItem ? "Edit Data Produksi Biogas" : "Input Catatan Produksi Biogas"}
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Tanggal Produksi</label>
                      <input
                        id="biogas-date"
                        className="form-input"
                        type="date"
                        value={form.production_date}
                        onChange={(e) => setForm({ ...form, production_date: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Status Digester</label>
                      <select
                        id="biogas-status"
                        className="form-select"
                        value={form.digester_status}
                        onChange={(e) => setForm({ ...form, digester_status: e.target.value })}
                      >
                        <option value="optimal">Optimal</option>
                        <option value="normal">Normal</option>
                        <option value="perawatan">Perawatan</option>
                        <option value="gangguan">Gangguan Teknis</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Input Kotoran / Slurry (kg)</label>
                      <input
                        id="biogas-input-kg"
                        className="form-input"
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="Contoh: 80"
                        value={form.input_volume_kg}
                        onChange={(e) => setForm({ ...form, input_volume_kg: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Volume Biogas Dihasilkan (m³)</label>
                      <input
                        id="biogas-output-m3"
                        className="form-input"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Contoh: 5.2"
                        value={form.biogas_volume_m3}
                        onChange={(e) => setForm({ ...form, biogas_volume_m3: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Tekanan Gas (bar)</label>
                      <input
                        id="biogas-pressure"
                        className="form-input"
                        type="number"
                        step="0.05"
                        placeholder="Contoh: 1.2"
                        value={form.gas_pressure_bar}
                        onChange={(e) => setForm({ ...form, gas_pressure_bar: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">pH Slurry (Optimal 6.8 - 7.5)</label>
                      <input
                        id="biogas-ph"
                        className="form-input"
                        type="number"
                        step="0.1"
                        placeholder="Contoh: 7.2"
                        value={form.ph_level}
                        onChange={(e) => setForm({ ...form, ph_level: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Rumah Tangga Dilayani (KK)</label>
                    <input
                      id="biogas-hh"
                      className="form-input"
                      type="number"
                      min="0"
                      placeholder="Contoh: 25"
                      value={form.households_served}
                      onChange={(e) => setForm({ ...form, households_served: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Catatan Operasional</label>
                    <textarea
                      id="biogas-notes"
                      className="form-textarea"
                      rows={2}
                      placeholder="Kondisi cuaca, penggantian valve, dsb..."
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button id="btn-save-biogas" type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Menyimpan..." : editingItem ? "Simpan Perubahan" : "Simpan Produksi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
