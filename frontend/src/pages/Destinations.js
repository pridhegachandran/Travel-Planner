import React, { useState, useEffect, useCallback } from 'react';
import { destinationsAPI } from '../services/api';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = ['all', 'beach', 'mountain', 'city', 'adventure', 'cultural'];

  const filterDestinations = useCallback(() => {
    let filtered = destinations;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(dest =>
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(dest => dest.category === selectedCategory);
    }

    setFilteredDestinations(filtered);
  }, [destinations, searchQuery, selectedCategory]);

  useEffect(() => {
    fetchDestinations();
  }, []);

  useEffect(() => {
    filterDestinations();
  }, [filterDestinations]);

  const fetchDestinations = async () => {
    try {
      const response = await destinationsAPI.getAll();
      setDestinations(response.data);
      setFilteredDestinations(response.data);
    } catch (error) {
      setError('Failed to fetch destinations');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    filterDestinations();
  };

  const handleAddToPlan = (destination) => {
    // This would typically add to itinerary or saved destinations
    alert(`Added ${destination.name} to your travel plan!`);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <h2>Loading destinations...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '40px', textAlign: 'center' }}>
        Explore Destinations
      </h1>

      {/* Search and Filter Section */}
      <div className="card" style={{ marginBottom: '40px' }}>
        <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
          <div className="d-flex gap-2">
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </div>
        </form>

        {/* Category Filter */}
        <div>
          <h4 style={{ marginBottom: '15px' }}>Filter by Category:</h4>
          <div className="d-flex gap-2" style={{ flexWrap: 'wrap' }}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-secondary'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Results Count */}
      <div style={{ marginBottom: '20px' }}>
        <p>Found {filteredDestinations.length} destinations</p>
      </div>

      {/* Destinations Grid */}
      {filteredDestinations.length === 0 ? (
        <div className="card text-center">
          <h3>No destinations found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '30px'
        }}>
          {filteredDestinations.map((destination) => (
            <div key={destination._id} className="card">
              {/* Destination Image */}
              <div style={{
                height: '200px',
                backgroundColor: '#f0f0f0',
                marginBottom: '15px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                overflow: 'hidden'
              }}>
                {destination.image_url ? (
                  <img
                    src={destination.image_url}
                    alt={destination.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  '🏝️'
                )}
              </div>

              {/* Destination Info */}
              <h3>{destination.name}</h3>
              <p style={{ color: '#666', marginBottom: '10px' }}>
                📍 {destination.location}
              </p>
              
              <p style={{ marginBottom: '15px', minHeight: '60px' }}>
                {destination.description}
              </p>

              {/* Additional Details */}
              <div style={{ marginBottom: '15px' }}>
                <span style={{
                  backgroundColor: '#e9ecef',
                  padding: '5px 10px',
                  borderRadius: '15px',
                  fontSize: '12px',
                  marginRight: '5px',
                  textTransform: 'capitalize'
                }}>
                  {destination.category || 'general'}
                </span>
                {destination.rating && (
                  <span style={{ color: '#ffc107', marginLeft: '10px' }}>
                    ⭐ {destination.rating}
                  </span>
                )}
              </div>

              {/* Price and Actions */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid #eee',
                paddingTop: '15px'
              }}>
                <div>
                  <span style={{ fontSize: '14px', color: '#666' }}>Est. Budget</span>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
                    ${destination.estimated_budget}
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    onClick={() => handleAddToPlan(destination)}
                    className="btn btn-primary"
                    style={{ padding: '8px 16px', fontSize: '14px' }}
                  >
                    Add to Plan
                  </button>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '8px 16px', fontSize: '14px' }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Destinations;
