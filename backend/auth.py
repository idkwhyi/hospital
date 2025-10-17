from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import config, models
from database import Sessions, get_db
from sqlalchemy.orm import Session

SECRET_KEY = config.SECRET_KEY
ALGORITHM = config.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = config.ACCESS_TOKEN_EXPIRE_MINUTES

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login/")

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(token: str = Depends(oauth2_scheme),db: Session = Depends(get_db)):
    payload = verify_token(token)
    username: str = payload.get('sub')
    if username is None:
        raise HTTPException(status_code=401, detail='Invalid token payload')
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise HTTPException(status_code=404, detail='User not found')
    return user

def require_role(roles: list[str]):
    def role_checker(current_user = Depends(get_current_user)):
        if current_user.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='You do not have permission to access this resource')
        return current_user
    return role_checker


