from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas, crud
from auth import require_role

router = APIRouter(
  prefix="/medical_records",
  tags=['Medical Records']
)

@router.post("/",response_model= schemas.MedicalRecord)
def create_medical_record(record: schemas.MedicalRecordCreate,db: Session = Depends(get_db), current_user: models.User =Depends(require_role(['doctor']))):
  if record.doctor_id != current_user.id:
    raise HTTPException(
      status_code=403,
      detail="You do not have permission"
    )
  return crud.create_medical_record(db, record)

@router.get("/patient/{patient_id}", response_model=list[schemas.MedicalRecord])
def get_medical_records(patient_id: int, db: Session= Depends(get_db), current_user: models.User=Depends(require_role(['doctor']))):
  records = crud.get_medical_records_by_patient(db,patient_id)
  if not records:
    raise HTTPException(
      status_code=404,
      detail='No medical records found for this patient'
    )
  return records
