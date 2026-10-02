/**
 * JANEGAS — CSV Export Utility
 * Converts arrays of objects to downloadable .csv files.
 */

/**
 * Escapes a cell value for safe CSV output.
 * Wraps in quotes if value contains comma, quote, or newline.
 */
function escapeCell(value) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generates and downloads a CSV file.
 * @param {Object[]} rows         - Array of data objects
 * @param {Object[]} columns      - Array of { header: string, key: string | fn(row) }
 * @param {string}   filename     - File name without extension
 */
export function downloadCSV(rows, columns, filename = "laporan") {
  if (!rows || rows.length === 0) return;

  // Header row
  const headerRow = columns.map((c) => escapeCell(c.header)).join(",");

  // Data rows
  const dataRows = rows.map((row) =>
    columns
      .map((c) => {
        const val = typeof c.key === "function" ? c.key(row) : row[c.key];
        return escapeCell(val);
      })
      .join(",")
  );

  const csvContent = [headerRow, ...dataRows].join("\r\n");

  // BOM for Excel UTF-8 compatibility
  const bom = "\uFEFF";
  const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;

  // Timestamp suffix: YYYYMMDD
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  link.download = `${filename}_${today}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/* ─────────────────────────────────────────────────────────────────
   Pre-built column schemas for each JANEGAS module
───────────────────────────────────────────────────────────────── */

export const MANURE_COLUMNS = (supplierMap) => [
  { header: "Tanggal Pasokan",       key: "supply_date" },
  { header: "Peternak Mitra",        key: (r) => supplierMap[r.supplier_id] || `Peternak #${r.supplier_id || "-"}` },
  { header: "Jenis Ternak",          key: (r) => ({ sapi: "Sapi", kambing: "Kambing", campuran: "Campuran" }[r.livestock_type] || r.livestock_type) },
  { header: "Volume (kg)",           key: "volume_kg" },
  { header: "Kadar Air (%)",         key: (r) => r.moisture_content ?? "" },
  { header: "Catatan",               key: (r) => r.notes || "" },
];

export const BIOGAS_COLUMNS = [
  { header: "Tanggal Produksi",      key: "production_date" },
  { header: "Input Kotoran (kg)",    key: "input_volume_kg" },
  { header: "Volume Biogas (m³)",    key: "biogas_volume_m3" },
  { header: "Status Digester",       key: (r) => ({ optimal: "Optimal", normal: "Normal", perawatan: "Perawatan", gangguan: "Gangguan" }[r.digester_status] || r.digester_status) },
  { header: "Tekanan Gas (bar)",     key: (r) => r.gas_pressure_bar ?? "" },
  { header: "Tingkat pH",            key: (r) => r.ph_level ?? "" },
  { header: "Rumah Tangga Terlayani",key: (r) => r.households_served ?? "" },
  { header: "Catatan",               key: (r) => r.notes || "" },
];

export const FERTILIZER_COLUMNS = (recipientMap) => [
  { header: "Tanggal Distribusi",    key: "distribution_date" },
  { header: "Penerima (Kelompok Tani)", key: (r) => recipientMap[r.recipient_id] || `ID #${r.recipient_id || "-"}` },
  { header: "Jenis Pupuk",           key: (r) => ({ cair: "Bio-Slurry Cair", padat: "Bio-Slurry Padat" }[r.fertilizer_type] || r.fertilizer_type) },
  { header: "Jumlah",               key: "quantity" },
  { header: "Satuan",               key: "unit" },
  { header: "Catatan",               key: (r) => r.notes || "" },
];

export const MEMBER_COLUMNS = [
  { header: "Nama Anggota / Kelompok", key: "name" },
  { header: "Peran Komunitas",        key: (r) => ({ peternak: "Peternak Mitra", kelompok_tani: "Kelompok Tani" }[r.member_type] || r.member_type) },
  { header: "Gampong / Desa",         key: (r) => r.village || "" },
  { header: "Alamat",                 key: (r) => r.address || "" },
  { header: "No. HP / WA",            key: (r) => r.phone || "" },
  { header: "Kapasitas Ternak / Lahan", key: (r) => r.capacity_info || "" },
  { header: "Status",                 key: (r) => r.is_active ? "Aktif" : "Non-Aktif" },
];

export const MAINTENANCE_COLUMNS = [
  { header: "Tanggal",               key: "log_date" },
  { header: "Jenis Kegiatan",        key: (r) => ({ routine_maintenance: "Pemeliharaan Rutin", repair: "Perbaikan Komponen", inspection: "Inspeksi Teknis", training: "Pelatihan Warga" }[r.log_type] || r.log_type) },
  { header: "Deskripsi Kegiatan",    key: "description" },
  { header: "Status",                key: (r) => ({ resolved: "Selesai", ongoing: "Sedang Dikerjakan", pending: "Menunggu Jadwal" }[r.status] || r.status) },
  { header: "Teknisi / PIC",         key: (r) => r.technician || "" },
  { header: "Biaya (Rp)",            key: (r) => r.cost_idr ?? 0 },
];
