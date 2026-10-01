from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime


# --- USER / AUTH -------------------------------------------------------------
class UserCreate(BaseModel):
    username: str
    password: str
    role: str = "kps"

class UserResponse(BaseModel):
    id: int
    username: str
    role: str
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    username: str
    user_id: Optional[int] = None
    member_id: Optional[int] = None


# --- MEMBER ------------------------------------------------------------------
class MemberCreate(BaseModel):
    name: str
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    member_type: str  # peternak | kelompok_tani
    livestock_type: Optional[str] = None
    livestock_count: Optional[int] = None
    village: Optional[str] = "Kota Jantho"
    capacity_info: Optional[str] = None
    is_active: Optional[bool] = True

class MemberUpdate(BaseModel):
    name: Optional[str] = None
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    member_type: Optional[str] = None
    livestock_type: Optional[str] = None
    livestock_count: Optional[int] = None
    village: Optional[str] = None
    capacity_info: Optional[str] = None
    is_active: Optional[bool] = None

class MemberResponse(BaseModel):
    id: int
    name: str
    contact_person: Optional[str]
    phone: Optional[str]
    address: Optional[str]
    member_type: str
    livestock_type: Optional[str]
    livestock_count: Optional[int]
    village: Optional[str] = "Kota Jantho"
    capacity_info: Optional[str] = None
    is_active: bool = True
    registered_at: datetime
    class Config:
        from_attributes = True


# --- MANURE SUPPLY -----------------------------------------------------------
class ManureSupplyCreate(BaseModel):
    supplier_id: int
    supply_date: date
    livestock_type: str
    volume_kg: float = Field(gt=0)
    moisture_content: Optional[float] = 75.0
    water_ratio: Optional[float] = 1.0
    notes: Optional[str] = None

class ManureSupplyUpdate(BaseModel):
    supply_date: Optional[date] = None
    livestock_type: Optional[str] = None
    volume_kg: Optional[float] = None
    moisture_content: Optional[float] = None
    water_ratio: Optional[float] = None
    notes: Optional[str] = None

class ManureSupplyResponse(BaseModel):
    id: int
    supplier_id: int
    supply_date: date
    livestock_type: str
    volume_kg: float
    moisture_content: Optional[float] = 75.0
    water_ratio: float
    notes: Optional[str]
    recorded_at: datetime
    supplier: Optional[MemberResponse] = None
    class Config:
        from_attributes = True


# --- BIOGAS PRODUCTION -------------------------------------------------------
class BiogasProductionCreate(BaseModel):
    production_date: date
    input_volume_kg: float = Field(gt=0)
    biogas_volume_m3: float = Field(gt=0)
    gas_pressure_bar: Optional[float] = 1.2
    ph_level: Optional[float] = 7.2
    households_served: int = 0
    digester_status: str = "normal"
    temperature_celsius: Optional[float] = None
    notes: Optional[str] = None

class BiogasProductionUpdate(BaseModel):
    production_date: Optional[date] = None
    input_volume_kg: Optional[float] = None
    biogas_volume_m3: Optional[float] = None
    gas_pressure_bar: Optional[float] = None
    ph_level: Optional[float] = None
    households_served: Optional[int] = None
    digester_status: Optional[str] = None
    temperature_celsius: Optional[float] = None
    notes: Optional[str] = None

class BiogasProductionResponse(BaseModel):
    id: int
    production_date: date
    input_volume_kg: float
    biogas_volume_m3: float
    gas_pressure_bar: Optional[float] = 1.2
    ph_level: Optional[float] = 7.2
    households_served: int
    digester_status: str
    temperature_celsius: Optional[float]
    notes: Optional[str]
    recorded_at: datetime
    class Config:
        from_attributes = True


# --- AI / FORECAST -----------------------------------------------------------
class AIChatRequest(BaseModel):
    message: str

class AIChatResponse(BaseModel):
    response: str


# --- FERTILIZER DISTRIBUTION -------------------------------------------------
class FertilizerDistributionCreate(BaseModel):
    recipient_id: int
    distribution_date: date
    fertilizer_type: str  # cair | padat
    quantity: float = Field(gt=0)
    unit: str = "liter"
    notes: Optional[str] = None

class FertilizerDistributionUpdate(BaseModel):
    distribution_date: Optional[date] = None
    fertilizer_type: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    notes: Optional[str] = None

class FertilizerDistributionResponse(BaseModel):
    id: int
    recipient_id: int
    distribution_date: date
    fertilizer_type: str
    quantity: float
    unit: str
    notes: Optional[str]
    recorded_at: datetime
    recipient: Optional[MemberResponse] = None
    class Config:
        from_attributes = True


# --- MAINTENANCE LOG ---------------------------------------------------------
class MaintenanceLogCreate(BaseModel):
    log_date: date
    log_type: str
    description: str
    status: str = "resolved"
    technician: Optional[str] = None
    cost_idr: float = 0.0

class MaintenanceLogUpdate(BaseModel):
    log_date: Optional[date] = None
    log_type: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    technician: Optional[str] = None
    cost_idr: Optional[float] = None

class MaintenanceLogResponse(BaseModel):
    id: int
    log_date: date
    log_type: str
    description: str
    status: str
    technician: Optional[str]
    cost_idr: float
    recorded_at: datetime
    class Config:
        from_attributes = True
