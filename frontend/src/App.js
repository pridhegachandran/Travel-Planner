import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import Itinerary from './pages/Itinerary';
import Dashboard from './pages/Dashboard';
import Memories from './pages/Memories';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './utils/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/itinerary" element={<Itinerary />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/memories" element={<Memories />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
