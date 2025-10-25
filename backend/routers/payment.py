from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from backend import schemas, models, crud, config
from backend.schemas import PaymentItemCreate, PaymentOutWithItems, PaymentItemOut
from backend.auth import require_role
from backend.database import get_db
import midtransclient
import hashlib

router = APIRouter(
    prefix="/payments",
    tags=['payments']
)

# Initialize Midtrans Snap client
snap = midtransclient.Snap(
    is_production=False,
    server_key=config.MIDTRANS_SERVER_KEY,
    client_key=config.MIDTRANS_CLIENT_KEY
)

# Initialize Core API for transaction status
core_api = midtransclient.CoreApi(
    is_production=False,
    server_key=config.MIDTRANS_SERVER_KEY,
    client_key=config.MIDTRANS_CLIENT_KEY
)


@router.post("/", response_model=schemas.PaymentOut)
def create_payment(
    payment: schemas.PaymentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(['staff', 'admin']))
):
    return crud.create_payment(db, payment)


@router.post("/create-snap-token")
def create_snap_payment(
    payment: schemas.PaymentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(['staff', 'admin']))
):
    """
    Create payment using Midtrans Snap (for various payment methods)
    Returns snap_token for frontend integration
    """
    # Create payment record in database
    db_payment = crud.create_payment(db, payment)
    
    # Build transaction parameter
    transaction_params = {
        "transaction_details": {
            "order_id": "test-transaction-123",
            "gross_amount": 200000
        }, "credit_card":{
            "secure" : True
        }, "customer_details":{
            "first_name": "budi",
            "last_name": "pratama",
            "email": "budi.pra@example.com",
            "phone": "08111222333"
        }
    }
    
    # Add items if available
    if hasattr(payment, 'items') and payment.items:
        transaction_params["item_details"] = [
            {
                "id": item.product_id,
                "price": int(item.price),
                "quantity": item.quantity,
                "name": item.name
            }
            for item in payment.items
        ]
    
    try:
        # Create Snap transaction
        transaction = snap.create_transaction(transaction_params)
        
        # Store transaction token in database
        db_payment.transaction_id = transaction['token']
        db_payment.snap_token = transaction['token']
        db.commit()
        db.refresh(db_payment)
        
        return {
            "message": "Snap token created successfully",
            "payment_id": db_payment.id,
            "snap_token": transaction['token'],
            "redirect_url": transaction['redirect_url']
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Failed to create Midtrans transaction: {str(e)}"
        )


@router.post("/create-bank-transfer")
def create_bank_transfer_payment(
    payment: schemas.PaymentCreate,
    bank_type: str = "bca",  # bca, bni, bri, permata
    db: Session = Depends(get_db),
    current_user=Depends(require_role(['staff', 'admin']))
):
    """
    Create payment specifically for bank transfer using Core API
    """
    # Create payment record in database
    db_payment = crud.create_payment(db, payment)
    
    # Build transaction parameter
    transaction_params = {
        "payment_type": "bank_transfer",
        "transaction_details": {
            "order_id": f"PAY-{db_payment.id}",
            "gross_amount": int(db_payment.amount)
        },
        "bank_transfer": {
            "bank": bank_type
        }
    }
    
    try:
        # Charge using Core API
        charge_response = core_api.charge(transaction_params)
        
        # Store transaction details
        db_payment.transaction_id = charge_response['transaction_id']
        db_payment.status = charge_response['transaction_status']
        db.commit()
        db.refresh(db_payment)
        
        # Extract VA number based on bank type
        va_numbers = charge_response.get('va_numbers', [])
        va_number = va_numbers[0]['va_number'] if va_numbers else None
        
        return {
            "message": "Bank transfer payment created",
            "payment_id": db_payment.id,
            "transaction_id": charge_response['transaction_id'],
            "va_number": va_number,
            "bank": bank_type,
            "gross_amount": charge_response['gross_amount'],
            "transaction_status": charge_response['transaction_status']
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Failed to create bank transfer: {str(e)}"
        )


@router.post("/notification")
async def midtrans_notification(request: Request, db: Session = Depends(get_db)):
    """
    Handle Midtrans payment notification (webhook)
    """
    try:
        # Get notification body
        notification_body = await request.json()
        
        # Verify notification authenticity
        order_id = notification_body.get('order_id')
        status_code = notification_body.get('status_code')
        gross_amount = notification_body.get('gross_amount')
        signature_key = notification_body.get('signature_key')
        
        # Create hash for verification
        hash_string = f"{order_id}{status_code}{gross_amount}{config.MIDTRANS_SERVER_KEY}"
        calculated_signature = hashlib.sha512(hash_string.encode('utf-8')).hexdigest()
        
        # Verify signature
        if calculated_signature != signature_key:
            raise HTTPException(status_code=403, detail="Invalid signature")
        
        # Get transaction status from Midtrans
        transaction_status = notification_body.get('transaction_status')
        fraud_status = notification_body.get('fraud_status')
        transaction_id = notification_body.get('transaction_id')
        
        # Map Midtrans status to internal status
        if transaction_status == 'capture':
            if fraud_status == 'accept':
                new_status = 'paid'
            else:
                new_status = 'pending'
        elif transaction_status == 'settlement':
            new_status = 'paid'
        elif transaction_status in ['cancel', 'deny', 'expire']:
            new_status = 'failed'
        elif transaction_status == 'pending':
            new_status = 'pending'
        else:
            new_status = 'pending'
        
        # Update payment status in database
        crud.update_payment_status(db, transaction_id, new_status)
                
        return {
            "message": "Notification processed successfully",
            "status": new_status
        }
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{payment_id}/status")
def check_payment_status(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(['admin', 'staff']))
):
    """
    Check payment status from Midtrans
    """
    payment = crud.get_payment_with_items(db, payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    if not payment.transaction_id:
        raise HTTPException(status_code=400, detail="No transaction ID found")
    
    try:
        # Get transaction status from Midtrans
        order_id = f"PAY-{payment_id}"
        status_response = core_api.transactions.status(order_id)
        
        # Update local status
        transaction_status = status_response['transaction_status']
        fraud_status = status_response.get('fraud_status', '')
        
        if transaction_status == 'capture':
            new_status = 'paid' if fraud_status == 'accept' else 'pending'
        elif transaction_status == 'settlement':
            new_status = 'paid'
        elif transaction_status in ['cancel', 'deny', 'expire']:
            new_status = 'failed'
        else:
            new_status = 'pending'
        
        crud.update_payment_status(db, payment.transaction_id, new_status)
        
        return {
            "payment_id": payment_id,
            "transaction_id": payment.transaction_id,
            "status": new_status,
            "midtrans_status": transaction_status,
            "fraud_status": fraud_status
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to check payment status: {str(e)}"
        )


@router.post("/{payment_id}/items", response_model=PaymentItemOut)
def add_payment_item(
    payment_id: int,
    item: PaymentItemCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(['admin', 'staff']))
):
    return crud.create_payment_item(db, payment_id, item)


@router.get("/{payment_id}", response_model=PaymentOutWithItems)
def get_payment_detail(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(['admin', 'staff']))
):
    payment = crud.get_payment_with_items(db, payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment