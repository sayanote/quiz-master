import { Server, Socket } from "socket.io";

class ConnectionManager {
    /** 
     * This class manages all connections of players.
     */
    private io: Server;
    private players: Map<string, string> = new Map(); // socketId -> playerName
    private spectators: Set<string> = new Set(); // socketId

    constructor(io: Server) {
        this.io = io;
    }

    public addPlayer(socket: Socket, name: string): void {
        this.players.set(socket.id, name);
        this.broadcastPlayerList();
    }

    public addSpectator(socket: Socket): void {
        this.spectators.add(socket.id);
        this.broadcastPlayerList();
    }

    public removeClient(socketId: string): void {
        if (this.players.has(socketId)) {
            this.players.delete(socketId);
            this.broadcastPlayerList();
        } else if (this.spectators.has(socketId)) {
            this.spectators.delete(socketId);
        }
    }

    public broadcastPlayerList(): void {
        const playerNames = Array.from(this.players.values());
        this.io.emit('playerListUpdated', { players: playerNames });
    }
}

export default ConnectionManager;