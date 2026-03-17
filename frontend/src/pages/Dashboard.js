import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { dashboardAPI } from '../services/api';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardStats();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchDashboardStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      setError('Failed to fetch dashboard data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <div className="card">
          <h2>Please Login Required</h2>
          <p>You need to be logged in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '40px', textAlign: 'center' }}>
        Welcome back, {user?.name}!
      </h1>

      {error && <div className="error-message">{error}</div>}

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '30px',
        marginBottom: '40px'
      }}>
        <div className="card" style={{
          textAlign: 'center',
          padding: '30px',
          backgroundColor: '#f8f9fa',
          border: '2px solid #e9ecef'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>✈️</div>
          <h3 style={{ fontSize: '2rem', marginBottom: '10px', color: '#007bff' }}>
            {stats?.total_trips || 0}
          </h3>
          <p style={{ color: '#666', margin: 0 }}>Total Trips Planned</p>
        </div>

        <div className="card" style={{
          textAlign: 'center',
          padding: '30px',
          backgroundColor: '#f8f9fa',
          border: '2px solid #e9ecef'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📅</div>
          <h3 style={{ fontSize: '2rem', marginBottom: '10px', color: '#28a745' }}>
            {stats?.upcoming_trips || 0}
          </h3>
          <p style={{ color: '#666', margin: 0 }}>Upcoming Trips</p>
        </div>

        <div className="card" style={{
          textAlign: 'center',
          padding: '30px',
          backgroundColor: '#f8f9fa',
          border: '2px solid #e9ecef'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>✅</div>
          <h3 style={{ fontSize: '2rem', marginBottom: '10px', color: '#6c757d' }}>
            {stats?.completed_trips || 0}
          </h3>
          <p style={{ color: '#666', margin: 0 }}>Completed Trips</p>
        </div>

        <div className="card" style={{
          textAlign: 'center',
          padding: '30px',
          backgroundColor: '#f8f9fa',
          border: '2px solid #e9ecef'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📸</div>
          <h3 style={{ fontSize: '2rem', marginBottom: '10px', color: '#ffc107' }}>
            {stats?.total_memories || 0}
          </h3>
          <p style={{ color: '#666', margin: 0 }}>Travel Memories</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 style={{ marginBottom: '30px' }}>Recent Activity</h2>
        
        {stats?.recent_activity && stats.recent_activity.length > 0 ? (
          <div>
            {stats.recent_activity.map((itinerary) => (
              <div
                key={itinerary._id}
                style={{
                  padding: '20px',
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h4 style={{ margin: '0 0 5px 0' }}>{itinerary.destination}</h4>
                  <p style={{ margin: '0', color: '#666' }}>
                    📅 {formatDate(itinerary.start_date)} - {formatDate(itinerary.end_date)}
                  </p>
                  <div style={{ marginTop: '8px' }}>
                    <span style={{
                      backgroundColor: itinerary.status === 'completed' ? '#28a745' :
                                      itinerary.status === 'ongoing' ? '#ffc107' : '#007bff',
                      color: 'white',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      textTransform: 'capitalize'
                    }}>
                      {itinerary.status}
                    </span>
                    <span style={{ marginLeft: '15px', color: '#999', fontSize: '14px' }}>
                      Created {formatDate(itinerary.created_at)}
                    </span>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  {itinerary.transport && (
                    <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                      🚗 {itinerary.transport}
                    </p>
                  )}
                  {itinerary.hotel && (
                    <p style={{ margin: '0', fontSize: '14px' }}>
                      🏨 {itinerary.hotel}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📋</div>
            <h3>No Recent Activity</h3>
            <p style={{ color: '#666' }}>Start planning your trips to see them here!</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ marginBottom: '20px' }}>Quick Actions</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <button
            onClick={() => window.location.href = '/itinerary'}
            className="btn btn-primary"
            style={{ padding: '20px', fontSize: '16px' }}
          >
            ➕ Create New Itinerary
          </button>
          <button
            onClick={() => window.location.href = '/destinations'}
            className="btn btn-secondary"
            style={{ padding: '20px', fontSize: '16px' }}
          >
            🌍 Browse Destinations
          </button>
          <button
            onClick={() => window.location.href = '/memories'}
            className="btn btn-secondary"
            style={{ padding: '20px', fontSize: '16px' }}
          >
            📸 Add Memory
          </button>
        </div>
      </div>

      {/* Travel Tips */}
      <div className="card" style={{ marginTop: '40px', backgroundColor: '#f0f8ff' }}>
        <h2 style={{ marginBottom: '20px' }}>💡 Travel Tips</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          <div>
            <h4>📝 Plan Ahead</h4>
            <p style={{ color: '#666' }}>
              Create detailed itineraries to make the most of your trips and avoid last-minute stress.
            </p>
          </div>
          <div>
            <h4>📸 Document Memories</h4>
            <p style={{ color: '#666' }}>
              Capture your travel moments and create lasting memories that you can cherish forever.
            </p>
          </div>
          <div>
            <h4>💰 Budget Wisely</h4>
            <p style={{ color: '#666' }}>
              Set realistic budgets for your trips and track your expenses to travel without financial worries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
