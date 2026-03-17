from flask import Blueprint, request, jsonify
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.destination import Destination
from src.config import db

destinations_bp = Blueprint('destinations', __name__)
destination_model = Destination(db)

@destinations_bp.route('/', methods=['GET'])
def get_destinations():
    try:
        destinations = destination_model.get_all_destinations()
        return jsonify(destinations), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@destinations_bp.route('/<destination_id>', methods=['GET'])
def get_destination(destination_id):
    try:
        destination = destination_model.get_destination_by_id(destination_id)
        if not destination:
            return jsonify({'error': 'Destination not found'}), 404
        return jsonify(destination), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@destinations_bp.route('/search', methods=['GET'])
def search_destinations():
    try:
        query = request.args.get('q', '')
        category = request.args.get('category', '')
        
        if query:
            destinations = destination_model.search_destinations(query)
        elif category:
            destinations = destination_model.filter_by_category(category)
        else:
            destinations = destination_model.get_all_destinations()
        
        return jsonify(destinations), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@destinations_bp.route('/', methods=['POST'])
def create_destination():
    try:
        data = request.get_json()
        destination_id = destination_model.create_destination(data)
        return jsonify({
            'message': 'Destination created successfully',
            'destination_id': destination_id
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
