import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { RegisterPlayerMessage, GameSettings } from './types.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ConnectionManager from './connectionManager.js';
import GameManager from './gameManager.js';

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
const gameManager = new GameManager(io);

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

  // Send current game state to the new connection
  socket.emit('game_state_update', gameManager.getGameState());

  // wait registration request
  socket.on('registerPlayer', (registerPlayerMessage: RegisterPlayerMessage) => {
    console.log(`${registerPlayerMessage.name} is registered`);
    connectionManager.addPlayer(socket, registerPlayerMessage.name);
    gameManager.addPlayer(socket.id, registerPlayerMessage.name);
    // Redirect the player to be the game room
    socket.emit('playerRegistered', { name: registerPlayerMessage.name });
  });

  socket.on('registerSpectator', () => {
    console.log(`Spectator registered: ${socket.id}`);
    connectionManager.addSpectator(socket);
  });

  socket.on('configure_game', (settings: GameSettings) => {
    console.log('Configuring game:', settings);
    gameManager.updateSettings(settings);
  });

  socket.on('start_game', () => {
    console.log('Starting game...');
    gameManager.startGame();
  });

  socket.on('reset_game', () => {
    console.log('Resetting game...');
    gameManager.resetGame();
  });

  socket.on('submit_answer', (data: { choiceIndex: number }) => {
    console.log(`Player ${socket.id} submitted answer index: ${data.choiceIndex}`);
    gameManager.submitAnswer(socket.id, data.choiceIndex);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    connectionManager.removeClient(socket.id);
    gameManager.removePlayer(socket.id);
  });
});


// Start to listen on port
// and goes into the event loop.
httpServer.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
