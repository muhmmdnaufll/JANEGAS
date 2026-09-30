import { driver } from "driver.js";
import "driver.js/dist/driver.css";

/**
 * Panduan Penggunaan Interaktif JANEGAS menggunakan Driver.js
 * Disesuaikan khusus untuk sistem monitoring biogas komunitas Jantho Renewable Gas (BREYI 2026).
 */
export const startJANEGASTour = (role = "admin") => {
  const steps = [];

  // Step 1: Sidebar Brand
  if (document.querySelector(".sidebar-logo")) {
    steps.push({
      element: ".sidebar-logo",
      popover: {
        title: "🌿 JANEGAS (Jantho Renewable Gas)",
        description: `
          <div style="font-size: 13px; line-height: 1.6; color: #2d3748;">
            Selamat datang di <b>Sistem Monitoring Rantai Pasok JANEGAS</b>! Platform ini menghubungkan peternak mitra, pengelola biodigester (KPS), rumah tangga penerima biogas, dan kelompok tani di Kota Jantho, Aceh Besar.
          </div>
        `,
        side: "right",
        align: "start"
      }
    });
  }

  // Step 2: Navigasi Modul Rantai Pasok
  if (document.querySelector(".sidebar-nav")) {
    steps.push({
      element: ".sidebar-nav",
      popover: {
        title: "Menu Navigasi Rantai Pasok",
        description: `
          <div style="font-size: 13px; line-height: 1.6; color: #2d3748;">
            Akses seluruh tahapan rantai energi:
            <ul style="margin: 8px 0 0 16px; padding: 0;">
              <li><b>Dashboard</b>: Ringkasan KPI dan tren performa.</li>
              <li><b>Pasokan Limbah</b>: Setoran kotoran sapi & kambing.</li>
              <li><b>Produksi Biogas</b>: Volume metana, tekanan, dan pH.</li>
              <li><b>Distribusi Pupuk</b>: Penyaluran bio-slurry cair & padat.</li>
              <li><b>Anggota Komunitas</b>: Direktori peternak & kelompok tani.</li>
              <li><b>Log Pemeliharaan</b>: Jadwal perawatan instalasi digester.</li>
            </ul>
          </div>
        `,
        side: "right",
        align: "center"
      }
    });
  }

  // Step 3: Profil & Hak Akses
  if (document.querySelector(".sidebar-footer")) {
    steps.push({
      element: ".sidebar-footer",
      popover: {
        title: "Profil Pengguna & Peran Akses",
        description: `
          <div style="font-size: 13px; line-height: 1.6; color: #2d3748;">
            Menampilkan username dan peran aktif Anda (<b>${role.toUpperCase()}</b>). Hak akses form dan tombol input disesuaikan otomatis dengan peran pengguna (Admin, Operator KPS, Peternak Mitra, atau Kelompok Tani).
          </div>
        `,
        side: "right",
        align: "end"
      }
    });
  }

  // Step 4: KPI Grid (Jika di Dashboard)
  if (document.querySelector("#dashboard-kpi-grid")) {
    steps.push({
      element: "#dashboard-kpi-grid",
      popover: {
        title: "Kartu KPI Real-Time",
        description: `
          <div style="font-size: 13px; line-height: 1.6; color: #2d3748;">
            Enam indikator utama kinerja rantai pasok:
            <ul style="margin: 8px 0 0 16px; padding: 0;">
              <li><b>Total Limbah</b>: Volume kotoran yang berhasil dihimpun.</li>
              <li><b>Biogas Dihasilkan</b>: Total volume gas metana (m³).</li>
              <li><b>Bio-Slurry</b>: Pupuk organik terdistribusi (L/kg).</li>
              <li><b>Penerima Manfaat</b>: Peternak, tani, dan KK terlayani pipa gas.</li>
            </ul>
          </div>
        `,
        side: "bottom",
        align: "center"
      }
    });
  }

  // Step 5: Dampak Lingkungan & LPG (Jika di Dashboard)
  if (document.querySelector("#dashboard-impact-card")) {
    steps.push({
      element: "#dashboard-impact-card",
      popover: {
        title: "Kalkulator Dampak Transisi Energi",
        description: `
          <div style="font-size: 13px; line-height: 1.6; color: #2d3748;">
            Estimasi otomatis dampak ekologis dan ekonomi:
            <ul style="margin: 8px 0 0 16px; padding: 0;">
              <li><b>Substitusi LPG</b>: Jumlah tabung LPG 3kg yang berhasil dihemat oleh masyarakat Jantho.</li>
              <li><b>Reduksi Emisi</b>: Pengurangan emisi gas metana bebas & CO₂e ke atmosfer.</li>
            </ul>
          </div>
        `,
        side: "bottom",
        align: "center"
      }
    });
  }

  // Step 6: Tren Grafik Produksi (Jika di Dashboard)
  if (document.querySelector("#dashboard-trend-chart")) {
    steps.push({
      element: "#dashboard-trend-chart",
      popover: {
        title: "Grafik Tren Produksi Biogas vs Pasokan",
        description: `
          <div style="font-size: 13px; line-height: 1.6; color: #2d3748;">
            Grafik interaktif 30 hari yang memperlihatkan korelasi antara input volume slurry harian (kg) dengan output gas metana (m³) yang dihasilkan instalasi fixed-dome.
          </div>
        `,
        side: "top",
        align: "center"
      }
    });
  }

  // Step 7: Penyaluran ke KK (Jika di Dashboard)
  if (document.querySelector("#dashboard-distribution-chart")) {
    steps.push({
      element: "#dashboard-distribution-chart",
      popover: {
        title: "Distribusi Gas ke Rumah Tangga",
        description: `
          <div style="font-size: 13px; line-height: 1.6; color: #2d3748;">
            Monitoring harian jumlah Kepala Keluarga (KK) yang aktif terhubung ke jaringan pipa biogas komunal Jantho.
          </div>
        `,
        side: "top",
        align: "center"
      }
    });
  }

  // Step 8: Log Aktivitas Rantai Pasok (Jika di Dashboard)
  if (document.querySelector("#dashboard-recent-activity")) {
    steps.push({
      element: "#dashboard-recent-activity",
      popover: {
        title: "Log Aktivitas Terkini",
        description: `
          <div style="font-size: 13px; line-height: 1.6; color: #2d3748;">
            Feed kronologis yang merekam setiap transaksi: setoran kotoran peternak baru, produksi harian biodigester, dan penyaluran pupuk bio-slurry.
          </div>
        `,
        side: "top",
        align: "center"
      }
    });
  }

  // Step 9: Tombol Aksi Tambah Data (Jika di halaman input tabel)
  const addBtn = document.querySelector("#btn-add-supply, #btn-add-biogas, #btn-add-fertilizer, #btn-add-member, #btn-add-maintenance");
  if (addBtn) {
    steps.push({
      element: addBtn,
      popover: {
        title: "Input Data Baru",
        description: `
          <div style="font-size: 13px; line-height: 1.6; color: #2d3748;">
            Klik tombol ini untuk membuka modal form dan mencatat data transaksi baru ke database sistem.
          </div>
        `,
        side: "bottom",
        align: "end"
      }
    });
  }

  // Inisialisasi Driver.js
  const driverObj = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    overlayColor: "rgba(13, 31, 15, 0.72)",
    stagePadding: 6,
    stageRadius: 10,
    nextBtnText: "Lanjut →",
    prevBtnText: "← Kembali",
    doneBtnText: "Selesai ✓",
    progressText: "{{current}} dari {{total}}",
    steps
  });

  driverObj.drive();
};
