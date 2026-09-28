
# --- MEMBERS -----------------------------------------------------------------
def get_members(db: Session, skip: int = 0, limit: int = 100, member_type: Optional[str] = None):
    q = db.query(models.Member)
    if member_type:
        q = q.filter(models.Member.member_type == member_type)
    return q.offset(skip).limit(limit).all()

def get_member(db: Session, member_id: int):
    return db.query(models.Member).filter(models.Member.id == member_id).first()

def create_member(db: Session, member: schemas.MemberCreate):
    db_member = models.Member(**member.model_dump())
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

def update_member(db: Session, member_id: int, member_update: schemas.MemberUpdate):
    db_member = get_member(db, member_id)
    if not db_member:
        return None
    for field, value in member_update.model_dump(exclude_unset=True).items():
        setattr(db_member, field, value)
    db.commit()
    db.refresh(db_member)
    return db_member

def delete_member(db: Session, member_id: int) -> bool:
    db_member = get_member(db, member_id)
    if not db_member:
        return False
    db.delete(db_member)
    db.commit()
    return True


# --- MANURE SUPPLIES ---------------------------------------------------------
def get_manure_supplies(db: Session, skip: int = 0, limit: int = 500):
    return db.query(models.ManureSupply).order_by(models.ManureSupply.supply_date.desc()).offset(skip).limit(limit).all()

def get_manure_supply(db: Session, supply_id: int):
    return db.query(models.ManureSupply).filter(models.ManureSupply.id == supply_id).first()

def create_manure_supply(db: Session, supply: schemas.ManureSupplyCreate):
    db_supply = models.ManureSupply(**supply.model_dump())
    db.add(db_supply)
    db.commit()
    db.refresh(db_supply)
    return db_supply

def update_manure_supply(db: Session, supply_id: int, supply_update: schemas.ManureSupplyUpdate):
    db_supply = get_manure_supply(db, supply_id)
    if not db_supply:
        return None
    for field, value in supply_update.model_dump(exclude_unset=True).items():
        setattr(db_supply, field, value)
    db.commit()
    db.refresh(db_supply)
    return db_supply

def delete_manure_supply(db: Session, supply_id: int) -> bool:
    db_supply = get_manure_supply(db, supply_id)
    if not db_supply:
        return False
    db.delete(db_supply)
    db.commit()
    return True


# --- BIOGAS PRODUCTIONS ------------------------------------------------------
def get_biogas_productions(db: Session, skip: int = 0, limit: int = 500):
    return db.query(models.BiogasProduction).order_by(models.BiogasProduction.production_date.desc()).offset(skip).limit(limit).all()

def get_biogas_production(db: Session, prod_id: int):
    return db.query(models.BiogasProduction).filter(models.BiogasProduction.id == prod_id).first()

def create_biogas_production(db: Session, prod: schemas.BiogasProductionCreate):
    db_prod = models.BiogasProduction(**prod.model_dump())
    db.add(db_prod)
    db.commit()
    db.refresh(db_prod)
    return db_prod

def update_biogas_production(db: Session, prod_id: int, prod_update: schemas.BiogasProductionUpdate):
    db_prod = get_biogas_production(db, prod_id)
    if not db_prod:
        return None
    for field, value in prod_update.model_dump(exclude_unset=True).items():
        setattr(db_prod, field, value)
    db.commit()
    db.refresh(db_prod)
    return db_prod

def delete_biogas_production(db: Session, prod_id: int) -> bool:
    db_prod = get_biogas_production(db, prod_id)
    if not db_prod:
        return False
    db.delete(db_prod)
    db.commit()
    return True


# --- FERTILIZER DISTRIBUTIONS ------------------------------------------------
def get_fertilizer_distributions(db: Session, skip: int = 0, limit: int = 500):
    return db.query(models.FertilizerDistribution).order_by(models.FertilizerDistribution.distribution_date.desc()).offset(skip).limit(limit).all()

def get_fertilizer_distribution(db: Session, dist_id: int):
    return db.query(models.FertilizerDistribution).filter(models.FertilizerDistribution.id == dist_id).first()

def create_fertilizer_distribution(db: Session, dist: schemas.FertilizerDistributionCreate):
    db_dist = models.FertilizerDistribution(**dist.model_dump())
    db.add(db_dist)
    db.commit()
    db.refresh(db_dist)
    return db_dist

def update_fertilizer_distribution(db: Session, dist_id: int, dist_update: schemas.FertilizerDistributionUpdate):
    db_dist = get_fertilizer_distribution(db, dist_id)
    if not db_dist:
        return None
    for field, value in dist_update.model_dump(exclude_unset=True).items():
        setattr(db_dist, field, value)
    db.commit()
    db.refresh(db_dist)
    return db_dist

def delete_fertilizer_distribution(db: Session, dist_id: int) -> bool:
    db_dist = get_fertilizer_distribution(db, dist_id)
    if not db_dist:
        return False
    db.delete(db_dist)
    db.commit()
    return True


# --- MAINTENANCE LOGS --------------------------------------------------------
def get_maintenance_logs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.MaintenanceLog).order_by(models.MaintenanceLog.log_date.desc()).offset(skip).limit(limit).all()

def create_maintenance_log(db: Session, log: schemas.MaintenanceLogCreate):
    db_log = models.MaintenanceLog(**log.model_dump())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def update_maintenance_log(db: Session, log_id: int, log_update: schemas.MaintenanceLogUpdate):
    db_log = db.query(models.MaintenanceLog).filter(models.MaintenanceLog.id == log_id).first()
    if not db_log:
        return None
    for field, value in log_update.model_dump(exclude_unset=True).items():
        setattr(db_log, field, value)
    db.commit()
    db.refresh(db_log)
    return db_log

def delete_maintenance_log(db: Session, log_id: int) -> bool:
    db_log = db.query(models.MaintenanceLog).filter(models.MaintenanceLog.id == log_id).first()
    if not db_log:
        return False
    db.delete(db_log)
    db.commit()
    return True
