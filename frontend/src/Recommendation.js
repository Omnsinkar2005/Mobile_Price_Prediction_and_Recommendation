import React, { useState } from 'react';
import axios from 'axios';
import { FaSearch, FaMobileAlt, FaMemory, FaBatteryFull, FaHdd, FaDesktop } from 'react-icons/fa';
import './Recommendation.css';

const Recommendation = () => {
  const [filters, setFilters] = useState({
    budget: '',
    brand: '',
    operatingSystem: '',
    minRam: '',
    minStorage: '',
    minBattery: '',
    minScreenSize: ''
  });

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/recommend', filters);
      if (response.data.success) {
        setRecommendations(response.data.recommendations);
      } else {
        alert('Error: ' + response.data.error);
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      alert('Failed to connect to server. Make sure the backend is running on http://localhost:5000');
      // Demo data
      setRecommendations([
        {
          id: 1,
          name: 'Samsung Galaxy S23',
          brand: 'Samsung',
          price: 74999,
          ram: 8,
          storage: 128,
          screenSize: 6.1,
          battery: 3900,
          os: 'Android',
          releaseYear: 2023,
          image: 'https://source.unsplash.com/300x400/?samsung+phone+2023'
        },
        {
          id: 2,
          name: 'iPhone 14',
          brand: 'Apple',
          price: 79900,
          ram: 6,
          storage: 128,
          screenSize: 6.1,
          battery: 3279,
          os: 'iOS',
          releaseYear: 2022,
          image: 'https://source.unsplash.com/300x400/?iphone+14'
        },
        {
          id: 3,
          name: 'OnePlus 11',
          brand: 'OnePlus',
          price: 56999,
          ram: 8,
          storage: 128,
          screenSize: 6.7,
          battery: 5000,
          os: 'Android',
          releaseYear: 2023,
          image: 'https://source.unsplash.com/300x400/?oneplus+phone'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recommendation-container">
      <div className="recommendation-content">
        <h1 className="page-title">
          <FaSearch className="title-icon" />
          Mobile Recommendations
        </h1>
        <p className="page-subtitle">Find the perfect mobile phone based on your preferences</p>

        <form className="filter-form" onSubmit={handleSubmit}>
          <div className="filter-grid">
            <div className="form-group">
              <label>Budget (₹)</label>
              <input
                type="number"
                name="budget"
                value={filters.budget}
                onChange={handleChange}
                placeholder="e.g., 50000"
                required
              />
            </div>

            <div className="form-group">
              <label>Brand</label>
              <select name="brand" value={filters.brand} onChange={handleChange}>
                <option value="">All Brands</option>
                <option value="Samsung">Samsung</option>
                <option value="Apple">Apple</option>
                <option value="Xiaomi">Xiaomi</option>
                <option value="OnePlus">OnePlus</option>
                <option value="Realme">Realme</option>
                <option value="Oppo">Oppo</option>
                <option value="Vivo">Vivo</option>
                <option value="Motorola">Motorola</option>
              </select>
            </div>

            <div className="form-group">
              <label>Operating System</label>
              <select name="operatingSystem" value={filters.operatingSystem} onChange={handleChange}>
                <option value="">Any OS</option>
                <option value="Android">Android</option>
                <option value="iOS">iOS</option>
              </select>
            </div>

            <div className="form-group">
              <label>Minimum RAM (GB)</label>
              <select name="minRam" value={filters.minRam} onChange={handleChange}>
                <option value="">Any RAM</option>
                <option value="4">4 GB+</option>
                <option value="6">6 GB+</option>
                <option value="8">8 GB+</option>
                <option value="12">12 GB+</option>
              </select>
            </div>

            <div className="form-group">
              <label>Minimum Storage (GB)</label>
              <select name="minStorage" value={filters.minStorage} onChange={handleChange}>
                <option value="">Any Storage</option>
                <option value="64">64 GB+</option>
                <option value="128">128 GB+</option>
                <option value="256">256 GB+</option>
                <option value="512">512 GB+</option>
              </select>
            </div>

            <div className="form-group">
              <label>Minimum Battery (mAh)</label>
              <input
                type="number"
                name="minBattery"
                value={filters.minBattery}
                onChange={handleChange}
                placeholder="e.g., 4000"
              />
            </div>

            <div className="form-group">
              <label>Minimum Screen Size (inches)</label>
              <input
                type="number"
                step="0.1"
                name="minScreenSize"
                value={filters.minScreenSize}
                onChange={handleChange}
                placeholder="e.g., 6.0"
              />
            </div>
          </div>

          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Find Recommendations'}
          </button>
        </form>

        {recommendations.length > 0 && (
          <div className="recommendations-grid">
            {recommendations.map((phone) => (
              <div key={phone.id} className="phone-card">
                <div className="phone-image">
                  {phone.image ? (
                    <img src={phone.image} alt={phone.name} onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }} />
                  ) : null}
                  <div className="phone-icon-fallback">
                    <FaMobileAlt className="phone-icon" />
                  </div>
                </div>
                <div className="phone-details">
                  <h3>{phone.name}</h3>
                  <p className="phone-brand">{phone.brand}</p>
                  <div className="phone-price">₹{phone.price.toLocaleString()}</div>
                  
                  <div className="phone-specs">
                    <div className="spec-item">
                      <FaMemory className="spec-icon" />
                      <span>{phone.ram}GB RAM</span>
                    </div>
                    <div className="spec-item">
                      <FaHdd className="spec-icon" />
                      <span>{phone.storage}GB Storage</span>
                    </div>
                    <div className="spec-item">
                      <FaDesktop className="spec-icon" />
                      <span>{phone.screenSize}" Display</span>
                    </div>
                    <div className="spec-item">
                      <FaBatteryFull className="spec-icon" />
                      <span>{phone.battery}mAh Battery</span>
                    </div>
                    <div className="spec-item">
                      <FaMobileAlt className="spec-icon" />
                      <span>{phone.os} • {phone.releaseYear}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendation;
