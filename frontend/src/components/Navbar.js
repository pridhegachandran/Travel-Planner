import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav style={{
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <Link to="/" style={{
            textDecoration: 'none',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#007bff'
          }}>
            ✈️ Travel Planner
          </Link>
          
          <div className="d-flex gap-3">
            <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>Home</Link>
            <Link to="/destinations" style={{ textDecoration: 'none', color: '#333' }}>Destinations</Link>
            <Link to="/itinerary" style={{ textDecoration: 'none', color: '#333' }}>Itinerary</Link>
            <Link to="/dashboard" style={{ textDecoration: 'none', color: '#333' }}>Dashboard</Link>
            <Link to="/memories" style={{ textDecoration: 'none', color: '#333' }}>Memories</Link>
            
            {isAuthenticated ? (
              <>
                <span style={{ color: '#666' }}>Welcome, {user?.name}</span>
                <button 
                  onClick={logout}
                  className="btn btn-secondary"
                  style={{ padding: '5px 15px', fontSize: '14px' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <button className="btn btn-primary" style={{ padding: '5px 15px', fontSize: '14px' }}>
                    Login
                  </button>
                </Link>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <button className="btn btn-secondary" style={{ padding: '5px 15px', fontSize: '14px' }}>
                    Register
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
