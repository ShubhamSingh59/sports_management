import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Delete.css';

function Delete() {
  const navigate = useNavigate();
  const { tableName } = useParams();
  const [rowData, setRowData] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [columns, setColumns] = useState([]);
  const [deleted, setDeleted] = useState(false); // New state variable
  
  const columnRegex = {
    Coach_ID: /^\d+$/, // int
    First_Name: /^[a-zA-Z\s]+$/,
    Last_Name: /^[a-zA-Z\s]+$/,
    DOB: /^\d{4}-\d{2}-\d{2}$/, // date
    Gender: /^[MF]$/,
    Mobile: /^\d{10}$/,
    Email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    Experience: /^\d+$/, // int
    Qualification: /.*/,
    Salary: /^\d+(\.\d{1,2})?$/, // decimal
    Sports_Name: /^[a-zA-Z\s]+$/,
    Player_ID: /^\d+$/, // int
    Equipment_Name: /.*/,
    Date_Time: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, // datetime format
    Quantity: /^\d+$/,
    Return_Status: /.*/,
    Equipment_photo: /.*/,
    Team_ID: /^\d+$/, // int
    Team_Name: /.*/,
    Captain_ID: /^\d+$/, // int
    Tournament_ID: /^\d+$/, // int
    Tournament_Name: /.*/,
    Start_Date: /^\d{4}-\d{2}-\d{2}$/, // date
    End_Date: /^\d{4}-\d{2}-\d{2}$/, // date
    Venue: /.*/,
    Winner_Team_ID: /^\d+$/, // int
    Match_ID: /^\d+$/, // int
    Winner_ID: /^\d+$/ // int
  };

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
    if (deleted) {
      const timer = setTimeout(() => {
        setDeleted(false);
        navigate(`/table/${tableName}`);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [deleted, navigate, tableName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRowData({ ...rowData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      setErrorMessage('');
      for (const column in rowData) {
        if (columnRegex.hasOwnProperty(column)) {
          if (!columnRegex[column].test(rowData[column])) {
            alert(`Invalid value for ${column}`);
            // throw new Error(`Invalid value for column ${column}`);
          }
        }
      }
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          table_name: tableName,
          where_values: { [selectedColumn]: rowData[selectedColumn] }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to delete data.');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.message && data.message === 'No data found') {
        throw new Error('No data found for the provided values.');
    }

      setDeleted(true); // Update status to trigger success message and page refresh
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="delete-container">
      <h2>Delete Data from {tableName}</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {deleted && <p style={{ color: 'green' }}>Data in {tableName} table deleted successfully!</p>} {/* Display success message */}
      {!showForm && (
        <button  className="delete-button" onClick={() => setShowForm(true)}>Delete Data</button>
      )}
      {showForm && (
        <form>
          <div>
            <label>Select Column:</label>
            <select value={selectedColumn} onChange={(e) => setSelectedColumn(e.target.value)}>
              {columns.map((column, index) => (
                <option key={index} value={column}>{column}</option>
              ))}
            </select>
          </div>
          <div>
            <label>{selectedColumn}</label>
            <input
              type="text"
              name={selectedColumn}
              value={rowData[selectedColumn] || ''}
              onChange={handleInputChange}
            />
          </div>
          <button type="button" onClick={handleSubmit}>Submit</button>
        </form>
      )}
    </div>
  );
}

export default Delete;
