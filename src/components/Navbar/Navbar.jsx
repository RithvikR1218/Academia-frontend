import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token); // true if token exists
  }, []);

  return (
    <nav className={`nav-container ${menuOpen ? 'open' : ''} ${isHome ? 'home' : ''}`}>
      <Link to="/" className='logo-link' onClick={() => setMenuOpen(false)}>Prof DB</Link>

      <input type="checkbox" id="menu-toggle" className="menu-toggle" onClick={toggleMenu} />
      <label htmlFor="menu-toggle" className="hamburger">
        <span></span>
        <span></span>
        <span></span>
      </label>

      <div className="nav-links">
        {!isAuthenticated && (
          <>
            <Link to="/signup" onClick={() => setMenuOpen(false)}>Signup</Link>
            <span className="dot">•</span>
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
            <span className="dot">•</span>
          </>
        )}
        <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
        <span className="dot">•</span>
        <Link to="/search" onClick={() => setMenuOpen(false)}>Search</Link>
      </div>

      <div className="github-button" onClick={() => {
        setMenuOpen(false);
        window.open('https://github.com/RithvikR1218/Academia-backend/', '_blank');
      }}>
        <span>Our Github</span>
        <i className="fa-brands fa-github"></i>
      </div>
    </nav>
  );
}
