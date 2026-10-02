from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import List, Optional
import jwt
from app.core.database import get_db
from app.core import security
from app.crud import crud
from app.schemas import schemas
from app.models import models

router = APIRouter()


# --- AUTH DEPENDENCY & ENDPOINTS ----------------------------------------------
def get_current_user(
    token: Optional[str] = None,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> models.User:
    """
    FastAPI dependency to extract and validate current authenticated user via JWT.
    Supports both Authorization: Bearer <jwt> header and ?token=<jwt> parameter.
    """
    raw_token = token
    if not raw_token and authorization:
        raw_token = authorization.replace("Bearer ", "").strip()
    if not raw_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Autentikasi diperlukan. Token tidak ditemukan.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = security.decode_access_token(raw_token)
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sesi login telah kedaluwarsa. Silakan login kembali.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token autentikasi tidak valid.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token autentikasi tidak valid.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub") or payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Identitas pengguna tidak ditemukan dalam token.")

    user = db.query(models.User).filter(models.User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pengguna tidak ditemukan.")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Akun pengguna nonaktif.")
    return user


@router.get("/auth/login", tags=["Auth"])
@router.get("/auth/login/", tags=["Auth"], include_in_schema=False)
def login_get_info():
    """Information endpoint for GET requests to /auth/login to avoid 405 Method Not Allowed."""
    return {
        "status": "online",
        "service": "JANEGAS Auth API",
        "method_required": "POST",
        "expected_payload": {"username": "admin", "password": "..." },
        "portal_url": "https://janegas.navablue.com"
    }


@router.post("/auth/login", response_model=schemas.LoginResponse, tags=["Auth"])
@router.post("/auth/login/", response_model=schemas.LoginResponse, tags=["Auth"], include_in_schema=False)
def login(login_req: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, login_req.username, login_req.password)
    if not user:
        raise HTTPException(status_code=401, detail="Username atau password salah")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Akun tidak aktif")
    member = db.query(models.Member).filter(models.Member.user_id == user.id).first()

    # Generate standard cryptographic JWT token
    access_token = security.create_access_token(data={
        "sub": str(user.id),
        "username": user.username,
        "role": user.role
    })

    return schemas.LoginResponse(
        access_token=access_token,
        role=user.role,
        username=user.username,
        user_id=user.id,
        member_id=member.id if member else None
    )


@router.get("/auth/users/me", response_model=schemas.UserResponse, tags=["Auth"])
def get_current_user_info(current_user: models.User = Depends(get_current_user)):
    return current_user


# --- MEMBERS -----------------------------------------------------------------
@router.get("/members/", response_model=List[schemas.MemberResponse], tags=["Members"])
def read_members(skip: int = 0, limit: int = 100, member_type: Optional[str] = None, db: Session = Depends(get_db)):
    return crud.get_members(db, skip=skip, limit=limit, member_type=member_type)

@router.post("/members/", response_model=schemas.MemberResponse, tags=["Members"])
def create_member(member: schemas.MemberCreate, db: Session = Depends(get_db)):
    return crud.create_member(db, member)

@router.put("/members/{member_id}", response_model=schemas.MemberResponse, tags=["Members"])
def update_member(member_id: int, member_update: schemas.MemberUpdate, db: Session = Depends(get_db)):
    result = crud.update_member(db, member_id, member_update)
    if not result:
        raise HTTPException(status_code=404, detail="Anggota tidak ditemukan")
    return result

@router.delete("/members/{member_id}", tags=["Members"])
def delete_member(member_id: int, db: Session = Depends(get_db)):
    success = crud.delete_member(db, member_id)
    if not success:
        raise HTTPException(status_code=404, detail="Anggota tidak ditemukan")
    return {"message": "Anggota berhasil dihapus"}


# --- MANURE SUPPLIES ---------------------------------------------------------
@router.get("/manure/", response_model=List[schemas.ManureSupplyResponse], tags=["Manure Supply"])
def read_manure_supplies(skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    return crud.get_manure_supplies(db, skip=skip, limit=limit)

@router.post("/manure/", response_model=schemas.ManureSupplyResponse, tags=["Manure Supply"])
def create_manure_supply(supply: schemas.ManureSupplyCreate, db: Session = Depends(get_db)):
    return crud.create_manure_supply(db, supply)

@router.put("/manure/{supply_id}", response_model=schemas.ManureSupplyResponse, tags=["Manure Supply"])
def update_manure_supply(supply_id: int, supply_update: schemas.ManureSupplyUpdate, db: Session = Depends(get_db)):
    result = crud.update_manure_supply(db, supply_id, supply_update)
    if not result:
        raise HTTPException(status_code=404, detail="Data pasokan tidak ditemukan")
    return result

@router.delete("/manure/{supply_id}", tags=["Manure Supply"])
def delete_manure_supply(supply_id: int, db: Session = Depends(get_db)):
    success = crud.delete_manure_supply(db, supply_id)
    if not success:
        raise HTTPException(status_code=404, detail="Data pasokan tidak ditemukan")
    return {"message": "Data pasokan berhasil dihapus"}


# --- BIOGAS PRODUCTIONS ------------------------------------------------------
@router.get("/biogas/", response_model=List[schemas.BiogasProductionResponse], tags=["Biogas Production"])
def read_biogas_productions(skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    return crud.get_biogas_productions(db, skip=skip, limit=limit)

@router.post("/biogas/", response_model=schemas.BiogasProductionResponse, tags=["Biogas Production"])
def create_biogas_production(prod: schemas.BiogasProductionCreate, db: Session = Depends(get_db)):
    return crud.create_biogas_production(db, prod)

@router.put("/biogas/{prod_id}", response_model=schemas.BiogasProductionResponse, tags=["Biogas Production"])
def update_biogas_production(prod_id: int, prod_update: schemas.BiogasProductionUpdate, db: Session = Depends(get_db)):
    result = crud.update_biogas_production(db, prod_id, prod_update)
    if not result:
        raise HTTPException(status_code=404, detail="Data produksi tidak ditemukan")
    return result

@router.delete("/biogas/{prod_id}", tags=["Biogas Production"])
def delete_biogas_production(prod_id: int, db: Session = Depends(get_db)):
    success = crud.delete_biogas_production(db, prod_id)
    if not success:
        raise HTTPException(status_code=404, detail="Data produksi tidak ditemukan")
    return {"message": "Data produksi berhasil dihapus"}


# --- FERTILIZER DISTRIBUTIONS ------------------------------------------------
@router.get("/fertilizer/", response_model=List[schemas.FertilizerDistributionResponse], tags=["Fertilizer"])
def read_fertilizer_distributions(skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    return crud.get_fertilizer_distributions(db, skip=skip, limit=limit)

@router.post("/fertilizer/", response_model=schemas.FertilizerDistributionResponse, tags=["Fertilizer"])
def create_fertilizer_distribution(dist: schemas.FertilizerDistributionCreate, db: Session = Depends(get_db)):
    return crud.create_fertilizer_distribution(db, dist)

@router.put("/fertilizer/{dist_id}", response_model=schemas.FertilizerDistributionResponse, tags=["Fertilizer"])
def update_fertilizer_distribution(dist_id: int, dist_update: schemas.FertilizerDistributionUpdate, db: Session = Depends(get_db)):
    result = crud.update_fertilizer_distribution(db, dist_id, dist_update)
    if not result:
        raise HTTPException(status_code=404, detail="Data distribusi tidak ditemukan")
    return result

@router.delete("/fertilizer/{dist_id}", tags=["Fertilizer"])
def delete_fertilizer_distribution(dist_id: int, db: Session = Depends(get_db)):
    success = crud.delete_fertilizer_distribution(db, dist_id)
    if not success:
        raise HTTPException(status_code=404, detail="Data distribusi tidak ditemukan")
    return {"message": "Data distribusi berhasil dihapus"}


# --- MAINTENANCE LOGS --------------------------------------------------------
@router.get("/maintenance/", response_model=List[schemas.MaintenanceLogResponse], tags=["Maintenance"])
def read_maintenance_logs(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return crud.get_maintenance_logs(db, skip=skip, limit=limit)

@router.post("/maintenance/", response_model=schemas.MaintenanceLogResponse, tags=["Maintenance"])
def create_maintenance_log(log: schemas.MaintenanceLogCreate, db: Session = Depends(get_db)):
    return crud.create_maintenance_log(db, log)

@router.put("/maintenance/{log_id}", response_model=schemas.MaintenanceLogResponse, tags=["Maintenance"])
def update_maintenance_log(log_id: int, log_update: schemas.MaintenanceLogUpdate, db: Session = Depends(get_db)):
    result = crud.update_maintenance_log(db, log_id, log_update)
    if not result:
        raise HTTPException(status_code=404, detail="Log tidak ditemukan")
    return result

@router.delete("/maintenance/{log_id}", tags=["Maintenance"])
def delete_maintenance_log(log_id: int, db: Session = Depends(get_db)):
    success = crud.delete_maintenance_log(db, log_id)
    if not success:
        raise HTTPException(status_code=404, detail="Log tidak ditemukan")
    return {"message": "Log berhasil dihapus"}


# --- DASHBOARD SUMMARY -------------------------------------------------------
@router.get("/dashboard/summary", tags=["Dashboard"])
def get_dashboard_summary(db: Session = Depends(get_db)):
    from sqlalchemy import func
    from app.models.models import ManureSupply, BiogasProduction, FertilizerDistribution, Member

    # Aggregates
    total_manure_kg = db.query(func.sum(ManureSupply.volume_kg)).scalar() or 0.0
    total_biogas_m3 = db.query(func.sum(BiogasProduction.biogas_volume_m3)).scalar() or 0.0
    total_fertilizer = db.query(func.sum(FertilizerDistribution.quantity)).scalar() or 0.0
    total_peternak = db.query(func.count(Member.id)).filter(Member.member_type == "peternak").scalar() or 0
    total_tani = db.query(func.count(Member.id)).filter(Member.member_type == "kelompok_tani").scalar() or 0

    # Latest 30 days of production for trend chart
    from datetime import date, timedelta
    thirty_days_ago = date.today() - timedelta(days=30)
    recent_biogas = db.query(BiogasProduction).filter(
        BiogasProduction.production_date >= thirty_days_ago
    ).order_by(BiogasProduction.production_date.asc()).all()

    # Aggregated 30 days of manure supply for trend chart
    recent_manure = db.query(
        ManureSupply.supply_date,
        func.sum(ManureSupply.volume_kg).label("volume_kg")
    ).filter(
        ManureSupply.supply_date >= thirty_days_ago
    ).group_by(
        ManureSupply.supply_date
    ).order_by(
        ManureSupply.supply_date.asc()
    ).all()

    # Recent activity log (latest 10)
    recent_supply_log = db.query(ManureSupply).order_by(ManureSupply.recorded_at.desc()).limit(5).all()
    recent_prod_log = db.query(BiogasProduction).order_by(BiogasProduction.recorded_at.desc()).limit(5).all()
    recent_dist_log = db.query(FertilizerDistribution).order_by(FertilizerDistribution.recorded_at.desc()).limit(5).all()

    # Max households served (capacity indicator)
    max_hh = db.query(func.max(BiogasProduction.households_served)).scalar() or 0

    from app.core.database import db_status_note, is_serverless, engine
    is_ephemeral = is_serverless and "sqlite" in str(engine.url)

    # Bio-Energy Forecast
    try:
        from app.services.forecaster import calculate_janegas_forecast
        forecast = calculate_janegas_forecast(db)
    except Exception as e:
        import logging
        logging.error(f"[Dashboard] Forecast calculation failed: {e}")
        forecast = None

    return {
        "kpi": {
            "total_manure_kg": round(total_manure_kg, 1),
            "total_biogas_m3": round(total_biogas_m3, 2),
            "total_fertilizer_liter_kg": round(total_fertilizer, 1),
            "total_peternak": total_peternak,
            "total_tani": total_tani,
            "total_beneficiaries": total_peternak + total_tani,
            "max_households_served": max_hh,
        },
        "forecast": forecast,
        "trend_biogas": [
            {
                "date": str(p.production_date),
                "biogas_m3": p.biogas_volume_m3,
                "input_kg": p.input_volume_kg,
                "hh_served": p.households_served
            } for p in recent_biogas
        ],
        "trend_manure": [
            {
                "date": str(s.supply_date),
                "volume_kg": round(float(s.volume_kg), 1),
            } for s in recent_manure
        ],
        "recent_supply_log": [
            {
                "id": s.id,
                "date": str(s.supply_date),
                "type": "supply",
                "desc": f"Pasokan {s.volume_kg} kg ({s.livestock_type})",
                "supplier_id": s.supplier_id
            } for s in recent_supply_log
        ],
        "recent_prod_log": [
            {
                "id": p.id,
                "date": str(p.production_date),
                "type": "production",
                "desc": f"Produksi {p.biogas_volume_m3} m3 biogas, {p.households_served} KK dilayani",
                "status": p.digester_status
            } for p in recent_prod_log
        ],
        "recent_dist_log": [
            {
                "id": d.id,
                "date": str(d.distribution_date),
                "type": "distribution",
                "desc": f"Distribusi {d.quantity} {d.unit} pupuk {d.fertilizer_type}",
                "recipient_id": d.recipient_id
            } for d in recent_dist_log
        ],
        "db_status_note": db_status_note,
        "is_ephemeral": is_ephemeral
    }


# --- FORECAST & AI ADVISOR ----------------------------------------------------
@router.get("/forecast/predict", tags=["Forecast & AI"])
def get_bioenergy_forecast(db: Session = Depends(get_db)):
    from app.services.forecaster import calculate_janegas_forecast
    try:
        result = calculate_janegas_forecast(db)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal menghitung peramalan: {str(e)}")


@router.post("/forecast/chat", response_model=schemas.AIChatResponse, tags=["Forecast & AI"])
def chat_with_janegas_ai(request: schemas.AIChatRequest, db: Session = Depends(get_db)):
    from app.services.gemini_service import analyze_janegas_with_gemini
    try:
        response_text = analyze_janegas_with_gemini(db, request.message)
        return schemas.AIChatResponse(response=response_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memproses konsultasi AI: {str(e)}")
