import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.config import db
from models.destination import Destination

# Sample destination data
sample_destinations = [
    {
        'name': 'Bali, Indonesia',
        'location': 'Indonesia',
        'description': 'Tropical paradise with beautiful beaches, ancient temples, and vibrant culture. Perfect for both relaxation and adventure.',
        'image_url': 'https://picsum.photos/seed/bali/400/300.jpg',
        'estimated_budget': 1500,
        'category': 'beach',
        'rating': 4.8
    },
    {
        'name': 'Paris, France',
        'location': 'France',
        'description': 'The City of Light offers iconic landmarks, world-class museums, charming cafes, and romantic atmosphere.',
        'image_url': 'https://picsum.photos/seed/paris/400/300.jpg',
        'estimated_budget': 2500,
        'category': 'city',
        'rating': 4.9
    },
    {
        'name': 'Swiss Alps',
        'location': 'Switzerland',
        'description': 'Breathtaking mountain scenery, world-class skiing, hiking trails, and charming alpine villages.',
        'image_url': 'https://picsum.photos/seed/swiss/400/300.jpg',
        'estimated_budget': 3000,
        'category': 'mountain',
        'rating': 4.7
    },
    {
        'name': 'Tokyo, Japan',
        'location': 'Japan',
        'description': 'Modern metropolis blending traditional culture with cutting-edge technology, amazing food, and unique experiences.',
        'image_url': 'https://picsum.photos/seed/tokyo/400/300.jpg',
        'estimated_budget': 2000,
        'category': 'city',
        'rating': 4.8
    },
    {
        'name': 'Santorini, Greece',
        'location': 'Greece',
        'description': 'Stunning sunsets, white-washed buildings, blue-domed churches, and crystal-clear waters of the Aegean Sea.',
        'image_url': 'https://picsum.photos/seed/santorini/400/300.jpg',
        'estimated_budget': 1800,
        'category': 'beach',
        'rating': 4.9
    },
    {
        'name': 'Machu Picchu, Peru',
        'location': 'Peru',
        'description': 'Ancient Incan citadel set high in the Andes Mountains, offering incredible history and mountain views.',
        'image_url': 'https://picsum.photos/seed/machupicchu/400/300.jpg',
        'estimated_budget': 1200,
        'category': 'adventure',
        'rating': 4.9
    },
    {
        'name': 'Dubai, UAE',
        'location': 'United Arab Emirates',
        'description': 'Ultra-modern city with futuristic architecture, luxury shopping, and desert adventures.',
        'image_url': 'https://picsum.photos/seed/dubai/400/300.jpg',
        'estimated_budget': 2200,
        'category': 'city',
        'rating': 4.6
    },
    {
        'name': 'Maldives',
        'location': 'Maldives',
        'description': 'Tropical paradise with overwater bungalows, pristine beaches, and incredible marine life.',
        'image_url': 'https://picsum.photos/seed/maldives/400/300.jpg',
        'estimated_budget': 3500,
        'category': 'beach',
        'rating': 4.9
    },
    {
        'name': 'Rome, Italy',
        'location': 'Italy',
        'description': 'Eternal city filled with ancient history, Renaissance art, delicious cuisine, and vibrant street life.',
        'image_url': 'https://picsum.photos/seed/rome/400/300.jpg',
        'estimated_budget': 1800,
        'category': 'cultural',
        'rating': 4.8
    },
    {
        'name': 'New York City, USA',
        'location': 'United States',
        'description': 'The Big Apple offers iconic landmarks, world-class museums, Broadway shows, and diverse neighborhoods.',
        'image_url': 'https://picsum.photos/seed/newyork/400/300.jpg',
        'estimated_budget': 2000,
        'category': 'city',
        'rating': 4.7
    },
    {
        'name': 'Iceland',
        'location': 'Iceland',
        'description': 'Land of fire and ice with glaciers, geysers, hot springs, and the Northern Lights.',
        'image_url': 'https://picsum.photos/seed/iceland/400/300.jpg',
        'estimated_budget': 2500,
        'category': 'adventure',
        'rating': 4.8
    },
    {
        'name': 'Bora Bora',
        'location': 'French Polynesia',
        'description': 'Ultimate luxury destination with turquoise lagoons, coral reefs, and exclusive overwater villas.',
        'image_url': 'https://picsum.photos/seed/borabora/400/300.jpg',
        'estimated_budget': 4000,
        'category': 'beach',
        'rating': 4.9
    }
]

def seed_destinations():
    """Seed the database with sample destinations"""
    destination_model = Destination(db)
    
    print("Seeding destinations...")
    
    for dest_data in sample_destinations:
        try:
            destination_id = destination_model.create_destination(dest_data)
            print(f"✅ Created destination: {dest_data['name']} (ID: {destination_id})")
        except Exception as e:
            print(f"❌ Error creating destination {dest_data['name']}: {str(e)}")
    
    print("\n✅ Destination seeding completed!")

if __name__ == "__main__":
    seed_destinations()
