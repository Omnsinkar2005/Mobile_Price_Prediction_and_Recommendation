import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMoneyBillWave, FaListAlt, FaMobileAlt } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <FaMobileAlt className="hero-icon" />
          <h1 className="hero-title">Mobile Price Prediction & Recommendation System</h1>
          <p className="hero-description">
            Discover the perfect mobile phone for your needs. Get accurate price predictions 
            and personalized recommendations powered by advanced machine learning algorithms.
          </p>
          
          <div className="cta-buttons">
            <button 
              className="cta-button primary"
              onClick={() => navigate('/predict')}
            >
              <FaMoneyBillWave className="button-icon" />
              Predict Mobile Price
            </button>
            <button 
              className="cta-button secondary"
              onClick={() => navigate('/recommend')}
            >
              <FaListAlt className="button-icon" />
              Get Recommendations
            </button>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FaMoneyBillWave className="feature-icon" />
            </div>
            <h3>Price Prediction</h3>
            <p>Get accurate price estimates based on mobile specifications using ML models</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FaListAlt className="feature-icon" />
            </div>
            <h3>Smart Recommendations</h3>
            <p>Find the best phones matching your budget and feature preferences</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FaMobileAlt className="feature-icon" />
            </div>
            <h3>Data-Driven Insights</h3>
            <p>Powered by FP-Growth and Decision Tree algorithms for accurate results</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
