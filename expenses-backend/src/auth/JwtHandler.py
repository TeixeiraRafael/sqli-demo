from jose import JWTError, jwt

from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from src.config.environment import SECRET_KEY, ALGORITHM
from src.repository.UserRepository import UserRepository

class JwtHandler(HTTPBearer):
    def __init__(
            self,
            user_repository = UserRepository(),  
            auto_error: bool = True
        ):
        super(JwtHandler, self).__init__(auto_error=auto_error)
        self.user_repository = user_repository

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(JwtHandler, self).__call__(request)
        
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(status_code=403, detail="Invalid authentication scheme.")
            
            payload = self.verify_jwt(credentials.credentials)
            
            if payload is None:
                raise HTTPException(status_code=403, detail="Invalid token or expired token.")
            
            current_user = self.user_repository.get_user_by_username(payload.get("sub"))
            request.current_user = current_user
            return current_user
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization code.")

    def verify_jwt(self, token: str) -> bool:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except JWTError:
            return None