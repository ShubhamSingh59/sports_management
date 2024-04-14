import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css';

function Signup() {
  const [useremail, setUseremail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simple email validation using regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(useremail)) {
        setError('Invalid email format');
        return;
      }

      // Password validation
      const lowerCaseRegex = /[a-z]/;
      const upperCaseRegex = /[A-Z]/;
      const numericRegex = /\d/;
      const minLength = 8;

      if (!lowerCaseRegex.test(password)) {
        setError('Password should contain at least one lowercase letter.');
        return;
      }

      if (!upperCaseRegex.test(password)) {
        setError('Password should contain at least one uppercase letter.');
        return;
      }

      if (!numericRegex.test(password)) {
        setError('Password should contain at least one numeric digit.');
        return;
      }

      if (password.length < minLength) {
        setError(`Password should have a minimum length of ${minLength} characters.`);
        return;
      }

      const response = await axios.post('http://localhost:5000/api/create_user', { useremail, password, role });
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
    <div className="login-container">
      <h2>Create User</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label htmlFor="useremail">Email:</label>
          <input type="text" id="useremail" value={useremail} onChange={(e) => setUseremail(e.target.value)} />
        </div>
        <div className="input-container">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="input-container">
          <label htmlFor="role">Role:</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Select Role</option>
            <option value="Player">Player</option>
            <option value="Coach">Coach</option>
          </select>
        </div>
        <button type="submit" className="login-button">Create User</button>
      </form>
      {error && <p className="login-error">{error}</p>}
    </div>
  );
}

export default Signup;
