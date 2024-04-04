import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Update.css';

function Update() {
  const navigate = useNavigate();
  const { tableName } = useParams();
  const [rowData, setRowData] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [updateValue, setUpdateValue] = useState('');
  const [updated, setUpdated] = useState(false); // New state variable

  // Fetch column names for the specified table
  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/${tableName}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const jsonData = await response.json();
        const columns = jsonData.column_names;
        setColumns(columns);
        setSelectedColumn(columns[0]); // Select the first column by default
      } catch (error) {
        console.error(`Error fetching columns for table ${tableName}:`, error);
      }
    };
    fetchColumns();
  }, [tableName]);

  useEffect(() => {
    if (updated) {
      const timer = setTimeout(() => {
        setUpdated(false);
        navigate(`/table/${tableName}`);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [updated, navigate, tableName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRowData({ ...rowData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          table_name: tableName,
          column_names: [selectedColumn],
          data: [updateValue],
          primary_key: rowData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update data.');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setUpdated(true); // Update status to trigger success message and page refresh
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="update-container">
      <h2>Update Data in {tableName}</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {updated && <p style={{ color: 'green' }}>Data in {tableName} table updated successfully!</p>} {/* Display success message */}
      {!showForm && (
        <button  className="insert-button" onClick={() => setShowForm(true)}>Update Data</button>
      )}
      {showForm && (
        <form>
          {/* Dropdown menu to select column */}
          <div>
            <label>Select Column:</label>
            <select value={selectedColumn} onChange={(e) => setSelectedColumn(e.target.value)}>
              {columns.map((column, index) => (
                <option key={index} value={column}>{column}</option>
              ))}
            </select>
          </div>
          {/* Input field for the selected column */}
          <div>
            <label>{selectedColumn}</label>
            <input
              type="text"
              name={selectedColumn}
              value={rowData[selectedColumn] || ''}
              onChange={handleInputChange}
            />
          </div>
          {/* Input field for the update value */}
          <div>
            <label>Update Value:</label>
            <input
              type="text"
              value={updateValue}
              onChange={(e) => setUpdateValue(e.target.value)}
            />
          </div>
          <button type="button" onClick={handleSubmit}>Submit</button>
        </form>
      )}
    </div>
  );
}

export default Update;
