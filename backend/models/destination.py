from datetime import datetime
from bson.objectid import ObjectId

class Destination:
    def __init__(self, db):
        self.collection = db.get_collection('destinations')
    
    def create_destination(self, destination_data):
        destination_doc = {
            'name': destination_data['name'],
            'location': destination_data['location'],
            'description': destination_data['description'],
            'image_url': destination_data.get('image_url', ''),
            'estimated_budget': destination_data.get('estimated_budget', 0),
            'category': destination_data.get('category', 'general'),
            'rating': destination_data.get('rating', 0),
            'created_at': datetime.utcnow()
        }
        
        result = self.collection.insert_one(destination_doc)
        return str(result.inserted_id)
    
    def get_all_destinations(self):
        destinations = list(self.collection.find({}))
        for dest in destinations:
            dest['_id'] = str(dest['_id'])
        return destinations
    
    def get_destination_by_id(self, destination_id):
        destination = self.collection.find_one({'_id': ObjectId(destination_id)})
        if destination:
            destination['_id'] = str(destination['_id'])
        return destination
    
    def search_destinations(self, query):
        search_filter = {
            '$or': [
                {'name': {'$regex': query, '$options': 'i'}},
                {'location': {'$regex': query, '$options': 'i'}},
                {'description': {'$regex': query, '$options': 'i'}}
            ]
        }
        destinations = list(self.collection.find(search_filter))
        for dest in destinations:
            dest['_id'] = str(dest['_id'])
        return destinations
    
    def filter_by_category(self, category):
        destinations = list(self.collection.find({'category': category}))
        for dest in destinations:
            dest['_id'] = str(dest['_id'])
        return destinations
