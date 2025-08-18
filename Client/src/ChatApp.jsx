import React, { useState, useEffect, useRef } from "react";
import "./chat.css"; // 👈 import CSS

export default function ChatApp() {
  const [ws, setWs] = useState(null);
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const joinRoom = () => {
    const socket = new WebSocket("ws://localhost:3001");

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "join", room }));
      setConnected(true);
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setMessages((prev) => [...prev, msg]);
    };

    socket.onclose = () => {
      setConnected(false);
      setWs(null);
    };

    setWs(socket);
  };

  const sendMessage = () => {
    if (ws && message.trim() !== "") {
      ws.send(JSON.stringify({ type: "chat", from: name, text: message }));
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      {!connected ? (
        <div className="join-card">
          <h2>Join a Room</h2>
          <input
            placeholder="Room ID"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <input
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={joinRoom}>Join</button>
        </div>
      ) : (
        <div className="chat-card">
          <h2>Room: {room}</h2>
          <div className="chat-box" ref={chatRef}>
            {messages.map((msg, i) => (
              <p key={i}>
                <b>{msg.from}:</b> {msg.text}
              </p>
            ))}
          </div>
          <div className="chat-input">
            <input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
