import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/Table.css';

function TableData() {
  const { tableName } = useParams();
  const [data, setData] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // State to track if the user is an admin
  const [columnsName, setColumns] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchData();
    checkAdminStatus(); // Check if the user is an admin
  }, [tableName]);

  useEffect(() => {
    filterData();
  }, [searchQuery, data]);

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

  const filterData = () => {
    if (!searchQuery) {
      setFilteredData(data);
    } else {
      const filtered = data.filter((row) =>
        Object.values(row).some((value) =>
          value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredData(filtered);
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
      <h1>{tableName}</h1>
    
        {isAdmin && ( 
        <div className="button-container">
          <Link to={`/table/${tableName}/insert`} className="insert-button">Insert Data</Link>
          <Link to={`/table/${tableName}/delete`} className="delete-button">Delete Data</Link>
          <Link to={`/table/${tableName}/update`} className="update-button">Update Data</Link>
          <Link to={`/table/${tableName}/rename`} className="rename-button">Rename Data</Link>
          <Link to={`/table/${tableName}/where`} className="where-button">Where Clause</Link>
        </div>
      )}
       
      <div className="search-container">
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>

      <table>
        <thead>
          <tr>
            {columnsName.map((columnName, index) => (
              <th key={index}>{columnName}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
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