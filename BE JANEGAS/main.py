from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base, SessionLocal
from app.models import models
from app.core.seeder import seed_database
from app.api.endpoints import router

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="JANEGAS Dashboard API",
    description="Backend API untuk sistem monitoring rantai pasok biogas komunitas Jantho Renewable Gas",
    version="1.0.0"
)

origins = [
    "https://janegas.navablue.com",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.navablue\.com|https://.*\.pages\.dev|https://.*\.workers\.dev",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed on startup
@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

# Support both with /api prefix and direct routes
app.include_router(router, prefix="/api")
app.include_router(router)

@app.get("/")
def root():
    return {"message": "JANEGAS API is running", "docs": "/docs"}
