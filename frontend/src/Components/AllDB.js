import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ALLDB() {
  const [data, setData] = useState([]);

  const fetchPlayerData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/data');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  return (
      <div className="App">
      <header className="App-header">
        <h1>Sports Management Application</h1>
      </header>
      <div>
        <h2>Backend Data:</h2>
        <ul>
          {data.map((item, index) => (
            <li key={index}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ALLDB;




