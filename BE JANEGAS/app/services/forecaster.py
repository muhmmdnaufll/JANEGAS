"""
Bio-Energy Forecasting and Operational Optimization Engine for JANEGAS
(Jantho Renewable Gas - BREYI 2026)
"""

from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
from app.models import models

# Standar parameter teknis fermentasi anaerobik & rantai pasok JANEGAS
OPTIMAL_WATER_RATIO = 1.0          # 1:1 pengenceran kotoran sapi/kambing dengan air
AVG_YIELD_SAPI = 0.045             # m3 biogas per kg kotoran sapi segar
AVG_YIELD_KAMBING = 0.055          # m3 biogas per kg kotoran kambing
HOUSEHOLD_DAILY_CONSUMPTION_M3 = 0.9  # Rata-rata konsumsi memasak harian per KK di Jantho (~27 m3/bln)
LPG_KG_PER_M3_BIOGAS = 0.46        # 1 m3 biogas setara 0.46 kg LPG
LPG_3KG_PRICE_IDR = 22000          # Rata-rata harga eceran tabung LPG 3kg subsidi di Jantho
SLURRY_RECOVERY_RATIO = 0.88       # 88% slurry keluar menjadi pupuk bio-slurry
LIQUID_SLURRY_SHARE = 0.85         # 85% pupuk organik cair (POC)
SOLID_SLURRY_SHARE = 0.15          # 15% pupuk padat / kompos bio-slurry
CO2_REDUCTION_MANURE_KG = 0.08     # Reduksi kg CO2e per kg kotoran diolah (mencegah emisi metana terbuka)
CO2_REDUCTION_BIOGAS_M3 = 1.50     # Reduksi kg CO2e per m3 biogas yang menggantikan bahan bakar fosil


def calculate_janegas_forecast(db: Session) -> dict:
    """
    Menghitung estimasi peramalan bio-energi 7 hari ke depan, neraca substrat,
    ketersediaan bio-slurry, kesehatan digester, dan dampak lingkungan & ekonomi.
    """
    today = date.today()
    start_date_30d = today - timedelta(days=30)
    start_date_7d = today - timedelta(days=7)

    # 1. Analisis Riwayat 30 Hari Terakhir
    # Manure Supplies
    total_manure_30d = db.query(func.sum(models.ManureSupply.volume_kg)).filter(
        models.ManureSupply.supply_date >= start_date_30d
    ).scalar() or 0.0

    count_manure_records = db.query(func.count(models.ManureSupply.id)).filter(
        models.ManureSupply.supply_date >= start_date_30d
    ).scalar() or 0

    manure_by_type = db.query(
        models.ManureSupply.livestock_type,
        func.sum(models.ManureSupply.volume_kg)
    ).filter(
        models.ManureSupply.supply_date >= start_date_30d
    ).group_by(models.ManureSupply.livestock_type).all()

    # Biogas Production
    recent_productions = db.query(models.BiogasProduction).filter(
        models.BiogasProduction.production_date >= start_date_30d
    ).order_by(models.BiogasProduction.production_date.desc()).all()

    total_biogas_30d = sum(p.biogas_volume_m3 for p in recent_productions)
    total_input_slurry_30d = sum(p.input_volume_kg for p in recent_productions)

    days_recorded = max(1, len(set(p.production_date for p in recent_productions)))
    avg_daily_manure = round(total_manure_30d / max(1, min(30, days_recorded)), 1)
    avg_daily_biogas = round(total_biogas_30d / max(1, min(30, days_recorded)), 2)

    # Yield aktual riil (m3 biogas per kg input slurry)
    if total_input_slurry_30d > 0 and total_biogas_30d > 0:
        actual_yield = round(total_biogas_30d / total_input_slurry_30d, 4)
    else:
        actual_yield = 0.048

    # Parameter Biokimiawi Terbaru (7 hari terakhir)
    last_prod = recent_productions[0] if recent_productions else None
    latest_ph = last_prod.ph_level if (last_prod and last_prod.ph_level is not None) else 7.2
    latest_pressure = last_prod.gas_pressure_bar if (last_prod and last_prod.gas_pressure_bar is not None) else 1.2
    latest_status = last_prod.digester_status if last_prod else "normal"
    latest_hh_served = last_prod.households_served if last_prod else 35

    # 2. Peramalan Kebutuhan & Output 7 Hari ke Depan
    # Estimasi pasokan 7 hari ke depan
    projected_daily_manure = avg_daily_manure if avg_daily_manure > 0 else 320.0
    projected_7d_manure_kg = round(projected_daily_manure * 7, 1)

    # Rekomendasi input harian slurry (1 kg kotoran : 1 liter air)
    recommended_daily_feed_kg = projected_daily_manure
    recommended_daily_water_liters = round(projected_daily_manure * OPTIMAL_WATER_RATIO, 1)
    recommended_7d_slurry_input_kg = round(projected_7d_manure_kg * (1 + OPTIMAL_WATER_RATIO), 1)

    # Proyeksi produksi biogas 7 hari (m3)
    projected_daily_biogas = round(projected_daily_manure * actual_yield * (1 + OPTIMAL_WATER_RATIO * 0.1), 2)
    projected_7d_biogas_m3 = round(projected_daily_biogas * 7, 2)

    # Kapasitas Rumah Tangga Penerima Manfaat
    projected_hh_capacity = int(projected_daily_biogas / HOUSEHOLD_DAILY_CONSUMPTION_M3)
    projected_hh_capacity = max(1, projected_hh_capacity)

    # Proyeksi Pupuk Bio-Slurry (cair & padat)
    projected_7d_total_slurry_output = round(recommended_7d_slurry_input_kg * SLURRY_RECOVERY_RATIO, 1)
    projected_7d_liquid_slurry_liters = round(projected_7d_total_slurry_output * LIQUID_SLURRY_SHARE, 1)
    projected_7d_solid_slurry_kg = round(projected_7d_total_slurry_output * SOLID_SLURRY_SHARE, 1)

    # Dampak Ekonomi & Lingkungan 7 Hari
    projected_lpg_kg_saved = round(projected_7d_biogas_m3 * LPG_KG_PER_M3_BIOGAS, 1)
    projected_lpg_cylinders = round(projected_lpg_kg_saved / 3.0, 1)
    projected_economic_savings_idr = int(projected_lpg_cylinders * LPG_3KG_PRICE_IDR)
    projected_co2e_reduction_kg = round(
        (projected_7d_manure_kg * CO2_REDUCTION_MANURE_KG) + (projected_7d_biogas_m3 * CO2_REDUCTION_BIOGAS_M3),
        1
    )

    # 3. Pemeriksaan Kesehatan Operasional & Deteksi Anomali
    alerts = []
    is_healthy = True

    # Evaluasi pH
    if latest_ph < 6.8:
        is_healthy = False
        ph_assessment = {
            "status": "warning",
            "title": "Waspada Asidifikasi (Sour Digester)",
            "message": f"pH berada di level {latest_ph:.2f} (ambang aman 6.8 - 7.6). Pertumbuhan bakteri metanogen tertekan.",
            "recommendation": "Kurangi laju pengisian bahan baku baru, hindari substrat tinggi karbohidrat/asam, dan sirkulasikan bio-slurry matang atau tambahkan buffer kapur tohor."
        }
        alerts.append(ph_assessment["message"])
    elif latest_ph > 7.8:
        is_healthy = False
        ph_assessment = {
            "status": "warning",
            "title": "Waspada Basa (Alkalinitas Tinggi)",
            "message": f"pH berada di level {latest_ph:.2f}. Potensi kelebihan amonia bebas dari kotoran kambing murni.",
            "recommendation": "Tingkatkan rasio pengenceran air dan campurkan kotoran sapi yang kaya serat selulosa."
        }
        alerts.append(ph_assessment["message"])
    else:
        ph_assessment = {
            "status": "optimal",
            "title": "pH Fermentasi Optimal",
            "message": f"pH berada pada kondisi ideal {latest_ph:.2f} (rentang 6.8 - 7.6).",
            "recommendation": "Pertahankan rasio pengenceran air 1:1 dan jadwal pengisian kontinu."
        }

    # Evaluasi Tekanan Gas
    if latest_pressure < 0.8:
        is_healthy = False
        pressure_assessment = {
            "status": "warning",
            "title": "Tekanan Gas Rendah",
            "message": f"Tekanan gas terdeteksi {latest_pressure:.2f} bar (normal 1.0 - 1.5 bar).",
            "recommendation": "Periksa manometer dan potensi kebocoran sambungan pipa distribusi ke rumah warga Jantho."
        }
        alerts.append(pressure_assessment["message"])
    elif latest_pressure > 1.6:
        is_healthy = False
        pressure_assessment = {
            "status": "warning",
            "title": "Tekanan Gas Berlebih",
            "message": f"Tekanan gas mencapai {latest_pressure:.2f} bar. Risiko overpressure.",
            "recommendation": "Periksa safety relief valve dan alirkan gas cadangan ke burner pengering bio-slurry."
        }
        alerts.append(pressure_assessment["message"])
    else:
        pressure_assessment = {
            "status": "optimal",
            "title": "Tekanan Gas Stabil",
            "message": f"Tekanan {latest_pressure:.2f} bar berada dalam batas operasional aman (1.0 - 1.5 bar).",
            "recommendation": "Jaringan transmisi pipa gas bertekanan optimal untuk suplai kompor warga."
        }

    # Evaluasi Log Maintenance Aktif
    open_maintenance = db.query(models.MaintenanceLog).filter(
        models.MaintenanceLog.status.in_(["ongoing", "pending"])
    ).count()

    last_maintenance = db.query(models.MaintenanceLog).order_by(
        models.MaintenanceLog.log_date.desc()
    ).first()

    if open_maintenance > 0:
        maintenance_note = f"Terdapat {open_maintenance} tiket pemeliharaan yang belum selesai."
    else:
        maintenance_note = "Seluruh log pemeliharaan terselesaikan dengan baik."

    # Rekomendasi Taktis AI
    tactical_recommendations = [
        f"Lakukan pengenceran kotoran ternak dengan perbandingan 1:1 ({recommended_daily_water_liters:,.0f} liter air bersih per hari) guna menjaga kestabilan Total Solids.",
        f"Alokasikan minimal {projected_7d_liquid_slurry_liters:,.0f} Liter bio-slurry cair untuk kelompok tani sawah di Kota Jantho minggu ini.",
        f"Proyeksi produksi biogas sanggup memenuhi kebutuhan gas rutin hingga {projected_hh_capacity} Kepala Keluarga tanpa kendala tekanan.",
        f"Estimasi penghematan ekonomi warga Jantho setara {projected_lpg_cylinders:.0f} tabung LPG 3kg (~Rp {projected_economic_savings_idr:,.0f})."
    ]

    return {
        "is_healthy": is_healthy,
        "latest_ph": latest_ph,
        "latest_pressure": latest_pressure,
        "latest_status": latest_status,
        "current_hh_served": latest_hh_served,
        "projected_daily_manure_kg": projected_daily_manure,
        "projected_7d_manure_kg": projected_7d_manure_kg,
        "recommended_daily_water_liters": recommended_daily_water_liters,
        "recommended_7d_slurry_input_kg": recommended_7d_slurry_input_kg,
        "projected_daily_biogas_m3": projected_daily_biogas,
        "projected_7d_biogas_m3": projected_7d_biogas_m3,
        "projected_hh_capacity": projected_hh_capacity,
        "projected_7d_liquid_slurry_liters": projected_7d_liquid_slurry_liters,
        "projected_7d_solid_slurry_kg": projected_7d_solid_slurry_kg,
        "projected_lpg_kg_saved": projected_lpg_kg_saved,
        "projected_lpg_cylinders": projected_lpg_cylinders,
        "projected_economic_savings_idr": projected_economic_savings_idr,
        "projected_co2e_reduction_kg": projected_co2e_reduction_kg,
        "ph_assessment": ph_assessment,
        "pressure_assessment": pressure_assessment,
        "open_maintenance_count": open_maintenance,
        "maintenance_note": maintenance_note,
        "alerts": alerts,
        "tactical_recommendations": tactical_recommendations,
        "actual_yield_m3_per_kg": actual_yield,
        "historical_30d": {
            "total_manure_kg": round(total_manure_30d, 1),
            "total_biogas_m3": round(total_biogas_30d, 2),
            "records_count": count_manure_records,
            "manure_by_type": {t: round(v, 1) for t, v in manure_by_type}
        }
    }
