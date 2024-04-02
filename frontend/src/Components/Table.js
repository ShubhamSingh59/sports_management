import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/Table.css';

function TableData() {
  const { tableName } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [tableName]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/${tableName}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch data for table ${tableName}`);
      }
      const jsonData = await response.json();
      setData(jsonData.data);
    } catch (error) {
      console.error(`Error fetching data for table ${tableName}:`, error);
      // Handle error, e.g., show error message to the user
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
      <div className="button-container">
        <Link to={`/table/${tableName}/insert`} className="insert-button">Insert Data</Link>
        <Link to={`/table/${tableName}/delete`} className="delete-button">Delete Data</Link>
        <Link to={`/table/${tableName}/update`} className="update-button">Update Data</Link>
        <Link to={`/table/${tableName}/rename`} className="rename-button">Rename Data</Link>
        <Link to={`/table/${tableName}/where`} className="where-button">Where Clause</Link>
      </div>

      <table>
        <thead>
          <tr>
            {data.length > 0 &&
              Object.keys(data[0]).map((columnName) => (
                <th key={columnName}>{columnName}</th>
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
