import os
from dotenv import load_dotenv

load_dotenv()

DEBUG = bool(os.getenv("DEBUG", True))

POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
DATABASE = os.getenv("DATABASE")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")

database_parameters = {
    "user": POSTGRES_USER,
    "password": POSTGRES_PASSWORD,
    "db_host": DB_HOST,
    "db_port": DB_PORT,
    "database": DATABASE, 
}

DATABASE_URL = 'postgresql://{user}:{password}@{db_host}:{db_port}/{database}'.format(**database_parameters)

SECRET_KEY = str(os.getenv("SECRET_KEY"))
ALGORITHM = str(os.getenv("ALGORITHM", "HS256"))
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))