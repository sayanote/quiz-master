import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { RegisterPlayerMessage } from './types.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ConnectionManager from './connectionManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

const connectionManager = new ConnectionManager(io);

const PORT = process.env.BACKEND_PORT || 4444;

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Return Player Application
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})


// Define the socket app.
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // wait registration request
  socket.on('registerPlayer', (registerPlayerMessage: RegisterPlayerMessage) => {
    console.log(`${registerPlayerMessage.name} is registered`);
    connectionManager.addPlayer(socket, registerPlayerMessage.name);
    // Redirect the player to be the game room
    socket.emit('playerRegistered', { name: registerPlayerMessage.name });
  });

  socket.on('registerSpectator', () => {
    console.log(`Spectator registered: ${socket.id}`);
    connectionManager.addSpectator(socket);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    connectionManager.removeClient(socket.id);
  });
});


// Start to listen on port
// and goes into the event loop.
httpServer.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
