import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleTheme = () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="main-nav">
      <div className="navbar-inner">
        <Link to="/" className="logo">TheFolio</Link>
        
        <div className="nav-right">
          <div className="nav-links">
            <Link to="/home">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            
            {!user ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            ) : (
              <div className="user-actions-group">
                <Link to="/create-post" className="nav-highlight">+ Create Post</Link>
                <Link to="/profile" className="nav-profile-link">
                  {user.profilePic ? (
                    <img src={`http://localhost:5000/uploads/${user.profilePic}?t=${Date.now()}`} alt="Me" className="nav-avatar" />
                  ) : (
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&size=32&background=0066ff&color=ffffff`} alt="Me" className="nav-avatar" />
                  )}
                </Link>
                {user.role === 'admin' && <Link to="/admin">Admin</Link>}
                <button onClick={handleLogout} className="btn-logout-text">Logout</button>
              </div>
            )}
          </div>

          <button id="themeToggle" onClick={toggleTheme} className="theme-btn">
            🌙/☀️
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;