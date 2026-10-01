# JANEGAS (Jantho Renewable Gas) Dashboard
> **Inisiatif Energi Bersih Berbasis Komunitas Melalui Pemanfaatan Limbah Ternak**  
> Kategori: *Community-Based Energy Transition*  
> **Bali Renewable Energy Young Innovators (BREYI) 2026** — Kota Jantho, Aceh Besar

---

## 🌿 Gambaran Proyek

JANEGAS (Jantho Renewable Gas) merupakan sistem monitoring rantai pasok energi terbarukan terpadu untuk pengolahan limbah kotoran sapi dan kambing menjadi biogas komunal dan pupuk organik bio-slurry. 

Sistem ini memfasilitasi transparansi tata kelola antara:
1. **Peternak Mitra**: Pemasok kotoran ternak sebagai bahan baku biodigester.
2. **Kelompok Pengelola Sistem (KPS)**: Operator digester komunal Jantho yang mengawasi fermentasi anaerobik, tekanan gas, dan perawatan jaringan pipa.
3. **Rumah Tangga Penerima Manfaat**: Pengguna biogas sebagai energi bersih pengganti LPG subsidi 3kg.
4. **Kelompok Tani Mitra**: Penerima pupuk bio-slurry organik (cair dan padat) untuk perbaikan kesuburan tanah dan pertanian berkelanjutan.

---

## 🚀 Cara Menjalankan

### Cara Cepat (Satu Klik di Windows)
Cukup jalankan file batch:
```bash
run_all.bat
```
Script ini akan otomatis meluncurkan Backend API (Port 8000) dan Frontend Dashboard (Port 5174).

---

### Cara Manual

#### 1. Backend (FastAPI)
```bash
cd "d:\JANEGAS\BE JANEGAS"
.venv\Scripts\activate
uvicorn main:app --reload --port 8000
```
- Base URL: `http://127.0.0.1:8000`
- Dokumentasi Interaktif (Swagger UI): `http://127.0.0.1:8000/docs`

#### 2. Frontend (React 19 + Vite)
```bash
cd "d:\JANEGAS\FE JANEGAS"
npm run dev
```
- Dashboard Web: `http://127.0.0.1:5174`

---

## 👥 Akun Demo & Peran Pengguna

Sistem dilengkapi tombol *quick-fill* akun demo di halaman Login:

| Peran | Username | Password | Deskripsi Hak Akses |
|---|---|---|---|
| **Admin Pengelola** | `admin` | `admin123` | Akses penuh seluruh modul (pasokan, produksi, distribusi, anggota, maintenance). |
| **Operator KPS** | `operator_kps` | `kps123` | Manajemen operasional biodigester, log pemeliharaan, dan penyaluran. |
| **Peternak Mitra** | `peternak_baihaqi` | `peternak123` | Input dan pantau riwayat setoran limbah ternak mandiri. |
| **Kelompok Tani** | `tani_mekar` | `tani123` | Pantau penerimaan pupuk bio-slurry cair & padat untuk lahan tani. |

---

## 🏗️ Arsitektur & Teknologi

### Backend (`BE JANEGAS/`)
- **Framework**: FastAPI (Python 3.12)
- **Database**: SQLite (SQLAlchemy ORM + Pydantic v2 validation)
- **Security**: Direct bcrypt password hashing
- **Seeder**: 30 hari data realistis produksi biogas, pasokan limbah, distribusi pupuk, dan anggota komunitas

### Frontend (`FE JANEGAS/`)
- **Framework**: React 19 + Vite 8
- **Routing**: React Router v7
- **Styling**: Vanilla CSS dengan desain tema *Earth & Green Living*
- **Icons**: Lucide React
- **Data Visualization**: Recharts (AreaChart tren biogas & BarChart distribusi KK)

---

## 📊 Modul Utama Sistem

1. **Dashboard Monitoring**:
   - 6 Kartu KPI: Total Limbah Terkumpul (kg), Biogas Dihasilkan (m³), Pupuk Tersalurkan (L/kg), Peternak Aktif, Kelompok Tani, Rumah Tangga Terlayani (KK).
   - Indikator Dampak: Estimasi kg substitusi tabung LPG 3kg & reduksi emisi gas metana/CO₂e.
   - Grafik interaktif tren 30 hari & riwayat aktivitas terkini.

2. **Pasokan Limbah Ternak (`/supply`)**:
   - Pencatatan harian volume kotoran sapi/kambing dari peternak mitra.
   - Filter jenis ternak, estimasi kadar air, dan pencarian pemasok.

3. **Produksi Biogas (`/biogas`)**:
   - Monitoring harian input slurry vs output volume gas metana (m³).
   - Kontrol tekanan gas (bar), derajat keasaman (pH slurry), dan jumlah KK terlayani.

4. **Distribusi Pupuk Bio-Slurry (`/fertilizer`)**:
   - Penyaluran pupuk organik bio-slurry cair (POC) dan kompos padat untuk kelompok tani.
   - Pelacakan peruntukan lahan sawah/palawija.

5. **Anggota Komunitas (`/members`)**:
   - Direktori terpadu peternak mitra dan kelompok tani binaan di kawasan Jantho.
   - Pendataan populasi ternak, luas lahan, kontak HP, dan status keaktifan.

6. **Log Pemeliharaan (`/maintenance`)**:
   - Riwayat perawatan digester, pembersihan filter desulfurisasi H₂S, manometer, pipa gas, dan pencatatan biaya operasional.

7. **AI Bio-Energy Advisor & Forecaster (Gemini 2.5 Flash + Local Engine)**:
   - **Peramalan Bio-Energi 7 Hari**: Proyeksi output biogas (m³), kapasitas KK terlayani, kebutuhan substrat kotoran ternak, dan air pengenceran (rasio 1:1).
   - **Diagnosis Kesehatan Biodigester**: Pemantauan otomatis derajat keasaman (pH) dan tekanan gas (bar) dengan deteksi dini risiko asidifikasi (*sour digester*) atau overpressure.
   - **Proyeksi Bio-Slurry**: Estimasi ketersediaan pupuk organik cair (POC) & kompos padat untuk sawah/palawija Jantho.
   - **Kalkulasi Dampak Lingkungan & Ekonomi**: Substitusi tabung LPG 3kg subsidi, penghematan belanja energi warga, dan reduksi emisi gas metana/CO₂e.
   - **Interactive Copilot Drawer**: Dialog interaktif AI dengan *smart prompt chips*, rendering Markdown, dan fallback heuristik lokal saat offline.

---
*Dikembangkan untuk Inisiatif BREYI 2026 (Bali Renewable Energy Young Innovators)*
