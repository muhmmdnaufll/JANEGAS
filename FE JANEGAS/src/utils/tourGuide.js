import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

/**
 * Enhanced, deeply-educational interactive walkthrough powered by driver.js.
 * Personalized for real founders (Muhammad Naufal CTOO, Bintang Najwa CEO, Siti Khairani CFO)
 * as well as Demo Users and B2B Wholesale Partners.
 */
export const startSystemTour = (role = 'ceo', displayName = '') => {
  const normalizedRole = (role || 'ceo').toLowerCase();
  const name = displayName || 'Rekan Tim Elpis';

  let steps = [];

  if (normalizedRole === 'partner') {
    steps = [
      {
        element: '#partner-header',
        popover: {
          title: '🛍️ Selamat Datang di Portal Mitra B2B Elpis',
          description: `
            <div style="font-size:12px; line-height:1.6; color:#334155;">
              <p style="margin-bottom:8px;">
                Halo <strong>${name}</strong>! Ini adalah portal mandiri khusus bagi swalayan, toko oleh-oleh khas Aceh, dan distributor resmi.
              </p>
              <p style="margin-bottom:6px;">
                Di sini Anda dapat memesan <strong>Basreng Ikan Depik 150g</strong> (Sumber Protein Rendah Minyak, bersertifikasi Halal resmi) secara grosir langsung ke antrean produksi tim Elpis di Takengon.
              </p>
            </div>
          `,
          position: 'bottom'
        }
      },
      {
        element: '#partner-catalog-section',
        popover: {
          title: '📦 Katalog Varian & Harga Grosir Otomatis',
          description: `
            <div style="font-size:12px; line-height:1.6; color:#334155;">
              <p style="margin-bottom:8px;">
                Pilih varian rasa yang diminati konsumen Anda: <strong>Original Gurih</strong>, <strong>Pedas Daun Jeruk</strong>, atau <strong>Balado Pedas</strong>.
              </p>
              <div style="background:#f8fafc; padding:8px 10px; border-radius:8px; border:1px solid #e2e8f0; font-size:11px; color:#475569;">
                💡 <strong>Skema Grosir:</strong> Diskon kuantitas kemitraan otomatis terpotong saat Anda menambah jumlah order.
              </div>
            </div>
          `,
          position: 'top'
        }
      },
      {
        element: '#partner-order-form',
        popover: {
          title: '📝 Formulir Pemesanan Mandiri 1-Klik',
          description: `
            <div style="font-size:12px; line-height:1.6; color:#334155;">
              <p style="margin-bottom:8px;">
                Tentukan jumlah karton/bungkus yang Anda perlukan. Masukkan catatan pengiriman jika ada permintaan tanggal drop-in khusus ke toko Anda.
              </p>
              <p style="color:#2E4420; font-weight:600;">
                👉 Klik "Kirim Pesanan Grosir" dan data akan seketika masuk ke sistem approval CEO Elpis!
              </p>
            </div>
          `,
          position: 'top'
        }
      },
      {
        element: '#partner-history-section',
        popover: {
          title: '🚚 Lacak Status Pesanan & Faktur Anda',
          description: `
            <div style="font-size:12px; line-height:1.6; color:#334155;">
              <p style="margin-bottom:8px;">
                Pantau proses pesanan Anda secara real-time:
              </p>
              <ul style="margin-left:14px; margin-bottom:8px; list-style-type:disc;">
                <li><strong style="color:#d97706;">Menunggu Konfirmasi:</strong> Sedang ditinjau manajemen.</li>
                <li><strong style="color:#2563eb;">Sedang Diproses:</strong> Produk sedang disiapkan di gudang Takengon.</li>
                <li><strong style="color:#16a34a;">Selesai:</strong> Barang terkirim dan faktur resmi diterbitkan.</li>
              </ul>
            </div>
          `,
          position: 'top'
        }
      }
    ];
  } else if (normalizedRole === 'ctoo' || normalizedRole === 'ops_tech' || normalizedRole === 'staff') {
    // Muhammad Naufal / CTOO / Operational & Tech
    steps = [
      {
        element: '#app-header-brand',
        popover: {
          title: '🐟 Smart Supply-Demand: Fondasi Agritech Elpis',
          description: `
            <div style="font-size:12px; line-height:1.6; color:#334155;">
              <p style="margin-bottom:8px;">
                Selamat datang, <strong>${name}</strong> (CTOO / Tech & Operations)!
              </p>
              <p style="margin-bottom:6px;">
                Platform ini menyelesaikan tantangan fluktuasi penangkapan Ikan Depik di Danau Laut Tawar dengan menghubungkan pasokan nelayan langsung ke batch penggorengan basreng 150g dan pesanan mitra.
              </p>
            </div>
          `,
          position: 'bottom'
        }
      },
      {
        element: '#app-user-profile',
        popover: {
          title: '👤 Profil & Hak Akses Operasional Anda',
          description: `
            <div style="font-size:12px; line-height:1.6; color:#334155;">
              <p style="margin-bottom:8px;">
                Sebagai <strong>CTOO</strong>, Anda memegang kendali penuh atas:
              </p>
              <ul style="margin-left:14px; list-style-type:disc; margin-bottom:6px;">
                <li>Pencatatan pasokan & timbangan nelayan Danau Laut Tawar.</li>
                <li>Eksekusi <strong>Batch Produksi</strong> (konversi kg ikan jadi kemasan).</li>
                <li>Penerbitan label QR Traceability kemasan 150g.</li>
              </ul>
            </div>
          `,
          position: 'bottom'
        }
      },
      {
        element: '#kpi-cards-grid',
        popover: {
          title: '📦 Monitor Kritis: Stok Ikan Depik & Kemasan',
          description: `
            <div style="font-size:12px; line-height:1.6; color:#334155;">
              <p style="margin-bottom:8px;">
                Perhatikan kartu ke-4: <strong>"Stok Cadangan Depik"</strong> (dalam satuan kg) dan kartu ke-2 <strong>"Volume Terjual"</strong> (dalam satuan pcs).
              </p>
              <div style="background:#fef2f2; padding:8px 10px; border-radius:8px; border:1px solid #fecaca; font-size:11px; color:#991b1b;">
                ⚠️ <strong>Peringatan Otomatis:</strong> Jika stok ikan depik di gudang Takengon di bawah 10 kg, indikator akan berubah oranye/merah.
              </div>
            </div>
          `,
          position: 'bottom'
        }
      },
      {
        element: '#action-center-hub',
        popover: {
          title: '🚨 Action Center: Pusat Tindakan Hari Ini',
          description: `
            <div style="font-size:12px; line-height:1.6; color:#334155;">
              <p style="margin-bottom:8px;">
                Panel kecerdasan operasional yang mendeteksi kendala secara dini:
              </p>
              <p style="margin-bottom:6px;">
                Jika ada pesanan mitra dalam jumlah besar sementara stok kemasan atau bahan baku ikan depik menipis, peringatan mendesak akan muncul di sini agar Anda bisa menjadwalkan batch penggorengan segera.
              </p>
            </div>
          `,
          position: 'bottom'
        }
      },
      {
        element: '#quick-action-buttons',
        popover: {
          title: '⚡ Input Cepat 1-Klik: Pasok Ikan Nelayan',
          description: `
            <div style="font-size:12px; line-height:1.6; color:#334155;">
              <p style="margin-bottom:8px;">
                Saat perahu nelayan merapat dan membawa hasil tangkapan depik Danau Laut Tawar, Anda tidak perlu repot membuka banyak sub-menu!
              </p>
              <p style="color:#2E4420; font-weight:600;">
                👉 Cukup klik <strong>"Pasok Ikan Nelayan"</strong>, masukkan berat kg dan harga beli, stok gudang otomatis bertambah seketika!
              </p>
            </div>
          `,
          position: 'bottom'
        }
      },
      {
        element: '#ai-recommendation-spotlight',
        popover: {
          title: '🧠 AI Production & Raw Material Forecaster',
          description: `
            <div style="font-size:12px; line-height:1.6; color:#334155;">
              <p style="margin-bottom:8px;">
                Model AI membaca tren penjualan CFD dan riwayat pesanan grosir untuk merekomendasikan target batch produksi minggu ini.
              </p>
              <p style="margin-bottom:6px;">
                AI juga menghitung persis <strong>berapa kilogram ikan depik segar/kering yang diperlukan</strong> dengan memperhitungkan faktor penyusutan penggorengan (rasio 1.8 kg per batch).
              </p>
            </div>
          `,
          position: 'top'
        }
      },
      {
        element: '#tab-navigation-bar',
        popover: {
          title: '🗺️ Navigasi Modul Operasional Kunci',
          description: `
            <div style="font-size:12px; line-height:1.6; color:#334155;">
              <p style="margin-bottom:8px;">
                Tiga modul kerja utama Anda:
              </p>
              <ul style="margin-left:14px; list-style-type:disc; margin-bottom:6px;">
                <li><strong>Rantai Pasok:</strong> Kelola data nelayan Danau Laut Tawar & riwayat timbangan.</li>
                <li><strong>QR Kemasan:</strong> Generate & cetak QR Code traceability kemasan fisik 150g (Halal ID112100009882540924).</li>
                <li><strong>Kelola Data:</strong> Jalankan formulir <strong>Batch Produksi</strong> untuk mengonversi kg ikan jadi kemasan basreng.</li>
              </ul>
            </div>
          `,
          position: 'bottom'
        }
      },
      {
        element: '#ai-copilot-trigger',
        popover: {
          title: '💬 Elpis AI Operations Advisor',
          description: `
            <div style="font-size:12px; line-height:1.6; color:#334155;">
              <p style="margin-bottom:8px;">
                Konsultan operasional cerdas Anda tersedia 24/7!
              </p>
              <p style="margin-bottom:6px;">
                Klik tombol bulat oranye ini kapan saja untuk bertanya: <em>"Berapa kg ikan yang kita butuhkan untuk pesanan 150 pcs basreng pedas?"</em> atau <em>"Bagaimana cadangan stok kita menghadapi event akhir pekan?"</em>
              </p>
            </div>
          `,
          position: 'left'
        }
      }
    ];
  } else if (normalizedRole === 'cfo' || normalizedRole === 'finance') {
    // Siti Khairani / CFO / Finance
    steps = [
      {
        element: '#app-header-brand',
        popover: {
          title: '💰 Selamat Datang di Pusat Keuangan Elpis',
          description: `
            <div style="font-size:12px; line-height:1.6; color:#334155;">
              <p style="margin-bottom:8px;">
                Halo <strong>${name}</strong> (CFO / Finance & Accounting)!
              </p>
              <p style="margin-bottom:6px;">
                Sistem ini memberi Anda transparansi penuh atas arus kas, standar HPP, laba kotor, beban operasional, dan neraca aset startup secara real-time.
              </p>
            </div>
          `,
          position: 'bottom'
        }
      },
      {
        element: '#app-user-profile',
        popover: {
          title: '👤 Hak Akses Eksklusif Keuangan',
          description: `
            <div style="font-size:12px; line-height:1.6; color:#334155;">
              <p style="margin-bottom:8px;">
                Sebagai <strong>CFO</strong>, Anda memiliki wewenang khusus untuk:
              </p>
              <ul style="margin-left:14px; list-style-type:disc; margin-bottom:6px;">
                <li>Mengakses seluruh Laporan Laba Rugi, Neraca, dan Arus Kas.</li>
                <li>Menyetel parameter matematis <strong>HPP (Harga Pokok Penjualan)</strong> dan asumsi operasional.</li>
                <li>Menghapus atau mengoreksi data keuangan dan catatan penjualan terdahulu.</li>
              </ul>
            </div>
          `,
          position: 'bottom'
        }
      },
      {
        element: '#kpi-cards-grid',
        popover: {
          title: '📊 Metrik Likuiditas & Pendapatan Startup',
          description: `
            <div style="font-size:12px; line-height:1.6; color:#334155;">
              <p style="margin-bottom:8px;">
                Kartu ke-1 menunjukkan <strong>Total Omzet</strong> gabungan (ritel CFD + pesanan grosir B2B), sedangkan kartu ke-3 menunjukkan <strong>Pesanan Menunggu</strong> yang merepresentasikan potensi piutang masuk.
              </p>
            </div>
          `,
          position: 'bottom'
        }
      },
      {
        element: '#action-center-hub',
        popover: {
          title: '🧾 Pengawasan Piutang & Status Pembayaran',
          description: `
            <div style="font-size:12px; line-height:1.6; color:#334155;">
              <p style="margin-bottom:8px;">
                Identifikasi pesanan mitra yang belum diverifikasi pembayarannya. Pastikan arus kas masuk terjaga sebelum barang dikirim keluar dari gudang.
              </p>
            </div>
          `,
          position: 'bottom'
        }
      },
      {
        element: '#tab-navigation-bar',
        popover: {
          title: '📑 Modul Kunci: Laporan Finansial & Standar HPP',
          description: `
            <div style="font-size:12px; line-height:1.6; color:#334155;">
              <p style="margin-bottom:8px;">
                Klik tab <strong>Laporan Finansial</strong> untuk melihat:
              </p>
              <ul style="margin-left:14px; list-style-type:disc; margin-bottom:8px;">
                <li>Laba Rugi otomatis (Pendapatan, HPP 65.2%, Laba Kotor, Laba Bersih 34.8%).</li>
                <li>Neraca Keuangan startup (Aset Lancar, Kas, Mesin, Modal Disetor).</li>
              </ul>
              <div style="background:#ecfdf5; padding:8px 10px; border-radius:8px; border:1px solid #a7f3d0; font-size:11px; color:#065f46;">
                ⚙️ <strong>Fitur Spesial CFO:</strong> Gunakan tombol <em>"⚙️ Sesuaikan Asumsi Finansial & HPP"</em> untuk mengubah rasio HPP saat harga beli ikan nelayan atau minyak berubah!
              </div>
            </div>
          `,
          position: 'bottom'
        }
      },
      {
        element: '#ai-recommendation-spotlight',
        popover: {
          title: '📈 Sinkronisasi Proyeksi Finansial AI',
          description: `
            <div style="font-size:12px; line-height:1.6; color:#334155;">
              <p style="margin-bottom:8px;">
                Proyeksi omzet dan margin laba bersih dari rekomendasi AI di sini langsung terkoneksi dengan rasio HPP yang Anda tentukan di tab Finansial.
              </p>
            </div>
          `,
          position: 'top'
        }
      },
      {
        element: '#ai-copilot-trigger',
        popover: {
          title: '💬 Elpis AI Financial Analyst',
          description: `
            <div style="font-size:12px; line-height:1.6; color:#334155;">
              <p style="margin-bottom:8px;">
                Konsultasikan simulasi keuangan dengan asisten AI:
              </p>
              <p style="font-style:italic; color:#475569;">
                "Bagaimana dampak kenaikan harga kemasan terhadap laba bersih kita?" atau "Berapa rasio margin kotor yang optimal bulan ini?"
              </p>
            </div>
          `,
          position: 'left'
        }
      }
    ];
  } else {
    // Bintang Najwa / CEO / Executive / Admin / Demo
    steps = [
      {
        element: '#app-header-brand',
        popover: {
          title: '🌟 Selamat Datang di Platform Eksekutif Elpis',
          description: `
            <div style="font-size:12px; line-height:1.6; color:#334155;">
              <p style="margin-bottom:8px;">
                Halo <strong>${name}</strong> (CEO / Pemimpin Bisnis Elpis)!
              </p>
              <p style="margin-bottom:6px;">
                Sistem ini memberi Anda visibilitas 360 derajat atas seluruh rantai nilai startup Elpis: dari tangkapan nelayan Danau Laut Tawar hingga omzet penjualan Basreng Ikan Depik 150g di ritel dan mitra swalayan.
              </p>
            </div>
          `,
          position: 'bottom'
        }
      },
      {
        element: '#app-user-profile',
        popover: {
          title: '👑 Peran & Wewenang Utama CEO',
          description: `
            <div style="font-size:12px; line-height:1.6; color:#334155;">
              <p style="margin-bottom:8px;">
                Sebagai <strong>CEO</strong>, fokus utama Anda adalah:
              </p>
              <ul style="margin-left:14px; list-style-type:disc; margin-bottom:6px;">
                <li>Validasi dan persetujuan pesanan grosir B2B mitra.</li>
                <li>Menjaga pertumbuhan omzet dan kepuasan mitra toko oleh-oleh.</li>
                <li>Mengawasi kesehatan rasio operasional dan arah strategis startup.</li>
              </ul>
            </div>
          `,
          position: 'bottom'
        }
      },
      {
        element: '#kpi-cards-grid',
        popover: {
          title: '📈 4 Metrik Pertumbuhan Utama Bisnis',
          description: `
            <div style="font-size:12px; line-height:1.6; color:#334155;">
              <p style="margin-bottom:8px;">
                Ringkasan eksekutif real-time:
              </p>
              <ul style="margin-left:14px; list-style-type:disc; margin-bottom:6px;">
                <li><strong>Total Omzet:</strong> Akumulasi pendapatan kas ritel & pesanan B2B.</li>
                <li><strong>Volume Terjual:</strong> Jumlah kemasan 150g yang berhasil diserap pasar.</li>
                <li><strong>Pesanan Menunggu:</strong> Jumlah pesanan B2B yang butuh persetujuan Anda.</li>
                <li><strong>Stok Cadangan:</strong> Cadangan bahan baku ikan depik di Takengon.</li>
              </ul>
            </div>
          `,
          position: 'bottom'
        }
      },
      {
        element: '#action-center-hub',
        popover: {
          title: '🎯 Action Center: Keputusan Mendesak Hari Ini',
          description: `
            <div style="font-size:12px; line-height:1.6; color:#334155;">
              <p style="margin-bottom:8px;">
                Pusat keputusan harian Anda:
              </p>
              <p style="margin-bottom:6px;">
                Setiap pesanan baru dari swalayan atau toko oleh-oleh akan muncul di sini. Klik tombol <strong>"Setujui Pesanan"</strong> untuk mengonfirmasi pengiriman barang dari gudang!
              </p>
            </div>
          `,
          position: 'bottom'
        }
      },
      {
        element: '#quick-action-buttons',
        popover: {
          title: '⚡ Aksi Cepat: Catat Penjualan 1-Klik',
          description: `
            <div style="font-size:12px; line-height:1.6; color:#334155;">
              <p style="margin-bottom:8px;">
                Saat tim Elpis selesai berjualan langsung di ritel, CFD Banda Aceh, atau pameran UMKM:
              </p>
              <p style="color:#2E4420; font-weight:600;">
                👉 Klik tombol <strong>"Catat Penjualan"</strong> di sini untuk mencatat transaksi langsung ke omzet startup.
              </p>
            </div>
          `,
          position: 'bottom'
        }
      },
      {
        element: '#ai-recommendation-spotlight',
        popover: {
          title: '💡 Rekomendasi Alokasi Pasar AI',
          description: `
            <div style="font-size:12px; line-height:1.6; color:#334155;">
              <p style="margin-bottom:8px;">
                AI memadukan data historis dengan kalender pariwisata Aceh untuk merekomendasikan porsi varian: berapa banyak Basreng Original, Pedas Daun Jeruk, dan Balado yang ideal diproduksi.
              </p>
            </div>
          `,
          position: 'top'
        }
      },
      {
        element: '#tab-navigation-bar',
        popover: {
          title: '📋 7 Modul Kerja Terpadu Elpis',
          description: `
            <div style="font-size:12px; line-height:1.6; color:#334155;">
              <p style="margin-bottom:8px;">
                Beralih antar modul kerja dengan rapi:
              </p>
              <ul style="margin-left:14px; list-style-type:disc; margin-bottom:6px;">
                <li><strong>Pesanan B2B:</strong> Kelola pesanan mitra, sunting data pesanan lama.</li>
                <li><strong>Analisis:</strong> Tren kanal penjualan, performa varian terlaris.</li>
                <li><strong>Laporan Finansial:</strong> Pantau Laba Rugi & Neraca.</li>
                <li><strong>QR Kemasan:</strong> Lihat kode verifikasi keaslian dan Halal ID112100009882540924.</li>
              </ul>
            </div>
          `,
          position: 'bottom'
        }
      },
      {
        element: '#ai-copilot-trigger',
        popover: {
          title: '💬 Elpis AI Executive Copilot',
          description: `
            <div style="font-size:12px; line-height:1.6; color:#334155;">
              <p style="margin-bottom:8px;">
                Asisten cerdas pendiri startup Elpis!
              </p>
              <p style="margin-bottom:6px;">
                Klik tombol AI ini untuk mendiskusikan strategi: <em>"Berapa estimasi pendapatan kita jika pesanan swalayan meningkat 20%?"</em> atau <em>"Varian rasa apa yang paling menguntungkan?"</em>
              </p>
            </div>
          `,
          position: 'left'
        }
      }
    ];
  }

  // Initialize and run Driver.js
  const validSteps = steps.filter(step => document.querySelector(step.element));

  if (validSteps.length === 0) {
    console.warn('No valid tour step elements found on this view.');
    return;
  }

  const driverObj = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    overlayColor: 'rgba(15, 23, 42, 0.70)',
    nextBtnText: 'Lanjut →',
    prevBtnText: '← Kembali',
    doneBtnText: 'Selesai Panduan 🎉',
    progressText: 'Langkah {{current}} dari {{total}}',
    steps: validSteps
  });

  driverObj.drive();
};
