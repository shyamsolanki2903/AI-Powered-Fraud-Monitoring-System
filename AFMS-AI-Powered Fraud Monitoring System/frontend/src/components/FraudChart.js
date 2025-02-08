import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FraudChart = () => {
  const [fraudData, setFraudData] = useState([]);

  useEffect(() => {
    // Flask API se fraud data fetch karna
    axios.get('http://127.0.0.1:5000/api/fraud-data')
      .then(response => {
        setFraudData(response.data.patterns); // API response ko state mein store karo
      })
      .catch(error => {
        console.error('Error fetching fraud data:', error);
      });
  }, []);

  return (
    <div>
      <h1>Fraud Patterns</h1>
      <ul>
        {fraudData.map((pattern) => (
          <li key={pattern.id}>{pattern.name} - {pattern.alert}</li>
        ))}
      </ul>
    </div>
  );
};

export default FraudChart;
