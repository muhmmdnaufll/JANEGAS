from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    # Roles: admin (KPS admin), kps (KPS operator), peternak (farmer), tani (farmer group)
    role = Column(String, default="kps")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    member = relationship("Member", back_populates="user", uselist=False)


class Member(Base):
    """Anggota komunitas JANEGAS: peternak (pemasok kotoran) atau kelompok tani (penerima pupuk)."""
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String, index=True, nullable=False)
    contact_person = Column(String)
    phone = Column(String)
    address = Column(String)
    # member_type: 'peternak' | 'kelompok_tani'
    member_type = Column(String, nullable=False)
    livestock_type = Column(String, nullable=True)
    livestock_count = Column(Integer, nullable=True)
    registered_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="member")
    manure_supplies = relationship("ManureSupply", back_populates="supplier")
    fertilizer_receipts = relationship("FertilizerDistribution", back_populates="recipient")


class ManureSupply(Base):
    """Modul 1: Pasokan kotoran ternak dari peternak ke instalasi biodigester."""
    __tablename__ = "manure_supplies"

    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey("members.id"), nullable=False)
    supply_date = Column(Date, nullable=False)
    livestock_type = Column(String, nullable=False)  # sapi, kambing, campuran
    volume_kg = Column(Float, nullable=False)
    water_ratio = Column(Float, default=1.0)
    notes = Column(Text, nullable=True)
    recorded_at = Column(DateTime, default=datetime.utcnow)

    supplier = relationship("Member", back_populates="manure_supplies")


class BiogasProduction(Base):
    """Modul 2: Produksi biogas harian dari instalasi digester."""
    __tablename__ = "biogas_productions"

    id = Column(Integer, primary_key=True, index=True)
    production_date = Column(Date, nullable=False)
    input_volume_kg = Column(Float, nullable=False)
    biogas_volume_m3 = Column(Float, nullable=False)
    households_served = Column(Integer, default=0)
    digester_status = Column(String, default="normal")  # normal, gangguan_ringan, gangguan_berat
    temperature_celsius = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    recorded_at = Column(DateTime, default=datetime.utcnow)


class FertilizerDistribution(Base):
    """Modul 3: Distribusi pupuk organik cair/padat ke kelompok tani."""
    __tablename__ = "fertilizer_distributions"

    id = Column(Integer, primary_key=True, index=True)
    recipient_id = Column(Integer, ForeignKey("members.id"), nullable=False)
    distribution_date = Column(Date, nullable=False)
    fertilizer_type = Column(String, nullable=False)  # cair, padat
    quantity = Column(Float, nullable=False)
    unit = Column(String, default="liter")  # liter, kg
    notes = Column(Text, nullable=True)
    recorded_at = Column(DateTime, default=datetime.utcnow)

    recipient = relationship("Member", back_populates="fertilizer_receipts")


class MaintenanceLog(Base):
    """Catatan pemeliharaan dan gangguan instalasi biodigester."""
    __tablename__ = "maintenance_logs"

    id = Column(Integer, primary_key=True, index=True)
    log_date = Column(Date, nullable=False)
    log_type = Column(String, nullable=False)  # routine_maintenance, repair, inspection, training
    description = Column(Text, nullable=False)
    status = Column(String, default="resolved")  # resolved, ongoing, pending
    technician = Column(String, nullable=True)
    cost_idr = Column(Float, default=0.0)
    recorded_at = Column(DateTime, default=datetime.utcnow)
