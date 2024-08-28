import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Home.scss';

const Home = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChatbotClick = () => {
    navigate('/chatbot'); // Navigate to the chatbot page
  };

  return (
    <div className="home">
      <h1>Welcome to SyncSupport</h1>
      <p>Quickly get IT support with the best AI-based support...</p>
      <div className="button-container">
        <button className="get-started-btn" onClick={handleChatbotClick}>
          AI-Agent Support
        </button>
        <button className="get-started-btn">
          Real Agent Support
        </button>
      </div>
    </div>
  );
};

export default Home;
