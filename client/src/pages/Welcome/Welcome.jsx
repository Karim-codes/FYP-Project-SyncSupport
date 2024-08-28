import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.scss'; // Ensure this path is correct
import ITSupportImage from '../../assets/IT-support.png';

const Welcome = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate('/login');
  };

  return (
    <div className="welcome-container">
      <h1>Welcome to SyncSupport</h1>
      <img src={ITSupportImage} alt="IT Support" width="300" height="200" />
      <p>Providing top-notch IT support services.</p>
      <div className="button-container">
        <button className="get-started-btn" onClick={handleGetStartedClick}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Welcome;
