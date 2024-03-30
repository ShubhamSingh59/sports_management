import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tables');
      const jsonData = await response.json();
      setTables(jsonData); // Update to setTables(jsonData) instead of setTables(jsonData.tables)
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  return (
    <div>
      <h1>Tables</h1>
      <ul>
        {tables.map((table) => (
          <li key={table} className="table-link">
            <Link to={`/table/${table}`}>{table}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
