from fastapi import APIRouter, HTTPException

from src.model.User import User
from src.repository.UserRepository import UserRepository
from src.auth.AuthenticationHandler import AuthenticationHandler

class AuthController:
    def __init__(
        self,
        router = APIRouter(),
        user_repository = UserRepository(),
        auth = AuthenticationHandler()
    ):
        self.router = router
        self.user_repository = user_repository
        self.auth = auth

        self.router.add_api_route("/register", self.register, methods=["POST"])
        self.router.add_api_route("/login", self.login, methods=["POST"])

    def register(self, user: User):
        _user = self.user_repository.get_user_by_username(user.username)
        if _user is not None:
            raise HTTPException(status_code=401, detail="User already exists")

        hashed_password = self.auth.hash_password(user.password)
        user.password = hashed_password
        created_user = self.user_repository.create_user(user)
        return created_user

    def login(self, user: User):
        _user = self.user_repository.get_user_by_username(user.username)

        if not _user or not self.auth.verify_password(user.password, _user.password):
            raise HTTPException(status_code=401, detail="Invalid username or password")

        access_token = self.auth.create_access_token(user=_user)
        
        return {"access_token": access_token, "token_type": "Bearer"}