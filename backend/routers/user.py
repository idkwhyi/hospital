from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
import models, schemas, crud
from auth import get_current_user,require_role
from database import get_db
from crud import hash_password, get_all_users

router = APIRouter(
  prefix="/users",
  tags=["Users"]
)

# Only admin can create new user
@router.post("/",response_model=schemas.UserOut)
def create_user(
    user_data: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != 'admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Hanya admin yang dapat membuat user baru"
        )
    existing_user = db.query(models.User).filter(models.User.username == user_data.username).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Username sudah terdaftar'
        )
    return crud.create_user(db, user_data)

@router.get("/", response_model=list[schemas.UserOut])
def list_users(
    role: str | None = Query(None, description="Filter berdasarkan role user"),
    db: Session = Depends(get_db),
    current_user = Depends(require_role(['admin']))
):
    users = crud.get_all_users(db, role=role)
    return users

@router.put("/{user_id}", response_model=schemas.UserOut)
def update_user(
    user_id: int,
    user_data: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role(['admin']))
):
    updated_user = crud.update_user(db, user_id, user_data)
    
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='User tidak ditemukan'
        )
    
    return updated_user

@router.delete("/{user_id}",status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    db: Session = Depends(require_role(['admin']))
):
    deleted = crud.delete_user(db, user_id)
    
    if not deleted:
        raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail='User tidak ditemukan'
    )

    return {"message":"User berhasil di hapus"}
