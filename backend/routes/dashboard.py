from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.itinerary import Itinerary
from models.memory import Memory
from src.config import db

dashboard_bp = Blueprint('dashboard', __name__)
itinerary_model = Itinerary(db)
memory_model = Memory(db)

@dashboard_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    try:
        user_id = get_jwt_identity()
        
        # Get all user itineraries
        all_itineraries = itinerary_model.get_user_itineraries(user_id)
        
        # Get upcoming and completed trips
        upcoming_trips = itinerary_model.get_upcoming_trips(user_id)
        completed_trips = itinerary_model.get_completed_trips(user_id)
        
        # Get user memories
        memories = memory_model.get_user_memories(user_id)
        
        # Calculate statistics
        total_trips = len(all_itineraries)
        upcoming_count = len(upcoming_trips)
        completed_count = len(completed_trips)
        memories_count = len(memories)
        
        # Get recent activity (last 3 itineraries)
        recent_itineraries = sorted(all_itineraries, key=lambda x: x['created_at'], reverse=True)[:3]
        
        return jsonify({
            'total_trips': total_trips,
            'upcoming_trips': upcoming_count,
            'completed_trips': completed_count,
            'total_memories': memories_count,
            'recent_activity': recent_itineraries
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
