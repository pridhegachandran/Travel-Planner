# Travel Planner

A comprehensive travel planning web application built with React frontend and Flask backend, featuring user authentication, destination management, itinerary planning, and travel memories storage.

## 🚀 Features

- **User Authentication**: Secure login and registration system
- **Destination Explorer**: Browse and search travel destinations with filters
- **Itinerary Management**: Create, edit, and delete detailed travel plans
- **Dashboard**: View travel statistics and upcoming trips
- **Travel Memories**: Store and manage travel photos and memories
- **Responsive Design**: Modern, mobile-friendly interface

## 🛠 Tech Stack

### Frontend
- **React 18**: Modern React with functional components
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **CSS3**: Custom styling with responsive design

### Backend
- **Flask**: Python web framework
- **Flask-CORS**: Cross-origin resource sharing
- **Flask-JWT-Extended**: JWT authentication
- **MongoDB**: NoSQL database
- **PyMongo**: MongoDB driver for Python

## 📋 Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

## 🗂 Project Structure

```
travel-planner/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/           # Flask API routes
│   ├── src/              # Flask app configuration
│   ├── requirements.txt  # Python dependencies
│   ├── .env             # Environment variables
│   ├── seed_data.py     # Sample data script
│   └── app.py           # Main Flask application
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # React pages
│   │   ├── services/    # API services
│   │   └── utils/       # Utility functions
│   ├── package.json     # Node dependencies
│   └── index.js         # React entry point
└── README.md
```

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd travel-planner
```

### 2. Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   - Create a `.env` file in the backend directory
   - Add the following configuration:
   ```
   MONGODB_URI=mongodb://localhost:27017/travel_planner
   JWT_SECRET_KEY=your-secret-key-here
   FLASK_ENV=development
   ```

5. **Start MongoDB:**
   - Make sure MongoDB is running on `localhost:27017`
   - Or update the `MONGODB_URI` in `.env` to use MongoDB Atlas

6. **Seed sample data (optional):**
   ```bash
   python seed_data.py
   ```

7. **Run the Flask server:**
   ```bash
   python src/app.py
   ```
   
   The backend will be running on `http://localhost:5000`

### 3. Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the React development server:**
   ```bash
   npm start
   ```
   
   The frontend will be running on `http://localhost:3000`

## 📱 Usage

1. **Open your browser** and navigate to `http://localhost:3000`

2. **Register a new account** or login with existing credentials

3. **Explore destinations** - Browse available travel destinations with search and filter options

4. **Plan your itinerary** - Create detailed travel plans with dates, activities, and notes

5. **View your dashboard** - Track your travel statistics and upcoming trips

6. **Store memories** - Add travel photos and descriptions to create lasting memories

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Destinations
- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/:id` - Get specific destination
- `GET /api/destinations/search` - Search destinations
- `POST /api/destinations` - Create destination (admin)

### Itineraries
- `GET /api/itineraries` - Get user itineraries
- `POST /api/itineraries` - Create itinerary
- `GET /api/itineraries/:id` - Get specific itinerary
- `PUT /api/itineraries/:id` - Update itinerary
- `DELETE /api/itineraries/:id` - Delete itinerary

### Memories
- `GET /api/memories` - Get user memories
- `POST /api/memories` - Create memory
- `GET /api/memories/:id` - Get specific memory
- `PUT /api/memories/:id` - Update memory
- `DELETE /api/memories/:id` - Delete memory

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🗄 Database Collections

### Users
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  created_at: Date,
  updated_at: Date
}
```

### Destinations
```javascript
{
  _id: ObjectId,
  name: String,
  location: String,
  description: String,
  image_url: String,
  estimated_budget: Number,
  category: String,
  rating: Number,
  created_at: Date
}
```

### Itineraries
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  destination: String,
  start_date: Date,
  end_date: Date,
  activities: [String],
  transport: String,
  hotel: String,
  notes: String,
  status: String, // planned, ongoing, completed
  created_at: Date,
  updated_at: Date
}
```

### Memories
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  title: String,
  image_url: String,
  date: Date,
  location: String,
  description: String,
  created_at: Date,
  updated_at: Date
}
```

## 🎨 Customization

### Adding New Destinations
1. Use the seed script to add more destinations
2. Or create destinations via the API (if implementing admin interface)

### Styling
- Modify `frontend/src/index.css` for global styles
- Component-specific styles are inline for simplicity
- Can be replaced with Tailwind CSS or other CSS frameworks

### Environment Variables
- Update `backend/.env` for different environments
- Use different MongoDB URIs for development/production

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the `MONGODB_URI` in `.env` file
   - Verify network connectivity for MongoDB Atlas

2. **CORS Issues**
   - Backend should handle CORS via Flask-CORS
   - Ensure frontend proxy is configured in `package.json`

3. **Authentication Errors**
   - Check JWT secret key in `.env`
   - Verify token storage in localStorage

4. **Port Conflicts**
   - Frontend defaults to port 3000
   - Backend defaults to port 5000
   - Modify if ports are already in use

## 📝 Development Notes

- The application uses JWT tokens for authentication
- Passwords are hashed using bcrypt
- All API endpoints are protected with JWT authentication (except login/register)
- Frontend includes error handling and loading states
- Responsive design works on mobile and desktop

## 🚀 Deployment

### Backend Deployment (Heroku Example)
1. Install Heroku CLI
2. Create `Procfile` in backend directory
3. Set environment variables on Heroku
4. Deploy using `git push heroku main`

### Frontend Deployment (Netlify/Vercel)
1. Build the frontend: `npm run build`
2. Deploy the `build` folder
3. Update API base URL for production

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For any questions or issues, please open an issue on the GitHub repository.
