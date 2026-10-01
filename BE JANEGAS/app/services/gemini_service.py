"""
JANEGAS AI Advisor Service
Integrates Google Gemini 2.5 Flash API with intelligent database state caching
and an offline local heuristics engine for Jantho Renewable Gas (BREYI 2026).
"""

import json
import hashlib
import logging
import urllib.request
import urllib.error
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, date, timedelta

from app.models import models
from app.core.config import settings
from app.services.forecaster import calculate_janegas_forecast

# Simple in-memory cache
# Key: hashlib.md5(f"{state_hash}_{query_normalized}".encode("utf-8")).hexdigest()
# Value: response_text
AI_CACHE = {}


def get_database_state_hash(db: Session) -> str:
    """
    Menghasilkan hash representasi kondisi database JANEGAS saat ini.
    Jika ada data pasokan, produksi, distribusi, atau maintenance yang berubah,
    hash akan otomatis berubah sehingga cache diperbarui.
    """
    try:
        manure_count = db.query(func.count(models.ManureSupply.id)).scalar() or 0
        manure_sum = db.query(func.sum(models.ManureSupply.volume_kg)).scalar() or 0
        biogas_count = db.query(func.count(models.BiogasProduction.id)).scalar() or 0
        biogas_sum = db.query(func.sum(models.BiogasProduction.biogas_volume_m3)).scalar() or 0
        dist_count = db.query(func.count(models.FertilizerDistribution.id)).scalar() or 0
        dist_sum = db.query(func.sum(models.FertilizerDistribution.quantity)).scalar() or 0
        maint_count = db.query(func.count(models.MaintenanceLog.id)).scalar() or 0
        members_count = db.query(func.count(models.Member.id)).scalar() or 0

        state_str = (
            f"M:{manure_count}-{manure_sum}|"
            f"B:{biogas_count}-{biogas_sum}|"
            f"D:{dist_count}-{dist_sum}|"
            f"MT:{maint_count}|"
            f"MB:{members_count}"
        )
        return hashlib.md5(state_str.encode("utf-8")).hexdigest()
    except Exception as e:
        logging.error(f"[JANEGAS AI] Error calculating database state hash: {e}")
        return str(datetime.now().date())


def build_janegas_context(db: Session) -> dict:
    """
    Mengumpulkan ringkasan data operasional riil dari database JANEGAS untuk AI Advisor.
    """
    members = db.query(models.Member).all()
    peternak = [m for m in members if m.member_type == "peternak"]
    kelompok_tani = [m for m in members if m.member_type == "kelompok_tani"]

    total_cattle = sum(m.livestock_count or 0 for m in peternak if m.livestock_type in ["sapi", "campuran"])
    total_goats = sum(m.livestock_count or 0 for m in peternak if m.livestock_type == "kambing")

    # Ambil 5 pasokan limbah kotoran terbaru
    recent_supplies = db.query(models.ManureSupply).order_by(
        models.ManureSupply.supply_date.desc()
    ).limit(5).all()

    # Ambil 5 log produksi biogas terbaru
    recent_productions = db.query(models.BiogasProduction).order_by(
        models.BiogasProduction.production_date.desc()
    ).limit(5).all()

    # Ambil 5 distribusi pupuk terbaru
    recent_fertilizers = db.query(models.FertilizerDistribution).order_by(
        models.FertilizerDistribution.distribution_date.desc()
    ).limit(5).all()

    # Ambil log maintenance
    recent_maintenance = db.query(models.MaintenanceLog).order_by(
        models.MaintenanceLog.log_date.desc()
    ).limit(5).all()

    # Hasil kalkulasi peramalan bio-energi
    forecast = calculate_janegas_forecast(db)

    return {
        "project_name": "JANEGAS (Jantho Renewable Gas)",
        "location": "Kota Jantho, Kabupaten Aceh Besar, Aceh",
        "competition": "Bali Renewable Energy Young Innovators (BREYI) 2026",
        "category": "Community-Based Energy Transition",
        "peternak_summary": {
            "total_peternak": len(peternak),
            "total_sapi": total_cattle,
            "total_kambing": total_goats,
            "list": [
                {
                    "name": p.name,
                    "village": p.village,
                    "livestock": f"{p.livestock_count} {p.livestock_type}",
                    "active": p.is_active
                }
                for p in peternak
            ]
        },
        "tani_summary": {
            "total_kelompok_tani": len(kelompok_tani),
            "list": [
                {
                    "name": t.name,
                    "village": t.village,
                    "contact": t.contact_person
                }
                for t in kelompok_tani
            ]
        },
        "forecast": forecast,
        "recent_supplies": [
            {
                "date": str(s.supply_date),
                "volume_kg": s.volume_kg,
                "type": s.livestock_type
            }
            for s in recent_supplies
        ],
        "recent_productions": [
            {
                "date": str(p.production_date),
                "biogas_m3": p.biogas_volume_m3,
                "input_kg": p.input_volume_kg,
                "ph": p.ph_level,
                "pressure_bar": p.gas_pressure_bar,
                "hh_served": p.households_served,
                "status": p.digester_status
            }
            for p in recent_productions
        ],
        "recent_fertilizers": [
            {
                "date": str(f.distribution_date),
                "type": f.fertilizer_type,
                "qty": f.quantity,
                "unit": f.unit
            }
            for f in recent_fertilizers
        ],
        "recent_maintenance": [
            {
                "date": str(m.log_date),
                "type": m.log_type,
                "status": m.status,
                "desc": m.description
            }
            for m in recent_maintenance
        ]
    }


def generate_local_janegas_analysis(context: dict, query: str) -> str:
    """
    Mesin analisis lokal berbasis heuristik pakar energi terbarukan komunitas.
    Menghasilkan respon komprehensif saat Gemini API offline atau tanpa koneksi internet.
    """
    q = query.lower()
    fc = context["forecast"]
    pet = context["peternak_summary"]
    tani = context["tani_summary"]

    # 1. Pertanyaan Peramalan & Produksi Biogas
    if any(k in q for k in ["ramal", "prediksi", "forecast", "minggu depan", "output", "kapasitas"]):
        return f"""### Hasil Analisis AI - Peramalan Produksi Biogas JANEGAS
Berdasarkan data operasional instalasi biodigester komunal Jantho selama 30 hari terakhir:

* **Proyeksi Pasokan Kotoran 7 Hari**: **{fc['projected_7d_manure_kg']:,.1f} kg** (rata-rata ~{fc['projected_daily_manure_kg']:,.1f} kg/hari)
* **Kebutuhan Air Pengenceran (Rasio 1:1)**: **{fc['recommended_daily_water_liters']:,.0f} Liter/hari**
* **Estimasi Produksi Biogas Mingguan**: **{fc['projected_7d_biogas_m3']:,.2f} m³** (rata-rata ~{fc['projected_daily_biogas_m3']:,.2f} m³/hari)
* **Kapasitas Rumah Tangga Terlayani**: **{fc['projected_hh_capacity']} Kepala Keluarga (KK)** stabil tanpa penurunan tekanan.

#### Dampak & Rekomendasi Taktis:
1. **Substitusi Bahan Bakar**: Setara dengan penghematan **{fc['projected_lpg_cylinders']:.1f} tabung LPG 3kg** subsidi atau senilai **Rp {fc['projected_economic_savings_idr']:,.0f}** per minggu bagi warga Jantho.
2. **Kestabilan Suplai**: Lakukan pengisian slurry secara kontinu 2 kali sehari (pagi dan sore) untuk menjaga temperatur mesofilik bakteri metanogen.
"""

    # 2. Pertanyaan Pasokan Limbah / Kotoran Ternak
    if any(k in q for k in ["pasok", "limbah", "kotoran", "sapi", "kambing", "peternak", "bahan baku"]):
        peternak_rows = "\n".join([f"- **{p['name']}** ({p['village']}): {p['livestock']}" for p in pet["list"]])
        return f"""### Analisis Neraca Bahan Baku & Peternak Mitra
Instalasi JANEGAS saat ini didukung oleh **{pet['total_peternak']} peternak mitra** dengan total populasi **{pet['total_sapi']} ekor sapi** dan **{pet['total_kambing']} ekor kambing**:

#### Daftar Peternak Mitra di Jantho:
{peternak_rows}

#### Neraca & Prosedur Pengolahan Substrat:
* **Estimasi Pasokan Harian**: Rata-rata **{fc['projected_daily_manure_kg']:,.1f} kg/hari**.
* **Rasio Air Ideal**: Wajib dicampur air bersih dengan perbandingan **1:1** ({fc['recommended_daily_water_liters']:,.0f} L air/hari) agar kadar padatan terlarut (Total Solids) terjaga di kisaran **8–10%**.
* **Keunggulan Substrat Campuran**: Kotoran sapi menyediakan massa selulosa sebagai buffer keasaman, sedangkan kotoran kambing meningkatkan kandungan nitrogen dan potensi yield metana (+20%).
"""

    # 3. Pertanyaan Bio-Slurry & Pupuk Organik untuk Kelompok Tani
    if any(k in q for k in ["pupuk", "slurry", "bio-slurry", "tani", "cair", "kompos", "poc"]):
        tani_rows = "\n".join([f"- **{t['name']}** (Kontak: {t['contact']}) — Wilayah: {t['village']}" for t in tani["list"]])
        return f"""### Proyeksi Distribusi Pupuk Organik Bio-Slurry
Pengolahan anaerobik limbah ternak JANEGAS menghasilkan produk sampingan bernilai tinggi:

* **Bio-Slurry Cair (POC)**: Proyeksi **{fc['projected_7d_liquid_slurry_liters']:,.0f} Liter** dalam 7 hari ke depan.
* **Bio-Slurry Padat (Kompos)**: Proyeksi **{fc['projected_7d_solid_slurry_kg']:,.0f} kg** siap keringkan.

#### Kelompok Tani Penerima Manfaat di Jantho:
{tani_rows}

#### Panduan Aplikasi Lahan Tani:
1. **Bio-Slurry Cair (POC)**: Encerkan 1:5 dengan air dan semprotkan pada tanaman padi atau palawija setiap 10-14 hari untuk menyuplai unsur hara makro (N, P, K) dan mikroba probiotik tanah.
2. **Bio-Slurry Padat**: Sangat efektif sebagai pembenah tanah sebelum musim tanam guna meningkatkan kemampuan retensi air tanah Jantho yang berpasir.
"""

    # 4. Pertanyaan Kesehatan Digester / pH / Tekanan / Maintenance
    if any(k in q for k in ["ph", "tekanan", "bar", "rusak", "bocor", "sehat", "kondisi", "maintenance", "rawat"]):
        ph_info = fc["ph_assessment"]
        press_info = fc["pressure_assessment"]
        status_text = "[STATUS: OPTIMAL]" if fc["is_healthy"] else "[STATUS: PERINGATAN OPERASIONAL]"

        return f"""### Diagnosis Kesehatan Operasional Biodigester
Status Keseluruhan Sistem: **{status_text}**

* **Status pH Slurry**: **{fc['latest_ph']:.2f}** — *{ph_info['title']}*
  > *Catatan*: {ph_info['message']}
  > *Tindakan*: {ph_info['recommendation']}
* **Status Tekanan Gas**: **{fc['latest_pressure']:.2f} bar** — *{press_info['title']}*
  > *Catatan*: {press_info['message']}
  > *Tindakan*: {press_info['recommendation']}
* **Log Pemeliharaan**: {fc['maintenance_note']}

#### Rekomendasi Checklist Operator KPS:
1. Pastikan media besi spons (Fe₂O₃) pada scrubber H₂S diperiksa setiap 30 hari untuk mencegah korosi burner pipa.
2. Pastikan water-trap pada jalur pipa terendah dikeringkan dari akumulasi kondensasi uap air.
"""

    # 5. Pertanyaan Dampak Lingkungan, Emisi, dan Penghematan Ekonomi
    if any(k in q for k in ["emisi", "lingkungan", "lpg", "hemat", "ekonomi", "co2", "breyi"]):
        return f"""### Dampak Transisi Energi & Reduksi Emisi (BREYI 2026)
Inisiatif JANEGAS di Kota Jantho memberikan kontribusi nyata terhadap target Net-Zero Emission dan ekonomi sirkular:

* **Substitusi LPG Subsidi**: Setara **{fc['projected_lpg_cylinders']:.1f} tabung 3kg** per minggu (~{fc['projected_lpg_kg_saved']} kg LPG).
* **Penghematan Pengeluaran Warga**: Menghemat sekitar **Rp {fc['projected_economic_savings_idr']:,.0f} per minggu** (Rp {fc['projected_economic_savings_idr']*4:,.0f}/bulan) bagi penerima manfaat.
* **Reduksi Emisi Gas Rumah Kaca (GRK)**: Menghindari pelepasan **{fc['projected_co2e_reduction_kg']:,.1f} kg CO₂e** per minggu melalui penangkapan gas metana dan substitusi bahan bakar fosil.
* **Pemberdayaan Komunitas**: Mengintegrasikan rantai pasok antara **{pet['total_peternak']} peternak mitra** dan **{tani['total_kelompok_tani']} kelompok tani** secara mandiri.
"""

    # Default Overview
    status_text = "Optimal & Siap Layani Warga" if fc["is_healthy"] else "Perlu Penyesuaian Operasional"
    return f"""### Selamat datang di JANEGAS AI Advisor!
Saya adalah asisten cerdas sistem pemantauan bio-energi terpadu **Jantho Renewable Gas (JANEGAS)**.

#### Ringkasan Kondisi Terkini:
* **Kesehatan Biodigester**: **{status_text}** (pH: {fc['latest_ph']:.2f} | Tekanan: {fc['latest_pressure']:.2f} bar)
* **Proyeksi Produksi 7 Hari**: **{fc['projected_7d_biogas_m3']:,.1f} m³** (~{fc['projected_hh_capacity']} KK terlayani)
* **Kebutuhan Kotoran Ternak**: **{fc['projected_7d_manure_kg']:,.0f} kg** (Air pengenceran: {fc['recommended_daily_water_liters']:,.0f} L/hari)
* **Ketersediaan Pupuk Organik**: **{fc['projected_7d_liquid_slurry_liters']:,.0f} L POC** & **{fc['projected_7d_solid_slurry_kg']:,.0f} kg kompos**
* **Penghematan Energi Komunitas**: Setara **{fc['projected_lpg_cylinders']:.0f} tabung LPG 3kg** (~Rp {fc['projected_economic_savings_idr']:,.0f})

#### Anda dapat mengajukan pertanyaan seputar:
- **Peramalan Energi** (*"Berapa proyeksi biogas minggu depan?"*)
- **Pasokan Bahan Baku** (*"Bagaimana rasio pengenceran air dan pasokan peternak?"*)
- **Kondisi Teknis** (*"Apakah level pH dan tekanan biodigester normal?"*)
- **Distribusi Pupuk** (*"Berapa bio-slurry cair yang siap disalurkan ke kelompok tani?"*)
- **Dampak Lingkungan** (*"Berapa reduksi emisi CO2e dan penghematan biaya warga?"*)
"""


def analyze_janegas_with_gemini(db: Session, user_query: str) -> str:
    """
    Mengkoordinasikan caching cerdas, memanggil Gemini 2.5 Flash API via urllib,
    dan melakukan fallback otomatis ke local heuristics engine jika kuota habis/error.
    """
    # 1. State Hashing dan Caching
    state_hash = get_database_state_hash(db)
    query_normalized = user_query.strip().lower()

    cache_key = hashlib.md5(f"{state_hash}_{query_normalized}".encode("utf-8")).hexdigest()

    if cache_key in AI_CACHE:
        logging.info("[JANEGAS AI] Cache hit! Returning cached insights.")
        return AI_CACHE[cache_key]

    # 2. Bangun konteks bisnis & operasional
    context = build_janegas_context(db)

    # 3. Cek API Key
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        logging.warning("[JANEGAS AI] Gemini API Key is not set. Using Local Engine Fallback.")
        local_response = generate_local_janegas_analysis(context, user_query)
        AI_CACHE[cache_key] = local_response
        return local_response

    # 4. Panggil Gemini 2.5 Flash API
    logging.info("[JANEGAS AI] Cache miss. Invoking Gemini 2.5 Flash API...")

    system_prompt = f"""
Kamu adalah "JANEGAS AI Advisor", asisten kecerdasan buatan analitik energi terbarukan berbasis komunitas untuk proyek JANEGAS (Jantho Renewable Gas) di Kota Jantho, Kabupaten Aceh Besar, Aceh.
Proyek ini berlaga dalam ajang Bali Renewable Energy Young Innovators (BREYI) 2026 kategori Community-Based Energy Transition.

Peranmu:
Membantu pengelola KPS (Kelompok Pengelola Sistem), operator biodigester, peternak mitra, dan kelompok tani dalam memantau, meramalkan, dan mengoptimalkan rantai pasok pengolahan limbah kotoran sapi/kambing menjadi biogas dan pupuk organik bio-slurry.

Konteks Sistem & Data Riil JANEGAS Saat Ini:
- Lokasi: Kota Jantho, Aceh Besar
- Peternak Mitra: {json.dumps(context['peternak_summary'])}
- Kelompok Tani Binaan: {json.dumps(context['tani_summary'])}
- Pasokan Kotoran Ternak Terbaru: {json.dumps(context['recent_supplies'])}
- Produksi Biogas Harian Terbaru: {json.dumps(context['recent_productions'])}
- Distribusi Pupuk Bio-Slurry Terbaru: {json.dumps(context['recent_fertilizers'])}
- Log Pemeliharaan Terbaru: {json.dumps(context['recent_maintenance'])}
- Hasil Kalkulasi Peramalan Bio-Energi 7 Hari: {json.dumps(context['forecast'])}

Pedoman Menjawab:
1. Hindari penggunaan emoji yang berlebihan. Gunakan teks Markdown profesional yang rapi dengan heading (### atau ####), bullet points (- atau *), dan cetak tebal (bold).
2. Jawaban harus padat, akurat, berbasis data angka riil di atas (maksimal 250-300 kata).
3. Berikan saran taktis operasional (misal rekomendasi rasio air pengenceran 1:1, status pH fermentasi, mitigasi asidifikasi/tekanan, alokasi pupuk bio-slurry untuk sawah).
4. Kaitkan dampak energi terbarukan dengan substitusi LPG 3kg dan reduksi emisi CO2e.
5. Jawab secara spesifik pertanyaan pengguna: "{user_query}"
"""

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": system_prompt}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 2000,
            "thinkingConfig": {
                "thinkingBudget": 0
            }
        }
    }

    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )

        with urllib.request.urlopen(req, timeout=8) as response:
            res_body = response.read().decode("utf-8")
            res_json = json.loads(res_body)

            response_text = res_json["candidates"][0]["content"]["parts"][0]["text"]
            AI_CACHE[cache_key] = response_text
            logging.info("[JANEGAS AI] Gemini API response fetched and cached successfully.")
            return response_text

    except urllib.error.HTTPError as e:
        error_msg = e.read().decode("utf-8") if e.fp else ""
        logging.error(f"[JANEGAS AI] Gemini API HTTP Error {e.code}: {e.reason}. Details: {error_msg}")
        local_response = generate_local_janegas_analysis(context, user_query)
        AI_CACHE[cache_key] = local_response
        return local_response

    except Exception as e:
        logging.error(f"[JANEGAS AI] Gemini API Exception occurred: {e}")
        local_response = generate_local_janegas_analysis(context, user_query)
        AI_CACHE[cache_key] = local_response
        return local_response
