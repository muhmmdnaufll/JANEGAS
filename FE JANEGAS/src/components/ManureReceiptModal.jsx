import React from "react";
import { Printer, X, FileText } from "lucide-react";

export default function ManureReceiptModal({ item, member, onClose }) {
  if (!item) return null;

  const handlePrint = () => {
    window.print();
  };

  const receiptNo = `JNG/STR/${(item.supply_date || "").replace(/-/g, "")}/${String(item.id).padStart(4, "0")}`;
  const farmerName = member?.name || `Peternak #${item.supplier_id || "-"}`;
  const village = member?.village || "Kota Jantho, Aceh Besar";
  const phone = member?.phone || "-";
  const livestock = item.livestock_type === "kambing" ? "Kotoran Kambing" : item.livestock_type === "campuran" ? "Kotoran Campuran" : "Kotoran Sapi";
  const yieldFactor = item.livestock_type === "kambing" ? 0.055 : 0.045;
  const estimatedBiogas = (item.volume_kg * yieldFactor).toFixed(2);
  const estimatedLpgEquivalent = (item.volume_kg * yieldFactor * 0.46 / 3.0).toFixed(1);
  const estimatedLiquidSlurry = (item.volume_kg * 0.88 * 0.85).toFixed(0);
  const estimatedSolidSlurry = (item.volume_kg * 0.88 * 0.15).toFixed(0);

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
          maxWidth: 680,
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
            <FileText size={18} color="#72c478" />
            <span>Pratinjau Bukti Setor Fisik (Siap Cetak / PDF)</span>
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

        {/* Printable Receipt Body */}
        <div style={{ padding: "30px 36px" }}>
          {/* Official Letterhead (KOP SURAT) */}
          <div style={{ textAlign: "center", borderBottom: "3px double #1e293b", paddingBottom: 14, marginBottom: 18 }}>
            <div style={{ fontSize: 10, letterSpacing: "2px", fontWeight: 800, color: "#166534", textTransform: "uppercase" }}>
              Inisiatif Transisi Energi Bersih Berbasis Komunitas
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", marginTop: 2, letterSpacing: "-0.3px" }}>
              KELOMPOK PENGELOLA SISTEM (KPS) BIOGAS KOMUNAL
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>
              UNIT INSTALASI PENGOLAHAN LIMBAH &amp; ENERGI BERSIH JANEGAS
            </div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>
              Gampong Weu, Kemukiman Jantho, Kec. Kota Jantho, Kabupaten Aceh Besar, Aceh 23911
            </div>
          </div>

          {/* Receipt Title & Meta */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Bukti Penerimaan Limbah Ternak
              </div>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                Slip Timbang Resmi Masuk Biodigester
              </div>
            </div>
            <div style={{ textAlign: "right", background: "#f8fafc", padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 11, color: "#64748b" }}>No. Register:</div>
              <div style={{ fontSize: 13, fontWeight: 800, fontFamily: "monospace", color: "#0f172a" }}>
                {receiptNo}
              </div>
            </div>
          </div>

          {/* Data Grid Section */}
          <div style={{ border: "1px solid #cbd5e1", borderRadius: 8, overflow: "hidden", marginBottom: 18 }}>
            <div style={{ background: "#f1f5f9", padding: "8px 12px", fontSize: 11, fontWeight: 800, color: "#334155", letterSpacing: "0.5px", textTransform: "uppercase" }}>
              A. Identitas Mitra Peternak
            </div>
            <div style={{ padding: "10px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 12 }}>
              <div>
                <span style={{ color: "#64748b" }}>Nama Peternak:</span>
                <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 13 }}>{farmerName}</div>
              </div>
              <div>
                <span style={{ color: "#64748b" }}>Desa / Domisili:</span>
                <div style={{ fontWeight: 600, color: "#0f172a" }}>{village}</div>
              </div>
              <div>
                <span style={{ color: "#64748b" }}>Kontak Person:</span>
                <div style={{ fontWeight: 600, color: "#0f172a" }}>{phone}</div>
              </div>
              <div>
                <span style={{ color: "#64748b" }}>Kepemilikan Ternak:</span>
                <div style={{ fontWeight: 600, color: "#0f172a" }}>
                  {member?.livestock_count ? `${member.livestock_count} ekor (${member.livestock_type})` : "-"}
                </div>
              </div>
            </div>

            <div style={{ background: "#f1f5f9", padding: "8px 12px", fontSize: 11, fontWeight: 800, color: "#334155", letterSpacing: "0.5px", textTransform: "uppercase", borderTop: "1px solid #cbd5e1" }}>
              B. Hasil Penimbangan &amp; Parameter Mutu
            </div>
            <div style={{ padding: "10px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 12 }}>
              <div>
                <span style={{ color: "#64748b" }}>Tanggal &amp; Waktu Timbang:</span>
                <div style={{ fontWeight: 700, color: "#0f172a" }}>{item.supply_date}</div>
              </div>
              <div>
                <span style={{ color: "#64748b" }}>Kategori Substrat:</span>
                <div style={{ fontWeight: 700, color: "#166534" }}>{livestock}</div>
              </div>
              <div style={{ background: "rgba(22, 163, 74, 0.08)", padding: "8px 12px", borderRadius: 8, gridColumn: "1 / -1", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, color: "#166534", fontWeight: 700, textTransform: "uppercase" }}>Berat Bersih (Netto Timbang):</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#15803d", fontFamily: "monospace" }}>
                    {item.volume_kg.toLocaleString("id-ID")} <span style={{ fontSize: 14 }}>kg</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "#64748b" }}>Estimasi Kadar Air:</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
                    {item.moisture_content ? `${item.moisture_content}%` : "75% (Normal)"}
                  </div>
                </div>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <span style={{ color: "#64748b" }}>Catatan Fisik Substrat:</span>
                <div style={{ fontStyle: item.notes ? "normal" : "italic", color: "#334155" }}>
                  {item.notes || "Kotoran segar tanpa kontaminan tanah/batu, siap fermentasi."}
                </div>
              </div>
            </div>

            <div style={{ background: "#f1f5f9", padding: "8px 12px", fontSize: 11, fontWeight: 800, color: "#334155", letterSpacing: "0.5px", textTransform: "uppercase", borderTop: "1px solid #cbd5e1" }}>
              C. Konversi Manfaat &amp; Alokasi Bio-Slurry (Estimasi Neraca)
            </div>
            <div style={{ padding: "10px 14px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, fontSize: 11 }}>
              <div style={{ background: "#f8fafc", padding: "8px 10px", borderRadius: 6, border: "1px solid #e2e8f0" }}>
                <div style={{ color: "#64748b" }}>Potensi Biogas:</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#0ea5a0", marginTop: 2 }}>
                  ~{estimatedBiogas} m³
                </div>
              </div>
              <div style={{ background: "#f8fafc", padding: "8px 10px", borderRadius: 6, border: "1px solid #e2e8f0" }}>
                <div style={{ color: "#64748b" }}>Setara LPG Bersubsidi:</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#16a34a", marginTop: 2 }}>
                  ~{estimatedLpgEquivalent} tabung 3kg
                </div>
              </div>
              <div style={{ background: "#f8fafc", padding: "8px 10px", borderRadius: 6, border: "1px solid #e2e8f0" }}>
                <div style={{ color: "#64748b" }}>Hak Bio-Slurry:</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#8b5e3c", marginTop: 2 }}>
                  ~{estimatedLiquidSlurry} L POC / {estimatedSolidSlurry} kg Padat
                </div>
              </div>
            </div>
          </div>

          {/* Signature Block */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 24, textAlign: "center", fontSize: 12 }}>
            <div>
              <div style={{ color: "#64748b", marginBottom: 50 }}>
                Peternak Mitra Penyetor,
              </div>
              <div style={{ fontWeight: 800, color: "#0f172a", borderTop: "1px solid #cbd5e1", paddingTop: 4, width: "70%", margin: "0 auto" }}>
                ( {farmerName} )
              </div>
            </div>

            <div>
              <div style={{ color: "#64748b", marginBottom: 50 }}>
                Kota Jantho, {item.supply_date}<br />
                Petugas Operator KPS Jantho,
              </div>
              <div style={{ fontWeight: 800, color: "#0f172a", borderTop: "1px solid #cbd5e1", paddingTop: 4, width: "70%", margin: "0 auto" }}>
                ( Operator KPS Jantho )
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div style={{ borderTop: "1px dashed #cbd5e1", marginTop: 22, paddingTop: 10, fontSize: 10, color: "#94a3b8", textAlign: "center" }}>
            * Lembar slip timbang ini merupakan bukti sah transaksi bahan baku biodigester komunal Jantho (Sistem JANEGAS).
          </div>
        </div>
      </div>
    </div>
  );
}
