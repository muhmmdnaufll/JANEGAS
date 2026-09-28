import os
import shutil
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import NullPool
from app.core.config import settings

# Normalize database URL
db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

# Adjust engine parameters based on database type
connect_args = {}
engine_kwargs = {
    "pool_pre_ping": True,  # Automatically checks and reconnects if database connection drops
}

is_serverless = bool(os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"))

if db_url.startswith("sqlite"):
    # check_same_thread is only needed for SQLite
    connect_args = {"check_same_thread": False}
    # In Vercel serverless, /var/task is read-only.
    # Redirect to /tmp/database.db if running on serverless platform (Vercel / Lambda)
    if is_serverless and "./database.db" in db_url:
        tmp_db_path = "/tmp/database.db"
        if not os.path.exists(tmp_db_path) and os.path.exists("./database.db"):
            try:
                shutil.copyfile("./database.db", tmp_db_path)
            except Exception:
                pass
        db_url = f"sqlite:///{tmp_db_path}"
else:
    # PostgreSQL (Neon, Supabase, etc.) — serverless stateless architecture
    # NullPool avoids holding stale connection pool across serverless cold/warm starts
    engine_kwargs["poolclass"] = NullPool
    if "sslmode" not in db_url:
        connect_args["sslmode"] = "require"
    connect_args["connect_timeout"] = 3

db_status_note = "ok"

if not db_url.startswith("sqlite"):
    try:
        engine = create_engine(
            db_url,
            connect_args=connect_args,
            **engine_kwargs
        )
        # Test connection to verify PostgreSQL is active (e.g. Supabase not paused)
        with engine.connect() as test_conn:
            pass
    except Exception as e:
        import logging
        db_status_note = f"PostgreSQL unavailable ({e}). Using embedded SQLite."
        logging.warning(db_status_note)
        fallback_url = "sqlite:////tmp/database.db" if is_serverless else "sqlite:///./database.db"
        if is_serverless:
            tmp_db_path = "/tmp/database.db"
            if not os.path.exists(tmp_db_path) and os.path.exists("./database.db"):
                try:
                    shutil.copyfile("./database.db", tmp_db_path)
                except Exception:
                    pass
        engine = create_engine(
            fallback_url,
            connect_args={"check_same_thread": False},
            pool_pre_ping=True
        )
else:
    engine = create_engine(
        db_url,
        connect_args=connect_args,
        **engine_kwargs
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get database session per request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
