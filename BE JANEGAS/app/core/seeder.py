import random
from datetime import date, timedelta, datetime
from sqlalchemy.orm import Session
from app.models import models
from app.crud import crud


def seed_database(db: Session):
    """Seed database JANEGAS dengan data demo realistis."""
    existing_user = db.query(models.User).filter(models.User.username == "admin").first()
    if existing_user:
        print("Database already seeded. Skipping.")
        return

    print("Seeding JANEGAS database...")

    # 1. Seed Users
    admin_user = models.User(
        username="admin",
        hashed_password=crud.get_password_hash("admin123"),
        role="admin"
    )
    kps_user = models.User(
        username="operator_kps",
        hashed_password=crud.get_password_hash("kps123"),
        role="kps"
    )
    peternak_user = models.User(
        username="peternak_baihaqi",
        hashed_password=crud.get_password_hash("peternak123"),
        role="peternak"
    )
    tani_user = models.User(
        username="tani_mekar",
        hashed_password=crud.get_password_hash("tani123"),
        role="tani"
    )
    db.add_all([admin_user, kps_user, peternak_user, tani_user])
    db.flush()

    # 2. Seed Members - Peternak
    peternak_list = [
        models.Member(
            user_id=peternak_user.id,
            name="Baihaqi",
            contact_person="Baihaqi",
            phone="08123456789",
            address="Desa Jantho, Kec. Jantho, Aceh Besar",
            member_type="peternak",
            livestock_type="sapi",
            livestock_count=8
        ),
        models.Member(
            name="Ramli",
            contact_person="Ramli",
            phone="08234567890",
            address="Desa Jantho Baru, Kec. Jantho, Aceh Besar",
            member_type="peternak",
            livestock_type="sapi",
            livestock_count=5
        ),
        models.Member(
            name="Sulaiman",
            contact_person="Sulaiman",
            phone="08345678901",
            address="Desa Buengcala, Kec. Jantho, Aceh Besar",
            member_type="peternak",
            livestock_type="kambing",
            livestock_count=15
        ),
        models.Member(
            name="Marzuki",
            contact_person="Marzuki",
            phone="08456789012",
            address="Desa Jantho Makmur, Kec. Jantho, Aceh Besar",
            member_type="peternak",
            livestock_type="campuran",
            livestock_count=10
        ),
    ]
    db.add_all(peternak_list)

    # 3. Seed Members - Kelompok Tani
    tani_list = [
        models.Member(
            user_id=tani_user.id,
            name="KT Mekar Jantho",
            contact_person="Pak Hasbi",
            phone="08567890123",
            address="Desa Jantho, Kec. Jantho, Aceh Besar",
            member_type="kelompok_tani",
            livestock_type=None,
            livestock_count=None
        ),
        models.Member(
            name="KT Tani Makmur",
            contact_person="Pak Zulkarnaen",
            phone="08678901234",
            address="Desa Buengcala, Kec. Jantho, Aceh Besar",
            member_type="kelompok_tani",
            livestock_type=None,
            livestock_count=None
        ),
    ]
    db.add_all(tani_list)
    db.flush()

    # 4. Seed Manure Supplies (90 hari terakhir)
    today = date.today()
    peternak_ids = [p.id for p in peternak_list]
    livestock_types = ["sapi", "kambing", "campuran"]

    for day_offset in range(90, 0, -1):
        supply_date = today - timedelta(days=day_offset)
        # 2-4 pasokan per hari dari peternak berbeda
        for _ in range(random.randint(2, 4)):
            supplier_id = random.choice(peternak_ids)
            member = db.query(models.Member).filter(models.Member.id == supplier_id).first()
            ltype = member.livestock_type if member.livestock_type else random.choice(livestock_types)
            # Sapi: ~25-40 kg/hari, Kambing: ~2-4 kg/hari
            if "sapi" in ltype:
                volume = round(random.uniform(20.0, 45.0), 1)
            elif "kambing" in ltype:
                volume = round(random.uniform(5.0, 20.0), 1)
            else:
                volume = round(random.uniform(15.0, 35.0), 1)

            db.add(models.ManureSupply(
                supplier_id=supplier_id,
                supply_date=supply_date,
                livestock_type=ltype,
                volume_kg=volume,
                water_ratio=1.0,
                notes=None
            ))

    db.flush()

    # 5. Seed Biogas Productions (90 hari terakhir)
    for day_offset in range(90, 0, -1):
        prod_date = today - timedelta(days=day_offset)
        # Estimasi: ~0.04 m3 biogas per kg limbah, input 80-150 kg/hari
        input_vol = round(random.uniform(80.0, 150.0), 1)
        biogas_vol = round(input_vol * random.uniform(0.035, 0.05), 2)
        hh = random.randint(18, 35)
        status = "normal" if random.random() > 0.05 else random.choice(["gangguan_ringan", "gangguan_berat"])
        db.add(models.BiogasProduction(
            production_date=prod_date,
            input_volume_kg=input_vol,
            biogas_volume_m3=biogas_vol,
            households_served=hh,
            digester_status=status,
            temperature_celsius=round(random.uniform(28.0, 35.0), 1),
            notes="Operasional normal." if status == "normal" else "Perlu pengecekan."
        ))

    db.flush()

    # 6. Seed Fertilizer Distributions (90 hari terakhir, ~2x per minggu)
    tani_ids = [t.id for t in tani_list]
    fert_types = [("cair", "liter"), ("padat", "kg")]
    for day_offset in range(90, 0, -7):  # weekly
        dist_date = today - timedelta(days=day_offset)
        for tid in tani_ids:
            ftype, unit = random.choice(fert_types)
            qty = round(random.uniform(30.0, 80.0), 1) if ftype == "cair" else round(random.uniform(15.0, 40.0), 1)
            db.add(models.FertilizerDistribution(
                recipient_id=tid,
                distribution_date=dist_date,
                fertilizer_type=ftype,
                quantity=qty,
                unit=unit,
                notes=None
            ))

    # 7. Seed Maintenance Logs
    maint_logs = [
        models.MaintenanceLog(
            log_date=today - timedelta(days=85),
            log_type="inspection",
            description="Inspeksi awal instalasi biodigester fixed-dome setelah commissioning.",
            status="resolved",
            technician="Tim JANEGAS",
            cost_idr=0.0
        ),
        models.MaintenanceLog(
            log_date=today - timedelta(days=60),
            log_type="routine_maintenance",
            description="Pengecekan pipa distribusi gas dan katup pengaman. Semua dalam kondisi baik.",
            status="resolved",
            technician="Operator KPS",
            cost_idr=50000.0
        ),
        models.MaintenanceLog(
            log_date=today - timedelta(days=30),
            log_type="repair",
            description="Penggantian seal pipa distribusi yang bocor di titik sambungan rumah warga RT 02.",
            status="resolved",
            technician="Teknisi Lokal",
            cost_idr=180000.0
        ),
        models.MaintenanceLog(
            log_date=today - timedelta(days=7),
            log_type="routine_maintenance",
            description="Pengecekan rutin bulanan: tekanan gas normal, tidak ada kebocoran.",
            status="resolved",
            technician="Operator KPS",
            cost_idr=50000.0
        ),
    ]
    db.add_all(maint_logs)

    db.commit()
    print("JANEGAS database seeding completed successfully.")
