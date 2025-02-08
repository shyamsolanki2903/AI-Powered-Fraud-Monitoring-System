import React, { useState } from 'react';
import './App.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import jsPDF from 'jspdf';

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [city, setCity] = useState('');
  const [fraudTypes, setFraudTypes] = useState([]);
  const [selectedFraudType, setSelectedFraudType] = useState('');
  const [fraudData, setFraudData] = useState([]);
  const [fraudCounts, setFraudCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);

  const fetchFraudTypes = async () => {
    if (!city) {
      alert("Please enter a city!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/fraud-data?city=${city}`);
      const data = await response.json();

      if (data.fraud_types.length > 0) {
        setFraudTypes(data.fraud_types);
        setFraudData([]);
        setSelectedFraudType('');

        const fraudTypeCounts = {};
        data.fraud_types.forEach((type) => {
          fraudTypeCounts[type] = Math.floor(Math.random() * 10) + 1;
        });
        setFraudCounts(fraudTypeCounts);
      } else {
        setFraudTypes([]);
        setFraudData([]);
        alert("No fraud types found for this city.");
      }
    } catch (error) {
      console.error("Error fetching fraud types:", error);
    }
    setLoading(false);
  };

  const fetchFraudData = async () => {
    if (!selectedFraudType) {
      alert("Please select a fraud type!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/fraud-data?city=${city}&fraud_type=${selectedFraudType}`);
      const data = await response.json();
      setFraudData(data.fraud_articles);
    } catch (error) {
      console.error("Error fetching fraud data:", error);
    }
    setLoading(false);
  };

  const handleReadMore = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const handleDownloadPDF = (item) => {
    const doc = new jsPDF();
    doc.text("Fraud Report", 20, 20);
    doc.text(`Title: ${item.title}`, 20, 40);
    doc.text(`Source: ${item.source}`, 20, 50);
    doc.text(`Date: ${new Date(item.publishedAt).toLocaleDateString()}`, 20, 60);
    doc.text(`URL: ${item.url}`, 20, 70);
    doc.save("Fraud_Report.pdf");
  };

  const pieChartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.label; // Only show fraud type name, not count
          }
        }
      }
    }
  };

  const pieChartData = {
    labels: Object.keys(fraudCounts),
    datasets: [
      {
        data: Object.values(fraudCounts),
        backgroundColor: [
          '#ff0000', '#ff7300', '#ffeb00', '#47ff00', '#00ffee',
          '#0040ff', '#8000ff', '#ff00d4', '#ff0073', '#7f00ff'
        ],
        hoverBackgroundColor: [
          '#cc0000', '#cc5c00', '#ccbe00', '#3acc00', '#00ccbb',
          '#0033cc', '#6600cc', '#cc00a7', '#cc005b', '#6600cc'
        ],
        borderWidth: 2,
        borderColor: '#fff',
        hoverBorderWidth: 4,
      },
    ],
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Fraud Data Dashboard</h1>
      </header>

      <div className="search-container">
        <label>City Name:</label>
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="search-input"
        />
        <button onClick={fetchFraudTypes} className="search-button1">Find Frauds</button>
      </div>

      {fraudTypes.length > 0 && (
        <>
          <div className="fraud-type-container">
            <label>Fraud Type:</label>
            <select value={selectedFraudType} onChange={(e) => setSelectedFraudType(e.target.value)} className="dropdown">
              <option value="">--Select Fraud Type--</option>
              {fraudTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
            <button onClick={fetchFraudData} className="search-button">Search</button>
          </div>

          <div className="pie-chart-container">
            <h2>Fraud Distribution in {city}</h2>
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </>
      )}

      <div className="fraud-results">
        {fraudData.length > 0 ? (
          fraudData.map((item, index) => (
            <div key={index} className="fraud-card">
              <h3>{item.title}</h3>
              <p><strong>Source:</strong> {item.source}</p>
              <p><strong>Date:</strong> {new Date(item.publishedAt).toLocaleDateString()}</p>

              <a onClick={() => handleReadMore(index)} className="read-more-link">
                {expandedCard === index ? "Hide" : "Read More"}
              </a>

              {expandedCard === index && (
                <div className="extra-buttons">
                  <button onClick={() => handleDownloadPDF(item)} className="download-button">Download</button>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="visit-site-button">
                    Visit Site
                  </a>
                </div>
              )}
            </div>
          ))
        ) : (
          selectedFraudType && <p>No fraud articles found for this type.</p>
        )}
      </div>

      {loading && (
        <div className="loader-overlay">
          <div className="loader">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
