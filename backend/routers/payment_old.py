from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import schemas, models, crud, config
from schemas import PaymentItemCreate, PaymentOutWithItems, PaymentItemOut
from auth import require_role
from database import get_db
import requests

router = APIRouter(
  prefix="/payments",
  tags=['payments']
)

@router.post("/", response_model=schemas.PaymentOut)
def create_payment(
  payment: schemas.PaymentCreate,
  db: Session=Depends(get_db),
  current_user = Depends(require_role(['staff','admin']))
):
  return crud.create_payment(db, payment)

@router.post("/create_midtrans/")
def create_midtrans_payment(
  payment: schemas.PaymentCreate,
  db: Session = Depends(get_db),
  current_user = Depends(require_role(['staff','admin']))
):
  db_payment = crud.create_payment(db, payment)

  url = "https://app.sandbox.midtrans.com/snap/v1/transactions"
  headers = {
    "Authorization":f"Basic {config.MIDTRANS_AUTH_KEY}",
    "Content-Type":"application/json"
  }

  payload = {
    "payment_type": "bank_transfer",
    "transaction_details":{
      "order_id": f"PAY-{db_payment.id}",
      "gross_amount": db_payment.amount
    },
    "bank":{
      "enable_callback":True,
      "callback_url": "http://localhost:8000/payments/notification"
    }
  }

  response = requests.post(url, json=payload,headers=headers)
  if response.status_code != 201:
    raise HTTPException(
      status_code=400,
      detail=response.text
    )
  data = response.json()
  db_payment.transaction_id = data['transaction_id']
  db.commit()
  db.refresh(db_payment)

  actions = data.get('actions',[])
  redirect_url : str | None = None
  if len(actions) > 1 and isinstance(actions[1],dict):
    redirect_url = actions[1].get('url')

  return{
    "message":"Payment created in Midtrans Sandbox",
    "payment_id": db_payment.id,
    "redirect_url": redirect_url
  }

@router.post("/notification")
def midtrans_notification(payload: dict, db: Session=Depends(get_db)):
  transaction_id: str | None = payload.get("transaction_id")
  transaction_status: str | None = payload.get("transaction_status")

  if not transaction_id:
    raise HTTPException(
      status_code=400,
      detail="Missing transaction_id"
    )
  
  status_map = {
    "settlement": "paid",
    "capture": "paid",
    "pending": "pending",
    "deny": "failed",
    "cancel": "failed",
    "expire": "failed"
  }

  new_status = status_map.get(transaction_status,"pending")
  crud.update_payment_status(db, transaction_id, new_status)

  return {"message": f"Payment status updated to {new_status}"}

@router.post("/{payment_id}/items",response_model=PaymentItemOut)
def add_payment_item(
  payment_id: int,
  item: PaymentItemCreate,
  db: Session = Depends(get_db),
  current_user = Depends(require_role(['admin','staff']))
):
  return crud.create_payment_item(db, payment_id, item)

@router.get("/{payment_id}", response_model=PaymentOutWithItems)
def get_payment_detail(
  payment_id: int,
  db: Session= Depends(get_db),
  current_user = Depends(require_role(['admin','staff']))
):
  payment = crud.get_payment_with_items(db,payment_id)
  if not payment:
    raise HTTPException(
      status_code=404,
      detail="Payment not found"
    )
  return payment