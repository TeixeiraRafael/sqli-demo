import bcrypt

from jose import jwt
from typing import Optional
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer

from src.model.User import User
from src.config.environment import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES


class AuthenticationHandler:

    def __init__(
            self,
            oauth2_scheme=OAuth2PasswordBearer(tokenUrl="/login")
        ):
        self.oauth2_scheme = oauth2_scheme

    def hash_password(self, password: str) -> str:
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

    def create_access_token(self, user: User, expires_delta: Optional[timedelta] = None):
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        payload = {
            "exp": expire,
            "sub": user.username
        }

        token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        return token
