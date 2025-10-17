from sqlalchemy import Column,String,Integer,TIMESTAMP,ForeignKey,Text, Float
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
  __tablename__ = 'users'
  id = Column(Integer, primary_key=True, index=True)
  username = Column(String, unique=True, index=True)
  password_hash = Column(String)
  role = Column(String)  
  branch = Column(String)

  appointments = relationship("Appointment", back_populates="doctor")

class Patient(Base):
  __tablename__ = 'patients'
  id= Column(Integer,primary_key=True,index=True)
  name= Column(String)
  national_id = Column(String)
  phone = Column(String)
  address = Column(Text)

  appointments = relationship("Appointment", back_populates="patient")
  medical_records = relationship("MedicalRecord",back_populates="patient")

class Appointment(Base):
  __tablename__ = "appointments"
  id = Column(Integer, primary_key=True, index=True)
  patient_id = Column(Integer, ForeignKey("patients.id"))
  doctor_id = Column(Integer, ForeignKey("users.id"))
  scheduled_at = Column(TIMESTAMP)
  status = Column(String, default="scheduled")

  patient = relationship("Patient",back_populates="appointments")
  doctor = relationship("User",back_populates="appointments")
  medical_record = relationship("MedicalRecord",back_populates="appointment",uselist=False)
  payment = relationship("Payment",back_populates="appointment",uselist=False)

class MedicalRecord(Base):
  __tablename__="medical_records"
  id= Column(Integer, primary_key=True, index=True)
  appointment_id = Column(Integer, ForeignKey("appointments.id", ondelete="CASCADE"))
  patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"))
  doctor_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
  diagnosis = Column(Text)
  treatment = Column(Text)
  notes = Column(Text)
  created_at = Column(TIMESTAMP, default=datetime.utcnow)

  appointment = relationship("Appointment",back_populates="medical_record")
  patient = relationship("Patient")
  doctor = relationship("User")

class Payment(Base):
  __tablename__ = 'payments'
  id = Column(Integer, primary_key=True, index=True)
  appointment_id = Column(Integer, ForeignKey('appointments.id'))
  amount = Column(Float,nullable=False)
  payment_method = Column(String, nullable=False)
  status= Column(String, default='pending')
  transaction_id = Column(String, nullable=True)
  payment_date = Column(TIMESTAMP, nullable=True)
  invoice_entries = Column(String)
  created_date = Column(TIMESTAMP)
  
  appointment = relationship("Appointment",back_populates="payment")
  items = relationship("PaymentItem", back_populates="payment", cascade="all, delete-orphan")

class PaymentItem(Base):
  __tablename__ = 'payment_items'
  id= Column(Integer, primary_key=True, index=True)
  payment_id = Column(Integer, ForeignKey('payments.id'))
  description = Column(String, nullable=False)
  quantity = Column(Integer, default=1)
  price = Column(Float, nullable=False)
  total = Column(Float, nullable=True)

  payment = relationship("Payment",back_populates="items")

