from sqlalchemy.orm import Session
import models,schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def hash_password(password: str) -> str:
  return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
  return pwd_context.verify(plain_password, hashed_password)

def create_user(db:Session, user:schemas.UserCreate):
  hashed_pw = hash_password(user.password)
  db_user = models.User(username = user.username,password_hash= hashed_pw,role = user.role,branch=user.branch)
  db.add(db_user)
  db.commit()
  db.refresh(db_user)
  return db_user

def get_user(db: Session, username: str):
  return db.query(models.User).filter(models.User.username == username).first()

def get_all_users(db: Session, role: str | None = None):
    query = db.query(models.User)
    if role:
        query = query.filter(models.User.role == role)
    return query.all()

def update_user(db: Session, user_id: int, user_data: schemas.UserUpdate):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not user:
        return None
    
    if user_data.password is not None and user_data.password.strip() != "":
        user.password = hash_password(user_data.password)
    
    if user_data.role is not None:
        user.role = user_data.role
    
    if user_data.branch is not None:
        user.branch = user_data.branch
    
    db.commit()
    db.refresh(user)
    
    return user

def delete_user(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        return None

    db.delete(user)
    db.commit()

    return user

def create_patient(db: Session, patient: schemas.PatientCreate):
  db_patient = models.Patient(**patient.dict())
  db.add(db_patient)
  db.commit()
  db.refresh(db_patient)
  return db_patient

def get_patients(db: Session):
  return db.query(models.Patient).all()

def get_patient_by_id(db: Session, patient_id: int):
  return db.query(models.Patient).filter(models.Patient.id == patient_id).first()

def update_patient(db: Session, db_patient: models.Patient, update_data: schemas.PatientCreate):
  for key, value in update_data.dict().items():
    setattr(db_patient, key, value)
  db.commit()
  db.refresh(db_patient)
  return db_patient

def delete_patient(db: Session, db_patient: models.Patient):
  db.delete(db_patient)
  db.commit()

# Appointment
def create_appointment(db: Session, appointment: schemas.AppointmentCreate):
  db_appt = models.Appointment(**appointment.dict())
  db.add(db_appt)
  db.commit()
  db.refresh(db_appt)
  return db_appt

def get_appointments(db: Session):
  return db.query(models.Appointment).all()

def get_appointment_by_id(db: Session, appointment_id : int):
  return db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()

def update_appointment(db: Session, db_appointment: models.Appointment, updated_data: schemas.AppointmentCreate):
  for key, value in updated_data.dict().items():
    setattr(db_appointment,key,value)
  db.commit()
  db.refresh(db_appointment)
  return db_appointment

def delete_appointment(db: Session, db_appointment: models.Appointment):
  db.delete(db_appointment)
  db.commit()

def create_medical_record(db: Session, record: schemas.MedicalRecordCreate):
  db_record = models.MedicalRecord(**record.dict())
  db.add(db_record)
  db.commit()
  db.refresh(db_record)
  return db_record

def get_medical_records_by_patient(db: Session, patient_id: int):
  return db.query(models.MedicalRecord).filter(models.MedicalRecord.patient_id == patient_id).all()

def create_payment(db: Session, payment: schemas.PaymentCreate):
  db_payment = models.Payment(
    appointment_id = payment.appointment_id,
    amount=payment.amount,
    payment_method=payment.payment_method,
    status='pending'
  )
  db.add(db_payment)
  db.commit()
  db.refresh(db_payment)
  return db_payment

def update_payment_status(db:Session, transaction_id:str, new_status: str):
  db_payment = db.query(models.Payment).filter(models.Payment.transaction_id == transaction_id).first()
  if db_payment:
    db_payment.status = new_status
    if new_status == 'paid':
      from datetime import datetime
      db_payment.payment_date = datetime.now()
    db.commit()
    db.refresh(db_payment)
  return db_payment

def create_payment_item(db: Session, payment_id: int, item: schemas.PaymentItemCreate):
  total = item.quantity * item.price
  db_item = models.PaymentItem(
    payment_id = payment_id,
    description=item.description,
    quantity=item.quantity,
    price=item.price,
    total=total
  )
  db.add(db_item)
  db.commit()
  db.refresh(db_item)
  return db_item

def get_payment_with_items(db: Session, payment_id: int):
  payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()
  return payment