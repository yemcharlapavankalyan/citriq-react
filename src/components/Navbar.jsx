import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Navbar = () => {
  const { user, logout } = useApp();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return null;
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          CITRIQ - Peer Review Platform
        </Link>

        <nav className="nav">
          <Link
            to="/dashboard"
            className={`nav-link ${isActive('/dashboard')}`}
          >
            Dashboard
          </Link>

          <Link
            to="/reviews"
            className={`nav-link ${isActive('/reviews')}`}
          >
            Reviews
          </Link>

          {user.role === 'teacher' && (
            <Link
              to="/admin"
              className={`nav-link ${isActive('/admin')}`}
            >
              Admin
            </Link>
          )}

          {user.role === 'teacher' && (
            <Link
              to="/analytics"
              className={`nav-link ${isActive('/analytics')}`}
            >
              Analytics
            </Link>
          )}

          <div className="user-info">
            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', marginRight: '1rem' }}>
              <span style={{ marginRight: '0.5rem' }}>Profile</span>
            </Link>
            <img
              src={user.avatar}
              alt={user.name}
              className="user-avatar"
            />
            <span>{user.name}</span>
            <button
              onClick={handleLogout}
              className="btn btn-sm btn-secondary"
              style={{ marginLeft: '0.5rem' }}
            >
              Logout
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
