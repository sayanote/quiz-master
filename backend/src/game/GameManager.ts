import { Server as SocketIOServer } from 'socket.io';

export enum GamePhase {
  REGISTRATION = 'REGISTRATION',
  ONGOING = 'ONGOING',
  FINISHED = 'FINISHED'
}

export interface Player {
  id: string;
  name: string;
  socketId: string;
  score: number;
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
}

const MAX_PLAYERS = 8;

class GameManager {
  private io: SocketIOServer;
  private phase: GamePhase;
  private players: Player[];

  constructor(io: SocketIOServer) {
    this.io = io;
    this.phase = GamePhase.REGISTRATION;
    this.players = [];
    this.resetState();
  }

  public resetState(): void {
    this.phase = GamePhase.REGISTRATION;
    this.players = [];
    this.broadcastState();
  }

  public getPhase(): GamePhase {
    return this.phase;
  }

  public getState(): GameState {
    return {
      phase: this.phase,
      players: this.players,
    };
  }

  private broadcastState(): void {
    this.io.emit('game_state_update', this.getState());
  }

  public registerPlayer(name: string, socketId: string): Player {
    if (this.phase !== GamePhase.REGISTRATION) {
      throw new Error('Game is not in the registration phase.');
    }

    if (this.players.length >= MAX_PLAYERS) {
      throw new Error('Game is full.');
    }

    const trimmedName = name?.trim();
    if (!trimmedName) {
      throw new Error('Player name is required.');
    }

    if (this.players.find(p => p.name === trimmedName)) {
      throw new Error('Player name is already taken.');
    }

    const newPlayer: Player = {
      id: `player_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: trimmedName,
      socketId: socketId,
      score: 0
    };

    this.players.push(newPlayer);
    console.log(`[GameManager] Player registered: ${newPlayer.name}`);
    this.broadcastState();

    return newPlayer;
  }

  public startGame(): void {
    if (this.phase !== GamePhase.REGISTRATION) return;
    this.phase = GamePhase.ONGOING;
    console.log('[GameManager] Phase changed to ONGOING');
    this.broadcastState();
  }

  public finishGame(): void {
    if (this.phase !== GamePhase.ONGOING) return;
    this.phase = GamePhase.FINISHED;
    console.log('[GameManager] Phase changed to FINISHED');
    this.broadcastState();
  }

  public resetGame(): void {
    this.resetState();
    console.log('[GameManager] Game reset');
  }

  public handleDisconnect(socketId: string): void {
    const player = this.players.find(p => p.socketId === socketId);
    if (player) {
      console.log(`[GameManager] Player disconnected: ${player.name}`);
    }
  }
}

export default GameManager;
