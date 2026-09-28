import React, { useState, useEffect, useMemo } from "react";
import { fertilizerService, memberService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { 
  Sprout, Plus, Search, Edit2, Trash2, X, 
  Droplets, Package, Building2, Calendar, CheckCircle2
} from "lucide-react";

const FERT_TYPES = {
  cair: { label: "Bio-Slurry Cair", defaultUnit: "liter", badge: "badge-teal", icon: Droplets },
  padat: { label: "Bio-Slurry Padat", defaultUnit: "kg", badge: "badge-earth", icon: Package },
};

export default function FertilizerDist() {
  const { user } = useAuth();
  const canEdit = user?.role === "admin" || user?.role === "kps";

  const [distributions, setDistributions] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    distribution_date: new Date().toISOString().slice(0, 10),
    recipient_id: "",
    fertilizer_type: "cair",
    quantity: "",
    unit: "liter",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [distRes, memRes] = await Promise.all([
        fertilizerService.getAll({ limit: 500 }),
        memberService.getAll({ member_type: "kelompok_tani" }),
      ]);
      setDistributions(distRes.data);
      setMembers(memRes.data);
    } catch {
      setError("Gagal memuat data distribusi pupuk organik.");
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
      distribution_date: new Date().toISOString().slice(0, 10),
      recipient_id: members[0]?.id || "",
      fertilizer_type: "cair",
      quantity: "",
      unit: "liter",
      notes: "",
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      distribution_date: item.distribution_date,
      recipient_id: item.recipient_id || "",
      fertilizer_type: item.fertilizer_type,
      quantity: item.quantity,
      unit: item.unit || (item.fertilizer_type === "cair" ? "liter" : "kg"),
      notes: item.notes || "",
    });
    setShowModal(true);
  };

  const handleTypeChange = (newType) => {
    setForm({
      ...form,
      fertilizer_type: newType,
      unit: newType === "cair" ? "liter" : "kg",
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.quantity) return;
    setSaving(true);
    try {
      const payload = {
        distribution_date: form.distribution_date,
        recipient_id: form.recipient_id ? Number(form.recipient_id) : null,
        fertilizer_type: form.fertilizer_type,
        quantity: parseFloat(form.quantity),
        unit: form.unit,
        notes: form.notes,
      };

      if (editingItem) {
        await fertilizerService.update(editingItem.id, payload);
      } else {
        await fertilizerService.create(payload);
      }
      setShowModal(false);
      loadData();
    } catch {
      alert("Gagal menyimpan data distribusi pupuk.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data distribusi pupuk ini?")) return;
    try {
      await fertilizerService.remove(id);
      loadData();
    } catch {
      alert("Gagal menghapus data.");
    }
  };

  const recipientMap = useMemo(() => {
    const map = {};
    members.forEach((m) => {
      map[m.id] = m.name;
    });
    return map;
  }, [members]);

  const filteredDistributions = useMemo(() => {
    return distributions.filter((d) => {
      const recName = recipientMap[d.recipient_id] || "";
      const matchesSearch = recName.toLowerCase().includes(search.toLowerCase()) ||
        (d.notes && d.notes.toLowerCase().includes(search.toLowerCase()));
      const matchesFilter = filterType === "all" || d.fertilizer_type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [distributions, search, filterType, recipientMap]);

  const totalCair = distributions
    .filter((d) => d.fertilizer_type === "cair")
    .reduce((s, d) => s + (d.quantity || 0), 0);
  const totalPadat = distributions
    .filter((d) => d.fertilizer_type === "padat")
    .reduce((s, d) => s + (d.quantity || 0), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Top Metrics */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div className="kpi-card" style={{ flex: "1 1 200px" }}>
          <div className="kpi-icon-wrap" style={{ background: "rgba(20, 184, 179, 0.12)", color: "#14b8b3" }}>
            <Droplets size={22} />
          </div>
          <div className="kpi-label">Bio-Slurry Cair Tersalurkan</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span className="kpi-value" style={{ color: "#0ea5a0", fontSize: 24 }}>
              {totalCair.toLocaleString("id-ID")}
            </span>
            <span className="kpi-unit">Liter</span>
          </div>
        </div>

        <div className="kpi-card" style={{ flex: "1 1 200px" }}>
          <div className="kpi-icon-wrap" style={{ background: "rgba(139, 94, 60, 0.12)", color: "#8b5e3c" }}>
            <Package size={22} />
          </div>
          <div className="kpi-label">Bio-Slurry Padat (Kompos)</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span className="kpi-value" style={{ color: "#8b5e3c", fontSize: 24 }}>
              {totalPadat.toLocaleString("id-ID")}
            </span>
            <span className="kpi-unit">kg</span>
          </div>
        </div>

        <div className="kpi-card" style={{ flex: "1 1 200px" }}>
          <div className="kpi-icon-wrap" style={{ background: "rgba(245, 158, 11, 0.12)", color: "#f59e0b" }}>
            <Building2 size={22} />
          </div>
          <div className="kpi-label">Kelompok Tani Penerima</div>
          <span className="kpi-value" style={{ color: "#f59e0b", fontSize: 24 }}>
            {members.length} Kelompok
          </span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card">
        <div className="card-header" style={{ flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h3 className="card-title">Daftar Distribusi Pupuk Bio-Slurry</h3>
            <span className="badge badge-earth">{filteredDistributions.length} Transaksi</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ position: "relative" }}>
              <Search size={15} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                className="form-input"
                placeholder="Cari penerima / catatan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 32, width: 200 }}
              />
            </div>

            <select
              className="form-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ width: 150 }}
            >
              <option value="all">Semua Jenis Pupuk</option>
              <option value="cair">Bio-Slurry Cair</option>
              <option value="padat">Bio-Slurry Padat</option>
            </select>

            {canEdit && (
              <button id="btn-add-fert" className="btn btn-primary btn-sm" onClick={openNewModal}>
                <Plus size={16} />
                <span>Salurkan Pupuk</span>
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
                    <th>Tanggal Penyaluran</th>
                    <th>Kelompok Tani Penerima</th>
                    <th>Bentuk Pupuk</th>
                    <th>Jumlah Disalurkan</th>
                    <th>Catatan Peruntukan Lahan</th>
                    {canEdit && <th>Aksi</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredDistributions.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <div className="empty-state">
                          <div className="empty-state-icon">
                            <Sprout size={40} color="var(--border-strong)" />
                          </div>
                          <div className="empty-state-desc">Belum ada catatan penyaluran pupuk.</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredDistributions.map((item) => {
                      const tInfo = FERT_TYPES[item.fertilizer_type] || FERT_TYPES.cair;
                      return (
                        <tr key={item.id}>
                          <td style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>
                            {item.distribution_date}
                          </td>
                          <td style={{ fontWeight: 600 }}>
                            {recipientMap[item.recipient_id] || `Kelompok Tani #${item.recipient_id || "-"}`}
                          </td>
                          <td>
                            <span className={`badge ${tInfo.badge}`}>
                              {tInfo.label}
                            </span>
                          </td>
                          <td style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "var(--color-earth-700)" }}>
                            {item.quantity.toLocaleString("id-ID")} {item.unit}
                          </td>
                          <td style={{ fontSize: 12.5, color: "var(--text-secondary)", maxWidth: 240 }}>
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
                {editingItem ? "Edit Penyaluran Pupuk" : "Catat Penyaluran Pupuk Bio-Slurry"}
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
                      <label className="form-label">Tanggal Penyaluran</label>
                      <input
                        id="fert-date"
                        className="form-input"
                        type="date"
                        value={form.distribution_date}
                        onChange={(e) => setForm({ ...form, distribution_date: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Kelompok Tani Penerima</label>
                      <select
                        id="fert-recipient"
                        className="form-select"
                        value={form.recipient_id}
                        onChange={(e) => setForm({ ...form, recipient_id: e.target.value })}
                      >
                        <option value="">-- Pilih Kelompok Tani --</option>
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
                      <label className="form-label">Bentuk Pupuk</label>
                      <select
                        id="fert-type"
                        className="form-select"
                        value={form.fertilizer_type}
                        onChange={(e) => handleTypeChange(e.target.value)}
                      >
                        <option value="cair">Bio-Slurry Cair (Pupuk Organik Cair)</option>
                        <option value="padat">Bio-Slurry Padat (Kompos Organik)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Jumlah Disalurkan</label>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input
                          id="fert-qty"
                          className="form-input"
                          type="number"
                          step="0.5"
                          min="0.5"
                          placeholder="Contoh: 50"
                          value={form.quantity}
                          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                          required
                          style={{ flex: 1 }}
                        />
                        <input
                          id="fert-unit"
                          className="form-input"
                          type="text"
                          value={form.unit}
                          onChange={(e) => setForm({ ...form, unit: e.target.value })}
                          style={{ width: 80, textAlign: "center" }}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Peruntukan Lahan & Catatan</label>
                    <textarea
                      id="fert-notes"
                      className="form-textarea"
                      rows={2}
                      placeholder="Contoh: Pemupukan padi gogo 1.5 Ha, musim tanam pertama..."
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
                <button id="btn-save-fert" type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Menyimpan..." : editingItem ? "Simpan Perubahan" : "Simpan Penyaluran"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
