from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import models, schemas, crud
from auth import get_current_user,require_role
from database import get_db
from crud import hash_password

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
  existing_user = db.query(models.User).filter(models.User.username == user_data).first()
  if existing_user:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail='Username sudah terdaftar'
    )
  return crud.create_user(db, user_data)
  
@router.get("/",response_model=list[schemas.UserOut])
def list_users(
  db: Session = Depends(get_db),
  current_user = Depends(require_role(['admin']))
):
  users = crud.get_all_users(db)
  return users

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
