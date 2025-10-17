from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from fastapi import Depends, HTTPException, Query

# localhost disesuaikan
DATABASES = {
    "central": "postgresql://postgres:120404@localhost/central",
    "branch_a": "postgresql://postgres:120404@localhost/branch_a",
    "branch_b": "postgresql://postgres:120404@localhost/branch_b",
}

engines = {name: create_engine(url) for name,url in DATABASES.items()}
Sessions = {name: sessionmaker(bind=engine) for name, engine in engines.items()}

Base = declarative_base()

def get_db(branch: str = Query("central")):
    branch = branch.lower()
    if branch not in Sessions:
        raise HTTPException(
            status_code=400,
            detail=f"Branch '{branch}' not found. Available branches: {list(Sessions.keys())}"
        )
    db = Sessions[branch]()
    try:
        yield db
    finally:
        db.close()