import React, { useState } from 'react';
import axios from 'axios';
import { FaMemory, FaMicrochip, FaBatteryFull, FaMobileAlt, FaCalendar, FaDesktop, FaHdd } from 'react-icons/fa';
import './PricePrediction.css';

const PricePrediction = () => {
  const [formData, setFormData] = useState({
    brand: '',
    releaseYear: '',
    screenSize: '',
    operatingSystem: '',
    internalStorage: '',
    battery: '',
    ram: '',
    processor: ''
  });

  const [predictedPrice, setPredictedPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/predict', formData);
      if (response.data.success) {
        setPredictedPrice(response.data.predicted_price);
      } else {
        alert('Error: ' + response.data.error);
      }
    } catch (error) {
      console.error('Error predicting price:', error);
      alert('Failed to connect to server. Make sure the backend is running on http://localhost:5000');
      // For demo purposes when backend is not running
      const demoPrice = Math.floor(Math.random() * (50000 - 10000) + 10000);
      setPredictedPrice(demoPrice);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prediction-container">
      <div className="prediction-content">
        <h1 className="page-title">
          <FaMobileAlt className="title-icon" />
          Mobile Price Prediction
        </h1>
        <p className="page-subtitle">Enter mobile specifications to get an accurate price estimate</p>

        <form className="prediction-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>
                <FaMobileAlt className="input-icon" />
                Brand
              </label>
              <select name="brand" value={formData.brand} onChange={handleChange} required>
                <option value="">Select Brand</option>
                <option value="Samsung">Samsung</option>
                <option value="Apple">Apple</option>
                <option value="Xiaomi">Xiaomi</option>
                <option value="OnePlus">OnePlus</option>
                <option value="Realme">Realme</option>
                <option value="Oppo">Oppo</option>
                <option value="Vivo">Vivo</option>
                <option value="Motorola">Motorola</option>
                <option value="Nokia">Nokia</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                <FaCalendar className="input-icon" />
                Release Year
              </label>
              <input
                type="number"
                name="releaseYear"
                value={formData.releaseYear}
                onChange={handleChange}
                placeholder="e.g., 2023"
                min="2015"
                max="2025"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FaDesktop className="input-icon" />
                Screen Size (inches)
              </label>
              <input
                type="number"
                step="0.1"
                name="screenSize"
                value={formData.screenSize}
                onChange={handleChange}
                placeholder="e.g., 6.5"
                required
              />
            </div>

            <div className="form-group">
              <label>Operating System</label>
              <select name="operatingSystem" value={formData.operatingSystem} onChange={handleChange} required>
                <option value="">Select OS</option>
                <option value="Android">Android</option>
                <option value="iOS">iOS</option>
                <option value="HarmonyOS">HarmonyOS</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                <FaHdd className="input-icon" />
                Internal Storage (GB)
              </label>
              <select name="internalStorage" value={formData.internalStorage} onChange={handleChange} required>
                <option value="">Select Storage</option>
                <option value="16">16 GB</option>
                <option value="32">32 GB</option>
                <option value="64">64 GB</option>
                <option value="128">128 GB</option>
                <option value="256">256 GB</option>
                <option value="512">512 GB</option>
                <option value="1024">1 TB</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                <FaBatteryFull className="input-icon" />
                Battery (mAh)
              </label>
              <input
                type="number"
                name="battery"
                value={formData.battery}
                onChange={handleChange}
                placeholder="e.g., 5000"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FaMemory className="input-icon" />
                RAM (GB)
              </label>
              <select name="ram" value={formData.ram} onChange={handleChange} required>
                <option value="">Select RAM</option>
                <option value="2">2 GB</option>
                <option value="3">3 GB</option>
                <option value="4">4 GB</option>
                <option value="6">6 GB</option>
                <option value="8">8 GB</option>
                <option value="12">12 GB</option>
                <option value="16">16 GB</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                <FaMicrochip className="input-icon" />
                Processor
              </label>
              <select name="processor" value={formData.processor} onChange={handleChange} required>
                <option value="">Select Processor</option>
                <option value="octa-core">Octa-Core</option>
                <option value="quad-core">Quad-Core</option>
                <option value="hexa-core">Hexa-Core</option>
                <option value="Unknown_Processor">Unknown Processor</option>
              </select>
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Predicting...' : 'Predict Price'}
          </button>
        </form>

        {predictedPrice && (
          <div className="result-card">
            <h2>Predicted Price</h2>
            <div className="price-display">
              ₹{predictedPrice.toLocaleString()}
            </div>
            <p className="result-note">This is an estimated price based on the specifications provided</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricePrediction;
