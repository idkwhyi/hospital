from fastapi import FastAPI, Depends , Query , HTTPException, status
from datetime import timedelta
from sqlalchemy.orm import Session
import models, schemas, crud, database, config
from database import Base, engines, Sessions, get_db
from auth import create_access_token, get_current_user, require_role, verify_token
from passlib.hash import argon2
from fastapi.openapi.utils import get_openapi
from routers import patient, user, appointment, medical_record, payment
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Clinic API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# for routing
app.include_router(patient.router)
app.include_router(user.router)
app.include_router(appointment.router)
app.include_router(medical_record.router)
app.include_router(payment.router)

for engine in engines.values():
  Base.metadata.create_all(bind=engine)

def custom_openapi():
  if app.openapi_schema:
      return app.openapi_schema
  openapi_schema = get_openapi(
      title="Clinic API",
      version="1.0.0",
      description="API untuk Klinik Terdistribusi",
      routes=app.routes,
  )
  openapi_schema["components"]["securitySchemes"] = {
      "BearerAuth": {
          "type": "http",
          "scheme": "bearer",
          "bearerFormat": "JWT"
      }
  }
  for path in openapi_schema["paths"].values():
      for method in path.values():
          method["security"] = [{"BearerAuth": []}]
  app.openapi_schema = openapi_schema
  return app.openapi_schema

app.openapi = custom_openapi

@app.post("/login/")
def login(
   user: schemas.UserLogin, db: Session = Depends(get_db)
   ):
  db_user = crud.get_user(db, user.username)
  if not db_user or not crud.verify_password(user.password, db_user.password_hash):
      raise HTTPException(status_code=401, detail="Invalid username or password")
  access_token_expires = timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
  access_token = create_access_token(data={'sub': db_user.username,'role': db_user.role,'branch': db_user.branch},expires_delta=access_token_expires)
  return {
     "access_token": access_token, 
     "token_type": "bearer",
     "message": f"Welcome {db_user.username}", 
     "role": db_user.role, 
     "branch": db_user.branch
     }

@app.get('/admin/dashboard')
def admin_dashboard(current_user = Depends(require_role(['admin']))):
   return {'message': f'Hello Admin {current_user.username}'}

@app.get('/doctor/dashboard')
def doctor_dashboard(current_user = Depends(require_role(['doctor']))):
   return {'message': f'Hello Doctor {current_user.username}'}

@app.get('/staff/dashboard')
def staff_dashboard(current_user = Depends(require_role(['staff']))):
   return {'message': f'Hello Staff {current_user.username}'}

@app.get('/patient/dashboard')
def patient_dashboard(current_user = Depends(require_role(['patient']))):
   return {'message': f'Hello Patient {current_user.username}'}

