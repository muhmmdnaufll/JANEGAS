import React, { useState } from "react";
import { 
  X, BookOpen, Layers, Sprout, Sparkles, ChevronRight,
  Info, Cpu, Users, Wrench
} from "lucide-react";

export default function TechAndGuideModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("tech");

  if (!isOpen) return null;

  const handleOpenAi = (query) => {
    onClose();
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("open-janegas-ai", { detail: query }));
    }, 150);
  };

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10, 25, 12, 0.7)",
        backdropFilter: "blur(5px)",
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
          maxWidth: 860,
          maxHeight: "90vh",
          borderRadius: 16,
          boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
          color: "#1e293b",
          fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
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
            padding: "18px 24px",
            background: "linear-gradient(135deg, #132a16 0%, #1e4523 100%)",
            color: "#ffffff",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "rgba(114, 196, 120, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#72c478",
              }}
            >
              <BookOpen size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: "#ffffff", letterSpacing: "-0.2px" }}>
                Pusat Edukasi Teknologi &amp; Panduan Penggunaan JANEGAS
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: "#a8dca9", marginTop: 2 }}>
                Dokumentasi Rekayasa Bio-Energi &amp; Standar Operasional Komunitas (BREYI 2026)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              borderRadius: 8,
              color: "#ffffff",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Bar */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #e2e8f0",
            background: "#f8fafc",
            padding: "0 24px",
            gap: 12,
            flexShrink: 0,
          }}
        >
          {[
            { id: "tech", label: "Penjelasan Teknologi", icon: Cpu },
            { id: "sop", label: "Panduan Penggunaan (SOP)", icon: Users },
            { id: "ai", label: "Fitur AI Advisor & FAQ", icon: Sparkles },
          ].map((tab) => {
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
                  padding: "14px 16px",
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#166534" : "#64748b",
                  border: "none",
                  background: "transparent",
                  borderBottom: isActive ? "3px solid #166534" : "3px solid transparent",
                  cursor: "pointer",
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
        <div style={{ padding: "24px", overflowY: "auto", flex: 1, fontSize: 13, lineHeight: 1.6 }}>
          {/* TAB 1: PENJELASAN TEKNOLOGI */}
          {activeTab === "tech" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "14px 16px", borderRadius: 10 }}>
                <div style={{ fontWeight: 700, color: "#166534", fontSize: 14, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                  <Info size={16} />
                  Prinsip Dasar Teknologi JANEGAS (Jantho Renewable Gas)
                </div>
                <p style={{ margin: 0, color: "#1e3a1f", fontSize: 12.5 }}>
                  JANEGAS mengimplementasikan rekayasa fermentasi anaerobik skala komunal untuk mengonversi limbah kotoran sapi dan kambing peternak Jantho menjadi gas metana (CH₄) bersih terbarukan dan pupuk organik bio-slurry berkualitas tinggi.
                </p>
              </div>

              {/* 4 Tahap Fermentasi Anaerobik */}
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>
                  1. Siklus 4 Tahap Biokimiawi Fermentasi Anaerobik
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
                  <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px", background: "#ffffff" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#166534", textTransform: "uppercase" }}>Tahap 1</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "2px 0 6px" }}>Hidrolisis</div>
                    <div style={{ fontSize: 11.5, color: "#64748b" }}>
                      Bakteri hidrolitik memecah polimer kompleks (protein, selulosa, lemak kotoran) menjadi monomer terlarut (glukosa, asam amino).
                    </div>
                  </div>

                  <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px", background: "#ffffff" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#166534", textTransform: "uppercase" }}>Tahap 2</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "2px 0 6px" }}>Asidogenesis</div>
                    <div style={{ fontSize: 11.5, color: "#64748b" }}>
                      Bakteri asidogenik mengonversi monomer menjadi Asam Lemak Volatil (VFA) seperti asam propionat, asam butirat, alkohol, dan CO₂.
                    </div>
                  </div>

                  <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px", background: "#ffffff" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#166534", textTransform: "uppercase" }}>Tahap 3</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "2px 0 6px" }}>Asetogenesis</div>
                    <div style={{ fontSize: 11.5, color: "#64748b" }}>
                      Bakteri asetogenik mengubah VFA menjadi asam asetat (CH₃COOH), gas hidrogen (H₂), dan karbon dioksida sebagai substrat akhir.
                    </div>
                  </div>

                  <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px", background: "#ffffff" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#0ea5a0", textTransform: "uppercase" }}>Tahap 4</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "2px 0 6px" }}>Metanogenesis</div>
                    <div style={{ fontSize: 11.5, color: "#64748b" }}>
                      Mikroba <em>Archae metanogen</em> menghasilkan gas metana murni (CH₄ 55–70%) yang siap dimurnikan untuk kompor warga.
                    </div>
                  </div>
                </div>
              </div>

              {/* Konstruksi & Spesifikasi Teknis */}
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>
                  2. Spesifikasi Teknis Instalasi Biodigester Kota Jantho
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px 14px" }}>
                    <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
                      🏗️ Desain Kubah Tetap (Fixed-Dome Digester)
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: "#475569" }}>
                      Konstruksi ditanam di bawah tanah (underground) untuk menjaga stabilitas suhu mesofilik (30–38°C) dari cuaca tropis Jantho. Kubah beton kedap gas menampung akumulasi metana hingga tekanan 1.5 bar.
                    </p>
                  </div>

                  <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px 14px" }}>
                    <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
                      🧪 Pemurnian H₂S (Desulfurizer Iron Sponge)
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: "#475569" }}>
                      Sebelum disalurkan ke jaringan pipa kompor warga, biogas dialirkan melalui tabung berisi serbuk besi oksida (Fe₂O₃) untuk menyerap gas asam H₂S, mencegah bau tidak sedap dan korosi pada burner kompor.
                    </p>
                  </div>

                  <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px 14px" }}>
                    <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
                      ⚖️ Rasio Pengenceran Wajib (1:1)
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: "#475569" }}>
                      Setiap 1 kg kotoran segar harus diencerkan dengan 1 liter air bersih untuk mempertahankan Total Solids (TS) pada kisaran 8–10%, mencegah endapan kerak tebal (scum) di bagian atas digester.
                    </p>
                  </div>

                  <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px 14px" }}>
                    <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
                      🌱 Hasil Sampingan Bio-Slurry
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: "#475569" }}>
                      Limbah fermentasi yang keluar (bio-slurry) bebas dari patogen dan bibit gulma. Dipisahkan menjadi Pupuk Organik Cair (POC 85%) dan Kompos Padat (15%) yang kaya hara makro (N, P, K) untuk kelompok tani Jantho.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PANDUAN PENGGUNAAN (SOP) */}
          {activeTab === "sop" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ borderLeft: "4px solid #166534", paddingLeft: 14 }}>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  Standar Operasional Prosedur (SOP) Berdasarkan Peran Pengguna
                </h4>
                <p style={{ margin: 0, fontSize: 12, color: "#64748b", marginTop: 2 }}>
                  Pedoman tata laksana operasional bagi seluruh pemangku kepentingan rantai pasok energi bersih Jantho
                </p>
              </div>

              {/* Peran 1: Peternak Mitra */}
              <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px 16px", background: "#f8fafc" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: "#b45309", marginBottom: 8 }}>
                  <Layers size={18} />
                  <span>1. Peran: Peternak Mitra (Pemasok Bahan Baku)</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: "#334155", display: "flex", flexDirection: "column", gap: 4 }}>
                  <li><b>Pengumpulan Kotoran:</b> Kumpulkan kotoran sapi atau kambing segar (kurang dari 24 jam) dan pastikan bebas dari batu, plastik, atau bahan kimia deterjen sanitasi kandang.</li>
                  <li><b>Pencatatan &amp; Penimbangan:</b> Antar bahan baku ke instalasi biodigester Jantho untuk ditimbang oleh petugas operator KPS.</li>
                  <li><b>Penerimaan Bukti Setor:</b> Peternak berhak meminta cetak lembar <b>Bukti Setor Fisik (Slip Timbang Resmi)</b> yang dapat dicetak dari dashboard sebagai bukti hak klaim bagi hasil pupuk/subsidi energi.</li>
                </ul>
              </div>

              {/* Peran 2: Operator KPS Jantho */}
              <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px 16px", background: "#f8fafc" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: "#166534", marginBottom: 8 }}>
                  <Wrench size={18} />
                  <span>2. Peran: Operator KPS Jantho (Pengelola Biodigester)</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: "#334155", display: "flex", flexDirection: "column", gap: 4 }}>
                  <li><b>Input Produksi Harian:</b> Setiap pagi dan sore, catat volume gas metana (m³), tekanan manometer (bar), dan pH slurry pada menu <b>Produksi Biogas</b>.</li>
                  <li><b>Pengawasan EWS (Early Warning System):</b> Jika pH &lt; 6.8 (asidifikasi), segera kurangi laju pengisian bahan baku baru dan sirkulasikan bio-slurry matang atau tambahkan kapur tohor. Jika tekanan &gt; 1.6 bar, periksa katup pengaman relief.</li>
                  <li><b>Pencatatan Pemeliharaan:</b> Laporkan kegiatan desulfurisasi, kuras water-trap, dan inspeksi pipa gas pada menu <b>Log Pemeliharaan</b>.</li>
                </ul>
              </div>

              {/* Peran 3: Kelompok Tani Mitra */}
              <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px 16px", background: "#f8fafc" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: "#8b5e3c", marginBottom: 8 }}>
                  <Sprout size={18} />
                  <span>3. Peran: Kelompok Tani Mitra (Penerima Pupuk Bio-Slurry)</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: "#334155", display: "flex", flexDirection: "column", gap: 4 }}>
                  <li><b>Pengambilan Pupuk Cair (POC):</b> Ambil jatah POC di bak penampungan outlet digester dengan jeriken tertutup, encerkan 1:10 dengan air untuk penyemprotan daun sawah.</li>
                  <li><b>Pemanfaatan Kompos Padat:</b> Tebar kompos bio-slurry padat pada saat olah tanah (1–2 minggu sebelum tanam) untuk merestorasi kesuburan tanah Jantho.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: ASISTEN AI & FAQ */}
          {activeTab === "ai" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ background: "linear-gradient(135deg, #132a16 0%, #1e4523 100%)", color: "#ffffff", padding: "16px 20px", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Sparkles size={18} color="#72c478" />
                    <span style={{ fontSize: 15, fontWeight: 800 }}>JANEGAS AI Copilot &amp; Advisor</span>
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#d4edd5" }}>
                    Didukung model <b>Google Gemini 2.5 Flash</b> terintegrasi database real-time dan kalkulasi stoikiometri lokal.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenAi("Analisis kondisi teknis operasional terkini dan berikan saran optimasi produksi biogas Jantho.")}
                  style={{
                    background: "linear-gradient(135deg, #2d6833 0%, #16a34a 100%)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 16px",
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  }}
                >
                  Konsultasi AI Sekarang
                </button>
              </div>

              <div>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>
                  Pertanyaan Populer yang Dapat Dijawab AI Advisor:
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    "Prediksi produksi biogas 7 hari ke depan berdasarkan pasokan saat ini?",
                    "Bagaimana neraca kotoran ternak dan rasio air pengenceran yang ideal?",
                    "Cek status pH & tekanan biodigester terkini dan tindakan mitigasinya?",
                    "Berapa estimasi penghematan tabung LPG 3kg dan reduksi emisi karbon?",
                    "Kapan dan berapa ketersediaan pupuk bio-slurry siap salur ke kelompok tani?",
                  ].map((q, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleOpenAi(q)}
                      style={{
                        padding: "10px 14px",
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
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f0fdf4")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
                    >
                      <span style={{ color: "#1e293b", fontWeight: 500 }}>"{q}"</span>
                      <ChevronRight size={14} color="#166534" />
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
          <div style={{ color: "#64748b" }}>
            * Modul edukasi teknis &amp; kepatuhan operasional program JANEGAS — BREYI 2026
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
