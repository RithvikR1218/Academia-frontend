import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const location = useLocation();
    const isHome = location.pathname === '/';

  return (
    <nav className={`nav-container ${menuOpen ? 'open' : ''} ${isHome ? 'home' : ''}`}>
      <Link to="/" className='logo-link' onClick={() => setIsMenuOpen(false)}>Prof DB</Link>

      <input type="checkbox" id="menu-toggle" className="menu-toggle" onClick={toggleMenu} />
      <label htmlFor="menu-toggle" className="hamburger">
        <span></span>
        <span></span>
        <span></span>
      </label>

      <div className="nav-links">
        <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
        <span className="dot">•</span>
        <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
        <span className="dot">•</span>
        <Link to="/search" onClick={() => setIsMenuOpen(false)}>Search</Link>
      </div>

      <div className="github-button" onClick={() => {
        setMenuOpen(false);
        window.open('https://github.com/RithvikR1218/Academia-backend/', '_blank');
      }}>
        <span>Our Github</span>
        <i class="fa-brands fa-github"></i>
      </div>
    </nav>
  );
}
