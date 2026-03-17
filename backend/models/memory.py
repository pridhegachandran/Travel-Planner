from datetime import datetime
from bson.objectid import ObjectId

class Memory:
    def __init__(self, db):
        self.collection = db.get_collection('memories')
    
    def create_memory(self, memory_data):
        memory_doc = {
            'user_id': memory_data['user_id'],
            'title': memory_data['title'],
            'image_url': memory_data.get('image_url', ''),
            'date': memory_data['date'],
            'location': memory_data['location'],
            'description': memory_data['description'],
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = self.collection.insert_one(memory_doc)
        return str(result.inserted_id)
    
    def get_user_memories(self, user_id):
        memories = list(self.collection.find({'user_id': user_id}))
        for memory in memories:
            memory['_id'] = str(memory['_id'])
        return memories
    
    def get_memory_by_id(self, memory_id):
        memory = self.collection.find_one({'_id': ObjectId(memory_id)})
        if memory:
            memory['_id'] = str(memory['_id'])
        return memory
    
    def update_memory(self, memory_id, update_data):
        update_data['updated_at'] = datetime.utcnow()
        result = self.collection.update_one(
            {'_id': ObjectId(memory_id)},
            {'$set': update_data}
        )
        return result.modified_count > 0
    
    def delete_memory(self, memory_id):
        result = self.collection.delete_one({'_id': ObjectId(memory_id)})
        return result.deleted_count > 0
