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
        e.preventDefault();
        try {
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
            {error && <p>{error}</p>}
            {result.length > 0 && (
                <div>
                    <h3>Results:</h3>
                    <ul>
                        {result.map((item, index) => (
                            <li key={index}>{JSON.stringify(item)}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default WhereClause;
