import React, { useState, useEffect, useRef } from 'react';
import './style.css';

export const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const [result,setResult] = useState(''); 
   // Initialize WebSocket connection
   const [userID,setUserID] = useState(localStorage.getItem("userID"));

   const getUniqueID = ()=>{
    return Math.floor(Math.random() * 10000);
   }
   useEffect(() => {
     // Create WebSocket connection 
     if(!userID){
      localStorage.setItem("userID",getUniqueID());
      setUserID(getUniqueID());
     }

     const ws = new WebSocket('ws://localhost:3001');
     setSocket(ws);
   
     // Connection opened
     ws.addEventListener('open', () => {
       console.log("connected to server")
     });
   
     // Listen for messages
     ws.addEventListener('message', (event) => {
     
       const newMessage = {
         id: Date.now(),
         text: event.data,
         sender: 'received',
         time: new Date().toLocaleTimeString()
       };
       
       setMessages(prev => [...prev, newMessage]);
     });
   
     // Handle errors
     ws.addEventListener('error', (error) => {
       console.error('WebSocket error:', error);
     });
   
     // Connection closed
     ws.addEventListener('close', () => {
       console.log('Disconnected from WebSocket server');
     });
   
     // Cleanup on component unmount
     return () => {
       ws.close();
     };
   }, []);
   
   const handleSend = () => {
     if (inputMessage.trim() && socket) {
       // Add message to local state immediately (optimistic update)
       const newMessage = {
         id: Date.now(),
         text: inputMessage,
         sender: 'sent',
         time: new Date().toLocaleTimeString()
       };
       setMessages(prev => [...prev, newMessage]);
       
       // Send message via WebSocket
       socket.send(inputMessage);
       setInputMessage('');
     }
   };
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
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
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input 
          type="text" 
          placeholder="Type your message..." 
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};