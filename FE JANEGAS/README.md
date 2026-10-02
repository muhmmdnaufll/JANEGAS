# JANEGAS Frontend Dashboard (Web Client)
> **Jantho Renewable Gas (JANEGAS) Web Application**  
> Inisiatif Transisi Energi Berbasis Komunitas Melalui Pengolahan Limbah Ternak Menjadi Biogas & Bio-Slurry  
> *Bali Renewable Energy Young Innovators (BREYI) 2026* — Kota Jantho, Aceh Besar

---

## 🌿 Gambaran Antarmuka

Aplikasi frontend ini merupakan dashboard pemantauan terpadu untuk sistem **JANEGAS (Jantho Renewable Gas)**. Dashboard ini memvisualisasikan seluruh siklus rantai pasok energi bersih komunitas di Jantho:
1. **Pusat Optimasi Bio-Energi & Dashboard**: Neraca massa fermentasi anaerobik, proyeksi 7 hari, substitusi tabung LPG 3kg, dan reduksi emisi CO₂e.
2. **Pasokan Limbah Ternak**: Pencatatan setoran kotoran sapi & kambing dari peternak mitra, filter rentang tanggal, dan ekspor CSV.
3. **Produksi Biogas Komunal & EWS**: Pemantauan volume gas metana (m³), Early Warning System (EWS) untuk kestabilan pH slurry & tekanan manometer pipa, filter rentang tanggal, dan ekspor CSV.
4. **Distribusi Bio-Slurry**: Penyaluran pupuk organik cair (POC) dan padat (kompos) ke kelompok tani binaan Jantho, filter tanggal, dan ekspor CSV.
5. **Anggota Komunitas**: Direktori terpadu mitra peternak dan kelompok tani Jantho beserta ekspor data CSV.
6. **Log Pemeliharaan**: Jadwal dan riwayat perawatan rutin serta perbaikan instalasi biodigester, filter rentang tanggal, dan ekspor CSV.

---

## 🛠️ Tumpukan Teknologi (Tech Stack)

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Visualisasi Data**: [Recharts](https://recharts.org/) (Grafik Area Tren Biogas & Pasokan Limbah)
- **Ikonografi**: [Lucide React](https://lucide.dev/)
- **Desain & Gaya**: Vanilla CSS dengan tema natural (*Forest Green, Earth Brown, Eco Teal*)
- **HTTP Client**: [Axios](https://axios-http.com/)

---

## 🚀 Cara Menjalankan Frontend

### Prasyarat
- Node.js (v18+ atau v20+)
- Backend JANEGAS aktif di `http://127.0.0.1:8000`

### Menjalankan Dev Server
```bash
# 1. Masuk ke direktori frontend
cd "FE JANEGAS"

# 2. Instal dependensi (jika baru pertama kali)
npm install

# 3. Jalankan server pengembangan Vite
npm run dev
```
Dashboard akan tersedia di: **`http://127.0.0.1:5174`**

---

## 🔑 Konfigurasi Environment (`.env`)

Konfigurasi koneksi API backend diatur melalui variabel lingkungan Vite:

```env
# URL API Backend FastAPI
VITE_API_URL=http://127.0.0.1:8000/api
```

---

## 👥 Akun Demo & Hak Akses Pengguna

| Peran | Username | Kata Sandi | Deskripsi Akses |
|---|---|---|---|
| **Admin Pengelola** | `admin` | `admin123` | Akses penuh ke semua modul monitoring dan manajemen. |
| **Operator KPS** | `operator_kps` | `kps123` | Akses operasional harian biodigester, log pemeliharaan, dan distribusi. |
| **Peternak Mitra** | `peternak_baihaqi` | `peternak123` | Form setor dan pantau riwayat pasokan kotoran ternak. |
| **Kelompok Tani** | `tani_mekar` | `tani123` | Pantau penerimaan pupuk bio-slurry cair & padat. |

---

*Dikembangkan untuk Inisiatif BREYI 2026 (Bali Renewable Energy Young Innovators)*