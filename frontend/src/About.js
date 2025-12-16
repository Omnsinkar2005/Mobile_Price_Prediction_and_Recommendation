import React from 'react';
import { FaLightbulb, FaCogs, FaChartLine, FaUsers } from 'react-icons/fa';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1 className="page-title">
          <FaLightbulb className="title-icon" />
          About Our Project
        </h1>

        <div className="about-section">
          <h2>Project Overview</h2>
          <p>
            The Mobile Price Prediction & Recommendation System is an intelligent platform 
            that leverages machine learning algorithms to provide accurate price predictions 
            and personalized mobile phone recommendations. Our system helps users make informed 
            decisions when purchasing mobile devices.
          </p>
        </div>

        <div className="objectives-section">
          <h2>
            <FaChartLine className="section-icon" />
            Objectives
          </h2>
          <div className="objectives-grid">
            <div className="objective-card">
              <h3>Price Prediction</h3>
              <p>Accurately predict mobile phone prices based on specifications using ML models</p>
            </div>
            <div className="objective-card">
              <h3>Smart Recommendations</h3>
              <p>Provide personalized recommendations based on user preferences and budget</p>
            </div>
            <div className="objective-card">
              <h3>Data Analysis</h3>
              <p>Analyze market trends and patterns to deliver insights</p>
            </div>
            <div className="objective-card">
              <h3>User Experience</h3>
              <p>Create an intuitive interface for seamless interaction</p>
            </div>
          </div>
        </div>

        <div className="methodology-section">
          <h2>
            <FaCogs className="section-icon" />
            Methodology & Algorithms
          </h2>
          <div className="algorithm-cards">
            <div className="algorithm-card">
              <h3>Decision Tree</h3>
              <p>
                Used for price prediction by analyzing mobile specifications and creating 
                decision rules based on historical data patterns.
              </p>
            </div>
            <div className="algorithm-card">
              <h3>FP-Growth Algorithm</h3>
              <p>
                Implements association rule mining to discover frequent patterns in mobile 
                purchases and generate intelligent recommendations.
              </p>
            </div>
          </div>
        </div>

        <div className="team-section">
          <h2>
            <FaUsers className="section-icon" />
            Our Team
          </h2>
          <p className="team-description">
            This project was developed by a dedicated team of data science enthusiasts 
            passionate about applying machine learning to solve real-world problems.
          </p>
        </div>

        <div className="tech-stack">
          <h2>Technology Stack</h2>
          <div className="tech-tags">
            <span className="tech-tag">Python</span>
            <span className="tech-tag">Scikit-learn</span>
            <span className="tech-tag">Pandas</span>
            <span className="tech-tag">React</span>
            <span className="tech-tag">Flask/FastAPI</span>
            <span className="tech-tag">Machine Learning</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
