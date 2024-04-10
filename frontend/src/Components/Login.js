import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css';

const Login = () => {
  const [useremail, setUseremail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
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

      // API call to login
      const response = await axios.post('http://localhost:5000/api/login', {
        useremail: useremail,
        password: password
      });

      const token = response.data.token;
      // Store the token in local storage or session storage
      localStorage.setItem('token', token);
      // Redirect to the desired page after successful login
      // You can replace '/dashboard' with the URL of your dashboard page
      window.location.href = '/';
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="login-error">{error}</div>}
      <div>
        <label>Email:</label>
        <input
          type="text"
          value={useremail}
          onChange={(e) => setUseremail(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
