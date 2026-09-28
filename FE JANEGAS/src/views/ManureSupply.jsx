import React, { useState, useEffect, useMemo } from "react";
import { manureService, memberService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { 
  Layers, Plus, Search, Edit2, Trash2, X, RefreshCw,
  Scale, Filter, Calendar, FileText, CheckCircle2
} from "lucide-react";

const LIVESTOCK_LABELS = {
  sapi: { label: "Sapi", badge: "badge-forest" },
  kambing: { label: "Kambing", badge: "badge-earth" },
  campuran: { label: "Campuran", badge: "badge-teal" },
};

export default function ManureSupply() {
  const { user } = useAuth();
  const canEdit = user?.role === "admin" || user?.role === "kps" || user?.role === "peternak";

  const [supplies, setSupplies] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    supply_date: new Date().toISOString().slice(0, 10),
    supplier_id: "",
    livestock_type: "sapi",
    volume_kg: "",
    moisture_content: "75",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [supRes, memRes] = await Promise.all([
        manureService.getAll({ limit: 500 }),
        memberService.getAll({ member_type: "peternak" }),
      ]);
      setSupplies(supRes.data);
      setMembers(memRes.data);
    } catch {
      setError("Gagal memuat data pasokan kotoran ternak.");
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
      supply_date: new Date().toISOString().slice(0, 10),
      supplier_id: members[0]?.id || "",
      livestock_type: "sapi",
      volume_kg: "",
      moisture_content: "75",
      notes: "",
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      supply_date: item.supply_date,
      supplier_id: item.supplier_id || "",
      livestock_type: item.livestock_type,
      volume_kg: item.volume_kg,
      moisture_content: item.moisture_content || "",
      notes: item.notes || "",
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.volume_kg) return;
    setSaving(true);
    try {
      const payload = {
        supply_date: form.supply_date,
        supplier_id: form.supplier_id ? Number(form.supplier_id) : null,
        livestock_type: form.livestock_type,
        volume_kg: parseFloat(form.volume_kg),
        moisture_content: form.moisture_content ? parseFloat(form.moisture_content) : null,
        notes: form.notes,
      };

      if (editingItem) {
        await manureService.update(editingItem.id, payload);
      } else {
        await manureService.create(payload);
      }
      setShowModal(false);
      loadData();
    } catch {
      alert("Gagal menyimpan data pasokan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus catatan pasokan ini?")) return;
    try {
      await manureService.remove(id);
      loadData();
    } catch {
      alert("Gagal menghapus data.");
    }
  };

  const supplierMap = useMemo(() => {
    const map = {};
    members.forEach((m) => {
      map[m.id] = m.name;
    });
    return map;
  }, [members]);

  const filteredSupplies = useMemo(() => {
    return supplies.filter((s) => {
      const suppName = supplierMap[s.supplier_id] || "";
      const matchesSearch = suppName.toLowerCase().includes(search.toLowerCase()) ||
        (s.notes && s.notes.toLowerCase().includes(search.toLowerCase()));
      const matchesFilter = filterType === "all" || s.livestock_type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [supplies, search, filterType, supplierMap]);

  const totalKg = supplies.reduce((acc, curr) => acc + (curr.volume_kg || 0), 0);
  const avgKg = supplies.length ? (totalKg / supplies.length).toFixed(1) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Top Summary Cards */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div className="kpi-card" style={{ flex: "1 1 200px" }}>
          <div className="kpi-icon-wrap" style={{ background: "rgba(58, 125, 64, 0.12)", color: "#3a7d40" }}>
            <Scale size={22} />
          </div>
          <div className="kpi-label">Total Volume Terkumpul</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span className="kpi-value" style={{ color: "#3a7d40", fontSize: 24 }}>
              {totalKg.toLocaleString("id-ID")}
            </span>
            <span className="kpi-unit">kg</span>
          </div>
        </div>

        <div className="kpi-card" style={{ flex: "1 1 200px" }}>
          <div className="kpi-icon-wrap" style={{ background: "rgba(20, 184, 179, 0.12)", color: "#14b8b3" }}>
            <Layers size={22} />
          </div>
          <div className="kpi-label">Total Transaksi Masuk</div>
          <span className="kpi-value" style={{ color: "#14b8b3", fontSize: 24 }}>
            {supplies.length}
          </span>
        </div>

        <div className="kpi-card" style={{ flex: "1 1 200px" }}>
          <div className="kpi-icon-wrap" style={{ background: "rgba(139, 94, 60, 0.12)", color: "#8b5e3c" }}>
            <Scale size={22} />
          </div>
          <div className="kpi-label">Rata-rata Pasokan / Transaksi</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span className="kpi-value" style={{ color: "#8b5e3c", fontSize: 24 }}>
              {avgKg}
            </span>
            <span className="kpi-unit">kg</span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card">
        <div className="card-header" style={{ flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h3 className="card-title">Daftar Pasokan Kotoran Ternak</h3>
            <span className="badge badge-forest">{filteredSupplies.length} Catatan</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {/* Search Input */}
            <div style={{ position: "relative" }}>
              <Search size={15} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                className="form-input"
                placeholder="Cari peternak / catatan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 32, width: 200 }}
              />
            </div>

            {/* Filter Livestock Type */}
            <select
              className="form-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ width: 140 }}
            >
              <option value="all">Semua Ternak</option>
              <option value="sapi">Sapi</option>
              <option value="kambing">Kambing</option>
              <option value="campuran">Campuran</option>
            </select>

            {canEdit && (
              <button id="btn-add-supply" className="btn btn-primary btn-sm" onClick={openNewModal}>
                <Plus size={16} />
                <span>Input Pasokan</span>
              </button>
            )}
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
                    <th>Peternak Mitra</th>
                    <th>Jenis Ternak</th>
                    <th>Volume (kg)</th>
                    <th>Kadar Air (%)</th>
                    <th>Catatan</th>
                    {canEdit && <th>Aksi</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredSupplies.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <div className="empty-state">
                          <div className="empty-state-icon">
                            <Layers size={40} color="var(--border-strong)" />
                          </div>
                          <div className="empty-state-desc">Tidak ada data pasokan yang cocok.</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredSupplies.map((item) => {
                      const lType = LIVESTOCK_LABELS[item.livestock_type] || LIVESTOCK_LABELS.sapi;
                      return (
                        <tr key={item.id}>
                          <td style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>
                            {item.supply_date}
                          </td>
                          <td style={{ fontWeight: 600 }}>
                            {supplierMap[item.supplier_id] || `Peternak #${item.supplier_id || "-"}`}
                          </td>
                          <td>
                            <span className={`badge ${lType.badge}`}>{lType.label}</span>
                          </td>
                          <td style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "var(--color-forest-700)" }}>
                            {item.volume_kg.toLocaleString("id-ID")} kg
                          </td>
                          <td style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>
                            {item.moisture_content ? `${item.moisture_content}%` : "-"}
                          </td>
                          <td style={{ fontSize: 12.5, color: "var(--text-secondary)", maxWidth: 220 }}>
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
                {editingItem ? "Edit Pasokan Limbah" : "Input Pasokan Limbah Ternak"}
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
                      <label className="form-label">Tanggal Setor</label>
                      <input
                        id="supply-date"
                        className="form-input"
                        type="date"
                        value={form.supply_date}
                        onChange={(e) => setForm({ ...form, supply_date: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Peternak Pemasok</label>
                      <select
                        id="supply-member"
                        className="form-select"
                        value={form.supplier_id}
                        onChange={(e) => setForm({ ...form, supplier_id: e.target.value })}
                      >
                        <option value="">-- Pilih Peternak --</option>
                        {members.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.village || "Jantho"})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Jenis Ternak</label>
                      <select
                        id="supply-livestock"
                        className="form-select"
                        value={form.livestock_type}
                        onChange={(e) => setForm({ ...form, livestock_type: e.target.value })}
                      >
                        <option value="sapi">Sapi</option>
                        <option value="kambing">Kambing</option>
                        <option value="campuran">Campuran</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Volume Kotoran (kg)</label>
                      <input
                        id="supply-volume"
                        className="form-input"
                        type="number"
                        step="0.1"
                        min="0.5"
                        placeholder="Contoh: 25.5"
                        value={form.volume_kg}
                        onChange={(e) => setForm({ ...form, volume_kg: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Estimasi Kadar Air (%) - Opsional</label>
                    <input
                      id="supply-moisture"
                      className="form-input"
                      type="number"
                      step="1"
                      min="0"
                      max="100"
                      placeholder="Default: 75%"
                      value={form.moisture_content}
                      onChange={(e) => setForm({ ...form, moisture_content: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Catatan Tambahan</label>
                    <textarea
                      id="supply-notes"
                      className="form-textarea"
                      rows={2}
                      placeholder="Kondisi kotoran segar, waktu pengambilan, dsb..."
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
                <button id="btn-save-supply" type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Menyimpan..." : editingItem ? "Simpan Perubahan" : "Tambah Pasokan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
