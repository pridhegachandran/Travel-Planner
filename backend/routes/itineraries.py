from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.itinerary import Itinerary
from src.config import db

itineraries_bp = Blueprint('itineraries', __name__)
itinerary_model = Itinerary(db)

@itineraries_bp.route('/', methods=['POST'])
@jwt_required()
def create_itinerary():
    try:
        data = request.get_json()
        data['user_id'] = get_jwt_identity()
        
        itinerary_id = itinerary_model.create_itinerary(data)
        return jsonify({
            'message': 'Itinerary created successfully',
            'itinerary_id': itinerary_id
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@itineraries_bp.route('/', methods=['GET'])
@jwt_required()
def get_user_itineraries():
    try:
        user_id = get_jwt_identity()
        itineraries = itinerary_model.get_user_itineraries(user_id)
        return jsonify(itineraries), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@itineraries_bp.route('/<itinerary_id>', methods=['GET'])
@jwt_required()
def get_itinerary(itinerary_id):
    try:
        user_id = get_jwt_identity()
        itinerary = itinerary_model.get_itinerary_by_id(itinerary_id)
        
        if not itinerary:
            return jsonify({'error': 'Itinerary not found'}), 404
        
        # Check if itinerary belongs to current user
        if itinerary['user_id'] != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        return jsonify(itinerary), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@itineraries_bp.route('/<itinerary_id>', methods=['PUT'])
@jwt_required()
def update_itinerary(itinerary_id):
    try:
        user_id = get_jwt_identity()
        itinerary = itinerary_model.get_itinerary_by_id(itinerary_id)
        
        if not itinerary:
            return jsonify({'error': 'Itinerary not found'}), 404
        
        # Check if itinerary belongs to current user
        if itinerary['user_id'] != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        data = request.get_json()
        success = itinerary_model.update_itinerary(itinerary_id, data)
        
        if success:
            return jsonify({'message': 'Itinerary updated successfully'}), 200
        else:
            return jsonify({'error': 'Failed to update itinerary'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@itineraries_bp.route('/<itinerary_id>', methods=['DELETE'])
@jwt_required()
def delete_itinerary(itinerary_id):
    try:
        user_id = get_jwt_identity()
        itinerary = itinerary_model.get_itinerary_by_id(itinerary_id)
        
        if not itinerary:
            return jsonify({'error': 'Itinerary not found'}), 404
        
        # Check if itinerary belongs to current user
        if itinerary['user_id'] != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        success = itinerary_model.delete_itinerary(itinerary_id)
        
        if success:
            return jsonify({'message': 'Itinerary deleted successfully'}), 200
        else:
            return jsonify({'error': 'Failed to delete itinerary'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@itineraries_bp.route('/upcoming', methods=['GET'])
@jwt_required()
def get_upcoming_trips():
    try:
        user_id = get_jwt_identity()
        upcoming_trips = itinerary_model.get_upcoming_trips(user_id)
        return jsonify(upcoming_trips), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@itineraries_bp.route('/completed', methods=['GET'])
@jwt_required()
def get_completed_trips():
    try:
        user_id = get_jwt_identity()
        completed_trips = itinerary_model.get_completed_trips(user_id)
        return jsonify(completed_trips), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
