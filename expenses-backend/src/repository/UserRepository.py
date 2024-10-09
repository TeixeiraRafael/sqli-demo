from src.model.User import User
from src.repository.BaseRepository import BaseRepository

class UserRepository(BaseRepository):

    def __init__(self):
        super()

    def create_user(self, user: User) -> User:
        query = """INSERT INTO users(username, password) VALUES (%s, %s) RETURNING *;"""
        connection = self.connect()
        cursor = connection.cursor()
        cursor.execute(query, (user.username, user.password))
        row = cursor.fetchone()
        _user = User(id=row.get("id"), username=row.get("username"), password=row.get("password"))
        
        connection.commit()
        connection.close()
        return _user
    
    def get_user_by_username(self, username) -> User:
        query = f"""SELECT * FROM users WHERE username = '{username}'"""
        connection = self.connect()
        cursor = connection.cursor()
        cursor.execute(query)
        row = cursor.fetchone()
        
        if row is None:
            return None
        
        _user = User(id=row.get("id"), username=row.get("username"), password=row.get("password"))
        return _user