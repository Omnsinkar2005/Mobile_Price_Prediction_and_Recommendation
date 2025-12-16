import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaMobileAlt, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <FaMobileAlt className="logo-icon" />
          <span>MobilePro</span>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/predict" 
              className={`nav-link ${isActive('/predict') ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              Price Prediction
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/recommend" 
              className={`nav-link ${isActive('/recommend') ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              Recommendations
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/about" 
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
