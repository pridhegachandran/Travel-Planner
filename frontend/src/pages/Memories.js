import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { memoriesAPI } from '../services/api';

const Memories = () => {
  const { isAuthenticated } = useAuth();
  const [memories, setMemories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    date: '',
    location: '',
    description: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchMemories();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchMemories = async () => {
    try {
      const response = await memoriesAPI.getAll();
      // Sort memories by date (newest first)
      const sortedMemories = response.data.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      setMemories(sortedMemories);
    } catch (error) {
      setError('Failed to fetch memories');
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
      if (editingMemory) {
        await memoriesAPI.update(editingMemory._id, formData);
        setSuccess('Memory updated successfully!');
      } else {
        await memoriesAPI.create(formData);
        setSuccess('Memory created successfully!');
      }

      resetForm();
      fetchMemories();
    } catch (error) {
      setError('Failed to save memory');
      console.error('Error:', error);
    }
  };

  const handleEdit = (memory) => {
    setEditingMemory(memory);
    setFormData({
      title: memory.title,
      image_url: memory.image_url,
      date: new Date(memory.date).toISOString().split('T')[0],
      location: memory.location,
      description: memory.description
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      try {
        await memoriesAPI.delete(id);
        setSuccess('Memory deleted successfully!');
        fetchMemories();
      } catch (error) {
        setError('Failed to delete memory');
        console.error('Error:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      image_url: '',
      date: '',
      location: '',
      description: ''
    });
    setEditingMemory(null);
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <div className="card">
          <h2>Please Login Required</h2>
          <p>You need to be logged in to manage your travel memories.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <h2>Loading memories...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontSize: '2.5rem' }}>Travel Memories</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : '+ Add Memory'}
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      {/* Memory Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '40px' }}>
          <h3>{editingMemory ? 'Edit Memory' : 'Add New Memory'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-control"
                  rows="4"
                  required
                  placeholder="Describe this travel memory..."
                />
              </div>
            </div>

            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-primary">
                {editingMemory ? 'Update Memory' : 'Add Memory'}
              </button>
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Memories Gallery */}
      {memories.length === 0 ? (
        <div className="card text-center">
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📸</div>
          <h3>No Memories Yet</h3>
          <p>Start capturing your travel moments by adding your first memory!</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '30px'
        }}>
          {memories.map((memory) => (
            <div key={memory._id} className="card">
              {/* Memory Image */}
              <div style={{
                height: '250px',
                backgroundColor: '#f0f0f0',
                marginBottom: '15px',
                borderRadius: '10px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {memory.image_url ? (
                  <img
                    src={memory.image_url}
                    alt={memory.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div style="font-size: 3rem;">📸</div>';
                    }}
                  />
                ) : (
                  <div style={{ fontSize: '3rem' }}>📸</div>
                )}
              </div>

              {/* Memory Content */}
              <h3>{memory.title}</h3>
              <div style={{ marginBottom: '10px' }}>
                <span style={{ color: '#666', marginRight: '15px' }}>
                  📍 {memory.location}
                </span>
                <span style={{ color: '#666' }}>
                  📅 {formatDate(memory.date)}
                </span>
              </div>
              
              <p style={{ marginBottom: '15px', color: '#555' }}>
                {memory.description}
              </p>

              {/* Actions */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid #eee',
                paddingTop: '15px'
              }}>
                <small style={{ color: '#999' }}>
                  Added {formatDate(memory.created_at)}
                </small>
                <div className="d-flex gap-2">
                  <button
                    onClick={() => handleEdit(memory)}
                    className="btn btn-secondary"
                    style={{ padding: '5px 15px', fontSize: '14px' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(memory._id)}
                    className="btn btn-danger"
                    style={{ padding: '5px 15px', fontSize: '14px' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Memories Summary */}
      {memories.length > 0 && (
        <div className="card" style={{ marginTop: '40px', backgroundColor: '#f8f9fa' }}>
          <h3>📊 Your Travel Memories Summary</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginTop: '20px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>
                {memories.length}
              </div>
              <p style={{ margin: 0, color: '#666' }}>Total Memories</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>
                {new Set(memories.map(m => m.location)).size}
              </div>
              <p style={{ margin: 0, color: '#666' }}>Unique Locations</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>
                {memories.filter(m => m.image_url).length}
              </div>
              <p style={{ margin: 0, color: '#666' }}>With Photos</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Memories;
