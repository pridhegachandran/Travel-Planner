from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os
import sys

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'default-secret-key')
    
    CORS(app)
    jwt = JWTManager(app)
    
    # Register routes
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    from routes.auth import auth_bp
    from routes.destinations import destinations_bp
    from routes.itineraries import itineraries_bp
    from routes.dashboard import dashboard_bp
    from routes.memories import memories_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(destinations_bp, url_prefix='/api/destinations')
    app.register_blueprint(itineraries_bp, url_prefix='/api/itineraries')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(memories_bp, url_prefix='/api/memories')
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
