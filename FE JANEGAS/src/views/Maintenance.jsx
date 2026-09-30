import React, { useState, useEffect } from "react";
import { maintenanceService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { 
  Wrench, Plus, Edit2, Trash2, X, AlertTriangle, 
  CheckCircle2, Clock, DollarSign
} from "lucide-react";

const LOG_TYPES = {
  routine_maintenance: { label: "Pemeliharaan Rutin", badge: "badge-forest" },
  repair: { label: "Perbaikan Komponen", badge: "badge-earth" },
  inspection: { label: "Inspeksi Teknis", badge: "badge-teal" },
  training: { label: "Pelatihan Warga", badge: "badge-yellow" },
};

const STATUS_MAP = {
  resolved: { label: "Selesai (Resolved)", badge: "badge-green", icon: CheckCircle2 },
  ongoing: { label: "Sedang Dikerjakan", badge: "badge-yellow", icon: Clock },
  pending: { label: "Menunggu Jadwal", badge: "badge-red", icon: AlertTriangle },
};

export default function Maintenance() {
  const { user } = useAuth();
  const canEdit = user?.role === "admin" || user?.role === "kps";

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    log_date: new Date().toISOString().slice(0, 10),
    log_type: "routine_maintenance",
    description: "",
    status: "resolved",
    technician: "",
    cost_idr: "",
  });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await maintenanceService.getAll();
      setLogs(res.data);
    } catch {
      setError("Gagal memuat catatan pemeliharaan.");
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
      log_date: new Date().toISOString().slice(0, 10),
      log_type: "routine_maintenance",
      description: "",
      status: "resolved",
      technician: "",
      cost_idr: "",
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      log_date: item.log_date,
      log_type: item.log_type,
      description: item.description,
      status: item.status,
      technician: item.technician || "",
      cost_idr: item.cost_idr || "",
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.description.trim()) return;
    setSaving(true);
    try {
      const payload = {
        log_date: form.log_date,
        log_type: form.log_type,
        description: form.description.trim(),
        status: form.status,
        technician: form.technician.trim(),
        cost_idr: form.cost_idr ? parseFloat(form.cost_idr) : 0,
      };

      if (editingItem) {
        await maintenanceService.update(editingItem.id, payload);
      } else {
        await maintenanceService.create(payload);
      }
      setShowModal(false);
      loadData();
    } catch {
      alert("Gagal menyimpan catatan pemeliharaan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus catatan log ini?")) return;
    try {
      await maintenanceService.remove(id);
      loadData();
    } catch {
      alert("Gagal menghapus log.");
    }
  };

  const totalCost = logs.reduce((sum, item) => sum + (item.cost_idr || 0), 0);
  const pendingCount = logs.filter((l) => l.status !== "resolved").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Top Metrics */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div className="kpi-card" style={{ flex: "1 1 200px" }}>
          <div className="kpi-icon-wrap" style={{ background: "rgba(59, 130, 246, 0.12)", color: "#3b82f6" }}>
            <Wrench size={22} />
          </div>
          <div className="kpi-label">Total Riwayat Pemeliharaan</div>
          <span className="kpi-value" style={{ color: "#3b82f6", fontSize: 24 }}>
            {logs.length} Log
          </span>
        </div>

        <div className="kpi-card" style={{ flex: "1 1 200px" }}>
          <div className="kpi-icon-wrap" style={{ background: "rgba(245, 158, 11, 0.12)", color: "#f59e0b" }}>
            <DollarSign size={22} />
          </div>
          <div className="kpi-label">Total Realisasi Biaya</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span className="kpi-value" style={{ color: "#f59e0b", fontSize: 22 }}>
              Rp {totalCost.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <div className="kpi-card" style={{ flex: "1 1 200px" }}>
          <div className="kpi-icon-wrap" style={{ background: "rgba(239, 68, 68, 0.12)", color: "#ef4444" }}>
            <AlertTriangle size={22} />
          </div>
          <div className="kpi-label">Perlu Tindakan / Proses</div>
          <span className="kpi-value" style={{ color: "#ef4444", fontSize: 24 }}>
            {pendingCount} Item
          </span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card">
        <div className="card-header" style={{ flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h3 className="card-title">Log Pemeliharaan & Perawatan Biodigester</h3>
            <span className="badge badge-forest">{logs.length} Catatan</span>
          </div>

          {canEdit && (
            <button id="btn-add-maint" className="btn btn-primary btn-sm" onClick={openNewModal}>
              <Plus size={16} />
              <span>Tambah Log Pemeliharaan</span>
            </button>
          )}
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
                    <th>Kategori Pekerjaan</th>
                    <th>Deskripsi Pemeliharaan / Kerusakan</th>
                    <th>Status</th>
                    <th>Teknisi / PIC</th>
                    <th>Biaya (Rp)</th>
                    {canEdit && <th>Aksi</th>}
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <div className="empty-state">
                          <div className="empty-state-icon">
                            <Wrench size={40} color="var(--border-strong)" />
                          </div>
                          <div className="empty-state-desc">Belum ada riwayat pemeliharaan.</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    logs.map((item) => {
                      const tInfo = LOG_TYPES[item.log_type] || LOG_TYPES.routine_maintenance;
                      const sInfo = STATUS_MAP[item.status] || STATUS_MAP.pending;
                      const StatusIcon = sInfo.icon;
                      return (
                        <tr key={item.id}>
                          <td style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>
                            {item.log_date}
                          </td>
                          <td>
                            <span className={`badge ${tInfo.badge}`}>
                              {tInfo.label}
                            </span>
                          </td>
                          <td style={{ fontSize: 13, maxWidth: 260 }}>
                            {item.description}
                          </td>
                          <td>
                            <span className={`badge ${sInfo.badge}`} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                              <StatusIcon size={12} />
                              {sInfo.label}
                            </span>
                          </td>
                          <td style={{ fontSize: 12.5, fontWeight: 500 }}>
                            {item.technician || "-"}
                          </td>
                          <td style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>
                            {item.cost_idr ? `Rp ${item.cost_idr.toLocaleString("id-ID")}` : "Rp 0"}
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
                {editingItem ? "Edit Log Pemeliharaan" : "Catat Pemeliharaan / Perbaikan"}
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
                      <label className="form-label">Tanggal Pelaksanaan</label>
                      <input
                        id="maint-date"
                        className="form-input"
                        type="date"
                        value={form.log_date}
                        onChange={(e) => setForm({ ...form, log_date: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Kategori Pekerjaan</label>
                      <select
                        id="maint-type"
                        className="form-select"
                        value={form.log_type}
                        onChange={(e) => setForm({ ...form, log_type: e.target.value })}
                      >
                        <option value="routine_maintenance">Pemeliharaan Rutin</option>
                        <option value="repair">Perbaikan Kerusakan</option>
                        <option value="inspection">Inspeksi Teknis / Sensor</option>
                        <option value="training">Pelatihan Warga / Operator</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Deskripsi Pekerjaan / Temuan Kerusakan</label>
                    <textarea
                      id="maint-desc"
                      className="form-textarea"
                      rows={3}
                      placeholder="Contoh: Pembersihan filter desulfurisasi H2S dan pengecekan manometer tekanan gas..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Status Penanganan</label>
                      <select
                        id="maint-status"
                        className="form-select"
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                      >
                        <option value="resolved">Selesai (Resolved)</option>
                        <option value="ongoing">Sedang Dikerjakan (Ongoing)</option>
                        <option value="pending">Menunggu Jadwal (Pending)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Teknisi / PIC Lapangan</label>
                      <input
                        id="maint-tech"
                        className="form-input"
                        type="text"
                        placeholder="Contoh: Teknisi KPS / Mahasiswa Tim"
                        value={form.technician}
                        onChange={(e) => setForm({ ...form, technician: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Biaya Operasional / Penggantian Part (Rp)</label>
                    <input
                      id="maint-cost"
                      className="form-input"
                      type="number"
                      step="5000"
                      min="0"
                      placeholder="0"
                      value={form.cost_idr}
                      onChange={(e) => setForm({ ...form, cost_idr: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button id="btn-save-maint" type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Menyimpan..." : editingItem ? "Simpan Perubahan" : "Simpan Log"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
