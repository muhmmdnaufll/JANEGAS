import React from "react";
import { Printer, X, FileSpreadsheet } from "lucide-react";

export default function ManureReportModal({ supplies, supplierMap, dateRange, onClose }) {
  if (!supplies) return null;

  const handlePrint = () => {
    window.print();
  };

  const totalKg = supplies.reduce((sum, s) => sum + (s.volume_kg || 0), 0);
  const avgKg = supplies.length ? (totalKg / supplies.length).toFixed(1) : 0;
  const sapiKg = supplies.filter(s => s.livestock_type === "sapi").reduce((sum, s) => sum + (s.volume_kg || 0), 0);
  const kambingKg = supplies.filter(s => s.livestock_type === "kambing").reduce((sum, s) => sum + (s.volume_kg || 0), 0);
  const estBiogas = ((sapiKg * 0.045) + (kambingKg * 0.055)).toFixed(1);
  const estSlurryL = (totalKg * 0.88 * 0.85).toFixed(0);

  const todayStr = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10, 25, 12, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 16,
        overflowY: "auto",
      }}
    >
      <div
        className="print-slip-container"
        style={{
          background: "#ffffff",
          width: "100%",
          maxWidth: 820,
          borderRadius: 14,
          boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
          color: "#1e293b",
          fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Action Bar (Hidden on print) */}
        <div
          className="no-print"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            background: "var(--color-forest-900, #132a16)",
            color: "#ffffff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600 }}>
            <FileSpreadsheet size={18} color="#72c478" />
            <span>Pratinjau Lembar Rekapitulasi Periode (Siap Cetak / PDF)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={handlePrint}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "linear-gradient(135deg, #2d6833 0%, #16a34a 100%)",
                color: "#ffffff",
                border: "none",
                borderRadius: 8,
                padding: "7px 14px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              <Printer size={15} />
              <span>Cetak / Unduh PDF</span>
            </button>
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
        </div>

        {/* Printable Content */}
        <div style={{ padding: "30px 36px" }}>
          {/* Letterhead */}
          <div style={{ textAlign: "center", borderBottom: "3px double #1e293b", paddingBottom: 14, marginBottom: 18 }}>
            <div style={{ fontSize: 10, letterSpacing: "2px", fontWeight: 800, color: "#166534", textTransform: "uppercase" }}>
              Inisiatif Bali Renewable Energy Young Innovators (BREYI 2026)
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", marginTop: 2 }}>
              KELOMPOK PENGELOLA SISTEM (KPS) BIOGAS KOMUNAL
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>
              REKAPITULASI PENERIMAAN PASOKAN LIMBAH TERNAK JANTHO
            </div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
              Gampong Weu &amp; Sekitarnya, Kota Jantho, Kabupaten Aceh Besar | Periode: {dateRange?.from || "Semua Data"} s.d. {dateRange?.to || "Terbaru"}
            </div>
          </div>

          {/* Metric Summary Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 18, fontSize: 11 }}>
            <div style={{ border: "1px solid #cbd5e1", borderRadius: 8, padding: "8px 12px", background: "#f8fafc" }}>
              <div style={{ color: "#64748b" }}>Total Penerimaan:</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#166534" }}>{totalKg.toLocaleString("id-ID")} kg</div>
              <div style={{ color: "#64748b", fontSize: 10 }}>{supplies.length} Transaksi Masuk</div>
            </div>
            <div style={{ border: "1px solid #cbd5e1", borderRadius: 8, padding: "8px 12px", background: "#f8fafc" }}>
              <div style={{ color: "#64748b" }}>Rata-rata / Setoran:</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{avgKg} kg</div>
              <div style={{ color: "#64748b", fontSize: 10 }}>Konsistensi Pemasok</div>
            </div>
            <div style={{ border: "1px solid #cbd5e1", borderRadius: 8, padding: "8px 12px", background: "#f8fafc" }}>
              <div style={{ color: "#64748b" }}>Estimasi Biogas:</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#0ea5a0" }}>~{estBiogas} m³</div>
              <div style={{ color: "#64748b", fontSize: 10 }}>Substitusi Energi Warga</div>
            </div>
            <div style={{ border: "1px solid #cbd5e1", borderRadius: 8, padding: "8px 12px", background: "#f8fafc" }}>
              <div style={{ color: "#64748b" }}>Potensi Bio-Slurry:</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#8b5e3c" }}>~{estSlurryL} Liter</div>
              <div style={{ color: "#64748b", fontSize: 10 }}>Pupuk Organik Petani</div>
            </div>
          </div>

          {/* Table */}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, marginBottom: 20 }}>
            <thead>
              <tr style={{ background: "#f1f5f9", borderBottom: "2px solid #cbd5e1" }}>
                <th style={{ padding: "6px 8px", textAlign: "left" }}>No.</th>
                <th style={{ padding: "6px 8px", textAlign: "left" }}>Tanggal</th>
                <th style={{ padding: "6px 8px", textAlign: "left" }}>Peternak Mitra</th>
                <th style={{ padding: "6px 8px", textAlign: "left" }}>Ternak</th>
                <th style={{ padding: "6px 8px", textAlign: "right" }}>Volume (kg)</th>
                <th style={{ padding: "6px 8px", textAlign: "center" }}>Kadar Air</th>
                <th style={{ padding: "6px 8px", textAlign: "left" }}>Catatan</th>
              </tr>
            </thead>
            <tbody>
              {supplies.slice(0, 30).map((row, idx) => (
                <tr key={row.id || idx} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "5px 8px" }}>{idx + 1}</td>
                  <td style={{ padding: "5px 8px", fontFamily: "monospace" }}>{row.supply_date}</td>
                  <td style={{ padding: "5px 8px", fontWeight: 600 }}>{supplierMap[row.supplier_id] || `Peternak #${row.supplier_id}`}</td>
                  <td style={{ padding: "5px 8px", textTransform: "capitalize" }}>{row.livestock_type}</td>
                  <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 700, fontFamily: "monospace" }}>
                    {row.volume_kg.toLocaleString("id-ID")}
                  </td>
                  <td style={{ padding: "5px 8px", textAlign: "center" }}>{row.moisture_content ? `${row.moisture_content}%` : "-"}</td>
                  <td style={{ padding: "5px 8px", color: "#64748b", fontSize: 10 }}>{row.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {supplies.length > 30 && (
            <div style={{ fontSize: 10, color: "#64748b", fontStyle: "italic", marginBottom: 16 }}>
              * Menampilkan 30 baris transaksi pertama. Gunakan Ekspor CSV untuk rekapitulasi data lengkap tanpa batas baris.
            </div>
          )}

          {/* Signatures */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, marginTop: 24, textAlign: "center", fontSize: 11 }}>
            <div>
              <div style={{ color: "#64748b", marginBottom: 55 }}>
                Mengetahui,<br />
                Ketua KPS Biogas Jantho
              </div>
              <div style={{ fontWeight: 800, color: "#0f172a", borderTop: "1px solid #cbd5e1", paddingTop: 4, width: "65%", margin: "0 auto" }}>
                ( Teuku Ridwan, S.Pt )
              </div>
            </div>

            <div>
              <div style={{ color: "#64748b", marginBottom: 55 }}>
                Kota Jantho, {todayStr}<br />
                Koordinator Penimbangan &amp; Logistik KPS
              </div>
              <div style={{ fontWeight: 800, color: "#0f172a", borderTop: "1px solid #cbd5e1", paddingTop: 4, width: "65%", margin: "0 auto" }}>
                ( Baihaqi / Petugas Timbang )
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
