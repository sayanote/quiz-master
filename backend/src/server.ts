import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';
import GameManager from './game/GameManager.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // For development. Update in production.
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 4000;

// Initialize GameManager
const gameManager = new GameManager(io);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', phase: gameManager.getPhase() });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`[Socket] New connection: ${socket.id}`);
  
  // Send current state upon connection
  socket.emit('game_state_update', gameManager.getState());

  // Player registration event
  socket.on('register_player', (data: { name: string }) => {
    try {
      gameManager.registerPlayer(data.name, socket.id);
      socket.emit('registration_success', { message: 'Successfully registered.' });
    } catch (error: any) {
      socket.emit('registration_error', { message: error.message });
    }
  });

  // Admin/Game control events
  socket.on('start_game', () => {
    gameManager.startGame();
  });

  socket.on('finish_game', () => {
    gameManager.finishGame();
  });

  socket.on('reset_game', () => {
    gameManager.resetGame();
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Disconnected: ${socket.id}`);
    gameManager.handleDisconnect(socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Backend Service (TypeScript) listening on port ${PORT}`);
});
