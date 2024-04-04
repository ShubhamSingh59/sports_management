import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css';

function Signin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/create_user', { username, password, role });
      alert('User created successfully');
    } catch (error) {
      if (error.response) {
        console.error('Server responded with error:', error.response.status);
        console.error('Error message:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error:', error.message);
      }
      setError('Error creating user');
    }
  };

  return (
    <div className="login-container"> {/* Apply the login-container class */}
      <h2>Create User</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-container"> {/* Apply the input-container class */}
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="input-container"> {/* Apply the input-container class */}
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="input-container"> {/* Apply the input-container class */}
          <label htmlFor="role">Role:</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Select Role</option>
            <option value="Player">Player</option>
            <option value="Coach">Coach</option>
          </select>
        </div>
        <button type="submit" className="login-button">Create User</button> {/* Apply the login-button class */}
      </form>
      {error && <p className="login-error">{error}</p>} {/* Apply the login-error class */}
    </div>
  );
}

export default Signin;
