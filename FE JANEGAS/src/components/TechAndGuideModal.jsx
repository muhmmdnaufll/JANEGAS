import React, { useState } from "react";
import { 
  X, BookOpen, Layers, Sprout, Sparkles, ChevronRight,
  Info, Users, Wrench, Activity, Scale, Flame, BarChart3,
  FileText, ShieldCheck, CheckCircle2, ArrowRight, HelpCircle
} from "lucide-react";

export default function TechAndGuideModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("about");

  if (!isOpen) return null;

  const handleOpenAi = (query) => {
    onClose();
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("open-janegas-ai", { detail: query }));
    }, 150);
  };

  const tabs = [
    { id: "about", label: "Tentang Website", icon: Info },
    { id: "modules", label: "Panduan Modul & Fitur", icon: Layers },
    { id: "roles", label: "Peran & Hak Akses", icon: Users },
    { id: "ai", label: "Bantuan & AI Copilot", icon: Sparkles },
  ];

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10, 25, 12, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 16,
      }}
    >
      <div
        style={{
          background: "#ffffff",
          width: "100%",
          maxWidth: 920,
          maxHeight: "92vh",
          borderRadius: 18,
          boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
          color: "#1e293b",
          fontFamily: "var(--font-sans)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            background: "linear-gradient(135deg, #132a16 0%, #1e4523 100%)",
            color: "#ffffff",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "rgba(114, 196, 120, 0.2)",
                border: "1px solid rgba(114, 196, 120, 0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#72c478",
              }}
            >
              <BookOpen size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: "#ffffff", letterSpacing: "-0.2px" }}>
                Panduan Penggunaan &amp; Pengenalan Sistem JANEGAS
              </h3>
              <p style={{ margin: 0, fontSize: 12.5, color: "#a8dca9", marginTop: 3 }}>
                Informasi Lengkap Fungsi Platform, Alur Rantai Pasok Digital, dan Panduan Fitur
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup Panduan"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              borderRadius: 8,
              color: "#ffffff",
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #e2e8f0",
            background: "#f8fafc",
            padding: "0 20px",
            gap: 8,
            flexShrink: 0,
            overflowX: "auto",
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "13px 16px",
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#166534" : "#64748b",
                  border: "none",
                  background: "transparent",
                  borderBottom: isActive ? "3px solid #166534" : "3px solid transparent",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                }}
              >
                <Icon size={16} color={isActive ? "#166534" : "#64748b"} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: "24px", overflowY: "auto", flex: 1, fontSize: 13, lineHeight: 1.65 }}>
          
          {/* TAB 1: TENTANG WEBSITE JANEGAS */}
          {activeTab === "about" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              
              {/* Highlight Banner */}
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "16px 18px", borderRadius: 12 }}>
                <div style={{ fontWeight: 800, color: "#166534", fontSize: 15, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                  <Info size={18} color="#166534" />
                  <span>Apa itu Website JANEGAS?</span>
                </div>
                <p style={{ margin: 0, color: "#1e3a1f", fontSize: 13 }}>
                  <b>JANEGAS (Jantho Renewable Gas)</b> adalah platform digital manajemen &amp; monitoring terpadu yang dirancang khusus untuk memantau siklus <b>energi terbarukan biogas berbasis komunitas di Kota Jantho, Aceh Besar</b>. 
                  Website ini menghubungkan seluruh pihak dalam ekosistem lokal—mulai dari peternak sapi/kambing, pengelola biodigester, hingga kelompok tani—ke dalam satu sistem data transparan, real-time, dan mudah dipahami.
                </p>
              </div>

              {/* 3 Tujuan Utama Website */}
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>
                  Mengapa Website Ini Dibuat?
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
                  <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px", background: "#ffffff" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", color: "#059669", marginBottom: 10 }}>
                      <Scale size={18} />
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
                      1. Digitalisasi Timbangan &amp; Transparansi
                    </div>
                    <div style={{ fontSize: 12, color: "#475569" }}>
                      Menggantikan pencatatan buku konvensional. Setiap setoran kotoran ternak ditimbang digital, dicatat otomatis, dan menghasilkan <b>Slip Timbang Resmi</b> untuk peternak.
                    </div>
                  </div>

                  <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px", background: "#ffffff" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: "#f0fdfa", display: "flex", alignItems: "center", justifyContent: "center", color: "#0d9488", marginBottom: 10 }}>
                      <Activity size={18} />
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
                      2. Monitoring Produksi &amp; Keamanan Reaktor
                    </div>
                    <div style={{ fontSize: 12, color: "#475569" }}>
                      Memantau volume gas metana (m³), tekanan tangki (bar), keasaman (pH), dan penyaluran ke kompor warga dengan sistem peringatan dini (Early Warning System) otomatis.
                    </div>
                  </div>

                  <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px", background: "#ffffff" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: "#fefce8", display: "flex", alignItems: "center", justifyContent: "center", color: "#ca8a04", marginBottom: 10 }}>
                      <Sprout size={18} />
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
                      3. Distribusi Sirkular Pupuk Bio-Slurry
                    </div>
                    <div style={{ fontSize: 12, color: "#475569" }}>
                      Memastikan hasil olahan limbah berupa pupuk organik cair dan padat terdistribusi merata ke kelompok tani Jantho untuk pertanian ramah lingkungan tanpa pupuk kimia.
                    </div>
                  </div>
                </div>
              </div>

              {/* Alur Kerja Rantai Pasok di Website */}
              <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px 18px", background: "#f8fafc" }}>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", margin: "0 0 12px 0" }}>
                  Alur Rantai Pasok Digital JANEGAS (Hulu ke Hilir):
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                  <div style={{ background: "#ffffff", padding: "12px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#b45309", marginBottom: 2 }}>LANGKAH 1</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Peternak Setor Limbah</div>
                    <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "#64748b" }}>
                      Peternak mengantar kotoran ternak sapi/kambing segar ke unit digester Jantho, ditimbang &amp; dicatat di menu <b>Pasokan Kotoran</b>.
                    </p>
                  </div>

                  <div style={{ background: "#ffffff", padding: "12px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#166534", marginBottom: 2 }}>LANGKAH 2</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Fermentasi &amp; Produksi</div>
                    <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "#64748b" }}>
                      Limbah dicerna bakteri anaerobik dalam kubah digester. Gas metana yang dihasilkan dicatat &amp; dipantau di menu <b>Produksi Biogas</b>.
                    </p>
                  </div>

                  <div style={{ background: "#ffffff", padding: "12px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#0284c7", marginBottom: 2 }}>LANGKAH 3</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Penyaluran Energi Warga</div>
                    <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "#64748b" }}>
                      Biogas bersih dialirkan melalui pipa ke kompor warga sekitar, menghemat biaya tabung LPG 3kg dan mengurangi emisi karbon.
                    </p>
                  </div>

                  <div style={{ background: "#ffffff", padding: "12px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#16a34a", marginBottom: 2 }}>LANGKAH 4</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Penyaluran Pupuk Tani</div>
                    <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "#64748b" }}>
                      Ampas pupuk organik bio-slurry cair &amp; padat dibagikan ke kelompok tani mitra melalui menu <b>Distribusi Pupuk</b>.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PANDUAN MODUL & FITUR WEBSITE */}
          {activeTab === "modules" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ borderLeft: "4px solid #166534", paddingLeft: 12 }}>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  Panduan Menu &amp; Fitur Pada Website Ini
                </h4>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b" }}>
                  Pelajari kegunaan setiap menu pada bilah samping (sidebar) JANEGAS
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                
                {/* Modul 1: Dashboard */}
                <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px 16px", background: "#ffffff" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <div style={{ padding: 6, borderRadius: 6, background: "#ecfdf5", color: "#166534" }}>
                      <BarChart3 size={18} />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>
                      1. Dashboard Utama
                    </div>
                  </div>
                  <p style={{ margin: "0 0 8px 0", fontSize: 12.5, color: "#334155" }}>
                    Halaman ringkasan eksekutif secara real-time yang menyajikan indikator KPI kunci:
                  </p>
                  <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: "#475569", display: "flex", flexDirection: "column", gap: 3 }}>
                    <li><b>Metrik Utama:</b> Total pasokan kotoran (kg), total gas dihasilkan (m³), rasio efisiensi, dan pupuk tersalurkan.</li>
                    <li><b>Dampak Nyata:</b> Ekuivalensi penghematan tabung LPG 3kg dan nilai reduksi emisi karbon (kg CO₂e).</li>
                    <li><b>Grafik Tren &amp; Status Reaktor:</b> Grafik interaktif pasokan vs produksi dan indikator tekanan/pH terkini.</li>
                  </ul>
                </div>

                {/* Modul 2: Pasokan Kotoran */}
                <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px 16px", background: "#ffffff" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <div style={{ padding: 6, borderRadius: 6, background: "#fffbeb", color: "#b45309" }}>
                      <Scale size={18} />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>
                      2. Pasokan Kotoran (Manure Supply)
                    </div>
                  </div>
                  <p style={{ margin: "0 0 8px 0", fontSize: 12.5, color: "#334155" }}>
                    Tempat operator mencatat setiap penerimaan kotoran sapi atau kambing dari peternak mitra:
                  </p>
                  <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: "#475569", display: "flex", flexDirection: "column", gap: 3 }}>
                    <li><b>Formulir Pencatatan:</b> Input tanggal, nama peternak, jenis kotoran (sapi/kambing), berat bersih (kg), dan kadar air/kualitas.</li>
                    <li><b>Cetak Bukti Fisik:</b> Tombol <b>"Cetak Bukti Setor"</b> untuk mencetak lembar slip timbangan resmi yang dapat diserahkan ke peternak.</li>
                    <li><b>Filter &amp; Pencarian:</b> Memfilter riwayat setoran berdasarkan peternak atau rentang tanggal tertentu.</li>
                  </ul>
                </div>

                {/* Modul 3: Produksi Biogas */}
                <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px 16px", background: "#ffffff" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <div style={{ padding: 6, borderRadius: 6, background: "#f0fdfa", color: "#0d9488" }}>
                      <Flame size={18} />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>
                      3. Produksi Biogas
                    </div>
                  </div>
                  <p style={{ margin: "0 0 8px 0", fontSize: 12.5, color: "#334155" }}>
                    Pencatatan harian hasil produksi gas dan pengawasan parameter biokimia tangki biodigester:
                  </p>
                  <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: "#475569", display: "flex", flexDirection: "column", gap: 3 }}>
                    <li><b>Parameter Kritis:</b> Volume gas (m³), tekanan manometer reaktor (bar), dan tingkat keasaman (pH slurry).</li>
                    <li><b>Early Warning System (EWS):</b> Peringatan visual otomatis apabila pH turun di bawah batas aman (&lt;6.8) atau tekanan melebihi ambang batas.</li>
                    <li><b>Distribusi Gas:</b> Catatan volume gas yang telah dialirkan ke burner kompor rumah tangga warga.</li>
                  </ul>
                </div>

                {/* Modul 4: Distribusi Pupuk */}
                <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px 16px", background: "#ffffff" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <div style={{ padding: 6, borderRadius: 6, background: "#f0fdf4", color: "#16a34a" }}>
                      <Sprout size={18} />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>
                      4. Distribusi Pupuk (Bio-Slurry)
                    </div>
                  </div>
                  <p style={{ margin: "0 0 8px 0", fontSize: 12.5, color: "#334155" }}>
                    Pengelolaan hasil sampingan fermentasi berupa pupuk organik ramah lingkungan:
                  </p>
                  <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: "#475569", display: "flex", flexDirection: "column", gap: 3 }}>
                    <li><b>Pupuk Cair (POC):</b> Pencatatan distribusi POC dalam satuan liter ke kelompok tani untuk pemupukan daun padi/palawija.</li>
                    <li><b>Kompos Padat:</b> Pencatatan pupuk padat dalam satuan kilogram untuk penyubur tanah pertanian Jantho.</li>
                  </ul>
                </div>

                {/* Modul 5 & 6: Pemeliharaan & Data Anggota */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px", background: "#ffffff" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <Wrench size={16} color="#64748b" />
                      <span style={{ fontSize: 13.5, fontWeight: 800, color: "#0f172a" }}>5. Pemeliharaan</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: "#475569" }}>
                      Jadwal servis berkala, pengurasan lumpur berkala, penggantian filter gas (desulfurizer), serta riwayat tindakan teknis preventif biodigester.
                    </p>
                  </div>

                  <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px", background: "#ffffff" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <Users size={16} color="#64748b" />
                      <span style={{ fontSize: 13.5, fontWeight: 800, color: "#0f172a" }}>6. Data Anggota</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: "#475569" }}>
                      Direktori lengkap data mitra peternak penyetor, petugas operator KPS, dan kelompok tani penerima pupuk di Jantho.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: PERAN & HAK AKSES PENGGUNA */}
          {activeTab === "roles" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ borderLeft: "4px solid #166534", paddingLeft: 12 }}>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  Peran Pengguna &amp; Hak Akses Akun
                </h4>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b" }}>
                  Setiap pengguna memiliki akses menu dan fungsi khusus sesuai tanggung jawabnya
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                
                {/* Peran: Admin KPS */}
                <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px 16px", background: "#f8fafc" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, color: "#166534", fontSize: 14 }}>
                      <ShieldCheck size={18} color="#166534" />
                      <span>Admin KPS Jantho</span>
                    </div>
                    <span style={{ fontSize: 11, background: "#dcfce7", color: "#15803d", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>
                      Akses Penuh (Full Control)
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: "#334155" }}>
                    Bertanggung jawab atas pengawasan menyeluruh sistem JANEGAS. Dapat melihat, menambah, mengedit, dan menghapus seluruh data pasokan kotoran, produksi biogas, distribusi pupuk, log pemeliharaan, serta manajemen data anggota koperasi.
                  </p>
                </div>

                {/* Peran: Operator KPS */}
                <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px 16px", background: "#f8fafc" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, color: "#0d9488", fontSize: 14 }}>
                      <Wrench size={18} color="#0d9488" />
                      <span>Operator Lapangan (KPS)</span>
                    </div>
                    <span style={{ fontSize: 11, background: "#ccfbf1", color: "#0f766e", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>
                      Input Operasional Harian
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: "#334155" }}>
                    Petugas harian di instalasi biodigester Jantho. Bertugas menimbang kotoran masuk dari peternak, menginput data pasokan, mencetak slip timbangan, mencatat tekanan &amp; pH gas harian, serta memperbarui log servis teknis instalasi.
                  </p>
                </div>

                {/* Peran: Peternak Mitra */}
                <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px 16px", background: "#f8fafc" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, color: "#b45309", fontSize: 14 }}>
                      <Scale size={18} color="#b45309" />
                      <span>Peternak Mitra (Penyetor Bahan Baku)</span>
                    </div>
                    <span style={{ fontSize: 11, background: "#fef3c7", color: "#b45309", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>
                      Akses Pasokan Sendiri
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: "#334155" }}>
                    Peternak sapi atau kambing di Jantho. Ketika login, peternak dapat melihat riwayat akumulasi setoran kotoran miliknya, tanggal setor, berat kilogram, serta mengunduh/mencetak ulang bukti slip setor resmi untuk hak kompensasi atau pupuk.
                  </p>
                </div>

                {/* Peran: Kelompok Tani */}
                <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px 16px", background: "#f8fafc" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, color: "#15803d", fontSize: 14 }}>
                      <Sprout size={18} color="#15803d" />
                      <span>Kelompok Tani Mitra (Penerima Pupuk)</span>
                    </div>
                    <span style={{ fontSize: 11, background: "#dcfce7", color: "#166534", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>
                      Akses Alokasi Pupuk
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: "#334155" }}>
                    Petani Jantho yang memanfaatkan produk pupuk bio-slurry. Dapat memantau riwayat kuota pupuk organik cair (liter) dan pupuk padat (kg) yang sudah diambil untuk lahan pertanian mereka.
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: BANTUAN & AI COPILOT */}
          {activeTab === "ai" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              
              {/* AI Copilot Callout */}
              <div style={{ background: "linear-gradient(135deg, #132a16 0%, #1e4523 100%)", color: "#ffffff", padding: "18px 20px", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
                <div style={{ maxWidth: 540 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Sparkles size={20} color="#72c478" />
                    <span style={{ fontSize: 15.5, fontWeight: 800 }}>JANEGAS AI Advisor &amp; Copilot</span>
                  </div>
                  <p style={{ margin: "6px 0 0", fontSize: 12.5, color: "#d4edd5" }}>
                    Butuh bantuan atau analisis data instan? Asisten cerdas JANEGAS AI terintegrasi langsung dengan database real-time dan siap menjawab pertanyaan Anda dalam bahasa Indonesia yang ramah.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenAi("Jelaskan ringkasan sistem JANEGAS dan status operasional hari ini.")}
                  style={{
                    background: "linear-gradient(135deg, #2d6833 0%, #16a34a 100%)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 10,
                    padding: "10px 18px",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 3px 12px rgba(0,0,0,0.3)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  <Sparkles size={16} />
                  <span>Tanya AI Sekarang</span>
                </button>
              </div>

              {/* Contoh Pertanyaan Populer */}
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>
                  Klik Pertanyaan di Bawah Ini Untuk Menanyakan ke AI:
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    "Apa fungsi utama website JANEGAS dan bagaimana cara memakainya?",
                    "Bagaimana status produksi biogas dan efisiensi reaktor Jantho hari ini?",
                    "Berapa kilogram kotoran yang telah disetor peternak minggu ini?",
                    "Berapa estimasi penghematan tabung gas LPG 3kg bagi warga Jantho?",
                    "Bagaimana cara mencetak bukti slip setor timbangan untuk peternak?",
                    "Kapan waktu ideal untuk melakukan pemeliharaan dan pengurasan biodigester?",
                  ].map((q, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleOpenAi(q)}
                      style={{
                        padding: "11px 14px",
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                        background: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        fontSize: 12.5,
                        transition: "all 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f0fdf4";
                        e.currentTarget.style.borderColor = "#86efac";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#ffffff";
                        e.currentTarget.style.borderColor = "#e2e8f0";
                      }}
                    >
                      <span style={{ color: "#1e293b", fontWeight: 500 }}>"{q}"</span>
                      <ChevronRight size={15} color="#166534" />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: "14px 24px",
            background: "#f8fafc",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            fontSize: 12,
          }}
        >
          <div style={{ color: "#64748b", display: "flex", alignItems: "center", gap: 6 }}>
            <CheckCircle2 size={15} color="#16a34a" />
            <span>Platform Resmi Monitoring Biogas Komunitas Jantho Renewable Gas (JANEGAS)</span>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ fontWeight: 600, padding: "6px 16px" }}
          >
            Tutup Panduan
          </button>
        </div>

      </div>
    </div>
  );
}
