import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Where.css';

function WhereClause() {
    const { tableName } = useParams();
    const [operation, setOperation] = useState('=');
    const [value, setValue] = useState('');
    const [result, setResult] = useState([]);
    const [error, setError] = useState('');
    const [columns, setColumns] = useState([]);
    const [selectedColumn, setSelectedColumn] = useState('');
    
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

    const handleSubmit = async (e) => {
        setError('') ; 
        setResult([]); 
        e.preventDefault();
        try {
            const regexPattern = columnRegex[selectedColumn];
    
            // Validate input value only if a regex pattern exists for the selected column
            if (regexPattern && !regexPattern.test(value)) {
                throw new Error(`Invalid input for column ${selectedColumn}.`);
            }
    
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/where', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    table_name: tableName,
                    column_name: selectedColumn,
                    operation: operation,
                    value: value
                })
            });
            if (!response.ok) {
                throw new Error('Failed to fetch data.');
            }
            const data = await response.json();
            setResult(data.data);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="where-container">
            <h2>Apply Where Clause {tableName} </h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="selectColumn">Select Column:</label>
                    <select id="selectColumn" value={selectedColumn} onChange={(e) => setSelectedColumn(e.target.value)}>
                        {columns.map((column, index) => (
                            <option key={index} value={column}>{column}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="operation">Operation:</label>
                    <select id="operation" value={operation} onChange={(e) => setOperation(e.target.value)}>
                        <option value="=">{"="}</option>
                        <option value=">">{">"}</option>
                        <option value="<">{'<'}</option>
                        <option value=">=">{">="} </option>
                        <option value="<=">{'<='}</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="value">Value:</label>
                    <input type="text" id="value" value={value} onChange={(e) => setValue(e.target.value)} />
                </div>
                <button type="submit">Apply Where Clause</button>
            </form>

           
            {result.length > 0 ? (
                <div>
                    <h3>Results:</h3>
                    <table className="result-table">
            <thead>
                <tr>
                    {Object.keys(result[0]).map((key) => (
                        <th key={key}>{key}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {result.map((item, index) => (
                    <tr key={index}>
                        {Object.entries(item).map(([key, value]) => (
                            <td key={key}>{JSON.stringify(value)}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
                </div>
            ) : (
                <p>No data found for the provided condition.</p>
            )}
           
          
        </div>
    );
}

export default WhereClause;
