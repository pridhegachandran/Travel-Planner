import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { destinationsAPI } from '../services/api';

const Home = () => {
  const [featuredDestinations, setFeaturedDestinations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await destinationsAPI.getAll();
        setFeaturedDestinations(response.data.slice(0, 6)); // Show first 6 destinations
      } catch (error) {
        console.error('Error fetching destinations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/destinations?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '100px 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3rem', marginBottom: '20px', fontWeight: 'bold' }}>
            Discover Your Next Adventure
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            Plan your perfect trip with our comprehensive travel planner. Explore destinations, 
            create itineraries, and cherish your travel memories.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  padding: '15px',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: '16px'
                }}
              />
              <button type="submit" className="btn btn-primary" style={{
                padding: '15px 30px',
                borderRadius: '50px',
                border: 'none',
                backgroundColor: '#ff6b6b',
                color: 'white',
                fontSize: '16px',
                cursor: 'pointer'
              }}>
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Quick Links */}
      <section style={{ padding: '60px 0', backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <h2 className="text-center" style={{ marginBottom: '40px', fontSize: '2.5rem' }}>
            Start Planning Your Journey
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px'
          }}>
            <Link to="/destinations" style={{ textDecoration: 'none' }}>
              <div className="card" style={{
                textAlign: 'center',
                padding: '30px',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🌍</div>
                <h3>Explore Destinations</h3>
                <p style={{ color: '#666' }}>Discover amazing places around the world</p>
              </div>
            </Link>
            
            <Link to="/itinerary" style={{ textDecoration: 'none' }}>
              <div className="card" style={{
                textAlign: 'center',
                padding: '30px',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📅</div>
                <h3>Plan Itinerary</h3>
                <p style={{ color: '#666' }}>Create detailed travel plans for your trips</p>
              </div>
            </Link>
            
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <div className="card" style={{
                textAlign: 'center',
                padding: '30px',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📊</div>
                <h3>View Dashboard</h3>
                <p style={{ color: '#666' }}>Track your travel statistics and upcoming trips</p>
              </div>
            </Link>
            
            <Link to="/memories" style={{ textDecoration: 'none' }}>
              <div className="card" style={{
                textAlign: 'center',
                padding: '30px',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📸</div>
                <h3>Travel Memories</h3>
                <p style={{ color: '#666' }}>Store and relive your favorite travel moments</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <h2 className="text-center" style={{ marginBottom: '40px', fontSize: '2.5rem' }}>
            Featured Destinations
          </h2>
          
          {loading ? (
            <div className="text-center">
              <p>Loading destinations...</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px'
            }}>
              {featuredDestinations.map((destination) => (
                <div key={destination._id} className="card">
                  <div style={{
                    height: '200px',
                    backgroundColor: '#f0f0f0',
                    marginBottom: '15px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem'
                  }}>
                    🏝️
                  </div>
                  <h3>{destination.name}</h3>
                  <p style={{ color: '#666', marginBottom: '10px' }}>📍 {destination.location}</p>
                  <p style={{ marginBottom: '15px' }}>{destination.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', color: '#007bff' }}>
                      ${destination.estimated_budget}
                    </span>
                    <Link to={`/destinations`}>
                      <button className="btn btn-primary">View Details</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-4">
            <Link to="/destinations">
              <button className="btn btn-primary" style={{ padding: '12px 30px' }}>
                View All Destinations
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#333',
        color: 'white',
        padding: '40px 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h3>Travel Planner</h3>
          <p style={{ marginBottom: '20px' }}>Your companion for perfect travel planning</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '20px' }}>
            <Link to="/destinations" style={{ color: 'white', textDecoration: 'none' }}>Destinations</Link>
            <Link to="/itinerary" style={{ color: 'white', textDecoration: 'none' }}>Itinerary</Link>
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/memories" style={{ color: 'white', textDecoration: 'none' }}>Memories</Link>
          </div>
          <p style={{ fontSize: '14px', opacity: 0.8 }}>
            © 2024 Travel Planner. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
