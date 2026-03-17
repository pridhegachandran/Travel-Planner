import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { itinerariesAPI } from '../services/api';

const Itinerary = () => {
  const { isAuthenticated } = useAuth();
  const [itineraries, setItineraries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    destination: '',
    start_date: '',
    end_date: '',
    activities: '',
    transport: '',
    hotel: '',
    notes: '',
    status: 'planned'
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchItineraries();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchItineraries = async () => {
    try {
      const response = await itinerariesAPI.getAll();
      setItineraries(response.data);
    } catch (error) {
      setError('Failed to fetch itineraries');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const data = {
        ...formData,
        activities: formData.activities.split(',').map(a => a.trim()).filter(a => a)
      };

      if (editingItinerary) {
        await itinerariesAPI.update(editingItinerary._id, data);
        setSuccess('Itinerary updated successfully!');
      } else {
        await itinerariesAPI.create(data);
        setSuccess('Itinerary created successfully!');
      }

      resetForm();
      fetchItineraries();
    } catch (error) {
      setError('Failed to save itinerary');
      console.error('Error:', error);
    }
  };

  const handleEdit = (itinerary) => {
    setEditingItinerary(itinerary);
    setFormData({
      destination: itinerary.destination,
      start_date: new Date(itinerary.start_date).toISOString().split('T')[0],
      end_date: new Date(itinerary.end_date).toISOString().split('T')[0],
      activities: itinerary.activities.join(', '),
      transport: itinerary.transport,
      hotel: itinerary.hotel,
      notes: itinerary.notes,
      status: itinerary.status
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this itinerary?')) {
      try {
        await itinerariesAPI.delete(id);
        setSuccess('Itinerary deleted successfully!');
        fetchItineraries();
      } catch (error) {
        setError('Failed to delete itinerary');
        console.error('Error:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      destination: '',
      start_date: '',
      end_date: '',
      activities: '',
      transport: '',
      hotel: '',
      notes: '',
      status: 'planned'
    });
    setEditingItinerary(null);
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <div className="card">
          <h2>Please Login Required</h2>
          <p>You need to be logged in to manage your itineraries.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <h2>Loading itineraries...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontSize: '2.5rem' }}>Travel Itinerary</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : '+ Create Itinerary'}
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      {/* Itinerary Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '40px' }}>
          <h3>{editingItinerary ? 'Edit Itinerary' : 'Create New Itinerary'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              <div className="form-group">
                <label className="form-label">Destination *</label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Start Date *</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Date *</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Transport</label>
                <input
                  type="text"
                  name="transport"
                  value={formData.transport}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="e.g., Flight, Train, Car"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hotel</label>
                <input
                  type="text"
                  name="hotel"
                  value={formData.hotel}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Hotel name or accommodation"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="planned">Planned</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Activities (comma-separated)</label>
                <textarea
                  name="activities"
                  value={formData.activities}
                  onChange={handleInputChange}
                  className="form-control"
                  rows="3"
                  placeholder="e.g., Sightseeing, Beach, Shopping, Hiking"
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="form-control"
                  rows="3"
                  placeholder="Additional notes or reminders"
                />
              </div>
            </div>

            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-primary">
                {editingItinerary ? 'Update Itinerary' : 'Create Itinerary'}
              </button>
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Itineraries List */}
      {itineraries.length === 0 ? (
        <div className="card text-center">
          <h3>No Itineraries Yet</h3>
          <p>Start planning your trips by creating your first itinerary!</p>
        </div>
      ) : (
        <div>
          {itineraries.map((itinerary) => (
            <div key={itinerary._id} className="card">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h3>{itinerary.destination}</h3>
                  <p style={{ color: '#666', margin: '5px 0' }}>
                    📅 {formatDate(itinerary.start_date)} - {formatDate(itinerary.end_date)}
                    <span style={{ marginLeft: '15px' }}>
                      ⏱️ {calculateDays(itinerary.start_date, itinerary.end_date)} days
                    </span>
                  </p>
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
                </div>
                <div className="d-flex gap-2">
                  <button
                    onClick={() => handleEdit(itinerary)}
                    className="btn btn-secondary"
                    style={{ padding: '5px 15px', fontSize: '14px' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(itinerary._id)}
                    className="btn btn-danger"
                    style={{ padding: '5px 15px', fontSize: '14px' }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginTop: '20px'
              }}>
                {itinerary.transport && (
                  <div>
                    <strong>🚗 Transport:</strong>
                    <p>{itinerary.transport}</p>
                  </div>
                )}
                {itinerary.hotel && (
                  <div>
                    <strong>🏨 Hotel:</strong>
                    <p>{itinerary.hotel}</p>
                  </div>
                )}
                {itinerary.activities && itinerary.activities.length > 0 && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <strong>🎯 Activities:</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '5px' }}>
                      {itinerary.activities.map((activity, index) => (
                        <span
                          key={index}
                          style={{
                            backgroundColor: '#e9ecef',
                            padding: '4px 12px',
                            borderRadius: '15px',
                            fontSize: '14px'
                          }}
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {itinerary.notes && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <strong>📝 Notes:</strong>
                    <p>{itinerary.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Itinerary;
