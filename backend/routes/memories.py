from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.memory import Memory
from src.config import db

memories_bp = Blueprint('memories', __name__)
memory_model = Memory(db)

@memories_bp.route('/', methods=['POST'])
@jwt_required()
def create_memory():
    try:
        data = request.get_json()
        data['user_id'] = get_jwt_identity()
        
        memory_id = memory_model.create_memory(data)
        return jsonify({
            'message': 'Memory created successfully',
            'memory_id': memory_id
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@memories_bp.route('/', methods=['GET'])
@jwt_required()
def get_user_memories():
    try:
        user_id = get_jwt_identity()
        memories = memory_model.get_user_memories(user_id)
        return jsonify(memories), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@memories_bp.route('/<memory_id>', methods=['GET'])
@jwt_required()
def get_memory(memory_id):
    try:
        user_id = get_jwt_identity()
        memory = memory_model.get_memory_by_id(memory_id)
        
        if not memory:
            return jsonify({'error': 'Memory not found'}), 404
        
        # Check if memory belongs to current user
        if memory['user_id'] != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        return jsonify(memory), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@memories_bp.route('/<memory_id>', methods=['PUT'])
@jwt_required()
def update_memory(memory_id):
    try:
        user_id = get_jwt_identity()
        memory = memory_model.get_memory_by_id(memory_id)
        
        if not memory:
            return jsonify({'error': 'Memory not found'}), 404
        
        # Check if memory belongs to current user
        if memory['user_id'] != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        data = request.get_json()
        success = memory_model.update_memory(memory_id, data)
        
        if success:
            return jsonify({'message': 'Memory updated successfully'}), 200
        else:
            return jsonify({'error': 'Failed to update memory'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@memories_bp.route('/<memory_id>', methods=['DELETE'])
@jwt_required()
def delete_memory(memory_id):
    try:
        user_id = get_jwt_identity()
        memory = memory_model.get_memory_by_id(memory_id)
        
        if not memory:
            return jsonify({'error': 'Memory not found'}), 404
        
        # Check if memory belongs to current user
        if memory['user_id'] != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        success = memory_model.delete_memory(memory_id)
        
        if success:
            return jsonify({'message': 'Memory deleted successfully'}), 200
        else:
            return jsonify({'error': 'Failed to delete memory'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500
