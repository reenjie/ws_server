const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3001 });

// rooms = { roomId: Set(sockets) }
const rooms = {};

function broadCastToAllChannels(ws,data){
  const roomId = ws.roomId;
  if (!roomId) return;
 
  rooms[roomId].forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (data) => {
    try {
      const msg = JSON.parse(data);

      if (msg.type === "join") {
        const roomId = msg.room;
        if (!rooms[roomId]) rooms[roomId] = new Set();
        rooms[roomId].add(ws);
        ws.roomId = roomId; // remember which room this client joined
        console.log(`Client joined room ${roomId}`);
      }

      if (msg.type === "chat") {
        const data = JSON.stringify({ from: msg.from, text: msg.text });
        broadCastToAllChannels(ws,data);
      } 

      if(msg.type === "typing"){
        console.log(`${msg.from} is typing...`)
        const data = JSON.stringify({ userTyping:msg.from });
        broadCastToAllChannels(ws,data);
      }
      if(msg.type === "done-typing"){
        console.log(`${msg.from} stopped typing...`)

        const data = JSON.stringify({ userTyping:-1 });
        broadCastToAllChannels(ws,data);
      }

    } catch (err) {
      console.error("Invalid message:", data);
    }
  });



  ws.on("close", () => {
    const roomId = ws.roomId;
    if (roomId && rooms[roomId]) {
      rooms[roomId].delete(ws);
      if (rooms[roomId].size === 0) delete rooms[roomId]; // cleanup empty room
    }
    console.log("Client disconnected");
  });
});

