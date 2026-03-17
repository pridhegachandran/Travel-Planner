from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/travel_planner')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'default-secret-key')

class Database:
    def __init__(self):
        self.client = MongoClient(Config.MONGODB_URI)
        self.db = self.client.get_database()
    
    def get_collection(self, collection_name):
        return self.db[collection_name]
    
    def close(self):
        self.client.close()

# Database instance
db = Database()
