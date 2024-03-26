import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ALLDB() {
  const [data, setData] = useState([]);
  const [sportsData, setSportsData] = useState([]);
  const [showPlayersData, setShowPlayersData] = useState(true);

  const fetchPlayerData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/playerData');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching player data:', error);
    }
  };
  
  const fetchSportsData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sportsData');
      const jsonData = await response.json();
      setSportsData(jsonData);
    } catch (error) {
      console.error('Error fetching sports data:', error);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchPlayerData();
    fetchSportsData();
  }, []);

  return (
    <div className="App">
      <div>
        <button onClick={() => setShowPlayersData(true)}>Show Players Data</button>
        <button onClick={() => setShowPlayersData(false)}>Show Sports Data</button>
      </div>
      {showPlayersData ? (
        <div>
          <h2>Players Data:</h2>
          <ul>
            {data.map((item, index) => (
              <li key={index}>{JSON.stringify(item)}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h2>Sports Data:</h2>
          <ul>
            {sportsData.map((item, index) => (
              <li key={index}>{JSON.stringify(item)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ALLDB;
