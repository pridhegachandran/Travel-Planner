from datetime import datetime
from bson.objectid import ObjectId

class Itinerary:
    def __init__(self, db):
        self.collection = db.get_collection('itineraries')
    
    def create_itinerary(self, itinerary_data):
        itinerary_doc = {
            'user_id': itinerary_data['user_id'],
            'destination': itinerary_data['destination'],
            'start_date': itinerary_data['start_date'],
            'end_date': itinerary_data['end_date'],
            'activities': itinerary_data.get('activities', []),
            'transport': itinerary_data.get('transport', ''),
            'hotel': itinerary_data.get('hotel', ''),
            'notes': itinerary_data.get('notes', ''),
            'status': itinerary_data.get('status', 'planned'),  # planned, ongoing, completed
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = self.collection.insert_one(itinerary_doc)
        return str(result.inserted_id)
    
    def get_user_itineraries(self, user_id):
        itineraries = list(self.collection.find({'user_id': user_id}))
        for itinerary in itineraries:
            itinerary['_id'] = str(itinerary['_id'])
        return itineraries
    
    def get_itinerary_by_id(self, itinerary_id):
        itinerary = self.collection.find_one({'_id': ObjectId(itinerary_id)})
        if itinerary:
            itinerary['_id'] = str(itinerary['_id'])
        return itinerary
    
    def update_itinerary(self, itinerary_id, update_data):
        update_data['updated_at'] = datetime.utcnow()
        result = self.collection.update_one(
            {'_id': ObjectId(itinerary_id)},
            {'$set': update_data}
        )
        return result.modified_count > 0
    
    def delete_itinerary(self, itinerary_id):
        result = self.collection.delete_one({'_id': ObjectId(itinerary_id)})
        return result.deleted_count > 0
    
    def get_upcoming_trips(self, user_id):
        current_date = datetime.utcnow()
        upcoming = list(self.collection.find({
            'user_id': user_id,
            'start_date': {'$gt': current_date},
            'status': 'planned'
        }))
        for trip in upcoming:
            trip['_id'] = str(trip['_id'])
        return upcoming
    
    def get_completed_trips(self, user_id):
        completed = list(self.collection.find({
            'user_id': user_id,
            'status': 'completed'
        }))
        for trip in completed:
            trip['_id'] = str(trip['_id'])
        return completed
