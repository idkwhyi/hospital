from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import models, crud, schemas
from auth import require_role
from database import get_db

router = APIRouter(
  prefix="/appointments",
  tags=['Appointments']
)

@router.post("/",response_model=schemas.AppointmentOut)
def create_appointment(
  appointment_data : schemas.AppointmentCreate,
  db: Session=Depends(get_db),
  current_user = Depends(require_role(['staff','admin']))
):
  return crud.create_appointment(db, appointment_data)

@router.get("/",response_model=list[schemas.AppointmentOut])
def list_appointments(
  db: Session=Depends(get_db),
  current_user = Depends(require_role(['doctor','admin']))
):
  return crud.get_appointments(db)

@router.put("/{appointment_id}",response_model=schemas.AppointmentOut)
def update_appointment(
  appointment_id : int,
  appointment_data: schemas.AppointmentCreate,
  db:Session = Depends(get_db),
  current_user = Depends(require_role(['admin','staff']))
):
  db_appointment = crud.get_appointment_by_id(db,appointment_id)
  if not db_appointment:
    raise HTTPException(
      status_code=404,
      detail='Appointment not found'
    )
  return crud.update_appointment(db,db_appointment,appointment_data)

@router.delete("/{appointment_id}",status_code=status.HTTP_204_NO_CONTENT)
def delete_appointment(
  appointment_id: int,
  db: Session = Depends(get_db),
  current_user = Depends(require_role(['admin']))
):
  db_appointment = crud.get_appointment_by_id(db, appointment_id)
  if not db_appointment:
    raise HTTPException(
      status_code=404,
      detail='Appointment not found'
    )
  crud.delete_appointment(db, db_appointment)
  return {'message':'Appointment deleted successfully'}
