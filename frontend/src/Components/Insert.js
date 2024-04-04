import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Insert.css';

function Insert() {
  const navigate = useNavigate();
  const { tableName } = useParams();
  const [rowData, setRowData] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [columns, setColumns] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [inserted, setInserted] = useState(false); // New state variable

  useEffect(() => {
    fetchColumns();
  }, [tableName]);

  useEffect(() => {
    if (inserted) {
      const timer = setTimeout(() => {
        setInserted(false);
        navigate(`/table/${tableName}`);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [inserted, navigate, tableName]);

  const fetchColumns = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/${tableName}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch columns for table ${tableName}`);
      }
      const jsonData = await response.json();
      setColumns(jsonData.column_names);
    } catch (error) {
      console.error(`Error fetching columns for table ${tableName}:`, error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRowData({ ...rowData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/insert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          table_name: tableName,
          column_names: Object.keys(rowData),
          data: [Object.values(rowData)]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to insert data.');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setInserted(true); // Update insertion status
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="insert-container">
      <h2>Insert Data into {tableName}</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {inserted && <p style={{ color: 'green' }}>Data in {tableName} table inserted successfully!</p>} {/* Display success message */}
      {!showForm && (
        <button className="insert-button" onClick={() => setShowForm(true)}>Insert Data</button>
      )}
      {showForm && (
        <form>
          {columns.map((column, index) => (
            <div key={index}>
              <label>{column}</label>
              <input type="text" name={column} onChange={handleInputChange} />
            </div>
          ))}
          <button type="button" onClick={handleSubmit}>Submit</button>
        </form>
      )}
    </div>
  );
}

export default Insert;
