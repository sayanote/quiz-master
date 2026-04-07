# QuizMaster2 Backend Service

This is the Node.js/TypeScript and Socket.IO real-time backend service for the QuizMaster2 game.

## Features
- Real-time multiplayer synchronization via WebSockets (Socket.IO).
- Game state management (Registration, Ongoing, Finished phases).
- Support for up to 8 players.
- Built with TypeScript and ESM.

## Setup & Running

1. **Install dependencies**:
   ```sh
   cd backend
   npm install
   ```

2. **Run the development server**:
   ```sh
   npm run dev
   ```
   The backend will run on port `4000` by default.

3. **Health Check**:
   ```sh
   curl http://localhost:4000/health
   ```

---

## WebSocket API Manual

Connect to the server using a Socket.IO client at: `ws://localhost:4000`

### 1. Connection & Initial State
Upon successful connection, the server immediately emits a `game_state_update` event containing the current state of the game.

### 2. Player Registration
To join the game as a player, emit the `register_player` event.

- **Event Name**: `register_player`
- **Payload**:
  ```json
  {
    "name": "Your Player Name"
  }
  ```
- **Response (Success)**: `registration_success`
  ```json
  {
    "message": "Successfully registered."
  }
  ```
- **Response (Error)**: `registration_error`
  ```json
  {
    "message": "Error message (e.g., 'Game is full', 'Name already taken')"
  }
  ```

### 3. Spectator Mode
Spectators do not need to "register". Simply connecting to the WebSocket server is enough. Spectators should listen for the `game_state_update` event to keep their screen synchronized with the game.

### 4. Game State Updates
The server broadcasts the full state to all connected clients whenever the state changes (new player joins, phase changes, etc.).

- **Event Name**: `game_state_update`
- **Payload Structure**:
  ```json
  {
    "phase": "REGISTRATION" | "ONGOING" | "FINISHED",
    "players": [
      {
        "id": "player_id_string",
        "name": "Player Name",
        "score": 0
      }
    ]
  }
  ```

### 5. Game Control (Admin/Debug)
The following events can be emitted to the server to control the game flow:
- `start_game`: Changes phase from `REGISTRATION` to `ONGOING`.
- `finish_game`: Changes phase from `ONGOING` to `FINISHED`.
- `reset_game`: Resets the game state and returns to the `REGISTRATION` phase.

---

## Running the Mock Quiz API (Optional)
If you need to run the mock of the Quiz Manager API:
```sh
npm install -g json-server
json-server --watch examples/quiz/choice.json
```
Access the mock API at `http://localhost:3000/quiz`.
