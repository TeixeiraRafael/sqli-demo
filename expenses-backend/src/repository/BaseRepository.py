import psycopg2
import psycopg2.extras
from src.config.environment import DATABASE_URL

class BaseRepository:

    def connect(self):
        connection = psycopg2.connect(DATABASE_URL, connection_factory=psycopg2.extras.RealDictConnection)
        return connection