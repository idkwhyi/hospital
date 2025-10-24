from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserLogin(BaseModel):
  username: str
  password: str

class UserCreate(BaseModel):
  username: str
  password: str
  role: str
  branch: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None
    branch: Optional[str] = None

class UserOut(BaseModel):
  id: int
  username: str
  role: str
  branch: str
  class Config:
      from_attributes = True

class PatientCreate(BaseModel):
  name: str
  national_id: str
  phone: str
  address: str

class PatientOut(BaseModel):
  id: int
  name: str
  national_id: str
  phone: str
  address: str
  class Config:
      from_attributes = True

class AppointmentCreate(BaseModel):
  patient_id: int
  doctor_id: int
  scheduled_at: datetime

class AppointmentOut(BaseModel):
  id: int
  patient_id: int
  doctor_id: int
  scheduled_at: datetime
  status: str
  class Config:
      from_attributes = True

class AppointmentDetail(BaseModel):
  id: int
  patient_id: int
  doctor_id: int
  scheduled_at: datetime
  status: str

  class Config:
     from_attributes = True

class MedicalRecordBase(BaseModel):
  appointment_id: int
  patient_id: int
  doctor_id: int
  diagnosis: str
  treatment: str
  notes: str

class MedicalRecordCreate(MedicalRecordBase):
  pass

class MedicalRecord(MedicalRecordBase):
  id: int
  created_at: datetime

  class Config:
    from_attributes = True

class PaymentBase(BaseModel):
  appointment_id: int
  amount: float
  payment_method: str

class PaymentCreate(PaymentBase):
  pass

class PaymentOut(PaymentBase):
  id: int
  status: str
  transaction_id: str | None = None
  payment_date: datetime | None = None

  class Config:
    from_attributes = True

class PaymentItemBase(BaseModel):
  description: str
  quantity: int = 1
  price: float

class PaymentItemCreate(PaymentItemBase):
  pass

class PaymentItemOut(PaymentItemBase):
  id: int
  total: float

  class Config:
    from_attributes = True
  
class PaymentOutWithItems(PaymentOut):
  items: list[PaymentItemOut]=[]