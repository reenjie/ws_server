const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3001 });

// rooms = { roomId: Set(sockets) }
const rooms = {};

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
        const roomId = ws.roomId;
        if (!roomId) return;
        const payload = JSON.stringify({ from: msg.from, text: msg.text });

        // broadcast only to the same room
        rooms[roomId].forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
          }
        });
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

