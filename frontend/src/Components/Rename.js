import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Rename.css';

function RenameTable() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tableName: '',
    newTableName: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/rename', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          table_name: formData.tableName,
          new_table_name: formData.newTableName
        })
      });

      if (!response.ok) {
        throw new Error('Failed to rename table.');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      navigate('/');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="rename-container">
      <h2>Rename Table</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form>
        <div>
          <label>Current Table Name:</label>
          <input
            type="text"
            name="tableName"
            value={formData.tableName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>New Table Name:</label>
          <input
            type="text"
            name="newTableName"
            value={formData.newTableName}
            onChange={handleInputChange}
          />
        </div>
        <button type="button" onClick={handleSubmit}>Rename Table</button>
      </form>
    </div>
  );
}

export default RenameTable;
