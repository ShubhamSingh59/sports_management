// TableData.js

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
      const response = await fetch(`/api/${tableName}`);
      const jsonData = await response.json();
      setData(jsonData.data);
    } catch (error) {
      console.error(`Error fetching data for table ${tableName}:`, error);
    }
  };

  const renderCellValue = (value) => {
    // Check if the value is a URL
    if (isValidUrl(value)) {
      return <img src={value} alt="Image" />;
    }
    // If not a URL, render the value as text
    return value;
  };

  const isValidUrl = (value) => {
    // Regular expression to check if the value is a valid URL
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
            {/* Assuming the data structure is an array of objects */}
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
