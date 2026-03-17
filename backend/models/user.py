from datetime import datetime
from bson.objectid import ObjectId
import bcrypt

class User:
    def __init__(self, db):
        self.collection = db.get_collection('users')
    
    def create_user(self, user_data):
        # Hash password
        password = user_data['password'].encode('utf-8')
        hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())
        
        user_doc = {
            'email': user_data['email'],
            'password': hashed_password,
            'name': user_data['name'],
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = self.collection.insert_one(user_doc)
        return str(result.inserted_id)
    
    def find_by_email(self, email):
        return self.collection.find_one({'email': email})
    
    def verify_password(self, input_password, stored_password):
        input_password = input_password.encode('utf-8')
        return bcrypt.checkpw(input_password, stored_password)
    
    def get_user_by_id(self, user_id):
        return self.collection.find_one({'_id': ObjectId(user_id)})
