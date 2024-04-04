import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/Table.css';

function TableData() {
  const { tableName } = useParams();
  const [data, setData] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // State to track if the user is an admin
  const [columnsName, setColumns] = useState([]) ;
  useEffect(() => {
    fetchData();
    checkAdminStatus(); // Check if the user is an admin
  }, [tableName]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/${tableName}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch data for table ${tableName}`);
      }
      const jsonData = await response.json();
      setData(jsonData.data);
      setColumns(jsonData.column_names) ;
      console.log(columnsName);
    } catch (error) {
      console.error(`Error fetching data for table ${tableName}:`, error);
      // Handle error, e.g., show error message to the user
    }
  };

  const checkAdminStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setIsAdmin(response.ok); // Set isAdmin based on whether the user is an admin or not
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const renderCellValue = (value) => {
    if (isValidUrl(value)) {
      return <img src={value} alt="Image" />;
    }
    return value;
  };

  const isValidUrl = (value) => {
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlPattern.test(value);
  };

  return (
    <div className="table-container">
  <h1>{tableName.toUpperCase()}</h1> {/* Convert tableName to uppercase */}
  {isAdmin && ( // Render buttons only if the user is an admin
    <div className="button-container">
      <Link to={`/table/${tableName}/insert`} className="insert-button">Insert Data</Link>
      <Link to={`/table/${tableName}/delete`} className="delete-button">Delete Data</Link>
      <Link to={`/table/${tableName}/update`} className="update-button">Update Data</Link>
      <Link to={`/table/${tableName}/rename`} className="rename-button">Rename Data</Link>
      <Link to={`/table/${tableName}/where`} className="where-button">Where Clause</Link>
    </div>



      )}

      <table>
      <thead>
        <tr>
          {columnsName.length > 0 &&
            columnsName.map((columnName, index) => ( // Use columnsName.map() here
              <th key={index}>{columnName}</th> // Use columnName instead of columnsName
            ))}
        </tr>
      </thead>

        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, index) => (
                <td key={index}>{renderCellValue(value)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableData;
