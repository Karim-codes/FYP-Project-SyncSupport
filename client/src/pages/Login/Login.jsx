import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.scss';

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Login successful");
        // Store the auth token or user info
        localStorage.setItem('authToken', data.token); // Assuming the token is returned in data.token
        // Redirect to home page on successful login
        navigate('/home');
      } else {
        setMessage(data.message || "An error occurred");
      }
    } catch (error) {
      setMessage("Error logging in. Please try again later.");
    }
  };

  return (
    <div className='login-wrapper'>
      <div className='login'>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="userName">Username:</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <input type="submit" value="Login" className="btn" />
        </form>
        {message && <p>{message}</p>}
        <p>Don't have an account? <a href="/signup">Sign up here</a>.</p>
      </div>
    </div>
  );
}

export default Login;
