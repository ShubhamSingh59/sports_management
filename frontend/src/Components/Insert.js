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
      // Validation
      setErrorMessage('');
      for (const column in rowData) {
        if (columnRegex.hasOwnProperty(column)) {
          if (!columnRegex[column].test(rowData[column])) {
            throw new Error(`Invalid value for column ${column}`);
          }
        }
      }
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
    
      // Rest of the code for submitting data to the server
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
