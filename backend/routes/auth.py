from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.user import User
from src.config import db

auth_bp = Blueprint('auth', __name__)
user_model = User(db)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Check if user already exists
        existing_user = user_model.find_by_email(data['email'])
        if existing_user:
            return jsonify({'error': 'User already exists'}), 400
        
        # Create new user
        user_id = user_model.create_user(data)
        
        # Create access token
        access_token = create_access_token(identity=user_id)
        
        return jsonify({
            'message': 'User created successfully',
            'user_id': user_id,
            'access_token': access_token
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Find user by email
        user = user_model.find_by_email(data['email'])
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Verify password
        if not user_model.verify_password(data['password'], user['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Create access token
        access_token = create_access_token(identity=str(user['_id']))
        
        return jsonify({
            'message': 'Login successful',
            'user_id': str(user['_id']),
            'name': user['name'],
            'email': user['email'],
            'access_token': access_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        user = user_model.get_user_by_id(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user_id': str(user['_id']),
            'name': user['name'],
            'email': user['email'],
            'created_at': user['created_at']
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
