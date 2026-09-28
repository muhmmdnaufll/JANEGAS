import React, { useState, useEffect, useMemo } from "react";
import { memberService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { 
  Users, Plus, Search, Edit2, Trash2, X, 
  MapPin, Phone, CheckCircle2, XCircle, Building2, User
} from "lucide-react";

export default function Members() {
  const { user } = useAuth();
  const canEdit = user?.role === "admin" || user?.role === "kps";

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    name: "",
    member_type: "peternak",
    phone: "",
    address: "",
    village: "Kota Jantho",
    capacity_info: "",
    is_active: true,
  });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await memberService.getAll();
      setMembers(res.data);
    } catch {
      setError("Gagal memuat direktori anggota komunitas.");
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
      name: "",
      member_type: "peternak",
      phone: "",
      address: "",
      village: "Kota Jantho",
      capacity_info: "",
      is_active: true,
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      member_type: item.member_type,
      phone: item.phone || "",
      address: item.address || "",
      village: item.village || "Kota Jantho",
      capacity_info: item.capacity_info || "",
      is_active: item.is_active ?? true,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        member_type: form.member_type,
        phone: form.phone.trim(),
        address: form.address.trim(),
        village: form.village.trim(),
        capacity_info: form.capacity_info.trim(),
        is_active: form.is_active,
      };

      if (editingItem) {
        await memberService.update(editingItem.id, payload);
      } else {
        await memberService.create(payload);
      }
      setShowModal(false);
      loadData();
    } catch {
      alert("Gagal menyimpan data anggota.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus anggota komunitas ini?")) return;
    try {
      await memberService.remove(id);
      loadData();
    } catch {
      alert("Gagal menghapus anggota.");
    }
  };

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        (m.village && m.village.toLowerCase().includes(search.toLowerCase())) ||
        (m.capacity_info && m.capacity_info.toLowerCase().includes(search.toLowerCase()));
      const matchesTab = tab === "all" || m.member_type === tab;
      return matchesSearch && matchesTab;
    });
  }, [members, search, tab]);

  const peternakCount = members.filter((m) => m.member_type === "peternak").length;
  const taniCount = members.filter((m) => m.member_type === "kelompok_tani").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Top Metrics */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div className="kpi-card" style={{ flex: "1 1 200px" }}>
          <div className="kpi-icon-wrap" style={{ background: "rgba(58, 125, 64, 0.12)", color: "#3a7d40" }}>
            <Users size={22} />
          </div>
          <div className="kpi-label">Total Anggota Komunitas</div>
          <span className="kpi-value" style={{ color: "#3a7d40", fontSize: 24 }}>
            {members.length} Mitra
          </span>
        </div>

        <div className="kpi-card" style={{ flex: "1 1 200px" }}>
          <div className="kpi-icon-wrap" style={{ background: "rgba(20, 184, 179, 0.12)", color: "#14b8b3" }}>
            <User size={22} />
          </div>
          <div className="kpi-label">Peternak Pemasok Limbah</div>
          <span className="kpi-value" style={{ color: "#14b8b3", fontSize: 24 }}>
            {peternakCount} Peternak
          </span>
        </div>

        <div className="kpi-card" style={{ flex: "1 1 200px" }}>
          <div className="kpi-icon-wrap" style={{ background: "rgba(245, 158, 11, 0.12)", color: "#f59e0b" }}>
            <Building2 size={22} />
          </div>
          <div className="kpi-label">Kelompok Tani Pemanfaat</div>
          <span className="kpi-value" style={{ color: "#f59e0b", fontSize: 24 }}>
            {taniCount} Kelompok
          </span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card">
        <div className="card-header" style={{ flexWrap: "wrap", gap: 12 }}>
          {/* Tab Filter */}
          <div style={{ display: "flex", gap: 6 }}>
            <button
              className={`btn btn-sm ${tab === "all" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setTab("all")}
            >
              Semua ({members.length})
            </button>
            <button
              className={`btn btn-sm ${tab === "peternak" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setTab("peternak")}
            >
              Peternak ({peternakCount})
            </button>
            <button
              className={`btn btn-sm ${tab === "kelompok_tani" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setTab("kelompok_tani")}
            >
              Kelompok Tani ({taniCount})
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ position: "relative" }}>
              <Search size={15} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                className="form-input"
                placeholder="Cari nama / gampong..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 32, width: 200 }}
              />
            </div>

            {canEdit && (
              <button id="btn-add-member" className="btn btn-primary btn-sm" onClick={openNewModal}>
                <Plus size={16} />
                <span>Tambah Anggota</span>
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
                    <th>Nama Anggota</th>
                    <th>Peran Komunitas</th>
                    <th>Gampong / Alamat</th>
                    <th>Kontak (HP)</th>
                    <th>Kapasitas Ternak / Lahan</th>
                    <th>Status</th>
                    {canEdit && <th>Aksi</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <div className="empty-state">
                          <div className="empty-state-icon">
                            <Users size={40} color="var(--border-strong)" />
                          </div>
                          <div className="empty-state-desc">Tidak ada anggota yang ditemukan.</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((m) => {
                      const isPeternak = m.member_type === "peternak";
                      return (
                        <tr key={m.id}>
                          <td style={{ fontWeight: 700, color: "var(--color-forest-900)" }}>
                            {m.name}
                          </td>
                          <td>
                            <span className={`badge ${isPeternak ? "badge-forest" : "badge-earth"}`}>
                              {isPeternak ? "Peternak Mitra" : "Kelompok Tani"}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5 }}>
                              <MapPin size={13} color="var(--text-muted)" />
                              <span>{m.village || m.address || "Jantho"}</span>
                            </div>
                          </td>
                          <td style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>
                            {m.phone || "-"}
                          </td>
                          <td style={{ fontSize: 12.5, fontWeight: 500 }}>
                            {m.capacity_info || "-"}
                          </td>
                          <td>
                            {m.is_active ? (
                              <span className="badge badge-green" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                                <CheckCircle2 size={11} /> Aktif
                              </span>
                            ) : (
                              <span className="badge badge-red" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                                <XCircle size={11} /> Non-Aktif
                              </span>
                            )}
                          </td>
                          {canEdit && (
                            <td>
                              <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                                <button
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => openEditModal(m)}
                                  title="Edit"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleDelete(m.id)}
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
                {editingItem ? "Edit Data Anggota" : "Tambah Anggota Komunitas Jantho"}
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
                      <label className="form-label">Nama Lengkap / Kelompok</label>
                      <input
                        id="member-name"
                        className="form-input"
                        type="text"
                        placeholder="Contoh: Baihaqi atau Poktan Makmur Jaya"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Peran Komunitas</label>
                      <select
                        id="member-type"
                        className="form-select"
                        value={form.member_type}
                        onChange={(e) => setForm({ ...form, member_type: e.target.value })}
                      >
                        <option value="peternak">Peternak (Pemasok Kotoran Ternak)</option>
                        <option value="kelompok_tani">Kelompok Tani (Penerima Bio-Slurry)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Nomor WhatsApp / HP</label>
                      <input
                        id="member-phone"
                        className="form-input"
                        type="text"
                        placeholder="08xxxxxxxxxx"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Gampong / Desa (Kec. Kota Jantho)</label>
                      <input
                        id="member-village"
                        className="form-input"
                        type="text"
                        placeholder="Contoh: Jantho Makmur, Weu Krueng"
                        value={form.village}
                        onChange={(e) => setForm({ ...form, village: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Kapasitas (Populasi Ternak / Luas Lahan)</label>
                    <input
                      id="member-capacity"
                      className="form-input"
                      type="text"
                      placeholder="Contoh: 8 ekor sapi potong, atau 3.5 Ha sawah irigasi"
                      value={form.capacity_info}
                      onChange={(e) => setForm({ ...form, capacity_info: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Alamat Lengkap / Dusun</label>
                    <textarea
                      id="member-address"
                      className="form-textarea"
                      rows={2}
                      placeholder="Jl. Jantho Lama, Dusun Meurandeh..."
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button id="btn-save-member" type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Menyimpan..." : editingItem ? "Simpan Perubahan" : "Tambah Anggota"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
