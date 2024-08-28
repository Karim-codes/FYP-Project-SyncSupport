import React, { useState } from 'react';
import './Chatbot.scss';

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Add the user's message to the chat history
    setChatHistory(prevHistory => [...prevHistory, { from: 'user', text: message }]);
    setMessage('');
    
    // Simulate AI typing
    setIsTyping(true);

    try {
      // Simulate AI thinking with a delay
      setTimeout(async () => {
        try {
          const response = await fetch('http://localhost:5001/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
          });
          const data = await response.json();
          
          // Add the bot's reply to the chat history
          setChatHistory(prevHistory => [
            ...prevHistory,
            { from: 'bot', text: data.reply }
          ]);
        } catch (error) {
          console.error('Error:', error);
          setChatHistory(prevHistory => [
            ...prevHistory,
            { from: 'bot', text: 'Error: Unable to get a response.' }
          ]);
        } finally {
          setIsTyping(false);
        }
      }, 1000); // 1 second delay before showing the bot's reply
    } catch (error) {
      console.error('Error:', error);
      setIsTyping(false);
    }
  };

  return (
    <div className="chatbot">
      <div className="chat-window">
        <div className="chat-history">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`chat-message ${chat.from}`}>
              <div className="message-text">{chat.text}</div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-message bot">
              <div className="message-text">...</div> {/* Typing indicator */}
            </div>
          )}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            placeholder="Type your message here..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
