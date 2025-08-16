import React, { useState, useEffect } from 'react';
import './style.css';
const socket = new WebSocket('ws://localhost:3001');
export const ChatBox = () => {
  const [messages, setMessages] = useState([
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const handleSend = () => {
    socket.send(inputMessage)
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat with Alex</h2>
      </div>
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-content">
              <p>{message.text}</p>
              <span className="message-time">{message.time}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input 
          type="text" 
          placeholder="Type your message..." 
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
       
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};