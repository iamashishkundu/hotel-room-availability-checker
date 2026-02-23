import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🏨 Hotel Availability
      </Link>
      <div className="navbar-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          Search
        </Link>
        <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
          Admin
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
