from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import schemas, crud
from auth import require_role
from database import Sessions, get_db

router = APIRouter(
  prefix="/patients",
  tags=["Patients"]
)

@router.post("/",response_model=schemas.PatientOut)
def create_patient(
    patient: schemas.PatientCreate,
    db: Session=Depends(get_db),
    current_user = Depends(require_role(['admin','staff']))
):
   return crud.create_patient(db, patient)

@router.get("/",response_model=list[schemas.PatientOut])
def list_patients(
   db: Session=Depends(get_db),
   current_user=Depends(require_role(['admin','doctor']))
):
   return crud.get_patients(db)

@router.put("/{patient_id}",response_model=schemas.PatientOut)
def update_patient(
   patient_id: int,
   updated_data: schemas.PatientCreate,
   db: Session = Depends(get_db),
   current_user = Depends(require_role(['admin','staff']))
):
   db_patient= crud.get_patient_by_id(db, patient_id)
   if not db_patient:
      raise HTTPException(
         status_code=404,
         detail='Patient not found'
      )
   return crud.update_patient(db, db_patient,updated_data)

@router.delete("/{patient_id}")
def delete_patient(
   patient_id: int,
   db: Session = Depends(get_db),
   current_user = Depends(require_role(['admin']))
):
   db_patient = crud.get_patient_by_id(db,patient_id)
   if not db_patient:
      raise HTTPException(
         status_code=404,
         detail='Patient not found'
      )
   crud.delete_patient(db,db_patient)
   return {"message":f"Patient with id {patient_id} has been deleted successfully"}